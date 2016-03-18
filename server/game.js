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


Meteor.publish("inventory", function() {
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("items for " + username + " : " + Iteminfo.find({username: username}).count() );
	
	return Iteminfo.find( { username: username } );
	
})

Meteor.publish("shopItems", function() {
	return Iteminfo.find( { owner: "<shop>"} )
})
	

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
///Extra helper functions for serverside game logic

///Spawn monsters in a given region, at a given round (combo)
///Returns an array of spawned units (already placed in DB)
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

///Starter equipment objects for new units.
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


///Curve for unit recruitment costs
var unitRecruitmentCost = function(u) {
	return 1000 * Math.pow(10, u);
}


///Create a new player unit for 'username'
var newPlayerUnit = function(username, name, job) {
	var unit = new Unit();
	unit.username = username;
	unit.name = name;
	if (name == 'Neptune') {
		unit.poses = {
			normal: "http://a.pomf.cat/jmuhje.png",
			ded: "http://a.pomf.cat/qsqrer.png",
			lowHP: "http://a.pomf.cat/wszovy.png",
			happy: "http://a.pomf.cat/pzfygl.png",
			hurt: "http://a.pomf.cat/qgarkn.png",
		}
	}
	
	unit.job = job;
	unit.equipment = starterEquips;
	unit.recalc();
	
	dbupdate(unit);
	return unit;
};


///Start a combat (or begin a new round of combat)
///Creates the new combat object and associates it with the calling user.
///Adds monsters based on the region the combat is in.
///If it's the first combat, resets fatigue and combo.
var startCombat = function(data) {
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
	gamedata.lastRegion = region;
	gamedata.retryTimeout = 0;
	
	if (data.first) {
		if (!gamedata.maxStamina || gamedata.maxStamina < 5) { gamedata.maxStamina = 5; }
		gamedata.stamina = gamedata.maxStamina;
		gamedata.fatigue = 0;
		gamedata.retryTime = 20;
	} else {
		if (gamedata.stamina > 0) {
			gamedata.stamina -= 1;
		} else {
			gamedata.fatigue += 1;
			gamedata.retryTime = 20 + 10 * gamedata.fatigue;
		}
	}
	dbupdate(gamedata);
}



///Give Item to user
///username - name of user to give item to
///data - information about what item to give
///		data.item - name of item to give, or rule to use 
///					to generate item
///		data.quantity - number of items to give
///					(default = 1)
///		data.level	- level of item to generate
///					(default = 0)
///		data.rarityBonus - bonus to rarity of
///					generated items (default = 0)
///
var giveItem = function(username, data) {
	var user = Userinfo.findOne({username: username});
	var gamedata = Gameinfo.findOne({username: username});
	
	var item = data.item;
	var quantity = data.quantity || 1;
	var rarityBonus = data.rarityBonus || 0;
	var level = data.level || 0;
	
	console.log("Giving ")
	console.log(data)
	console.log("to" + username)
	
	if (!gamedata) { throw new Meteor.Error(422, "You must have a game!!!"); }
	
	if (itemDB.has(item)) {
		if (!gamedata.stacks) { gamedata.stacks = {}; }
		if (!gamedata.stacks.has(item)) {
			gamedata.stacks[item] = quantity;
		} else {
			gamedata.stacks[item] += quantity;
		}
		console.log('gave ' + quantity + ' ' + item + "(s)");
		dbupdate(gamedata);
	} else {
		var i;
		for (i = 0; i < quantity; i+=1) {
			var i = MakeItem(item, level, rarityBonus);
			i.username = username;
			console.log('created item from rule ' + item);
			console.log(i.name);
			dbinsert("Iteminfo", i);
		}
		
	}
	
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Messages that can be sent to the server by clients for game logic.

Meteor.methods({
	testMakeItem: () => {
		var item = MakeItem("heavyArmor", 1);
		console.log(item);
		
		reapplyHistory(item, 100);
		console.log(item);
		
		console.log("Histories");
		item.genHistory.each((h)=>{
			console.log(h);
		})
	},
	testGiveDrops: (data) => {
		console.log("testing drops");
		
		var results = rollDropTable(data.table);
		console.log("Roll results:")
		console.log(results)
		
		var username = Meteor.user() && Meteor.user().username;
		results.each((k,v) => {
			giveItem(username, {item:k, quantity:v});
		})
		
		
	},
	testGiveItem: (data) => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		
		
		giveItem(username, data);
	},					
	dropGameDB: function() {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        var admin = Userinfo.findOne({username: Meteor.user().username});
        admin = admin && admin.admin;
        if (!admin) throw new Meteor.Error(422,"Not authorized");
        Unitinfo.remove({});
        Combatinfo.remove({});
        Gameinfo.remove({});
		Iteminfo.remove({});
        console.log("Game database cleared");
    },
	
	purgeGame: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedatas = Gameinfo.find({username: username}).fetch();
		var unitinfos = Unitinfo.find({username: username}).fetch();
		var combatinfo = Combatinfo.find({username: username}).fetch();
		var items = Iteminfo.find({username: username}).fetch();
		
		gamedatas.each((d) => { dbremove(d); })
		unitinfos.each((d) => { dbremove(d); })
		combatinfo.each((d) => { dbremove(d); })
		items.each((d) => { dbremove(d); })
		
	},
	
	purgeCombat: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedatas = Gameinfo.find({username: username}).fetch();
		var unitinfos = Unitinfo.find({username: username}).fetch();
		var combatinfo = Combatinfo.find({username: username}).fetch();
		
		unitinfos.each((unit)=> {
			if (unit.team != 'player') { dbremove(unit); }
			else {
				unit.combat = null;
				dbupdate(unit);
			}
		});
		gamedatas.each((data)=> {
			data.combat = null;
			dbupdate(data);
		});
		
		combatinfo.each((info)=> {
			dbremove(info);
		});
		
		
	},
	
	purgeAllCombats: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var isAdmin = Userinfo.findOne({username: username});
		isAdmin = isAdmin && isAdmin.admin;
		if (!isAdmin) { throw new Meteor.Error(422, "Error: You must be admin!");}
		var gamedatas = Gameinfo.find().fetch();
		var unitinfos = Unitinfo.find().fetch();
		var combatinfo = Combatinfo.find().fetch();
		unitinfos.each((unit)=> {
			if (unit.team != 'player') { dbremove(unit); }
			else {
				unit.combat = null;
				dbupdate(unit);
			}
		});
		gamedatas.each((data)=> {
			data.combat = null;
			dbupdate(data);
		});
		
		combatinfo.each((info)=> {
			dbremove(info);
		});
		
	},
	
	
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
			stamina: 4,
			maxStamina: 4,
			retryTime: 10,
			retryTimeout: 0,
			unitsRecruited: 0,
			summary:defaultSummary,
		};
		dbinsert("Gameinfo", gamedata)
		
		console.log("Gameinfo\n" + gamedata);
		
	},
	recruitNewUnit: (data) => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var userinfo = Userinfo.findOne({username: username})
		
		var cost = unitRecruitmentCost(gamedata.unitsRecruited);
		
		
		
	},
	
	updateUnitInfo: (data) => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var userinfo = Userinfo.findOne({username: username})
		var unit = Unitinfo.findOne(data.id);
		if (!unit) { throw new Meteor.Error(422, "Error: Unit does not exist!"); }
		if (unit.username != username) { throw new Meteor.Error(422, "Error: You don't own this unit!"); }
		if (isZalgo(data.name) || isZalgo(data.race) || isZalgo(data.job)) throw new Meteor.Error(422,"Error: Zalgo text detected");
		if (isHTML(data.name) || isHTML(data.race) || isHTML(data.job)) throw new Meteor.Error(422,"Error: HTML detected");
		var obj = data.poses;
		obj.each(function(key, value) {
			console.log("is " + value + " html?");
			if (isHTML(value)) throw new Meteor.Error(422,"Error: HTML detected");
		});
		unit.name = data.name;
		unit.race = data.race;
		unit.job = data.job;
		unit.poses = data.poses;
		
		dbupdate(unit);
	},
	
	resetSummary: ()=> {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var combatinfo = Combatinfo.findOne({username: username});
		
		var summary = defaultSummary;
		
		gamedata.summary = summary;
		dbupdate(gamedata);
		if (combatinfo) {
			combatinfo.summary = summary;
			dbupdate(combatinfo);
		}
		
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
		startCombat(data);
	},
	
	
	
	runAway: function() {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var combatinfo = Combatinfo.findOne({username: username});
		if (!combatinfo) { throw new Meteor.Error(422, "Error: You must be in combat");}
		var userinfo = Userinfo.findOne({username: username})
		
		combatinfo.run = true;
		dbupdate(combatinfo);
		
	},
	
	elapseRetryTime: function(data) {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var combatinfo = Combatinfo.findOne({username: username});
		if (combatinfo) {
			gamedata.retryTimeout = 0;
			dbupdate(gamedata);
			return;
		}
		
		var userinfo = Userinfo.findOne({username: username})
		if (!userinfo._collection) {
			userinfo._collection = "Userinfo";
		}
		
		var timeMilis = 200;
		var now = (new Date()).getTime();
		var lastTime = gamedata.lastTime || now;
		var diff = now - lastTime - timeMilis;
		gamedata.lastTime = now;
		dbupdate(gamedata);
		
		if (diff > 1000 || diff < -40) {
			console.log(diff);
			console.log("elapseRetryTime: potential cheating detected, ignoring!")
		} else {
			gamedata.retryTimeout += .2;
			if (gamedata.retryTimeout > gamedata.retryTime) {
				var info = {}
				info.region = gamedata.lastRegion;
				info.first = false;
				
				startCombat(info);
			} else {
				dbupdate(gamedata);
			}
			
		}
		
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
		var now = (new Date()).getTime();
		var lastTime = combatinfo.lastTime;
		var diff = now - lastTime - timeMilis;
		
		var currentTurn = now;
		combatinfo.currentTurn = currentTurn;
		var messages = {turn: currentTurn};
		
		var summary = gamedata.summary;
		if (!summary) {
			summary = {};
			summary.setVals(defaultSummary);
			gamedata.summary = summary;
		}
		combatinfo.summary = gamedata.summary;
		
		if (combatinfo.hits.unshift(messages) > 3) { combatinfo.hits.pop(); }
		combatinfo.rebuildCombatantLists();
		
		
		if (diff > 1000 || diff < -40) {
			console.log(diff);
			console.log("elapseTime: potential cheating detected, ignoring!")
		} else {
			summary.time += 200;
			combatinfo.combatants.each((id) => {
				var unit = dbget("Unitinfo", id);
				
				if (unit) {
					unit.combatUpdate(.2, combatinfo);
					
					
				} else {
					console.log("elapseTime: could not find unit " + id);
				}
				
				
			})
			gamedata.summary = combatinfo.summary;
			
			dbupdate(gamedata);
		}
		
		
		var winner = combatinfo.run ? 'run' : combatinfo.winningTeam();
		if (winner) {
			if (winner == 'run') {
				console.log("bitches ran away!");
				gamedata.cleanUpAllCombats();
				
			} else if (winner == 'player') {
				var region = combatinfo.region;
				console.log("Spawning next thing in Region : " + region)
				var regionData = areaData[region];
				combatinfo.combo += 1;
				var goldDrop = 0;
				var expDrop = 0;
				combatinfo.combatants.each((id) => {
					var unit = dbget("Unitinfo", id);
					
					if (unit.team != 'player') {
						goldDrop += unit.exp * Random.value();
						expDrop += unit.exp;
						
					}
				})
				summary.inc("goldDrop", Math.floor(goldDrop));
				summary.inc("expDrop", Math.floor(expDrop));
				
				userinfo.wallet.gold = Math.floor(userinfo.wallet.gold + goldDrop);
				console.log("dropped " + goldDrop + " golds");
				
				gamedata.units.each((id) => {
					var unit = dbget("Unitinfo", id);
					unit.timer = 0;
					unit.giveExp(expDrop);
					
				})
					
				
				combatinfo.cleanUpCombat();
				var mons = spawnMonsters(regionData, combatinfo.combo);
				combatinfo.startNewBattle(mons);
				
				dbupdate(combatinfo);
				
				dbupdate(gamedata);
				dbupdate(userinfo);
				
				combatinfo.lastTime = now;
			} else {
				
				console.log('bitches died');
				gamedata.cleanUpAllCombats();
				
			}
			
			
		} else {
		
			combatinfo.lastTime = now;
			dbupdate(combatinfo);
		}
		
		
		
	}
		
		
		
		
});