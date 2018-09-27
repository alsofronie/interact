/*
Module that offers APIs to interact with PrivateSky web sandboxes
*/

const commandTypes = require('./util/commandTypes.js');
const uuidv4 = require('./util/uuid.js');

function buildMessage(type,args,options){
    var ret = {
        command:type,
        args:args
    }

    if(options){
        for(var v in options){
            ret[v] = options[v];
        }
    }
    return ret;
}


function ConnectDomain(childWindow){    //running in parent

    var typeMaps = {};
    var onReturnCallbacks = [];
    var onCallbacks = [];

    var initialized = false;
    var toBeDispatchedWhenChildIsReady = [];


    function startSwarmInChild(swarmName, ctor, args){
        var msg = buildMessage(commandTypes.SWARM,args);
        msg.swarmName   = swarmName;
        msg.ctor        = ctor;
        childWindow.postMessage(msg, "*")
    }


    window.addEventListener('message', function(msg) {

        if (msg.source === childWindow) {
            if (!msg.data.error) {

                if (msg.data.meta && msg.data.meta.requestId) {
                    if (onReturnCallbacks[msg.data.meta.requestId]) {
                        onReturnCallbacks[msg.data.meta.requestId](null, msg.data);
                        delete onReturnCallbacks[msg.data.meta.requestId];
                    }

                    if (onCallbacks[msg.data.meta.requestId]) {
                        var phaseNameCallbacks = onCallbacks[msg.data.meta.requestId];
                        phaseNameCallbacks = phaseNameCallbacks.filter(function (phaseNameCallback) {
                            return phaseNameCallback.phaseName === msg.data.meta.phaseName;
                        });


                        phaseNameCallbacks.forEach(function (phaseNameCallback) {
                            phaseNameCallback.callback(null, msg.data);
                        })

                    }
                } else {
                    if (msg.data.command) {
                        let command = msg.data.command;
                        if (typeMaps[command]) {
                            typeMaps[command](function (data) {
                                childWindow.postMessage({
                                    commandType: "response",
                                    command: msg.data.command,
                                    requestId:msg.data.requestId,
                                    data: data
                                }, "*")
                            });
                        }
                    }
                }
            }
        }
    });

    function childIsReady(){
        initialized = true;
        while(toBeDispatchedWhenChildIsReady.length>0){
            var request = toBeDispatchedWhenChildIsReady.pop();
            request();
        }
    }

    function dispatchToChild(swarmName, ctor, requestId, args){

        childWindow.postMessage({
            command:commandTypes.SWARM,
            swarmName:swarmName,
            requestId:requestId,
            ctor:ctor,
            args:args,
        },"*");

    }

    function dispatchSwarmRequest(swarmName, ctor,  args) {
        var requestId = uuidv4();

        if (initialized === true) {
            dispatchToChild(swarmName, ctor, requestId, args);
        }
        else {
            console.log("Child is not ready yet.");
            var toBeLaterDispatched = function (swarmName, ctor, args) {
                return function () {
                    dispatchToChild(swarmName, ctor, requestId, args)
                };
            };
            toBeDispatchedWhenChildIsReady.push(toBeLaterDispatched(swarmName, ctor, args));
        }

        return {
            onReturn:function(callback){
                if(typeof callback !== "function"){
                    throw new Error("The first parameter should be a string and the second parameter should be a function");
                }
                onReturnCallbacks[requestId] = callback;
            },
            on:function(phaseName, callback){
                if(typeof phaseName !== "string"  || typeof callback !== "function"){
                    throw new Error("The first parameter should be a string and the second parameter should be a function");
                }

                if(!onCallbacks[requestId]){
                    onCallbacks[requestId] = [];
                }
                onCallbacks[requestId].push({
                    callback:callback,
                    phaseName:phaseName
                });

            }
        }
    }

    function establishCommunicationWithChild(msg) {

        if (msg.data.command === commandTypes.MEET_YOUR_CHILD) {
            childIsReady();
        }
    }

    childWindow.parent.addEventListener("message", establishCommunicationWithChild);

    return {
        onRequest:function(type, callback){
            if(typeMaps[type]){
                $$.log("Warning: overwriting onRequest for type ", type);
            }
            typeMaps[type] = callback;
        },
        startSwarm:function(swarmName, ctor, ...params){
            return dispatchSwarmRequest(swarmName, ctor, params);
        },
        get:function(domainUrlKey, callback){
            startSwarmInChild("PDS", "get", [domainUrlKey],callback);
        },
        set:function(domainUrlKey, value, callback){
            startSwarmInChild("PDS", "get", [domainUrlKey, value],callback);
        }
    }
}


module.exports  = ConnectDomain;