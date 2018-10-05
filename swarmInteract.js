if (typeof $$ == "undefined") {
    $$ = {};
}
var onReturnCallbacks = {};
var onCallbacks = {};


function SwarmCommand (swarmName, phaseName, args){
    var swarm = {};
    swarm.meta = {};
    swarm.name = swarmName;
    swarm.meta.swarmTypeName    = swarmName;
    swarm.meta.phaseName        = phaseName;
    swarm.meta.args = args;


    this.onReturn = function (callback) {
        if (typeof callback !== "function") {
            throw new Error("The first parameter should be a string and the second parameter should be a function");
        }
        if (!onReturnCallbacks[swarmName]) {
            onReturnCallbacks[swarmName] = [];
        }
        onReturnCallbacks[swarmName].push(callback);
    };

    this.on = function (phaseName, callback) {

        if (!onCallbacks[swarmName]) {
            onCallbacks[swarmName] = [];
        }

        onCallbacks[swarmName].push({
            callback: callback,
            phaseName: phaseName
        });
    };

    this.resendSwarm = function( swarmSerialisation, phaseName, args){
        swarm.meta = swarmSerialisation.meta;
        swarm.meta.phaseName = phaseName;
        swarm.args = args;
        dispatchSwarm(swarm);
    };



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

    var hasOnReturn = false;
    for (var v in description) {
        if(v == "onReturn"){
            hasOnReturn = true;
        }

        console.log(bindInteractPhase(v));
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



var webInteractionSpace = function(childMessageQue){

    this.startSwarm = function (swarmName, ctor, args) {
        let swarmCmd = new SwarmCommand(swarmName, ctor, args);
        childMessageQue.produce(swarmCmd);
    };

    this. resendSwarm = function (swarmInstance, swarmSerialisation, phaseName, args) {
        swarmInstance.resendSwarm(swarmSerialisation, phaseName, args);
    };

    let consumerUplets = [];

    childMessageQue.registerConsumer(function(err, result){
        if(err){
            console.err(err);
            return;
        }

        for(var i=0; i<consumerUplets.length; i++){
            let consumer = consumerUplets[i];
            if((consumer.phaseName === result.meta.phaseName || consumer.phaseName === "*")
                && consumer.swarmInstance.swarmId === result.meta.swarmId){
                consumer.callback(result);
            }
        }
    });

    this.on = function (swarmInstance, phaseName, callback) {
        consumerUplets.push({swarmInstance:swarmInstance, phaseName:phaseName, callback:callback});
    };

    this.off = function (swarmInstance, phaseName) {
        for(var i=0; i<consumerUplets.length; i++){
            let consumer = consumerUplets[i];
            if((consumer.phaseName === phaseName || phaseName === "*")
                && consumer.swarmInstance.swarmId === swarmInstance.swarmId){
                consumerUplets.splice(i,1);
            }
        }
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

