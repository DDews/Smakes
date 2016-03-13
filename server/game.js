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
	var level = regionData.level;
	var enemies = regionData.enemies;
		
	size.times((s) => { 
		var mon = Monster(enemies.choose(), level, combo)
		units.push(mon); 
	});
	return units;
}

var starterEquips = {
	head: {
		id:'eq_starter_helm',
		name:'Headband',
		icon:'helm6',
		desc:'A small headband.',
		type:'Equipment',
		slot:"head",
		value: 50,
		rarity: 2,
		
		armor: 10,
		shell: 10,
		pdef: .01,
	},
	body: {
		id:'eq_starter_body',
		name:'Cotton Shirt',
		icon:'armor1',
		desc:'Does not offer much protection',
		type:'Equipment',
		slot:"body",
		value: 50,
		rarity: 2,
		
		armor: 25,
		shell: 25,
		pdef: .04,
	},
	legs: {
		id:'eq_starter_legs',
		name:'Cotton Skirt',
		icon:'leg1',
		desc:'A cute skirt.',
		type:'Equipment',
		slot:"legs",
		value: 50,
		rarity: 2,
		
		armor: 20,
		shell: 20,
		pdef: .03,
	},
	gloves: {
		id:'eq_starter_gloves',
		name:'Quilted Gloves',
		icon:'glove2',
		desc:'Homemade quilted gloves, made with love.',
		type:'Equipment',
		slot:"gloves",
		value: 50,
		rarity: 2,
		
		armor: 13,
		shell: 13,
		pdef: .01,
	},
	feet: {
		id:'eq_starter_feet',
		name:'Basic Shoes',
		icon:'shoes1',
		desc:'Simple shoes with rubber bottoms.',
		type:'Equipment',
		feet:"feet",
		value: 50,
		rarity: 2,
		
		armor: 12,
		shell: 12,
		pdef: .01,
	},
	handRight: {
		id:'eq_starter_knife',
		name:'Kitchen Knife',
		icon:'dagger14',
		desc:'A simple knife, more suited for cooking than combat.',
		type:'Equipment',
		slot:"hand",
		slotIsPrefix:true,
		value: 50,
		rarity: 2,
		element:"slash",
		
		patk: 25,
		pacc: .10,
		aspd: .4
	},
	handLeft: {
		id:'eq_starter_shield',
		name:'Pan Lid',
		icon:'shield2',
		desc:'A sturdy pan lid. A great shield for beginners.',
		type:'Equipment',
		slot:"hand",
		slotIsPrefix:true,
		value: 50,
		rarity: 2,
		
		armor: 20,
		shell: 20,
		pdef: .01,
		peva: .05,
	},
	
};

var newPlayerUnit = function(username, name, job) {
	var unit = new Unit();
	unit.username = username;
	unit.name = name;
	unit.job = job;
	
	unit.equipment = starterEquips;
	
	unit.recalc();
	
	dbupdate(unit);
	return unit;
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
		
		var unit = newPlayerUnit(username, data.name, data.job);
		
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
	
	buyStat: (data) => {
		var stat = data.stat;
		var n = data.n;
		var unit = Unitinfo.findOne(data.unit);
		
		console.log("Upgrading shit yo ");
		console.log(stat + " + " + n);
		if (unit) {
			var exp = unit.spendableExp;
			var statsP = unit.statsPurchased || {};
			var val = statsP[stat] || 0;
			var cost = statUpgradeCost(val, n);
			
			if (exp >= cost) {
				unit.spendableExp -= cost;
				unit[stat] += n;
				statsP[stat] = val + n;
				unit.statsPurchased = statsP;
				
				unit.recalc();
				if (!unit.combat) {
					unit.fullHeal();
				}
				
				dbupdate(unit);
			} 
			
			
		}
		
		
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
	runAway: function() {
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
		
		combatinfo.run = true;
		dbupdate(combatinfo);
		
		//Remove non-player units
		//combatinfo.cleanUpCombat();
		//Remove combat object
		//combatinfo.endcombat();
		
		
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
		
		var timeMilis = 200;
		var sendTime = data.sendTime;
		
		var now = (new Date()).getTime();
		var lastTime = combatinfo.lastTime;
		
		var currentTurn = now;
		combatinfo.currentTurn = currentTurn;
		var messages = {turn: currentTurn};
		
		if (combatinfo.hits.unshift(messages) > 3) { combatinfo.hits.pop(); }
		combatinfo.rebuildCombatantLists();
		
		if (Math.abs(now - lastTime - timeMilis) > 40) {
			console.log("elapseTime: potential cheating detected, ignoring!")
		} else {
			combatinfo.combatants.each((id) => {
				var unit = dbget("Unitinfo", id);
				
				if (unit) {
					unit.combatUpdate(.2, combatinfo);
					
					
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