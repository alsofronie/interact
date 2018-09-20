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
        MEET_YOUR_FATHER:"meetYourFather"
}

function registerParent(){

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
        console.log(msg);
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
                console.log("SWARM_COMMAND:",msg.swarmName);
                $$.flow.start(msg.swarmName, msg.ctor, msg.args);
                break;
            }
            default:deliverCommandResponse(msg);

        }
    });

    window.parent.postMessage({
        command:COMMAND_TYPES.MEET_YOUR_CHILD
    }, "*");


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
    connectDomain:function (childWindow) {
        var initialized = false;
        var toBeDispatchedWhenChildIsReady = [];


        function childIsReady(){
            initialized = true;
            while(toBeDispatchedWhenChildIsReady.length>0){
                var request = toBeDispatchedWhenChildIsReady.pop();
                request();
            }
        }

        function dispatchToChild(swarmName, ctor, args){
            childWindow.postMessage({
                command:COMMAND_TYPES.SWARM,
                swarmName:swarmName,
                ctor:ctor,
                args:args
            },"*");
        }

        function dispatchSwarmRequest(swarmName, ctor, args) {
            if (initialized === true) {
                dispatchToChild(swarmName, ctor, args);
            }
            else {
                console.log("Child is not ready yet.")
                var toBeLaterDispatched = function (swarmName, ctor, args) {
                    return function () {
                        dispatchToChild(swarmName, ctor, args)
                    };
                };
                toBeDispatchedWhenChildIsReady.push(toBeLaterDispatched(swarmName, ctor, args));
            }

        }


        function establishCommunicationWithChild(msg) {

            if (msg.data.command === COMMAND_TYPES.MEET_YOUR_CHILD) {
                childIsReady();

                childWindow.postMessage(
                    {
                        command: COMMAND_TYPES.MEET_YOUR_FATHER
                    },
                    "*"
                )
            }
        }

        childWindow.parent.addEventListener("message", establishCommunicationWithChild);


        return {
            sendRequest: function (type, args, callback) {
                notImplementd();
            },
            startSwarm: function (swarmName, ctor, args, callback) {
                dispatchSwarmRequest(swarmName, ctor, args);
            },
            get: function (domainUrlKey, callback) {
                notImplementd();
            },
            set: function (domainUrlKey, value, callback) {
                notImplementd();
            },
            onRequest: function (type, callback) {
                notImplementd();
            }
        }

    }
};


if(typeof module !== "undefined" ){
    module.exports = exportInteract;

}

export const interact = exportInteract;

