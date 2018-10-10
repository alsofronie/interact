

var is = require("../index").createInteractionSpace();

require("../../../builds/devel/pskruntime");
require("callflow");
require("launcher");

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

is.startSwarm("swarmTest", "start", {foo:"foo", bar:"bar"}).on({
    step1:function(value){
        console.log("Interaction step ", value);
        this.swarm("step2", value);
    },
    step3:function(value){
        console.log("Step3",value);
        this.swarm("end", value);
    }
});





