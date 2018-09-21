require("util");
require("callflow");

import initWebEmbeddedMode  from '../../../webInteract.js';
initWebEmbeddedMode();

var fs = require("fs");
console.log("FS stat:", fs.stat);


window.addEventListener('message', function(msg) {
    console.log("In child", msg.data);
});



