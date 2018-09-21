/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */

const applyTemplate = require("./util/interactUtil");

const exportInteract = {
    initConsoleMode:function(){
		applyTemplate(require("./consoleInteract"));
    },
    initCustomMode:applyTemplate,
};


if(typeof module !== "undefined" ){
    module.exports = exportInteract;

}

//export const interact = exportInteract;

