var childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;
import {interact}  from '../../../index.js';
var domainSandboxWebView = interact.connectDomain(childWindow);


//domainSandboxWebView.sendRequest(type,args,callback);
//domainSandboxWebView.startSwarm(swarmName,ctor, args, callback) //start a swarm inside of the child



console.log("Waiting from children");
window.addEventListener('message', function(msg) {
  console.log("In parent", msg.data);
});

setTimeout(function(){
    childWindow.postMessage(
        {
            command:"fromParentToChild"
        },
        "*"
    )
}, 1000);


