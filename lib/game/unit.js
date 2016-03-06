function expCurve(level) {
	return Math.floor(level * 1000 * Math.log(1 + level))
}

defaultUnitData = {
	name: "Neptune",
	job: "Novice",
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
}

Monster = function() {
	var unit = new Unit();
	
	unit.name = japaneseName();
	unit.job = "monster";
	unit.team = "monsters";
	
	return unit;
}


Unit.prototype.recalc = function() {
	var groups = {}
	
	rules.each( (k,v) => { groups[k] = {}; })
	groups.baseStats = this.mask(baseStatCalc);
	var baseCombatStats = this.baseCombatStats;
	if (isString(baseCombatStats)) {
		baseCombatStats = baseStatData[baseCombatStats]
	}
	
	groups.combatStats = baseCombatStats.mask(combatStats)
	groups.combatRatios = baseCombatStats.mask(combatRatios)
	
	//console.log("\n\nstarting stats ")
	//console.log(groups.baseStats)
	
	this.equipmentSlots.each((slot) => {
		var equipPiece = this[slot];
		if (equipPiece) { this.applyRules(groups, thing) }
	})
	
	var genstats = groups.baseStats.matMul(combatStatCalc)
	//console.log("\n\nGeneratedStats: ")
	//console.log(genstats)
	
	this.applyRules(groups, genstats)
	//console.log("\n\nGroups after genstats: ")
	//console.log(groups)
	
	var results = {};
	groupCombine.each( (s) => { results = results.addNums(groups[s]) } )
	conversions.each( (conv) => { this.applyConversion(results, conv) } )
	
	floors.each((s) => { if (results.has(s)) results[s] = Math.floor(results[s]) } )
	
	this.setVals(results)
}

Unit.prototype.applyConversion = function(results, conv) {
	var curve = curves[conv["curve"]]
	var cmbrule = combineRules[conv["rule"]]
	var stat = conv["stat"]
	var source = conv["source"]
	
	var sourceVal = results.num(source);
	var vals = conv.addNums({x: sourceVal});
	
	var statValue1 = results[stat];
	var statValue2 = curve(vals);
	
	
	//console.log("Values: " + sourceVal)
	//console.log(vals)
	//console.log("Converted : " + source + "->" + stat + ": " + statValue1 + " : " + statValue2)
	
	
	results[stat] = cmbrule(statValue1, statValue2)
}

Unit.prototype.applyRules = function(groups, thing) {
	if (thing) {
		rules.each((key,rule) => {
			var checkRule = statCalcData[key]
			var mask;
			if (checkRule instanceof Array) {
				//console.log("Masking with array " + key)
				mask = checkRule;
			} else if (checkRule instanceof Object) {
				//console.log("Masking with object matching keys " + key)
				mask = thing.matchingKeys(rule);
			}
			var lhs = groups[key];
			//console.log(lhs)
			var rhs = thing.mask(mask);
			//console.log(rhs)
			
			var method = combineRules[rule];
			//console.log(method)
			var result = lhs.combine(rhs, method)
			
			groups[key] = result;
		})
	}
	
}

Unit.prototype.update = function(delta) {
	if (inCombat && !dead()) {
		this.timer += delta * data["aspd"]
		if (this.timer >= this.timeout) {
			this.timer -= this.timeout;
			var target = targetOneEnemy();
			
			castSkill(this.autoAttack)
		}
	}
}




