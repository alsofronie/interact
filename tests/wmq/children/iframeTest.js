require("callflow");

$$.swarm.describe("swarmTest", {
    public:{
        collectedValue:"int"
    },
    start:function(value){
        this.value = value;
        console.log("Start");
        var self = this;

        var is = require("interact").createInteractionSpace();
        is.startSwarm("swarmTest2", "start", value).on({
            auxiliaryStep :function(){
                self.swarm("interaction", "step1", "auxiliary");
            }
        });

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

$$.swarm.describe("swarmTest2", {
    start: function (value) {
        this.value = value;
        this.swarm("interaction", "auxiliaryStep", this.value);
    },
});




var interaction = require("interact").createWindowInteractionSpace("iframe", window);
interaction.init();