//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Published data for game

Meteor.publish("gamedata", function() {
	//console.log("User id for gamedata: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("gamedatas for " + username + " : " + Gameinfo.find({username: username}).count() );
	
	return Gameinfo.find( { username: username } );
	
});

	

Meteor.publish("unitinfo", function() {
	//console.log("User id for unitinfo: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("unitinfos for " + username + " : " + Unitinfo.find({username: username}).count() );
	
	return Unitinfo.find( { username: username } );
	
});

Meteor.publish("allunits", function() {
	return Unitinfo.find();
})

Meteor.publish("combatinfo", function() {
	//console.log("User id for combatinfo: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("combatinfos for " + username + " : " + Combatinfo.find({username: username}).count() );
	
	return Combatinfo.find( { username: username } );
	
});

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Extra helper functions for serverside game logic
spawnMonsters = function(regionData, combo) {
	var size = 1 + Random.range(regionData.min, regionData.max) * .25;
	var units = [];
	var enemies = regionData.enemies;
		
	size.times((s) => { 
		var mon = Monster(enemies.choose(), 1, combo)
		units.push(mon); 
	});
	return units;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Messages that can be sent to the server by clients for game logic.

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
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		//var userinfo = Userinfo.findOne({username: username});
		
		var region = data.region;
		var regionData = areaData[region];
		if (!regionData) { throw new Meteor.Error(422, "Error: Unknown region " + region); }
		
		
		var units = []
		
		gamedata.units.each( (id) => { 
				var u = dbget("Unitinfo", id);
				u.fullHeal(); 
				units.push(u); 
		} );
		
		//console.log("units added!");	
		var mons = spawnMonsters(regionData, 0);
		mons.each( (mon) => { 
			mon.username = username;
			units.push(mon); 
			dbupdate(mon);
		} );
		
		var combat = new Combat(units, username, region);
		gamedata.combat = combat._id;
		
		dbupdate(gamedata);
		
	},
	
	elapseTime: function(data) {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var combatinfo = Combatinfo.findOne({username: username});
		if (!combatinfo) { throw new Meteor.Error(422, "Error: You must be in combat");}
		var userinfo = Userinfo.findOne({username: username})
		if (!userinfo._collection) {
			userinfo._collection = "Userinfo";
		}
		
		var time = data.time;
		var timeMilis = time * 1000;
		var sendTime = data.sendTime;
		
		var now = (new Date()).getTime();
		var lastTime = combatinfo.lastTime;
		
		combatinfo.rebuildCombatantLists();
		
		if (Math.abs(now - lastTime - timeMilis) > 40) {
			console.log("elapseTime: potential cheating detected, ignoring!")
		} else {
			//console.log("elapseTime: elapsing " + time + "s")
			combatinfo.combatants.each((id) => {
				var unit = dbget("Unitinfo", id);
				
				if (unit) {
					unit.combatUpdate(time, combatinfo);
					
					
				} else {
					console.log("elapseTime: could not find unit " + id);
				}
				
				
			})
			
		}
			
		
		var winner = combatinfo.winningTeam();
		//console.log("winner: " + winner)
		if (winner) {
			if (winner == 'player') {
				var region = combatinfo.region;
				console.log("Spawning next thing in Region : " + region)
				var regionData = areaData[region];
				combatinfo.combo += 1;
				//userinfo.kills += 
				var goldDrop = 0;
				var expDrop = 0;
				combatinfo.combatants.each((id) => {
					var unit = dbget("Unitinfo", id);
					
					if (unit.team != 'player') {
						goldDrop += unit.exp * Random.value();
						expDrop += unit.exp;
					}
				})
				
				userinfo.wallet.gold = Math.floor(userinfo.wallet.gold + goldDrop);
				console.log("dropped " + goldDrop + " golds");
				
				gamedata.units.each((id) => {
					var unit = dbget("Unitinfo", id);
					
					unit.giveExp(expDrop);
					
				})
					
				
				combatinfo.cleanUpCombat();
				var mons = spawnMonsters(regionData, combatinfo.combo);
				combatinfo.startNewBattle(mons);
				
				dbupdate(combatinfo);
				dbupdate(userinfo);
				
				combatinfo.lastTime = now;
			} else {
				
				combatinfo.cleanUpCombat();
				combatinfo.endCombat();
				
			}
			
			
		} else {
		
			combatinfo.lastTime = now;
			dbupdate(combatinfo);
		}
		
		
		
	}
		
		
		
		
});