
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

Random.normal = function() {
	return (Math.random() + Math.random() + Math.random()) / 3.0;
}

last = function(arr) { return arr[arr.length-1]; }

chooseFrom = function(coll) {
	if (coll instanceof Array) {
		return coll.choose();
	}
	
	var weight = coll.sum();
	var roll = Random.value() * weight;
	var s = 0;
	var it = "none";
	
	coll.each((k,v) => {
		if (isNumber(v)) {
			if (s < roll) { it = k }
			s += v;
		}
	});
	
	return it;
}

getOrChooseString = function(obj, key) {
	var val = obj[key];
	if (!val) { return null; }
	if (isString(val)) { return val; }
	return chooseFrom(val);	
}


formatDate = function(date) {
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	
	var hour = date.getHours();
	if (hour < 10) { hour = "0" + hour; }
	var minutes = date.getMinutes();
	if (minutes < 10) { minutes = "0" + minutes; }
	var seconds = date.getSeconds();
	if (seconds < 10) { seconds = "0" + seconds; }
	
	return month+"/"+day+"/"+year+" "+hour+":"+minutes+":"+seconds;
}