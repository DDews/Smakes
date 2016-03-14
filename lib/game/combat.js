defaultSummary = {
	message: "None",
	time: 1,
	goldDrop: 0,
	expDrop: 0,
	kills: 0,
	eliteKills: 0,
	skillsUsed: 0,
	deaths: 0,
	resses: 0,
	missesDealt: 0,
	missesTaken: 0,
	hitsDealt: 0,
	hitsTaken: 0,
	critsDealt: 0,
	critsTaken: 0,
	damageDealt: 0,
	damageTaken: 0,
	healingDone: 0,
};

//takes all combatants in the combat
Combat = function(units, username, region) {
	this.username = username;
	this.region = region;
	this.lastTime = (new Date()).getTime();
	this.combatants = [];
	this.combo = 0;
	this.hits = [];
	this.summary = defaultSummary;
	
	this.beginTime = (new Date()).getTime();
	
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
	
	dbupdate(this);
}
