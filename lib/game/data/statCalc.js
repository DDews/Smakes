statCalcData = {
	baseStatCalc:[ "level", "str", "dex", "agi", "vit", "int", "wis",  ],
	baseStats:[ "str", "dex", "agi", "vit", "int", "wis",  ],
	vitals:[ "hp", "mp", "sp", ],
	combatStats:[
		"mhp","mmp","msp",
		"rhp","rmp","rsp",
		"patk","pacc",
		"matk","macc",
		"aspd","cspd",
	],
	combatRatios:[
		"pdef","peva",
		"mdef","meva",
		"crit","resi",
	],
	intermediate:[
		"armor","shell",
		"rflex","intut",
		"sight","tough",
	],
	resistances:{prefix:"res_"},
	affinities:{prefix:"aff_"},
	
	rules:{
		baseStats:"add",
		combatStats:"add",
		intermediate:"add",
		affinities:"add",
		combatRatios:"ratio",
		resistances:"ratio",
	},
	
	groupCombine:[
		"combatStats",
		"combatRatios",
		"intermediate",
		"resistances",
		"affinities",
	],
	
	floors:[
		"patk","matk",
		"str","dex","vit","agi","int","wis",
		"armor","shell","rflex",
		"intut","sight","tough",
		"mhp","mmp","msp",
	],
	curves:{
		//y = ax + b
		linear: (d) => { 
			var x = d.num("x"); var a = d.num("a"); var b = d.num("b"); 
			return a*x + b; 
		},
		//y = ax^2 + bx + c
		square: (d) => { 
			var x = d.num("x"); var a = d.num("a"); var b = d.num("b"); var c = d.num("c"); 
			return a*x*x + b*x + c; 
		},
		//y = ax^3 + bx^2 + cx + d
		cube: (d) => { 
			var x = d.num("x"); var a = d.num("a"); var b = d.num("b"); var c = d.num("c"); var e = d.num("d"); 
			return a*x*x*x + b*x*x + c*x + e; 
		},
		//y = 1 - (r/(x+r)) [0...cap]
		asymp: (d) => { 
			var x = d.num("x"); var r = d.xt("r", 800); var cap = d.xt("cap", 1); 
			return clamp(1.0 - (r / (x + r)), 0, cap); 
		},
		//y = r*log(x+base, base) [0...cap]
		log: (d) => { 
			var x = d.num("x"); var r = d.xt("r", 1); var cap = d.xt("cap", Infinity); var base = d.xt("base", 2); 
			return clamp( r * Math.log( x + base) / Math.log(base), 0, cap ); 
		},
	},
		
	combineRules:{
		add: (a,b) => { return a + b },
		mul: (a,b) => { return a * b },
		ratio: (a,b) => { return ratio(a, b); },
		set: (a, b) => { return b; },
	},
	
	conversions:[
		{
			curve:"asymp",
			rule:"ratio",
			source:"armor",
			stat:"pdef",
			r:1600,
			cap:.95,
		},
		{
			curve:"asymp",
			rule:"ratio",
			source:"shell",
			stat:"mdef",
			r:1600,
			cap:.95,
		},
		{
			curve:"log",
			rule:"ratio",
			source:"rflex",
			stat:"peva",
			r:.01,
			cap:.95,
			base:2,
		},
		{
			curve:"log",
			rule:"ratio",
			source:"intut",
			stat:"meva",
			r:.01,
			cap:.95,
			base:2,
		},
		{
			curve:"asymp",
			rule:"ratio",
			source:"sight",
			stat:"crit",
			r:3600,
			cap:.50,
		},
		{
			curve:"asymp",
			rule:"ratio",
			source:"tough",
			stat:"resi",
			r:3600,
			cap:.50,
		},
		
		{
			curve:"linear",
			rule:"add",
			source:"armor",
			stat:"patk",
			a:.1,
		},
		
		
	],
	baseCombatStats: {
		mhp:100.000,	mmp: 10.000,	msp:  5.000,
		rhp:  0.200,	rmp:  0.100,	rsp:  0.015,
		patk: 10.000,	pacc:  0.500,	pdef:  0.000,	peva:  0.000,
		matk: 10.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.000,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor:  0.000,	rflex:  1.000,	
		shell:  0.000,	intut:  1.000,	
		sight:  0.000,	tough:  0.000,
	},
	
	expStatRates:{
		mhp:  0.100,	mmp:  0.300,	msp:  0.500,
		rhp:  0.300,	rmp:  0.100,	rsp:  0.100,
		patk:  0.200,	pacc:  0.100,	pdef:  1.000,	peva:  2.000,
		matk:  1.000,	macc:  0.100,	mdef:  1.000,	meva:  2.000,
		crit:  1.000,	resi:  1.000,	aspd:  3.000,	cspd:  3.000,
		armor:  0.100,	rflex:  0.100,
		shell:  0.100,	intut:  0.100,
		sight:  0.100,	tough:  0.100,
		
	},
	
	
	combatStatCalc:{
		mhp: { level:30.000, vit: 5.400, str: 1.100, }, 
		mmp: { level: 5.000, wis:  .800, int:  .125, }, 
		msp: { level: 1.000, str:  .125, dex:  .125, agi:  .125, vit:  .125, int:  .125, wis:  .125, },
		
		rhp: { level:  .050, vit:  .007, str:  .003, },
		rmp: { level:  .020, wis:  .002, int:  .001, },
		rsp: { level:  .010, str:  .001, dex:  .001, agi:  .001, vit:  .001, int:  .001, wis:  .001, },
		
		patk: { level: 4.000, str: 2.000, dex: 1.000, },
		//pdef: { level:  .000, vit:  .000, agi:  .000, },
		pacc: { level:  .002, dex:  .002, agi:  .001, },
		//peva: { level:  .000, agi:  .000, dex:  .000, },
		
		matk: { level: 4.500, int: 2.150, wis: 1.020, },
		//mdef: { level:  .000, vit:  .000, wis:  .000, },
		macc: { level:  .002, int:  .001, wis:  .002, },
		//meva: { level:  .000, wis:  .000, agi:  .000, },
		
		aspd: { level:  .001, agi:  .0007, dex:  .0004, },
		cspd: { level:  .001, dex:  .0007, wis:  .0004, },
		
		//crit: { level:  .000, agi:  .001, dex:  .001, int:  .001, },
		//resi: { level:  .000, str:  .001, vit:  .001, wis:  .001, },
		
		armor: { level:  .000, vit: 4.000, agi: 2.000, },
		shell: { level:  .000, vit: 4.000, wis: 2.000, },
		
		rflex: { level:  .000, agi: 4.000, dex: 2.000, },
		intut: { level:  .000, wis: 4.000, agi: 2.000, },
		
		sight: { level:  .000, dex: 4.000, agi: 2.000, int: 2.000, },
		tough: { level:  .000, vit: 4.000, str: 2.000, wis: 2.000, },
		
	},
	
}

expCurve = function(level) {
	return Math.floor(level * 1000 * Math.log(1 + level))
}


//Put stuff from stat calc into global context;
//much of it is used directly in other files
//this makes it easier to work with
//this is the main thing that is used this way...
vitals = statCalcData.vitals;
baseStats = statCalcData.baseStats;
baseStatCalc = statCalcData.baseStatCalc;
combatStats = statCalcData.combatStats;
combatRatios = statCalcData.combatRatios;
intermediate = statCalcData.intermediate;
resistances = statCalcData.resistances;
affinities = statCalcData.affinities;
floors = statCalcData.floors;
conversions = statCalcData.conversions;
rules = statCalcData.rules;
groupCombine = statCalcData.groupCombine;
combineRules = statCalcData.combineRules;
curves = statCalcData.curves;
expStatRates = statCalcData.expStatRates;
combatStatCalc = statCalcData.combatStatCalc;
