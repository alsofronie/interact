function RemoteInteractionSpace(alias, remoteEndPoint, agentUid, cryptoInfo) {
    const swarmInteract = require("./swarmInteract");

    let initialized = false;
    function init(){
        if(!initialized){
            initialized = true;
            $$.remote.createRequestManager();
            $$.remote.newEndPoint(alias, remoteEndPoint, agentUid, cryptoInfo);
        }
    }

    const comm = {
        startSwarm: function (swarmName, ctor, args) {
            init();
            return $$.remote[alias].startSwarm(swarmName, ctor, ...args);
        },
        continueSwarm: function (swarmHandler, swarmSerialisation, ctor, args) {
            return $$.remote[alias].continueSwarm(swarmSerialisation, ctor, args);
        },
        on: function (swarmHandler, callback) {
            $$.remote[alias].on(swarmHandler.getInnerValue().meta.swarmTypeName, '*', callback);
        },
        off: function (swarmHandler) {
            $$.remote[alias].off(swarmHandler.getInnerValue().meta.swarmTypeName, '*');
        }
    };

    return swarmInteract.newInteractionSpace(comm);
}

module.exports.createRemoteInteractionSpace = function (alias, remoteEndPoint, agentUid, cryptoInfo) {
    //singleton
    return new RemoteInteractionSpace(alias, remoteEndPoint, agentUid, cryptoInfo);
};