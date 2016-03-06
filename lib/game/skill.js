
Skill = function(name) {
	if (skillData.has(name)) {
		this.setVals(skillData[name])
	} else {
		console.log("Unknown skill '" + name + "'");
	}
	
}

