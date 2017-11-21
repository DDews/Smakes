/**
 * Created by Dan on 2/27/2016.
 */
 Meteor.startup(function() {
     reCAPTCHA.config({
         sitekey: '6LcluzkUAAAAAFJKVPYtuaqZzEVgLQxQ5Zw8yYRS'
     });
 });
Meteor.users.deny({
    update: function() { return false },
    remove: function() { return false },
    insert: function() { return false },
});
Messages.deny({
    update: function() { return false; },
    remove: function() { return false; },
    insert: function() { return false; }
});


//Helpers BS:
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Register a single function in Handlebars
var reg = function(name, func) {
	Handlebars.registerHelper(name, func);
}

//Register a map of functions in Handlebars
var helpers = function(fmap) { for (var k in fmap) { reg(k, fmap[k]); } }

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Helpers to be available on every page.
var globalHelpers = {
	formatMiliTime: function(t) { return formatMiliTime(t); },
	regions: function() { return areaData.toPairRay();  },
	vitals: function() { return statCalcData.vitals; },
	baseStats: function() { return statCalcData.baseStats; },
	combatStats: function() { return statCalcData.combatStats; },
	currentUserWalletExists: function() {
		var username = Meteor.user();
		username = username && username.username;
		if (!username) return;

		var user = Userinfo.findOne({username: username});
		var wallet = user && user.wallet;

		if (!wallet) {
			Meteor.call("newWallet", username);
			return null;
		}

		return wallet;
	},
	currentUserWallet: function() {
		var username = Meteor.user();
		username = username && username.username;
		if (!username) return null;

		var user = Userinfo.findOne({username: username});
		var wallet = user && user.wallet;

		if (!wallet) {
			Meteor.call("newWallet", username);
			return null;
		}

		return wallet.toPairRay();
	},
	unCamelCase: function(string) {
		return string.replace(/[A-Z]/g, function(x) { return " " + x; }).capitalize();
	},
};
helpers(globalHelpers);
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Global helpers for game logic stuff

inCombat = function() {
	var data = Gameinfo.findOne();
	return data && data.combat != null;
}

_pause = false;
_inCombat = false;
_retry = true;
_turnsDone = {};

var globalGameHelpers = {
	onGamePage: function() {
		var route = Router.current().route.getName();
		//console.log(route);
		return route == "game";
	},
	userInCombat: function() { return Combatinfo.findOne(); },
	showLogs: function() { return Session.get("showLogs"); },
	gameInfoExists: function() {
		var data = Gameinfo.findOne();
		if (data) { return true; }
		return false;
	},
	gameInfoUnits: function() {
		var data = Gameinfo.findOne();
		//console.log("gameInfoUnits: " + data)
		return data ? data.units : null;
	},
	gameSummary: function() {
		var data = Gameinfo.findOne();
		if (!data) { return null; }
		return data.summary;
	},
	combatInfoUnits: function() {
		var data = Combatinfo.findOne();
		//console.log("combatInfoUnits: " + data)
		return data ? data.combatants : null;
	},
	gameInCombat: function() {
		var data = Gameinfo.findOne();
		return data && data.combat != null;
	},
	combatRound: function() {
		var data = Combatinfo.findOne();
		return data && (1+data.combo);
	},
	paused: function() { return _pause; },
	retry: function() { return _retry; },
	retryAndNotInCombat: function() { return _retry && !_inCombat; },
	gameFatigue: function() {
		var data = Gameinfo.findOne();
		if (!data) { return 0; }
		return data.fatigue;
	},
	gameFatigueColor: function() {
		var data = Gameinfo.findOne();
		if (!data) { return "purple"; }
		return data.fatigue ? "red" : "green";
	},
	gameStamina: function() {
		var data = Gameinfo.findOne();
		if (!data) { return 0; }
		return data.stamina || 0;
	},
	gameMaxStamina: function() {
		var data = Gameinfo.findOne();
		if (!data) { return 20; }
		return data.maxStamina || 20;
	},
	gameRetryTime: function() {
		var data = Gameinfo.findOne();
		var time = 5;
		if (data) {
			time = data.retryTime || 5;
		}
		return time.toFixed(2);
	},
	gameRetryTimeout: function() {
		var data = Gameinfo.findOne();
		if (!data) { return 0; }
		return data.retryTimeout || 0;
	},
	gameRetryTimeoutPercent: function() {
		var data = Gameinfo.findOne();
		var inKombat = data && data.combat != null;
		if (inKombat || !_retry) { return 0; }

		var data = Gameinfo.findOne();
		if (!data) { return .5; }
		var retryTime = data.retryTime || 5;
		var retryTimeout = data.retryTimeout || 2.5;

		return Math.floor(retryTimeout / retryTime * 100);
	},
};

helpers(globalGameHelpers);
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Data
var vitalColors = {
	hp:"green",
	mp:"indigo",
	sp:"red",
}


var auxStats = [
	"rhp#", "rmp#", "rsp#",
	"armor", "shell", "tough",
	"rflex", "intut", "sight",
]

var tooltips = {
	str: "Strength.\nPure brute force.",
	vit: "Vitality.\nBecome the wall.",
	dex: "Dexterity.\nDeft, accurate, skillful.",
	agi: "Agility.\nGotta go fast.",
	int: "Intelligence.\nI am SMRT, I mean SMART.",
	wis: "Wisdom.\nUnderstanding the flow.",
	patk: "Base physical power",
	pacc: "Physical chance to hit",
	pdef: "Reduction to physical damage taken",
	peva: "Chance to dodge physical attacks",
	matk: "Base magical power",
	macc: "Magical chance to hit",
	mdef: "Reduction to magical damage taken",
	meva: "Chance to dodge magical attacks",
	aspd: "Rate of attacks",
	cspd: "Bonus to cooldown speed",
	crit: "Chance to deal extra damage per attack",
	resi: "Chance to reduce critical damage taken",
	rhp: "HP recovered per second",
	rmp: "MP recovered per second",
	rsp: "SP recovered per second",
	armor: "Boosts Defense",
	shell: "Boosts Ward",
	tough: "Boosts Resilience",
	rflex: "Boosts Evasion",
	intut: "Boosts Aegis",
	sight: "Boosts Crit Rate",
}
var statNames = {
	str: "STR",
	vit: "VIT",
	dex: "DEX",
	agi: "AGI",
	int: "INT",
	wis: "WIS",
	patk: "Attack",
	pacc: "Accuracy",
	pdef: "Defense",
	peva: "Evasion",
	matk: "Magic",
	macc: "Aim",
	mdef: "Ward",
	meva: "Aegis",
	aspd: "Speed",
	cspd: "Recast",
	crit: "Crit Rate",
	resi: "Resilience",
	rhp: "Hp Rec",
	rmp: "Mp Rec",
	rsp: "Sp Rec",
	armor: "Armor",
	shell: "Shell",
	tough: "Toughness",
	rflex: "Reflex",
	intut: "Intuition",
	sight: "Sight",
	desc: "Description",
	type: "",
	value: "Value",
	rarity: "Rarity",
	quality: "Item Level",
	hp: "Heal HP",
	res_pierce: "Pierce Resist",
	res_crush: "Crush Resist",
	res_slash: "Slash Resist"
}

unSuffix = function(str) {
	if (str.suffix("%")
		|| str.suffix("#")
		|| str.suffix("@")) {
		return str.substring(0, str.length-1);
	}
	return str;
}

var getUnit = function(id) { return Unitinfo.findOne(id); }
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Map of all functions that are useful for units.
var globalUnitHelpers = {
	test: function() { return "lel"; },
	unit: function(id) { return Unitinfo.findOne(id); },
	vitalColor: function(vital) { return vitalColors[vital]; },
	combat: function(id) { return getUnit(id).combat; },
	tooltipFor: function(thing) {
		if (isString(thing)) {
			return tooltips[unSuffix(thing)];
		}
		return "THING IS NOT STRING";
	},
	unitInCombat: function(id) {
		var unit = getUnit(id);
		return unit && unit.combat;
	},
	unitInParty: function(id) {
		var gamedata = Gameinfo.findOne();
		var inParty = gamedata && gamedata.party.includes(id);
		return inParty ? "checked" : null;
	},
	unitName: function(id) {
		var unit = getUnit(id);
		return unit ? unit.name : "";
	},

};

helpers(globalUnitHelpers);


//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Map of global item helpers
var globalItemHelpers = {
	getStackIconBG: (item) => {
		if (itemDB.has(item)) {
			var rarity = Math.floor(itemDB[item].rarity / 10);
			if (rarity < 0) { rarity = 0; }
			if (rarity > 9) { rarity = 9; }
			return "iconbg" + rarity;
		}
		return "iconbg";
	},
	getIconBG: (rarity) => {
		rarity = Math.floor(rarity / 10);
		if (rarity < 0) { rarity = 0; }
		if (rarity > 9) { rarity = 9; }
		return "iconbg" + rarity;
	},
};
helpers(globalItemHelpers);

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Helpers (to be moved into globalUnitHelpers):
var unitStat = function(id, stat) { return getUnit(id)[stat]; }
var ownerName = function(id) {
	var unit = getUnit(id);
	if (unit.team != 'player') {
		return "Nobody.";
	}
	return getUnit(id).username;
}
var isPlayer = function(id) {
	var unit = getUnit(id);
	if (!unit) { return false; }
	return unit.team == 'player';
}

var unitPercent2 = function(id, vital, cap) {
	var unit = getUnit(id);
	if (!unit) { return 0; }
	return Math.floor(unit[vital] / unit[cap] * 100);
}
var unitPercent = function(id, vital) {
	var unit = getUnit(id);
	if (!unit) { return 0; }
	var cap = "m"+vital;
	return Math.floor(unit[vital] / unit[cap] * 100);
}
var unitVital2 = function(id, vital, cap) {
	var unit = getUnit(id);
	if (!unit) { return 0; }
	return vital + ": " + Math.floor(unit[vital]) + " / " + unit[cap];
}
var unitVital = function(id, vital) {
	var unit = getUnit(id);
	if (!unit) { return 0; }
	var cap = "m"+vital;
	return vital + ": " + Math.floor(unit[vital]) + " / " + unit[cap];
}
var unitHeader = function(id) {
	var unit = getUnit(id);
	if (!unit) { return "NO UNIT TO MAKE HEADER"; }

	var str = "lv. " + unit.level + " " + unit.race + " " + unit.job + " (" + unit.team + ")";
	return str;
}
var unitLevelHeader = function(id) {
	var unit = getUnit(id);
	if (!unit) { return "" }

	return "lv. " + unit.level;
}
var unitRace = function(id) {
	var unit = getUnit(id);
	if (!unit) { return "" }

	return unit.race;
}
var unitJob = function(id) {
	var unit = getUnit(id);
	if (!unit) { return "" }

	return unit.job;
}
var unitTeam = function(id) {
	var unit = getUnit(id);
	if (!unit) { return "" }

	return unit.team;
}
var unitColor = function(id) {
	var unit = getUnit(id);
	if (!unit) { return "unknownUnit"; }

	var team = unit.team;
	if (team == 'player') {
		return unit.dead() ? "playerDead" : "playerAlive"
	}
	return unit.dead() ? "enemyDead" : "enemyAlive" ;
}

var unitPose = function(id) {
	var unit = getUnit(id);
	if (!unit) { return ""; }

	if (unit.dead()) { return unit.poses["ded"]; }
	var cpose = unit.cpose;
	if (cpose == 'normal' && unit.hp / unit.mhp < .25) {
		return unit.poses["lowHP"]
	}

	return unit.poses[cpose];
}

var unitPoseURL = function(id, pose) {
	var unit = getUnit(id);
	if (!unit) { return ""; }

	return unit.poses[pose];
}


var unitPoseStyle = function(id) {
	var unit = getUnit(id);
	if (!unit) { return ""; }

	if (unit.dead()) { return "blendDarkRed"; }
	if (unit.hp / unit.mhp < .25) { return "blendRed"}
	return "";
}

getDbStat = function(stat, collection, id) {
	var obj = dbget(collection, id);
	if (obj) {

		var num = 0;
		if (stat.suffix("%")) {
			stat = unSuffix(stat)
			num = (obj[stat] * 100)
			return num.toFixed(3) + "%";
		} else if (stat.suffix("#")) {
			stat = unSuffix(stat);
			num = obj[stat]
			return num.toFixed(3);
		} else if (stat.suffix("@")) {
			stat = unSuffix(stat);
			num = obj[stat]
			return num.toFixed(0);
		} else {
			num = obj[stat];
		}
		return num;
	}
	return collection + ":" + id + "Does not exist";
}
fixZeroes = function(val) {
	if (val > Math.round(val)) {
		if (('' + val).length > ('' + val.toFixed(1)).length) return val.toFixed(2);
		else return val;
	}
	return val;
}
statName = function(stat) { return statNames[unSuffix(stat)]; }




Handlebars.registerHelper('toPairs', (thing) => {return thing.toPairRay(); });


Handlebars.registerHelper('getDbStat', getDbStat);
Handlebars.registerHelper('statName', statName);

Handlebars.registerHelper('unitPose', unitPose);
Handlebars.registerHelper('unitPoseURL', unitPoseURL);
Handlebars.registerHelper('unitPoseStyle', unitPoseStyle);


Handlebars.registerHelper('ownerName', ownerName);
Handlebars.registerHelper('unitStat', unitStat);
Handlebars.registerHelper('percent', unitPercent);
Handlebars.registerHelper('percent2', unitPercent2);
Handlebars.registerHelper('vital', unitVital);
Handlebars.registerHelper('vital2', unitVital2);
Handlebars.registerHelper('unitHeader', unitHeader);
Handlebars.registerHelper('unitLevelHeader', unitLevelHeader);
Handlebars.registerHelper('unitRace', unitRace);
Handlebars.registerHelper('unitColor', unitColor);
Handlebars.registerHelper('unitJob', unitJob);
Handlebars.registerHelper('unitTeam', unitTeam);
Handlebars.registerHelper('isPlayer', isPlayer);
