/*
Module that offers APIs to interact with PrivateSky web sandboxes
*/

const commandTypes = {
    MESSAGE:"message",
    SAY:"say",
    LOG:"log",
    GET_KEY:"getKey",
    SET_KEY:"setKey",
    SWARM  :"startSwarm",
    GET_PIN:"getPIN",
    GET_NMB:"getNumber",
    GET_STR:"getString",
    GET_PSW:"getPassword",
    GET_FRM:"getForm",
    MEET_YOUR_CHILD:"meetYourChild"
};

import uuidv4 from './util/uuid.js';

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


export function connectDomain(childWindow){    //running in parent

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
        if(msg.source === childWindow){

            if(msg.data.meta && msg.data.meta.requestId){
                if(onReturnCallbacks[msg.data.meta.requestId]){
                    onReturnCallbacks[msg.data.meta.requestId](null, msg.data);
                    delete onReturnCallbacks[msg.data.meta.requestId];
                }

                if(onCallbacks[msg.data.meta.requestId]){
                    var phaseNameCallbacks = onCallbacks[msg.data.meta.requestId];
                    phaseNameCallbacks = phaseNameCallbacks.filter(function (phaseNameCallback) {
                        return phaseNameCallback.phaseName === msg.data.meta.phaseName;
                    });


                    phaseNameCallbacks.forEach(function(phaseNameCallback){
                        phaseNameCallback.callback(null, msg.data);
                    })

                }
            }else{
                console.log("###request",msg.data);
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
