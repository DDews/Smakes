String.prototype.regexIndexOf = function(regex, startpos) {
	var indexOf = this.substring(startpos || 0).search(regex);
	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}
function addTo(ptype, name, func) { Object.defineProperty(ptype, name, { value: func, enumerable: false }) }
function addToObject(name, func) { addTo(Object.prototype, name, func) }

addTo(String.prototype, "prefix", function(s) { return this.startsWith(s); })
addTo(String.prototype, "suffix", function(s) { return this.endsWith(s); })
addTo(String.prototype, "contains", function(s) { return this.includes(s); })
addTo(String.prototype, "capitalize", function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
})

addTo(Number.prototype, "times", function(callback) {
	var i; for (i = 0; i < this; i+=1) { callback(i); }
});

addTo(Array.prototype, "each", function(callback) { for (var ind in this) { callback(this[ind]) } })
addTo(Array.prototype, "choose", function() {
	var ind = Math.floor(Math.random() * this.length)
	return this[ind];
})

addTo(Array.prototype, "subtract", function(other) {
	var result = [];
	this.each((v) => {result.push(v); } );
	
	other.each((thing) => {
		if (result.indexOf(thing) >= 0) {
			result.splice(result.indexOf(thing), 1);
		}
	})
	return result
})


//addToObject("has", function(key) { if (this[key]) return true; return false; })
addToObject("has", function(key) { return this[key] !== undefined && this[key] !== null })


addToObject("each", function(callback) {
	for (var key in this) { if (this.hasOwnProperty(key)) { callback(key, this[key]); } }
});

addToObject("toPairRay", function() {
	var result = [];
	this.each((k,v) => {result.push({key:k, value:v} ) } );
	return result;
});

addToObject("mask", function(msk) {
	var val = {}
	if (msk instanceof Array) { msk.each( (k) => { if (this.has(k)) val[k] = this[k] } ) }
	else if (msk instanceof Object) { msk.each( (k,v) => { if (this.has(k)) val[k] = this[k] } ) }
	return val;
});

addToObject("matchingKeys", function(rule) {
	if (!rule) { rule = {}; }
	result = [];
	var pf = rule.xt("prefix", "");
	var sf = rule.xt("suffix", "");
	var cn = rule.xt("contains", "");

	this.each((k,v) => {
		if (k.prefix(pf) || k.suffix(sf) || k.contains(cn)) {
			result.push(k);
		}
	})
	return result;
	
})

addToObject("setVals", function(vals) { vals.each( (k,v) => { this[k]=vals[k] } ); return this; })

addToObject("xt", function(key, defaultVal) { return this.has(key) ? this[key] : defaultVal })
addToObject("num", function(key) { return this.xt(key, 0) })


addToObject("neg", function() {
	var c = {}
	this.each( (k,v) => { if (this.num(k) !== 0) c[k] = -v; } )
	return c
})

addToObject("sum", function() {
	var c = 0
	this.each( 
		(k,v) => { if (isNumber(v)) { c += v; } } 
	)
	return c
})




addToObject("combine", function(b, method) {
	var c = {};
	this.each( (k,v) => { c[k] = v; } )
	b.each( (k,v) => { c[k] = c[k] ? method(c[k], v) : v } )
	return c;
})

addToObject("combinex", function(b, method) {
	b.each( (k,v) => { this[k] = method(this.num(k), v) } )
})

addToObject("addNums", function(b) { return this.combine(b, add); } )
addToObject("mulNums", function(b) { return this.combine(b, mul); } )
addToObject("ratioNums", function(b) { return this.combine(b, ratio); } )

addToObject("matMul", function(b) {
	c = {};
	b.each( (k,v) => {
		r = 0;
		if (v instanceof Object) { v.each( (kk,vv) => { r += this.num(kk) * vv; } ) }
		else if (v instanceof Number) { r = this.num(k) * v; }
		c[k] = r;
	})
	return c;
})



addToObject("recalc", function() {
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
});

addToObject("applyConversion", function(results, conv) {
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
});

addToObject("applyRules", function(groups, thing) {
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
	
});

addToObject("inCombat", function() { return this.combat; })
addToObject("dead", function() { return this.hp < 0; })

addToObject("combatUpdate", function(delta) {
	if (this.inCombat() && !dead()) {
		this.timer += delta * data["aspd"]
		if (this.timer >= this.timeout) {
			this.timer -= this.timeout;
			var target = targetOneEnemy();
			
			castSkill(this.autoAttack)
		}
	}
});


addToObject("fullHeal", function() {
	this.hp = this.mhp;
	this.mp = this.mmp;
	this.sp = this.msp;
});


