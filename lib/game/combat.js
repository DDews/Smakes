//takes all combatants in the combat
Combat = function(units, username) {
	this.username = username;
	this.combatants = [];
	units.each(c => this.combatants.push(c._id));
	this.byTeam = {};
	this.opposition = {};
	dbinsert("Combatinfo", this);
	
	this.combatants.each( (id) => {
		var c = dbget("Unitinfo", id);
		c.combat = this._id;
		var team = this.byTeam[c.team] || []
		team.push(c._id)
		
		this.byTeam[c.team] = team
		dbupdate(c);
	})
	
	this.byTeam.each((team, dudes) => {
		this.opposition[team] = this.combatants.subtract(dudes)
	})
	
	//console.log(this);
	dbupdate(this);
}


Combat.prototype.winningTeam = function() {
	var teams = []
	combatants.each((c) => {
		if (!c.dead() && teams.indexOf(c.team) >= 0) {
			teams.push(c.team)
		}
	})
	if (teams.length == 1) { return teams[0]; }
	return null;
}
