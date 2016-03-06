//takes all combatants in the combat
Combat = function(units) {
	this.combatants = [];
	units.each(c => this.combatants.push(c));
	this.byTeam = {};
	this.opposition = {};
	
	this.combatants.each( (c) => {
		c.combat = this;
		var team = this.byTeam[c.team] || []
		team.push(c)
		
		this.byTeam[c.team] = team
	})
	
	this.byTeam.each((team, dudes) => {
		this.opposition[team] = combatants.subtract(dudes)
	})
	
	
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
