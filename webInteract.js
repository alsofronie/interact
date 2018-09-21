import commandTypes from './util/commandTypes.js';


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

function applyTemplate(template){
    for(var v in template){
        $$.interact[v] = template[v].bind($$.interact);
    }
}


function WebEmbeddedImplementation(){ //this works inside of the iframe

    var targetWindow = window.parent;

    var openRequests = [];


    function sendMessageToParent (message){
        window.parent.postMessage(message,"*");
    }

    var self = this;

    window.addEventListener('message', function(event) {
        var msg = event.data;
        console.log(msg.command);
        switch(msg.command){
            case commandTypes.GET_KEY: {
                $$.flow.start("pds", "getKey", msg.key, function(err, res){
                    self.response(res, msg);
                });
                break;
            }
            case commandTypes.SET_KEY: {
                $$.flow.start("pds", "setKey", msg.key);
                break;
            }
            case commandTypes.SWARM  : {
                console.log("SWARM_COMMAND:",msg.swarmName);
                $$.flow.start(msg.swarmName, msg.ctor, msg.args);
                sendMessageToParent({
                    requestId:msg.requestId,
                    message:"From fake swarm"
                });
                break;
            }
            default:sendMessageToParent({"error": "Command was not understood", command:msg.command});

        }
    });

    window.parent.postMessage({
        command:commandTypes.MEET_YOUR_CHILD
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
        targetWindow.postMessage(buildMessage(commandTypes.SAY, args), "*");
    }

    this.log = function(...args){
        targetWindow.postMessage(buildMessage(commandTypes.LOG, args), "*");
    }

    $$.log = this.log;


    this.response = function(response, request){
        targetWindow.postMessage(buildMessage(commandTypes.RESPONSE, request), "*");
    }

    this.readPin = createAskForInput(commandTypes.GET_PIN);

    this.readPassword = createAskForInput(commandTypes.GET_PSW);

    this.readNumber = createAskForInput(commandTypes.GET_NMB);

    this.readString = createAskForInput(commandTypes.GET_STR);

    this.readForm = createAskForInput(commandTypes.GET_FRM);
}

const initWebEmbeddedMode  = function(){
    applyTemplate(new WebEmbeddedImplementation());
}

export default initWebEmbeddedMode;