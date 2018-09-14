
require("util");
require("callflow");

var simpleFlow = $$.callflow.create("testSwarm",{
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
console.log("running")
simpleFlow.start(function(){
    //require("callflow");
    console.log("Callback called");
});

/*var fs = require("fs");
console.log("FS stat:", fs.stat);


console.log("Trimit");
window.parent.postMessage({
    command:"echo"
}, "*")


window.addEventListener('message', function(msg) {
    console.log("In child", msg.data);

})

*/

