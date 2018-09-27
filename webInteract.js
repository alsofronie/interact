const commandTypes = require('./util/commandTypes.js');
const uuidv4 = require('./util/uuid.js');

function WebEmbeddedImplementation(){ //this works inside of the iframe

    var targetWindow = window.parent;

    var openRequests = [];

    function sendMessageToParent (message){
        targetWindow.postMessage(message,"*");
    }

    var self = this;


    function buildMessage(type, args,options){
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

    window.addEventListener('message', function(event) {
        var msg = event.data;

        if(msg.commandType === "response"){

            let targetedRequest = openRequests.find(function(request){
                return request.requestId === msg.requestId;
            });
            if(targetedRequest){
                targetedRequest.callback(msg.data);
            }
        }


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
                    meta:{
                        requestId:msg.requestId,
                        phaseName:"success"
                    },
                    message:"From fake swarm"
                });

                setTimeout(function(){
                    sendMessageToParent({
                        meta:{
                            requestId:msg.requestId,
                            phaseName:"error"
                        },
                        message:"From fake swarm"
                    });
                },1000);
                break;
            }
            default:sendMessageToParent({"error": "Command was not understood", command:msg.command});

        }
    });

    targetWindow.postMessage({
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
    };

    this.readPin = createAskForInput(commandTypes.GET_PIN);

    this.readPassword = createAskForInput(commandTypes.GET_PSW);

    this.readNumber = createAskForInput(commandTypes.GET_NMB);

    this.readString = createAskForInput(commandTypes.GET_STR);

    this.readForm = createAskForInput(commandTypes.GET_FRM);

    this.sendRequest = function(command, ...params){
        if(typeof params[params.length-1] === "function"){
            var callback = params.pop();
        }

        var args = params;
        var request = buildMessage(command, args);
        request.requestId = uuidv4();
        targetWindow.postMessage(request, "*");

        if(callback){
            request.callback = callback;
            openRequests.push(request);
        }

    }
}

module.exports = new WebEmbeddedImplementation();