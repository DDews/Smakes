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
