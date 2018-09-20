var childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;
import {interact} from '../../../index.js';

var domainSandboxWebView = interact.connectDomain(childWindow);

/*domainSandboxWebView.sendRequest("testCallback", {"message": "HelloWordRequest"}, function (data) {
    console.log(data);
});*/

domainSandboxWebView.startSwarm("testSwarm.js", "start",{"message": "HelloWordSwarm"}, function (data) {
    console.log(data);
});



