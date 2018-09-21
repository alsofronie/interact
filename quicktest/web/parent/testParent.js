var childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;
import {connectDomain} from '../../../webConnect.js';

var domainSandboxWebView = connectDomain(childWindow);

/*domainSandboxWebView.sendRequest("testCallback", {"message": "HelloWordRequest"}, function (data) {
    console.log(data);
});*/

domainSandboxWebView.startSwarm("testSwarm.js", "start","message","Test",[1,2,3]).onReturn(function(data){
    console.log("Returned data:",data);
});



