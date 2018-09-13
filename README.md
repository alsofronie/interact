# interact module
APIs to interact with an embedded PrivateSky domain in a webview or iframe (child). Another window will act as a parent for one ore more childs.
These APIs also offer primitives for PrivateSky conversational interfaces in console mode or could be used to implement them on the client side

#Host APIs

var interact = require("interact");
var domainSandboxWebView = interact.connectChild(wnd)

domainSandboxWebView.sendRequest(type,args,callback)
domainSandboxWebView.startSwarm(swarmName,ctor, args, callback) //start a swarm inside of the child

domainSandboxWebView.get(domainUrlKey, callback)        // ask the value of a key
domainSandboxWebView.set(domainUrlKey, value, callback) // set a value for a key

domainSandboxWebView.onRequest(type, callback)  // register callbacks for various type of request comming from child. type could be "getPIN","getNumber","getString","getPassword","getForm" (COMMAND_TYPES fields in index.js)


##Generic APIs and console mode APIs

$$.interact.say(..args)
$$.interact.log(..args)
$$.interact.readPin()
$$.interact.readPassword()
$$.interact.readNumber()
$$.interact.readString()
$$.interact.readForm()
$$.interact.response(response, originalRequest)  //used mainly internally to dispatch responses from parent


# domainUrlKey concept
A domainUrlKey is an URL in form:
    psk://PSKDomain/space/path

    where:
        psk://  signals the protocol (PrivateSky protocol, like http)
        PSKDomain  is a method to identify a PrivateSky domain. Like classical internet domains, a PSK domain is like:   subDomain_n...subDomain1.rootDomain
        space means some sort of name space and could be one of this:
            - reference - keeps data about names, aliases and references - it help the implementation of the name resolution between human readable names and technically required adresses
            - blockchain - a key in the blockchain of the domain
            - PDS - a  key in the PDS (Private Data System)
            - CSB - signals a path inside of a cloud Safe Box referenciated in the domain
            - agents - space for agents that are stakeholders in the domain
            - contract - smart contract instance serialised in domain
            - swarm   - swarm instance serialised in domain
            - flow    - flow instance serialised in domain


        Depending by the space, the path can be any string, but we suggest to use hierahical model in the form parent/child/.../child

#reference space
  The aliases space is just in json containing all the names and aliases relevant to the domain.
    The generic example could be:
    {
    uid:domainUniqueUid
    alias:domainAliasValue
    children:{
            alias:value
            uid:value
            addresses:[list of known replicas as VirtualMQ endpoints]
            ...
        }
    parents:[{
            name:value
            uid:value
            addresses:[list of known replicas as VirtualMQ endpoints]
            ...
           }]
    csbs:[{
            alias:value,
            dseed:value,
            seed:value,
            publicKeys:[values],
            version:integer
            virtualMQAdresses:[list of adresses],
        }]
    }


   uid: Each domain has a name represented by an uniquly cryptografically generated identifier but also by a  readable
   alias: is a string with the favorite, human readable name for the current domain
   children: contains all entries for the accepted childrens for this domain
   parent: contains all entries for the accepted parents for this domain
   casbs: contain a CSB reference

   A CSB reference could contain the following fields:
    - seed - anybody can write in CSB (very unusual!)
    - dseed - anybody can read data from CSB but can not create a new version (write new content) without signing the HASH of the content with a private key
    - publicKey - an array with publicKeys that should be used to check that the write in the CSB was properly authorised
    - version: signals the current version of the CSB
    - virtualMQAdresses that could be used to retrieve the content of the CSB



