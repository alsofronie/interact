
setTimeout(function(){
    var childWindow = document.getElementsByTagName("iframe")[0].contentWindow;
    require("callflow");
    require("launcher");
    var is = require("interact").createWindowInteractionSpace("iframe",childWindow);

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


},1000);








