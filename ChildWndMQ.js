var channelsRegistry = {}; //keeps callbacks for consumers and windows references for producers
var callbacksRegistry = {};

function dispatchEvent(event) {
    var swarm = event.data;
    var callback = callbacksRegistry[swarm.meta.channelName];
    if (callback) {
        callback(null, swarm);
    } else {
        throw new Error("");
    }
}


function ChildWndMQ(channelName, mainWindow) {
    //channel name is

    channelsRegistry[channelName] = mainWindow;

    this.produce = function (swarmMsg) {
        swarmMsg.meta.channelName = channelName;
        channelsRegistry[channelName].postMessage(swarmMsg, "*");
    }

    var consumer;

    this.registerConsumer = function (callback, shouldDeleteAfterRead = true) {
        if (typeof callback !== "function") {
            throw new Error("First parameter should be a callback function");
        }
        if (consumer) {
            throw new Error("Only one consumer is allowed! " + folder);
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
}

module.exports.initInParent = function(){

}

module.exports.initInReact = function(){

}

/*

//parent
    var q_i = createMQ("inputSwarmsDomain1",childWnd);

    q_i.produce(swarm);

    var q_o = createMQ("inputSwarmsDomain1",mainWindow);


    q_o.registerConsumer(callback);


//child
    var q_i = createMQ("inputSwarmsDomain1",childWnd);
    q_i.registerConsumer("callback);
    var q_o = createMQ("outputSwarmsDomain1",childWnd);

    q_o.produce(swarm)

 */