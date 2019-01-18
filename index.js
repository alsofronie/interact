/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */


const exportBrowserInteract = {
    enableIframeInteractions: function () {
        module.exports.createWindowMQ = require("./lib/ChildWndMQ").createMQ;
        module.exports.createWindowInteractionSpace = require("./lib/WMQInteractionSpace").createInteractionSpace;
    },

    enableReactInteractions: function () {
        module.exports.createWindowInteractionSpace = require("./lib/WMQInteractionSpace").createInteractionSpace;
        module.exports.createWindowMQ = require("./lib/ChildWndMQ").createMQ;
    },
    enableWebViewInteractions:function(){
        module.exports.createWindowInteractionSpace = require("./lib/WebViewMQInteractionSpace").createInteractionSpace;
        module.exports.createWindowMQ = require("./lib/ChildWebViewMQ").createMQ;
    },
    enableLocalInteractions: function () {
        module.exports.createInteractionSpace = require("./lib/interactionSpace").createInteractionSpace;
    },
    enableRemoteInteractions: function () {
        module.exports.createRemoteInteractionSpace = require('./lib/remoteInteractionSpace').createRemoteInteractionSpace;
    }
};


if (typeof(navigator) !== "undefined") {
    module.exports = exportBrowserInteract;

}
else {
    module.exports = {
        createNodeInteractionSpace: require("./lib/nodeInteractionSpace").createInteractionSpace,
        createInteractionSpace: require("./lib/interactionSpace").createInteractionSpace,
        createRemoteInteractionSpace: require('./lib/remoteInteractionSpace').createRemoteInteractionSpace
    }
}

