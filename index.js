/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */

const applyTemplate = require("./util/interactUtil");

const exportInteract = {
    connectDomain : require("./webConnect"),
    initConsoleMode:function(){
		applyTemplate(require("./consoleInteract"));
    },
    initWebEmbeddedMode:function(){
        applyTemplate(require('./webInteract'));
    },
    initCustomMode:applyTemplate,
};

module.exports = exportInteract;
