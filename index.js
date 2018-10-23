/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */


const exportInteract = {
    createInteractionSpace: require("./lib/interactionSpace").createInteractionSpace,
    createWindowInteractionSpace: require("./lib/WMQInteractionSpace").createInteractionSpace,
    createWindowMQ:require("./lib/ChildWndMQ").createMQ,
    createWMQInteractionSpace: require("./lib/virtualMQInteractionSpace"),
    createRemoteInteractionSpace: require('./lib/remoteInteractionSpace').createRemoteInteractionSpace
};

module.exports = exportInteract;
