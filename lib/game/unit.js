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
var rules = statCalcData.rules;
var combineRules = statCalcData.combineRules;
var curves = statCalcData.curves;

Unit.prototype.recalc = function() {
	var groups = {}
	
	
}
Unit.prototype.applyConversion = function(results, rule) {
	var curve = curves[rule["curve"]]
	var cmbrule = combineRules[rule["combine"]]
	var stat = rule["stat"]
	var source = rule["source"]
	
	var sourceVal = results.extract(source, 0);
	var vals = rule.addNums({x: sourceVal})
	
}

Unit.prototype.applyRule = function(groups, thing) {
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
}