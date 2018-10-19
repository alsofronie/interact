if (typeof $$ == "undefined") {
    $$ = {};
}

function VirtualSwarm(innerObj, globalHandler){
    var knownExtraProps = ["swarm"];

    function buildHandler(){
        var utility = {};
        return {
            set: function(target, property, value, receiver){
                if(target.privateVars && target.privateVars.hasOwnProperty(property)){
                    target.privateVars[property] = value;
                } else{
                    if(target.publicVars && target.publicVars.hasOwnProperty(property)){
                        target.publicVars[property] = value;
                    } else {
                        if(target.hasOwnProperty(property)){
                            target[property] = value;
                        }else{
                            if(knownExtraProps.indexOf(property) == -1){
                                if(!globalHandler.protected){
                                    globalHandler.protected = {};
                                }
                                globalHandler.protected[property] = value;
                            }else{
                                utility[property] = value;
                            }
                        }
                    }
                }
                return true;
            },
            get: function(target, property, receiver){
                if(target.publicVars && target.publicVars.hasOwnProperty(property)){
                    return target.publicVars[property];
                }

                if(target.privateVars && target.privateVars.hasOwnProperty(property)){
                    return target.privateVars[property];
                }

                if(target.hasOwnProperty(property)){
                    return target[property];
                }

                if(globalHandler.protected && globalHandler.protected.hasOwnProperty(property)){
                    return globalHandler.protected[property];
                }

                if(utility.hasOwnProperty(property)){
                    return utility[property];
                }

                return undefined;
            }
        }
    }

    return new Proxy(innerObj, buildHandler());
}

function SwarmInteraction(communicationInterface, swarmName, ctor, args) {

    var swarmHandler = communicationInterface.startSwarm(swarmName, ctor, args);

    this.on = function(description){
        communicationInterface.on(swarmHandler, function(err, swarmSerialisation){
            var phase = description[swarmSerialisation.meta.phaseName];
            var virtualSwarm = new VirtualSwarm(swarmSerialisation, swarmHandler);

            virtualSwarm.swarm = function(phaseName, ...args){
                communicationInterface.resendSwarm(swarmHandler, swarmSerialisation, phaseName, args);
            };

            phase.apply(virtualSwarm, swarmSerialisation.meta.args);
            if(virtualSwarm.meta.__isReturn){
                communicationInterface.off(swarmHandler);
            }
        })
    };

    this.onReturn = function(callback){

    };
}

var abstractInteractionSpace = {
    startSwarm: function (swarmName, ctor, args) {
        throw new Error("Overwrite  SwarmInteraction.prototype.startSwarm")
    },
    resendSwarm: function (swarmInstance, swarmSerialisation, ctor, args) {
        throw new Error("Overwrite  SwarmInteraction.prototype.resendSwarm ")
    },
    on: function (swarmInstance, phaseName, callback) {
        throw new Error("Overwrite  SwarmInteraction.prototype.onSwarm")
    },
    off: function (swarmInstance) {
        throw new Error("Overwrite  SwarmInteraction.prototype.onSwarm")
    }
}

module.exports.newInteractionSpace = function (communicationInterface) {

    if(!communicationInterface) {
        communicationInterface = abstractInteractionSpace ;
    }
    return {
        newInteraction: function (swarmName, ctor, args) {
            return new SwarmInteraction(communicationInterface, swarmName, ctor, args);
        }
    }
}


/*
Example of usage:

    var ispace = $$.newInteractionSpace({
    ...provide implementation
    )

    ispace.newInteraction("swarmname", {
        readPassword:function(text){
            //write text somewhere..
            this.swarm("onPInRead", password);
        },
        onReturn:function(){
          //do somethings
          this.end();
                  }

    )

 */

