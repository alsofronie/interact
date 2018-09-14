/*
Module that offers APIs to interact with PrivateSky web sandboxes

 */


export function connectDomain(childWindow){    //running in parent

    function startSwarmInChild(swarmName, ctor, args){
        var msg = buildMessage(COMMAND_TYPES.SWARM,args);
        msg.swarmName   = swarmName;
        msg.ctor        = ctor;
        childWindow.postMessage(msg, "*")
    }

    var typeMaps = {};

    window.addEventListener('message', function(msg) {
        if(msg.source === childWindow){
            var callback = msg.command;
            callback(null, msg);
        }
    })

    return {
        onRequest:function(type, callback){
            if(typeMaps[type]){
                $$.log("Warning: overwriting onRequest for type ", type);
            }
            typeMaps[type] = callback;
        },
        sendRequest:function(type, args,callback){
            var msg = buildMessage(COMMAND_TYPES.SWARM,args);
            msg.swarmName   = swarmName;
            msg.ctor        = ctor;
            childWindow.postMessage(msg, "*")
        },
        startSwarm:function(swarmName, ctor, args, callback){
            startSwarmInChild(swarmName, ctor, args)
        },
        get:function(domainUrlKey, callback){
            startSwarmInChild("PDS", "get", [domainUrlKey],callback);
        },
        set:function(domainUrlKey, value, callback){
            startSwarmInChild("PDS", "get", [domainUrlKey, value],callback);
        }
    }
}
