var channelsRegistry = {}; //keeps callbacks for consumers and windows references for producers
var callbacksRegistry = {};

function dispatchEvent(event) {

    if (event.source !== window) {

        var swarm = event.data;
        if(swarm.meta){
            var callback = callbacksRegistry[swarm.meta.channelName];
            if (callback) {
                callback(null, swarm);
            } else {
                throw new Error("");
            }
        }
    }
}


function ChildWndMQ(channelName, mainWindow) {
    //channel name is

    channelsRegistry[channelName] = mainWindow;

    this.produce = function (swarmMsg) {
        swarmMsg.meta.channelName = channelName;
        var message = {
            meta:swarmMsg.meta,
            publicVars:swarmMsg.publicVars,
            privateVars:swarmMsg.privateVars
        };
        //console.log(swarmMsg.getJSON());
        //console.log(swarmMsg.valueOf());
        mainWindow.postMessage(message, "*");
    };

    var consumer;

    this.registerConsumer = function (callback, shouldDeleteAfterRead = true) {
        if (typeof callback !== "function") {
            throw new Error("First parameter should be a callback function");
        }
        if (consumer) {
           // throw new Error("Only one consumer is allowed!");
        }

        consumer = callback;
        callbacksRegistry[channelName] = consumer;
        mainWindow.addEventListener("message", dispatchEvent);
    }
}


module.exports.createMQ = function createMQ(channelName, wnd){
    return new ChildWndMQ(channelName, wnd);
}


module.exports.initForSwarmingInChild = function(domainName){

    var pubSub = $$.require("soundpubsub").soundPubSub;

    var inbound = createMQ(domainName+"/inbound");
    var outbound = createMQ(domainName+"/outbound");


    inbound.registerConsumer(function(err, swarm){
            //restore and execute this tasty swarm
            global.$$.swarmsInstancesManager.revive_swarm(swarm);
    });

    pubSub.subscribe($$.CONSTANTS.SWARM_FOR_EXECUTION, function(swarm){
        outbound.sendSwarmForExecution(swarm);
    });
};

