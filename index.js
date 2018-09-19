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
        GET_FRM:"getForm"
}

function buildMessage(type,args,options){
    var ret = {
        command:type,
        args:args
    }

    if(options){
        for(var v in options){
            ret[v] = options[v];
        }
    }
    return ret;
}

function WebEmbeddedImplementation(){ //this works inside of the iframe
    var targetWindow = window.parent;

    var openRequests = [];

    function deliverCommandResponse(msg){

    }

    var self = this;

    window.addEventListener('message', function(event) {
        var msg = event.data;
        switch(msg.command){
            case COMMAND_TYPES.GET_KEY: {
                $$.flow.start("pds", "getKey", msg.key, function(err, res){
                    self.response(res, msg);
                });
                break;
            }
            case COMMAND_TYPES.SET_KEY: {
                $$.flow.start("pds", "setKey", msg.key);
                break;
            }
            case COMMAND_TYPES.SWARM  : {
                $$.flow.start(msg.swarmType, msg.ctor, msg.args);
                break;
            }
            default:deliverCommandResponse(msg);

        }
    });


    function createAskForInput(type){
        return function(callback){
            var request = buildMessage(type);
            targetWindow.postMessage(request, "*");
            request.callback = callback;
            openRequests.push(request);
        }
    }

    this.say = function(...args){
        targetWindow.postMessage(buildMessage(COMMAND_TYPES.SAY, args), "*");
    }

    this.log = function(...args){
        targetWindow.postMessage(buildMessage(COMMAND_TYPES.LOG, args), "*");
    }

    $$.log = this.log;


    this.response = function(response, request){
        targetWindow.postMessage(buildMessage(COMMAND_TYPES.RESPONSE, request), "*");
    }

    this.readPin = createAskForInput(COMMAND_TYPES.GET_PIN);

    this.readPassword = createAskForInput(COMMAND_TYPES.GET_PSW);

    this.readNumber = createAskForInput(COMMAND_TYPES.GET_NMB);

    this.readString = createAskForInput(COMMAND_TYPES.GET_STR);

    this.readForm = createAskForInput(COMMAND_TYPES.GET_FRM);
}

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
    initWebEmbeddedMode:function(){
        applyTemplate(new WebEmbeddedImplementation());
    },
    initCustomMode:applyTemplate,
    connectDomain:function () {
        return new Error("Not implemented yet");
    }
};


if(typeof module !== "undefined" ){
    module.exports = exportInteract;

}

export const interact = exportInteract;

