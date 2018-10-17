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

            return {
                meta: {"swarmTypeName":"global.swarmTest"},
                public: {},
                protected: {"value":{"foo":"foo","bar":"bar"}},
                private: {}
            }
        },
        resendSwarm: function (swarmHandler, swarmSerialisation, ctor, args) {
            swarmHandler[ctor].apply(swarmHandler,args)
        },
        on: function (swarmHandler, callback) {
            childMessageMQ.registerConsumer(callback);
        },
        off: function (swarmHandler) {

        }
    };


    var space = swarmInteract.newInteractionSpace(comm);
    this.startSwarm = function (name, ctor, args) {
        return space.newInteraction(name, ctor, args);
    };

    this.init = function () {
        childMessageMQ.registerConsumer(function (err, data) {
            if (err) {
                console.log(err);
            }
            else {


                var swarm = $$.swarm.start(data.meta.swarmName, data.meta.ctor, data.meta.args);
                swarm.onReturn(function(data){
                  console.log(data);
                })

                /*childMessageMQ.produce({

                })*/

            }
        })
    }
}



module.exports.createInteractionSpace = function(channelName, window){
    return new WindowMQInteractionSpace(channelName, window);
};