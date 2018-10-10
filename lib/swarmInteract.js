if (typeof $$ == "undefined") {
    $$ = {};
}

function SwarmInteraction(communicationInterface, swarmName, ctor, args) {

    var swarmHandler = communicationInterface.startSwarm(swarmName, ctor, args);

    this.on = function(description){
        communicationInterface.on(swarmHandler, function(swarmSerialisation){
            var phase = description[swarmSerialisation.meta.phaseName];
            swarmSerialisation.swarm = function(phaseName, ...args){
                communicationInterface.resendSwarm(swarmHandler,swarmSerialisation,phaseName,args);
            }

            phase.apply(swarmSerialisation,swarmSerialisation.meta.args);
            if(swarmSerialisation.meta.__isReturn){
                communicationInterface.off(swarmHandler);
            }
        })
    }

    this.onReturn = function(callback){

    }
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

