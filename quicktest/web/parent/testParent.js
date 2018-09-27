require("util");
require("callflow");
const childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;
const interact = require('interact');


const domainSandboxWebView = interact.connectDomain(childWindow);

domainSandboxWebView.startSwarm("testSwarm.js", "start","message","Test",[1,2,3]).onReturn(function(err, data){
    console.log("Returned data:",data);
});

const sandBoxSwarm = domainSandboxWebView.startSwarm("testSwarm.js", "start","message");

sandBoxSwarm.on("success",function(err, data){
    console.log("Success phase",data);
});

sandBoxSwarm.on("error",function(err, data){
    console.log("Error phase",data);
});

domainSandboxWebView.onRequest("authenticate", function (callback){
    setTimeout(function () {
        callback({"user": "rafael.mastaleru", "email": "rafael.mastaleru@gmail.com"});
    },2000);
});