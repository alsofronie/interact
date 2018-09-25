require("util");
require("callflow");

const webInteract = require ('interact');

webInteract.initWebEmbeddedMode();
let requester = $$.interact.sendRequest("authenticate",["user","email"]);
requester(function(data){
console.log(data);
});
const fs = require("fs");
console.log("FS stat:", fs.stat);


window.addEventListener('message', function(msg) {
    console.log("In child", msg.data);
});



