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

Meteor.publish("allInventory", function() {
	return Iteminfo.find({username: "<middleman>"});
})
Meteor.publish("inventory", function() {
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("items for " + username + " : " + Iteminfo.find({username: username}).count() );
	
	return Iteminfo.find( { username: username } );
	
})

Meteor.publish("shopitems", function() {
	return Iteminfo.find( { username: "<shop>"} )
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
		itemId:'eq_starter_helm',
		name:'Headband',
		icon:'helm6',
		desc:'A small headband.',
		type:'Equipment',
		slot:"head",
		equip:true,
		value: 50,
		quality: 0,
		rarity: 2,
		
		armor: 10,
		shell: 10,
		pdef: .01,
	},
	body: {
		itemId:'eq_starter_body',
		name:'Cotton Shirt',
		icon:'armor1',
		desc:'Does not offer much protection',
		type:'Equipment',
		slot:"body",
		equip:true,
		value: 50,
		quality: 0,
		rarity: 2,
		
		armor: 25,
		shell: 25,
		pdef: .04,
	},
	legs: {
		itemId:'eq_starter_legs',
		name:'Cotton Pants',
		icon:'leg1',
		desc:'A basic pair of pants.',
		type:'Equipment',
		slot:"legs",
		equip:true,
		value: 50,
		quality: 0,
		rarity: 2,
		
		armor: 20,
		shell: 20,
		pdef: .03,
	},
	gloves: {
		itemId:'eq_starter_gloves',
		name:'Quilted Gloves',
		icon:'glove2',
		desc:'Homemade quilted gloves, made with love.',
		type:'Equipment',
		slot:"gloves",
		equip:true,
		value: 50,
		quality: 0,
		rarity: 2,
		
		armor: 13,
		shell: 13,
		pdef: .01,
	},
	feet: {
		itemId:'eq_starter_feet',
		name:'Basic Shoes',
		icon:'shoes1',
		desc:'Simple shoes with rubber bottoms.',
		type:'Equipment',
		slot:"feet",
		equip:true,
		value: 50,
		quality: 0,
		rarity: 2,
		
		armor: 12,
		shell: 12,
		pdef: .01,
	},
	handRight: {
		itemId:'eq_starter_knife',
		name:'Kitchen Knife',
		icon:'dagger14',
		desc:'A simple knife, more suited for cooking than combat.',
		type:'Equipment',
		slot:"hand",
		equip:true,
		equipSlotIsPrefix:true,
		value: 50,
		quality: 0,
		rarity: 2,
		element:"slash",
		
		patk: 25,
		pacc: .10,
		aspd: .4
	},
	handLeft: {
		itemId:'eq_starter_shield',
		name:'Pan Lid',
		icon:'shield2',
		desc:'A sturdy pan lid. A great shield for beginners.',
		type:'Equipment',
		slot:"hand",
		equip:true,
		equipSlotIsPrefix:true,
		value: 50,
		quality: 0,
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
	
	var region = data.region;
	var regionData = areaData[region];
	if (!regionData) { throw new Meteor.Error(422, "Error: Unknown region " + region); }
	
	var units = [];
	
	gamedata.party.each( (id) => { 
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
	combat.combatlog = gamedata.combatlog || [];
	combat.combatlog.push("Combat Started!");
	combat.combatlog.push("---------------Round 1---------------");
	dbupdate(combat);
	
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
	console.log("Starting combat");
	dbupdate(gamedata);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Inventory Manipulation functions

///Give Item to user
///username - name of user to give item to
///data - information about what item to give
///		data.item - name of item to give, or rule to use 
///					to generate item
///		data.quantity - number of items to give
///					(default = 1)
///		data.level	- level of item to generate
///					(default = 0)
///		data.rollBonus - bonus to rarity of
///					generated items (default = 0)
///		data.rarityBonus - multiplicitave bonus chance
///					to application of bonuses to items found
///
var giveItem = function(username, data) {
	var user = Userinfo.findOne({username: username});
	var gamedata = Gameinfo.findOne({username: username});
	
	giveItemLive(gamedata, data);
}
	
///Give Item to gamedata
///gamedata - users gamedata
///data - information about what item to give
///		data.item - name of item to give, or rule to use 
///					to generate item
///		data.quantity - number of items to give
///					(default = 1)
///		data.level	- level of item to generate
///					(default = 0)
///		data.rollBonus - bonus to rarity of
///					generated items (default = 0)
///		data.rarityBonus - multiplicitave bonus chance
///					to application of bonuses to items found
///
var giveItemLive = function(gamedata, data) {
	if (!gamedata) { throw new Meteor.Error(422, "You must have a game!"); }
	var username = gamedata.username;
	var user = Userinfo.findOne({username: username});
	if (!user)  { throw new Meteor.Error(422, "You must be logged in!"); }
	//console.log("Giving ")
	//console.log(data)
	//console.log("to" + username)
	if (!gamedata.itemlog) { gamedata.itemlog = []; }
	
	var item = data.item;
	var quantity = data.quantity || 1;
	var rollBonus = data.rollBonus || 0;
	var rarityBonus = data.rarityBonus || 1;
	var level = data.level || 0;
	
	if (itemDB.has(item)) {
		if (!gamedata.stacks) { gamedata.stacks = {}; }
		if (!gamedata.stacks.has(item)) {
			gamedata.stacks[item] = quantity;
		} else {
			gamedata.stacks[item] += quantity;
		}
		var msg = 'Found ' + quantity + ' ' + itemDB[item].name + "(s)";
		while (gamedata.itemlog.length > 10) { gamedata.itemlog.shift(); }
		gamedata.itemlog.push(msg);
		
		dbupdate(gamedata);
	} else {
		
		var i;
		for (i = 0; i < quantity; i+=1) {
			var i = MakeItem(item, level, rollBonus, rarityBonus);
			i.username = username;
			
			var msg = "Found " + i.name;
			while (gamedata.itemlog.length > 10) { gamedata.itemlog.shift(); }
			gamedata.itemlog.push(msg);
			
			//console.log('created item from rule ' + item);
			//console.log(i.name);
			dbinsert("Iteminfo", i);
		}
		
		dbupdate(gamedata);
		
	}
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Messages that can be sent to the server by clients for game logic.

Meteor.methods({
	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Inventory Manipulation
	//Test method to give an item
	giveItem: function(data) {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) throw new Meteor.Error(422,"Error: you must be logged in");
		var admin = Userinfo.findOne({username: Meteor.user().username});
        admin = admin && admin.admin;
        if (!admin) throw new Meteor.Error(422,"Not authorized");
        
		giveItem(username, data)
	},
	
	
	//Purchases a stackable item from the shop
	buyItem: function(item,quantity) {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) throw new Meteor.Error(422,"Error: you must be logged in");
		var userinfo = Userinfo.findOne({username: username});
		if (!userinfo) throw new Meteor.Error(422,"Error: userinfo not found");
		if (+quantity < 1) throw new Meteor.Error(422,"Error: You can't buy that many");
		var gold = userinfo.wallet.gold;
		var itemInfo = itemDB[item];
		var db = true;
		if (!itemInfo) {
			itemInfo = Iteminfo.findOne({_id: item});
			db = false;
		}
		var value = itemInfo.value;
		var cost = value * quantity;
		if (cost > gold) throw new Meteor.Error(422,"You can't afford it");
		gold -= cost;
		var wallet = userinfo.wallet;
		wallet.gold = gold;
		Userinfo.update(userinfo._id,{$set:{wallet: wallet}});
		var data = {};
		data.item = item;
		data.quantity = +quantity;
		if (db) giveItem(username,data);
		else {
			Iteminfo.update(itemInfo._id,{$set:{username: Meteor.user().username}});
		}
	},
	
	//Equips an item on a given unit
	equipItem: (data) => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) throw new Meteor.Error(422,"Error: you must be logged in");
		var userinfo = Userinfo.findOne({username: username});
		if (!userinfo) throw new Meteor.Error(422,"Error: userinfo not found");
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		
		var unit = Unitinfo.findOne(data.unit);
		if (!unit) { throw new Meteor.Error(422, "Error: Unit does not exist!"); }
		var item = Iteminfo.findOne(data.item);
		if (!item) { throw new Meteor.Error(422, "Error: Item does not exist!"); }
		if (item.username != username) { throw new Meteor.Error(422, "Error: You don't own that item!"); }
		
		var slot = data.slot;
		if (!slot) { throw new Meteor.Error(422, "Error: Slot does not exist!"); }
		var oldItem = unit.equipment[slot];
		if (oldItem) { 
			oldItem.username = username;
			dbinsert("Iteminfo", oldItem); 
		}
		
		dbremove(item);
		delete item._collection;
		delete item._id;
		
		unit.equipment[slot] = item;
		
		if (item.twoHands) {
			var otherHand = (slot == "handLeft") 
				? "handRight" : "handLeft";
			
			var otherHandItem = unit.equipment[otherHand];
			if (otherHandItem) {
				otherHandItem.username = username;
				dbinsert("Iteminfo", otherHandItem);
				unit.equipment[otherHand] = null;
			}
			
		}
		
		unit.recalc();
		dbupdate(unit);
		
		
	},
	
	//Toggles the lock state of an item in the player's inventory.
	toggleUniqueLock: (id) => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var userinfo = Userinfo.findOne({username: username});
		if (!userinfo) throw new Meteor.Error(422,"Error: userinfo not found");
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		
		var item = Iteminfo.findOne(id);
		if (!item)  { throw new Meteor.Error(422, "Error: Item does not exist!"); }
		
		item.locked = !item.locked;
		dbupdate(item);
	},
	
	//Sells all unlocked items in the player's inventory
	sellUnlockedItems: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var userinfo = Userinfo.findOne({username: username});
		if (!userinfo) throw new Meteor.Error(422,"Error: userinfo not found");
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		
		var items = Iteminfo.find({username: username});
		var itemsCount = items.count();
		items = items.fetch();
		var shopItems = Iteminfo.find({username:"<shop>"});
		var shopItemCount = shopItems.count();
		shopItems = shopItems.fetch();
		
		if (itemsCount > 1000) {
			for (var i = 0; i < shopItemCount; i++) {
				dbremove(shopItems[i]);
			}
			
		} else if (shopItemCount + itemsCount > 1000) {
			var toDrop = shopItemCount + itemsCount - 1000;
			
			for (var i = 0; i < toDrop && i < 1000; i += 1) {
				dbremove(shopItems[i]);
			}
		}
		
		var totalSell = 0;
		var newShopItems = 0;
		items.each((item)=>{
			if (!item.locked) {
				totalSell += Math.floor(item.value * .1);
				if (newShopItems < 1000) {
					item.username = "<shop>";
					dbupdate(item);
					newShopItems += 1;
				} else {
					dbremove(item);
				}
			}
		});
		
		userinfo.wallet.gold += totalSell;
		dbupdate(gamedata);
		dbupdate(userinfo);
		
		
		
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Game data management functions
	
	//Resets all game data. Yay.
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
	
	//Removes the current user's game data.
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
	
	//Forcefully removes the current user's combat data 
	//Used when running away doesn't work for laggy players.
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
	
	//Forcefully removes all combats for all players...
	//Used when there's some issue that purgeCombat() can't solve.
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

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Game creation
	
	//Creates a new game with some information.
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
			party: [unit._id],
			items: [],
			combat: null,
			kills: 0,
			stamina: 5,
			maxStamina: 5,
			retryTime: 20,
			retryTimeout: 0,
			unitsRecruited: 0,
			summary:defaultSummary,
			combatlog: [],
			itemlog: [],
			
		};
		dbinsert("Gameinfo", gamedata)
		
		console.log("Gameinfo\n" + gamedata);
		
	},
	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Unit Manipulation methods
	
	//Called when a unit is recruited
	//tbd: make it work :)
	recruitNewUnit: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var userinfo = Userinfo.findOne({username: username})
		
		var combatdata = Combatinfo.findOne({username: username});
		if (userinfo.combat || combatData != null) { throw new Meteor.Error(422, "Error: You cannot be in combat!"); }
		
		var cost = unitRecruitmentCost(gamedata.unitsRecruited);
		
		if (userinfo.wallet.gold >= cost) {
			var unit = newPlayerUnit(username, japaneseName(), "Mercenary");
			gameData.units.push(unit._id);
			
			dbupdate();
		}
		
	},
	
	
	toggleUnitInParty: (data) => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		var gamedata = Gameinfo.findOne({username: username});
		if (!gamedata) { throw new Meteor.Error(422, "Error: You must have a game started"); }
		var userinfo = Userinfo.findOne({username: username})
		
		var combatdata = Combatinfo.findOne({username: username});
		if (userinfo.combat || combatdata != null) { throw new Meteor.Error(422, "Error: You cannot be in combat!"); }
		
		var id = data.id;
		console.log(gamedata.party + " : " + gamedata.party.length);
		
		var index = gamedata.party.indexOf(id);
		
		if (index >= 0) {
			if (gamedata.party.length == 1) {
				throw new Meteor.Error(422, "Error: You must have at least one unit in your party!");
			} else {
				gamedata.party.splice(index, 1);
			}
		} else {
			if (gamedata.party.length == 4) {
				throw new Meteor.Error(422, "Error: You can only have up to 4 units in you party!");
			} else {
				gamedata.party.push(id);
			}
		}
		
		dbupdate(gamedata);
		
		
	},
	
	
	//Called when a unit's information is edited
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

	//Called to boost the stats of a unit
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
	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///misc functions
	
	//Called to reset the tracked information in the summary window
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
	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Combat functions
	
	//Called to initiate combat
	startCombat: (data) => {
		startCombat(data);
	},
	
	//Called to voluntarily stop combat
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
	
	//Called to elapse time on the out-of-combat screen
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
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///Major game logic function- 
	
	//elapses time in combat.
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
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		//Moves the summary into the game data (which is passed into the combat methods)
		//so that combat actions can be tracked.
		var summary = gamedata.summary;
		if (!summary) {
			summary = {};
			summary.setVals(defaultSummary);
			gamedata.summary = summary;
		}
		combatinfo.summary = gamedata.summary;
		
		if (combatinfo.hits.unshift(messages) > 3) { combatinfo.hits.pop(); }
		combatinfo.rebuildCombatantLists();
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		//Cheat protection
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
			gamedata.combatlog = combatinfo.combatlog;
			
			dbupdate(gamedata);
		}
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		//Check for and handle win/loss conditions
		var winner = combatinfo.run ? 'run' : combatinfo.winningTeam();
		if (winner) {
			if (winner == 'run') {
				//////////////////////////////////////////////////////////////////////////////////////////////////
				//Run away
				console.log("bitches ran away!");
				gamedata.removeAllCombats();
				
			} else if (winner == 'player') {
				//////////////////////////////////////////////////////////////////////////////////////////////////
				//Victory!
				var region = combatinfo.region;
				console.log("Spawning next thing in Region : " + region)
				var regionData = areaData[region];
				combatinfo.combo += 1;
				var goldDrop = 0;
				var expDrop = 0;
				gamedata.itemlog.push("---------------Round " + (combatinfo.combo) + " Drops---------------");
				
				combatinfo.combatants.each((id) => {
					var unit = dbget("Unitinfo", id);
					
					if (unit.team != 'player') {
						goldDrop += unit.exp * Random.value();
						expDrop += unit.exp;
						var drops = unit.drops;
						if (drops) {
							var dropData = {};
							dropData.level = Math.floor(unit.level/10);
							dropData.rarityBonus = .1 + .1 * unit.num("eliteRank");
							dropData.rollBonus = 0 + .0001 * combatinfo.combo;
							
							var results = rollDropTable(drops);
							console.log("rolled ")
							console.log(results)
							
							results.each((k,v) => {
								if (v > 0) {
									dropData.item = k;
									dropData.quantity = v;
									console.log("giving " + username + "  " + v + " " + k + "(s)");
									giveItemLive(gamedata, dropData);
								}
							});
								
						}
						
					}
				})
				
				summary.inc("goldDrop", Math.floor(goldDrop));
				summary.inc("expDrop", Math.floor(expDrop));
				
				userinfo.wallet.gold = Math.floor(userinfo.wallet.gold + goldDrop);
				console.log("dropped " + goldDrop + " golds");
				
				gamedata.party.each((id) => {
					var unit = dbget("Unitinfo", id);
					unit.timer = 0;
					unit.giveExp(expDrop);
					
				})
					
				
				combatinfo.cleanUpCombat();
				var maxRounds = combatinfo.maxRounds;
				
				console.log("Max rounds: " + maxRounds)
				
				
				if (combatinfo.combo < maxRounds) {
					var mons = spawnMonsters(regionData, combatinfo.combo);
					combatinfo.startNewBattle(mons);
					var roundMessage = "---------------Round " + (1+combatinfo.combo) + "/" + maxRounds + "---------------";
					combatinfo.combatlog.push(roundMessage);
					dbupdate(combatinfo);
					gamedata.combatlog = combatinfo.combatlog;

					dbupdate(gamedata);
					dbupdate(userinfo);

					combatinfo.lastTime = now;
				} else {
					
					combatinfo.combatlog.push("---------------Victory! Area Cleared!---------------");
					gamedata.combatlog = combatinfo.combatlog;
					dbupdate(gamedata);
					dbupdate(userinfo);
					
					gamedata.removeAllCombats();
					
					
					
				}
				
			} else { // Flee
				combatinfo.combatlog.push("---------------You Were Defeated---------------");
				console.log('party died');
				gamedata.removeAllCombats();
				
			}
			
			
		} else { // No Winner
		
			combatinfo.lastTime = now;
			dbupdate(combatinfo);
		}
		
		
		
	}
		
		
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///
		
});