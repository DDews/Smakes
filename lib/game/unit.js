function expCurve(level) {
	return Math.floor(level * 1000 * Math.log(1 + level))
}

defaultUnitData = {
	name: "Neptune",
	job: "Novice",
	race: "Human",
	team: "player",
	
	level: 1,
	exp: 0.0,
	tnl: 1.0,
	
	timer: 0.0,
	timeout: 3.0,
	str: 5,
	dex: 5,
	int: 5,
	vit: 5,
	agi: 5,
	wis: 5,
	equipmentSlots: [ 
		"head", "body", "legs", "gloves", "feet", 
		"handRight", "handLeft",
		"accessory1", "accessory2",
	],
	baseCombatStats: "normal",
} 


Unit = function() {
	this.setVals(defaultUnitData)
	this.tnl = expCurve(this.level)
	this.autoAttack = new Skill("autoAttack")
	this.recalc()
	this.fullHeal();
	
	this.skills = {};
	this.skills["autoAttack"] = skillData["autoAttack"];
	
	dbinsert("Unitinfo", this);
}

Monster = function(type, level, combo) {
	var mob = new Unit();
	
	mob.name = japaneseName();
	mob.team = "monster";
	mob.level = level;
	mob.race = type.capitalize();
	
	var mon = monsterData[type];
	
	mob.baseCombatStats = mon.baseCombatStats;
	var scales = mon.statMults;
	
	var eliteRank = 0;
	var eliteChance = 0 + combo * .0001;
	var maxElite = 1 + Math.floor(combo / 100);
	
	maxElite.times((n) => {
		var roll = Math.random();
		if (roll < eliteChance) { eliteRank += 1; }
	})
	
	mob.job = (eliteRank > 0) ? "Elite *" + eliteRank : "Mook" 
	
	var levelScale = (level + 10.0) / 10.0;
	var baseStat = 2 * levelScale + 2 * eliteRank * levelScale;
	baseStats.each((stat) => {
		mob[stat] = baseStat * scales.xt(stat, 1);
	})
	
	mob.recalc();
	
	mob.combinex(scales, mul)
	
	mob.exp = mob.mask(expStatRates).mulNums(expStatRates).sum();
	
	floors.each( (stat) => { mob[stat] = Math.floor(mob[stat]) });
	
	mob.fullHeal();
	
	dbupdatef(mob);
	return mob;
}


