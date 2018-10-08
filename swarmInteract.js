if (typeof $$ == "undefined") {
    $$ = {};
}

function SwarmInteraction(communicationInterface, swarmName, description, ctor, ...args) {
    var swarmInstance = communicationInterface.startSwarm(swarmName, ctor, args);

    function bindInteractPhase(phaseName, callOnEnd) {
        return function (err, swarmSerialisation) {
            swarmSerialisation.swarm = function (phaseName, ...args) {
                communicationInterface.resendSwarm(swarmInstance,swarmSerialisation,phaseName,args);
            }
            swarmSerialisation.end = function (swarmInstance) {
                communicationInterface.off(swarmInstance);
            }
            phase.apply(swarmSerialisation, swarmSerialisation.meta.args);
            if(callOnEnd){
                communicationInterface.off(swarmInstance);
            }
        }
    }

    this.onSwarm = function(phaseName, callback){
        swarmInstance.on(phaseName,callback);
    };

    var hasOnReturn = false;
    for (var v in description) {
        if(v == "onReturn"){
            hasOnReturn = true;
        }

        this.onSwarm(v, bindInteractPhase(v), hasOnReturn);
    }
    if(!hasOnReturn){
        description["onReturn"] = function(err, swarm){
            communicationInterface.off(swarmInstance);
        }
        this.onSwarm("onReturn", bindInteractPhase("onReturn", true));
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

$$.newInteractionSpace = function (communicationInterface) {

    if(!communicationInterface) {
        communicationInterface = abstractInteractionSpace ;
    }
    return {
        newInteraction: function (swarmName, description, ctor, ...args) {
            return new SwarmInteraction(communicationInterface, swarmName, description, ctor, ...args);
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

