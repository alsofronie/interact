require("util");
require("callflow");
const interact = require('interact');

const childWindow = (document.getElementsByTagName("iframe")[0]).contentWindow;

const childMq = interact.createMQ(childWindow);
const interactionSpace = $$.newInteractionSpace(childWindow);

interactionSpace.newInteraction("swarmTest.js",{

    sayHello:function(){
        this.swarm("clientSaidHello","My name is Rafael");
    },

    sayGoodby:function(){
        this.swarm("clientSaidGoodby","Goodby, see you tomorrow");
    }
});





