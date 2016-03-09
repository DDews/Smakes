//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Failed shortcut for registration of helpers.... laaaame....
var reg = {}
reg.helpers = function(fmap) {
	fmap.each((name, func) => {
		Handlebars.registerHelper(name, func);
	});
}
reg.helpers({}); //this didn't work out as expected:
//TBD - research why...

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//
Handlebars.registerHelper('currentUserWalletExists', () => {
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
})

Handlebars.registerHelper('currentUserWallet', () => {
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
})

function unCamelCase(string) {
	return string.replace(/[A-Z]/g, function(x) { return " " + x; }).capitalize();
}


Handlebars.registerHelper('unCamelCase', unCamelCase);
Handlebars.registerHelper('regions', () => { return areaData.toPairRay(); });

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Global Unit helpers...

var vitalColors = {
	hp:"green",
	mp:"indigo",
	sp:"red",
}

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
}

unSuffix = function(str) {
	if (str.suffix("%") || str.suffix("#")) {
		return str.substring(0, str.length-1); 
	}
	return str;
}

var tooltipFor = function(thing) { 
	if (isString(thing)) {
		return tooltips[unSuffix(thing)]; 
	}
	return "THING IS NOT STRING";
}
	
var vitalColor = function(vital) { return vitalColors[vital]; }

var getUnit = function(id) { return Unitinfo.findOne(id); }

var unitInCombat = function(id) {
	var unit = getUnit(id);
	return unit && unit.combat;
}

var combat = function(id) { return getUnit(id).combat; }

var unitName = function(id) { 
	var unit = getUnit(id);
	if (!unit) { return ""; }
	return getUnit(id).name; 
}
var unitStat = function(id, stat) { return getUnit(id)[stat]; }
var ownerName = function(id) { return getUnit(id).username; }
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


var unitPoseStyle = function(id) {
	var unit = getUnit(id);
	if (!unit) { return ""; }
	
	if (unit.dead()) { return "blendDarkRed"; }
	if (unit.hp / unit.mhp < .25) { return "blendRed"}
	return "";
}

var statName = function(stat) { return statNames[unSuffix(stat)]; }
	
Handlebars.registerHelper('statName', statName);
Handlebars.registerHelper('vitalColor', vitalColor);
Handlebars.registerHelper('vitals', ()=>{return statCalcData.vitals;});
Handlebars.registerHelper('baseStats', ()=>{return statCalcData.baseStats;});
Handlebars.registerHelper('combatStats', ()=>{return statCalcData.combatStats;});

Handlebars.registerHelper('tooltipFor', tooltipFor);
Handlebars.registerHelper('unitPose', unitPose);
Handlebars.registerHelper('unitPoseStyle', unitPoseStyle);


Handlebars.registerHelper('ownerName', ownerName);
Handlebars.registerHelper('unitStat', unitStat);
Handlebars.registerHelper('combat', combat);
Handlebars.registerHelper('percent', unitPercent);
Handlebars.registerHelper('percent2', unitPercent2);
Handlebars.registerHelper('vital', unitVital);
Handlebars.registerHelper('vital2', unitVital2);
Handlebars.registerHelper('unitName', unitName);
Handlebars.registerHelper('unitHeader', unitHeader);
Handlebars.registerHelper('unitColor', unitColor);
Handlebars.registerHelper('unitInCombat', unitInCombat);
Handlebars.registerHelper('isPlayer', isPlayer);