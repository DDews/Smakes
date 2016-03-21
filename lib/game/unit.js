
defaultUnitData = {
	name: "Neptune",
	job: "Novice",
	race: "Human",
	team: "player",
	
	level: 1,
	exp: 0.0,
	totalExp: 0.0,
	spendableExp: 0.0,
	
	tnl: 1.0,
	
	timer: 0.0,
	timeout: 3.0,
	str: 5, dex: 5, int: 5,
	vit: 5, agi: 5, wis: 5,
	
	statsPurchased:{
		str:0, dex:0, int:0,
		vit:0, agi:0, wis:0,
	},
	equipmentSlots: [ 
		"head", "body", "legs", "gloves", "feet", 
		"handRight", "handLeft",
		"accessory1", "accessory2",
	],
	
	equipment: {
		//NOTHING!
	},
	damageTypeFrom: "handRight",
	baseCombatStats: "player",
	cpose: "normal",
	poseTime: 0.0,
	poses:{
		normal: "http://a.pomf.cat/jmuhje.png",
		ded: "http://a.pomf.cat/qsqrer.png",
		lowHP: "http://a.pomf.cat/wszovy.png",
		happy: "http://a.pomf.cat/pzfygl.png",
		hurt: "http://a.pomf.cat/qgarkn.png",
	}
} 


statUpgradeCost = function(val, cnt) {
	var base = 10;
	var total = 0;
	
	var i;
	for (i = 0; i < cnt; i++) {
		var n = val + i;
		total += base + n * Math.log(1+n) * 20;
	}
	
	return Math.floor(total);
};

Unit = function() {
	this.setVals(defaultUnitData)
	this.tnl = expCurve(this.level)
	this.recalc()
	this.fullHeal();
	
	this.skills = {};
	this.skills["autoAttack"] = skillData["autoAttack"];
	
	var num = Math.floor(Random.range(0, 10));
	this.poses = {
		normal:	"/mercs/merc" + num + "_normal.gif",
		ded:	"/mercs/merc" + num + "_dead.gif",
		lowHP:	"/mercs/merc" + num + "_lowhp.gif",
		happy:	"/mercs/merc" + num + "_dodge.gif",
		hurt:	"/mercs/merc" + num + "_hurt.gif",
	};
	
	
	
	
	dbinsert("Unitinfo", this);
}

var expScale = .1;
Monster = function(type, level, combo) {
	var mob = new Unit();
	
	mob.name = japaneseName();
	mob.team = "monster";
	mob.level = level + Math.floor(combo / 2.0);
	mob.race = type.capitalize();
	
	var mon = monsterData[type];
	
	if (mon.poses) { mob.poses = mon.poses; }
	if (isString(mob.poses)) {
		var poses = {};
		poses.normal =	mob.poses + "_normal.png";
		poses.ded =		mob.poses + "_dead.png";
		poses.happy =	mob.poses + "_dodge.png";
		poses.lowHP =	mob.poses + "_lowhp.png";
		poses.hurt =	mob.poses + "_hurt.png";
		
		mob.poses = poses;
		
	}
	if (mon.drops) { mob.drops = mon.drops; }
	if (!mob.drops) { mob.drops = "standard"; }
	
	mob.baseCombatStats = mon.baseCombatStats;
	var scales = mon.statMults;
	
	var eliteRank = 0;
	var eliteChance = 0.0001 + combo * .0001;
	var maxElite = 1 + Math.floor(combo / 5);
	
	
	maxElite.times((n) => {
		var roll = Math.random();
		if (roll < eliteChance) { eliteRank += 1; }
	})
	
	mob.job = (eliteRank > 0) ? "Elite *" + eliteRank : "" 
	
	var levelScale = (level + 1.0);
	var baseStat = 2 * levelScale + 2 * eliteRank * levelScale;
	baseStats.each((stat) => {
		mob[stat] = baseStat * scales.xt(stat, 1) * Random.range(.5, 1.3);
	})
	
	mob.recalc();
	if (eliteRank > 0) {
		mob.mhp *= (1 + eliteRank * Math.log(eliteRank));
	}
	mob.combinex(scales, mul)
	
	mob.exp = mob.mask(expStatRates).mulNums(expStatRates).sum();
	mob.exp *= expScale;
	
	
	floors.each( (stat) => { mob[stat] = Math.floor(mob[stat]) });
	
	mob.fullHeal();
	
	dbupdatef(mob);
	return mob;
}


