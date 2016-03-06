
clamp = function(v, min, max) { if (v < min) return min; if (v > max) return max; return v; }
clamp01 = function(v) { if (v < 0) return 0; if (v > 1) return 1; return v; }
add = function(a, b) { return a + b; }
mul = function(a, b) { return a * b; }
ratio = function(a, b) { return (1.0 - (1.0 - clamp01(a)) * (1.0 - clamp01(b))) }


isString = function(s) { return typeof(s) === 'string' || s.constructor === String; }
isNumber = function(n) { return typeof(n) === 'number' || n.constructor === Number; }
isBool = function(b) { return typeof(b) === 'boolean' || b.constructor === Boolean; }
isArray = function(a) { return a.constructor === Array; }


Random = {}

Random.value = Math.random;
Random.range = function(min, max) {
	var r = max-min;
	return min + Random.value() * r;
}
