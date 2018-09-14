
//let module = await import('../index.js')

import {connectDomain} from '../index.js';

var childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;
//interact.connectDomain(childWindow);


console.log("Urmaresc", childWindow.postMessage);

window.addEventListener('message', function(msg) {
  console.log("In parent", msg);
})


setTimeout(function(){

    childWindow.postMessage(
        {
            command:"fromParent"
        },
        "*"
    )
}, 1000)


