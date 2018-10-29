require("callflow");
require("launcher");

$$.swarm.describe("swarmTest", {
    public:{
        collectedValue:"int"
    },
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
        this.swarm("interaction","step4", value);
        console.log("End..", value);
    }
});

var interaction = require("interact").createWindowInteractionSpace("iframe",window);
interaction.init();