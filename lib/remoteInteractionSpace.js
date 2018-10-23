function RemoteInteractionSpace(alias, remoteEndPoint, agentUid, cryptoInfo) {
    const swarmInteract = require("./swarmInteract");

    let initialized = false;
    function init(){
        if(!initialized){
            initialized = true;
            $$.remote.newEndPoint(alias, remoteEndPoint, agentUid, cryptoInfo);
        }
    }

    const comm = {
        startSwarm: function (swarmName, ctor, args) {
            init();
            return $$.remote[alias].startSwarm(swarmName, ctor, ...args);
        },
        resendSwarm: function (swarmHandler, swarmSerialisation, ctor, args) {
            // ??
        },
        on: function (swarmHandler, callback) {
            $$.remote[alias].on(swarmHandler.getInnerValue().meta.swarmTypeName, '*', callback);
        },
        off: function (swarmHandler) {
            $$.remote[alias].off(swarmHandler.getInnerValue().meta.swarmTypeName, '*');
        }
    };

    const space = swarmInteract.newInteractionSpace(comm);
    this.startSwarm = function (name, ctor, args) {
        return space.newInteraction(name, ctor, args);
    }
}

module.exports.createRemoteInteractionSpace = function (alias, remoteEndPoint, agentUid, cryptoInfo) {
    //singleton
    return new RemoteInteractionSpace(alias, remoteEndPoint, agentUid, cryptoInfo);
};