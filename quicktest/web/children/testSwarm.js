require("util");
require("callflow");

const webInteract = require ('interact');

webInteract.initWebEmbeddedMode();

const fs = require("fs");
console.log("FS stat:", fs.stat);


window.addEventListener('message', function(msg) {
    console.log("In child", msg.data);
});



