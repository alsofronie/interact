require("callflow");
require("launcher");
var interactWindowMq = require("interact").createWindowMQ("iframe", window);

interactWindowMq.registerConsumer(function(err,data){
    if(err){
        console.log(err);
    }
    else{
       $$.swarm.start(data.meta.swarmName, data.meta.ctor, data.meta.args);
    }
});

$$.swarm.describe("swarmTest", {
    start:function(value){
        this.value = value;
        console.log("Start");
        this.swarm("interaction", "step1", this.value);
    },
    step1:"interaction",
    step2: function(value){
        console.log("Back in step 2");
        this.swarm("interaction","step3", value);
    },
    end:function(value){
        console.log("End..", value);
    }
});

