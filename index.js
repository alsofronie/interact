/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */

const applyTemplate = require("./util/interactUtil");

const exportInteract = {
    initConsoleMode:function(){
		applyTemplate(require("./consoleInteract"));
    },
    initWebEmbeddedMode:function(){
        applyTemplate(require('./webInteract'));
    },
    initCustomMode:applyTemplate,
};


/*if(typeof module !== "undefined" ){
    module.exports = exportInteract;
}

export const interact = exportInteract;
*/

module.exports = exportInteract;
