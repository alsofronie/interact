function LocalInteractionSpace() {
    var swarmInteract = require("./swarmInteract");
    var pskSubscriber = {};

    var registerSubscriber = function (swarmHandler, callback) {
        pskSubscriber[swarmHandler] = function (swarm) {
            if (swarm.meta.target === "interaction") {
                //TODO fix this after swarm is getting swarmID synchronously
                //  if(swarm.meta.swarmId == swarmHandler.meta.swarmId){
                callback(null, swarm);
                //
                //   }
            }
        };
        return pskSubscriber[swarmHandler];
    }

    var comm = {
        startSwarm: function (swarmName, ctor, args) {
            return $$.swarm.start(swarmName, ctor, args);
        },
        resendSwarm: function (swarmHandler, swarmSerialisation, ctor, args) {
            swarmHandler[ctor].apply(swarmHandler, args)
        },
        on: function (swarmHandler, callback) {
            var swarmHandlerCbk = registerSubscriber(swarmHandler, callback);
            $$.PSK_PubSub.subscribe($$.CONSTANTS.SWARM_FOR_EXECUTION, swarmHandlerCbk);
        },
        off: function (swarmHandler) {
            if (pskSubscriber[swarmHandler]) {
                $$.PSK_PubSub.unsubscribe($$.CONSTANTS.SWARM_FOR_EXECUTION, pskSubscriber[swarmHandler]);
            }
        }
    };
    var space = swarmInteract.newInteractionSpace(comm);
    this.startSwarm = function (name, ctor, args) {
        return space.newInteraction(name, ctor, args);
    }
}

module.exports.createInteractionSpace = function () {
    //singleton
    return new LocalInteractionSpace();
};