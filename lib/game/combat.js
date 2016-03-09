//takes all combatants in the combat
Combat = function(units, username, region) {
	this.username = username;
	this.region = region;
	this.lastTime = (new Date()).getTime();
	this.combatants = [];
	this.combo = 0;
	this.hits = [];
	
	this.combatlog = ["Combat Started!"]
	units.each(c => this.combatants.push(c._id));
	dbinsert("Combatinfo", this);
	
	
	
	this.opposition = {};
	this.byTeam = {};
	
	this.combatants.each( (id) => {
		var c = dbget("Unitinfo", id);
		c.combat = this._id;
		c.username = username;
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
