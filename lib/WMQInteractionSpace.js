
function WindowMQInteractionSpace(channelName, window){
    var swarmInteract = require("./swarmInteract");
    var childMessageMQ = require("./ChildWndMQ").createMQ(channelName, window);

    var pskSubscriber = {} ;
    var registerSubscriber = function(swarmHandler, callback){
        pskSubscriber[swarmHandler] = function(swarm){
            if (swarm.meta.target === "interaction") {
                //  if(swarm.meta.swarmId == swarmHandler.meta.swarmId){
                callback(swarm);
                //
                //   }
            }
        };
        return pskSubscriber[swarmHandler];
    }

    var comm = {
        startSwarm: function (swarmName, ctor, args) {
            childMessageMQ.produce({meta:{
                    swarmName:swarmName,
                    ctor:ctor,
                    args:args
                }});
        },
        resendSwarm: function (swarmHandler, swarmSerialisation, ctor, args) {
            swarmHandler[ctor].apply(swarmHandler,args)
        },
        on: function (swarmHandler, callback) {
            console.log(swarmHandler);
            //childMessageMQ.registerConsumer(callback);
        },
        off: function (swarmHandler) {

        }
    }
    var space = swarmInteract.newInteractionSpace(comm);
    this.startSwarm = function (name, ctor, args) {
        return space.newInteraction(name, ctor, args);
    }
}



module.exports.createInteractionSpace = function(channelName, window){
    return new WindowMQInteractionSpace(channelName, window);
};