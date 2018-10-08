require("util");
require("callflow");
const interact = require('interact');

const childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;

//$$.remote.newEndPoint("clientAgent", "http://192.168.0.1:8081", "domeniuPrivatesky.subdomeniu1/agent/NumeAgent","cryptoInfo");

const childMq = interact.createMQ("webInteraction",childWindow);

const webInteractionSpace = new interact.WebInteractionSpace(childMq);

const interactionSpace = $$.newInteractionSpace(webInteractionSpace);

interactionSpace.newInteraction("swarmTest.js", {

    sayHello:function(){
        this.swarm("clientSaidHello","My name is Rafael");
    },

    sayGoodby:function(){
        this.swarm("clientSaidGoodby","Goodby, see you tomorrow");
    }
});