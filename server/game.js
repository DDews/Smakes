
Meteor.publish("gamedata", function() {
	console.log(this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("gamedata for : " +username);
	
	return Gameinfo.find( { username: username } );
	
});


Meteor.publish("unitinfo", function() {
	console.log(this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("unitinfo for : " +username);
	
	return Unitinfo.find( { username: username } );
	
});


Meteor.publish("combatinfo", function() {
	console.log(this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("combatinfo for : " + username);
	
	return Combatinfo.find( { username: username } );
	
});

Meteor.methods({
	newGame: (data) => {
		
		console.log("dickbutts");
		var username = Meteor.user() && Meteor.user().username;
		
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		if (Gameinfo.findOne({username: username})) {
			throw new Meteor.Error(422, "You already have a game!");
		}
		
		var unit = new Unit();
		unit.username = username;
		unit.name = data.name;
		unit.job = data.job;
		
		dbupdate(unit);
		
		console.log(unit);
		
		var gamedata = {
			username: username,
			units: [unit._id],
			items: [],
			combat: null,
			kills: 0,
		};
		dbinsert("Gameinfo", gamedata)
		
		console.log(gamedata);
		
	},
	
	startCombat: (data) => {
		console.log("combat is starting!");	
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		console.log("user found!");	
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		console.log("gamedata found!");	
		var userinfo = Userinfo.findOne({username: username});
		console.log("userinfo found!");	
		
		var region = data.region;
		var regionData = areaData[region];
		console.log("region found!");	
		if (!regionData) { throw new Meteor.Error(422, "Error: Unknown region " + region); }
		var enemies = regionData.enemies;
		
		
		var units = []
		
		gamedata.units.each(
			(id) => { 
				var u = dbget("Unitinfo", id);
				u.fullHeal(); units.push(u); 
		} );
		console.log("units added!");	
		var size = 1 + Random.range(regionData.min, regionData.max) * .5;
		size.times((s) => { units.push(Monster(enemies.choose(), 1, 0)); })
		console.log("monsters generated!");
		
		var combat = new Combat(units);
		
		gamedata.combat = combat;
		combat.username = username;
		console.log(combat);
		dbupdate(gamedata);
		
		console.log("saved!");	
		
		
		
	},
		
});