/*
Module that exports

 */

function notImplementd(){
    try{
        throw new Error("Function not implemented");
    } catch(err){
        console.log(err.stack);
        throw err;
    }
}

if (typeof($$.interact) !== "undefined") {
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
    var targetWindow = window.opener;
    var myWindow     = window;

    var openRequests = [];

    function deliverCommandResponse(msg){

    }

    var self = this;

    window.addEventListener('message', function(msg) {

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

module.exports = {
    initConsoleMode:function(){
        $$.interact.say = function(...args){
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
    connectDomain:function(childWindow){

        function sendSwarm(swarmName, ctor, args){
            var msg = buildMessage(COMMAND_TYPES.SWARM,args);
            msg.swarmName   = swarmName;
            msg.ctor        = ctor;
            childWindow.postMessage(msg, "*")
        }

        return {
            onRequest:function(type, callback){

            },
            sendRequest:function(type, args,callback){
                var msg = buildMessage(COMMAND_TYPES.SWARM,args);
                msg.swarmName   = swarmName;
                msg.ctor        = ctor;
                childWindow.postMessage(msg, "*")
            },
            startSwarm:function(swarmName, ctor, args, callback){
                sendSwarm(swarmName, ctor, args)
            },
            get:function(domainUrlKey, callback){
                sendSwarm("PDS", "get", [domainUrlKey],callback);
            },
            set:function(domainUrlKey, value, callback){
                sendSwarm("PDS", "get", [domainUrlKey, value],callback);
            }
        }
    },
    initCustomMode:applyTemplate
}