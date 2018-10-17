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
    step3:"interaction",
    end:function(value){
        console.log("End..", value);
    }
});

require("interact").createWindowInteractionSpace("iframe",window).init();