
Meteor.publish("gamedata", function() {
	console.log("User id for gamedata: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("gamedata for : " + username + "\n" + Gameinfo.find({username: username}).count() );
	
	return Gameinfo.find( { username: username } );
	
});


Meteor.publish("unitinfo", function() {
	console.log("User id for unitinfo: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("unitinfo for : " + username + "\n" + Unitinfo.find({username: username}).count() );
	
	return Unitinfo.find( { username: username } );
	
});


Meteor.publish("combatinfo", function() {
	console.log("User id for combatinfo: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("combatinfo for : " + username + "\n" + Combatinfo.find({username: username}).count() );
	
	return Combatinfo.find( { username: username } );
	
});

Meteor.methods({
	newGame: (data) => {
		
		console.log("new game started");
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
		
		//console.log(unit);
		
		var gamedata = {
			username: username,
			units: [unit._id],
			items: [],
			combat: null,
			kills: 0,
		};
		dbinsert("Gameinfo", gamedata)
		
		console.log("Gameinfo\n" + gamedata);
		
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
				u.fullHeal(); 
				units.push(u); 
		} );
		console.log("units added!");	
		var size = 1 + Random.range(regionData.min, regionData.max) * .25;
		size.times((s) => { 
			var mon = Monster(enemies.choose(), 1, 0)
			units.push(mon); 
			mon.username = username;
			dbupdate(mon);
			console.log("Generated " + mon.name + " the " + mon.race + " : in combat with : " + mon.username);
		});
		console.log("monsters generated!");
		
		var combat = new Combat(units, username);
		gamedata.combat = combat._id;
		dbupdate(gamedata);
		
		console.log("Combatinfo: " + combat);
		console.log("Gameinfo: " + gamedata);
		console.log("saved!");	
		
		
		
	},
		
});