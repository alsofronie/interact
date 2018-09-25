const childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;
import {connectDomain} from '../../../webConnect.js';

const domainSandboxWebView = connectDomain(childWindow);

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







