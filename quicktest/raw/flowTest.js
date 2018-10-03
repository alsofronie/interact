require("callflow");
var simpleFlow = $$.callflow.describe("testSwarm",{
    start:function(end){
        this.end = end;
        console.log("In 'start'");
        this.firstPhase();
    },
    firstPhase:function(){
        console.log("In 'nextPhase'");
        this.secondPhase();
    },
    secondPhase:function(){
        console.log("In 'secondPhase'");
        this.end();
    }
});
console.log("running");
simpleflow.describe(function(){
    console.log("Callback called");
});