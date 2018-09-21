/*
Module that offers APIs to interact with PrivateSky web sandboxes
 */

function notImplementd(){
    try{
        throw new Error("Function not implemented");
    } catch(err){
        console.log(err.stack);
        throw err;
    }
}

if (typeof($$.interact) === "undefined") {
    $$.interact = {
        say: notImplementd,
        log: notImplementd,
        response: notImplementd,
        readPin: notImplementd,
        readPassword: notImplementd,
        readNumber: notImplementd,
        readString: notImplementd,
        readForm: notImplementd
    };
}

const COMMAND_TYPES = {
        MESSAGE:"message",
        SAY:"say",
        LOG:"log",
        GET_KEY:"getKey",
        SET_KEY:"setKey",
        SWARM  :"startSwarm",
        GET_PIN:"getPIN",
        GET_NMB:"getNumber",
        GET_STR:"getString",
        GET_PSW:"getPassword",
        GET_FRM:"getForm",
        MEET_YOUR_CHILD:"meetYourChild",
};


function applyTemplate(template){
    for(var v in template){
        $$.interact[v] = template[v].bind($$.interact);
    }
}

const exportInteract = {
    initConsoleMode:function(){
        $$.interact.say = function(...args){
            notImplementd();
        }

        $$.interact.log = function(...args){
            notImplementd();
        }

        $$.interact.readPin = function(callback){
            notImplementd();
        }

        $$.interact.readPassword = function(callback){
            notImplementd();
        }

        $$.interact.readNumber = function(callback){
            notImplementd();
        }

        $$.interact.readString = function(callback){
            notImplementd();
        }

        $$.interact.readForm = function(form, callback){
            notImplementd();
        }
    },

    initCustomMode:applyTemplate,
};


if(typeof module !== "undefined" ){
    module.exports = exportInteract;

}

export const interact = exportInteract;

