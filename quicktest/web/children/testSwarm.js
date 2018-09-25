require("util");
require("callflow");

const webInteract = require ('interact');

webInteract.initWebEmbeddedMode();

var fs = require("fs");
console.log("FS stat:", fs.stat);


window.addEventListener('message', function(msg) {
    console.log("In child", msg.data);
});



