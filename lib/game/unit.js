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
	
	autoAttackTimer: 0.0,
	autoAttackTime: 3.0,
	str: 5,
	dex: 5,
	int: 5,
	vit: 5,
	agi: 5,
	wis: 5,
	equipmentSlots: [ "head", "body", "legs", "gloves", "feet", 
		"handRight", "handLeft",
		"accessory1", "accessory2",],
	
} 

Unit.prototype.recalc = function() {
	var groups = {}
	
	rules.each( (k,v) => { groups[k] = {}; })
	groups.baseStats = this.mask(baseStatCalc);
	
	this.equipmentSlots.each((slot) => {
		var equipPiece = this[slot];
		if (equipPiece) { this.applyRules(groups, thing) }
	})
	
	var genstats = groups.baseStats.matMul(combatStatCalc)
	this.applyRules(groups, genstats)
	
	var results = {};
	groupCombine.each( (s) => { results = results.add(groups[s]) } )
	conversions.each( (conv) => { this.applyConversion(results, conv) } )
	
	floors.each((s) => { if (results.has(s)) results[s] = Math.floor(results[s]) } )
	
	this.setVals(results)
}

Unit.prototype.applyConversion = function(results, rule) {
	var curve = curves[rule["curve"]]
	var cmbrule = combineRules[rule["combine"]]
	var stat = rule["stat"]
	var source = rule["source"]
	
	var sourceVal = results.extract(source, 0);
	var vals = rule.addNums({x: sourceVal})
	
	var statValue1 = results[stat];
	var statValue2 = curve(vals);
	
	results[stat] = cmbrule(statValue1, statValue2)
}

Unit.prototype.applyRules = function(groups, thing) {
	if (thing) {
		rules.each((key,rule) => {
			var checkRule = statCalcData[key]
			var mask;
			if (checkRule instanceof Array) {
				mask = check_rule;
			} else if (checkRule instanceof Object) {
				mask = thing.matchingKeys(rule);
			}
			var lhs = groups[key];
			var rhs = thing.mask(mask);
			
			var method = combineRules[rule];
			var result = lhs.combind(rhs, method)
			groups[key] = result;
		})
	}
	
}

function Unit() {
	this.setVals(defaultUnitData)
	this.tnl = expCurve(this.level)
	
	this.recalc()
	console.log(this)
}