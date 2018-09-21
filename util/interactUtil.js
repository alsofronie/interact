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

module.exports = applyTemplate;