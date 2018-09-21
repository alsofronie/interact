/*
Module that offers APIs to interact with PrivateSky web sandboxes
*/

import commandTypes from './util/commandTypes.js';
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

            if(msg.data.requestId){
                if(onReturnCallbacks[msg.data.requestId]){
                    onReturnCallbacks[msg.data.requestId](msg.data);
                    delete onReturnCallbacks[msg.data.requestId];
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
                onReturnCallbacks[requestId] = callback;
            },
            on:function(phaseName, callback){
                
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
        sendRequest:function(type, args, callback){
            var msg = buildMessage(commandTypes.SWARM,args);
            msg.swarmName   = swarmName;
            msg.ctor        = ctor;
            childWindow.postMessage(msg, "*")
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
