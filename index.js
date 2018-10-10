/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */


const exportInteract = {
    createInteractionSpace: require("./lib/interactionSpace").createInteractionSpace,
    createWindowMQ:require("./lib/ChildWndMQ").createMQ,
    createWMQInteractionSpace: require("./lib/virtualMQInteractionSpace")
};

module.exports = exportInteract;
