statCalcData = {
	baseStatCalc:[ "level", "str", "dex", "agi", "vit", "mnd", "wis",  ],
	baseStats:[ "str", "dex", "agi", "vit", "mnd", "wis",  ],
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
	resistances:{"prefix":"res_"},
	affinities:{"prefix":"aff_"},
	
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
		"str","dex","vit","agi","mnd","wis",
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
			type:"asymp",
			rule:"ratio",
			source:"armor",
			stat:"pdef",
			r:1600,
			cap:.95,
		},
		{
			type:"asymp",
			rule:"ratio",
			source:"shell",
			stat:"mdef",
			r:1600,
			cap:.95,
		},
		{
			type:"log",
			rule:"ratio",
			source:"rflex",
			stat:"peva",
			rate:.01,
			cap:.95,
			base:2,
		},
		{
			type:"log",
			rule:"ratio",
			source:"intut",
			stat:"meva",
			rate:.01,
			cap:.95,
			base:2,
		},
		{
			type:"asymp",
			rule:"ratio",
			source:"sight",
			stat:"crit",
			rate:3600,
			cap:.50,
		},
		{
			type:"asymp",
			rule:"ratio",
			source:"tough",
			stat:"resi",
			rate:3600,
			cap:.50,
		},
		
		{
			"type":"line",
			"rule":"add",
			"source":"armor",
			"stat":"patk",
			"rate":.1,
		},
		
		
	],
	
		
	
	baseCombatStats:{
		mhp:100.000,
		mmp: 10.000,
		msp:  5.000,
		
		rhp:  0.200,
		rmp:  0.100,
		rsp:  0.015,
		
		patk: 10.000,
		pacc:  0.500,
		pdef:  0.000,
		peva:  0.000,
		
		matk: 10.000,
		macc:  0.500,
		mdef:  0.000,
		meva:  0.000,
		
		
		crit:  0.000,
		resi:  0.000,
		
		aspd:  1.000,
		cspd:  1.000,
		
		armor:  0.000,
		rflex:  1.000,
	
		shell:  0.000,
		intut:  1.000,
		
		signt:  0.000,
		tough:  0.000,
		
	},
	
	expStatRates:{
		mhp:  0.100,
		mmp:  0.300,
		msp:  0.500,
		
		rhp:  0.300,
		rmp:  0.100,
		rsp:  0.100,
		
		patk:  0.200,
		pacc:  0.100,
		pdef:  1.000,
		peva:  2.000,
		
		matk:  1.000,
		macc:  0.100,
		mdef:  1.000,
		meva:  2.000,
		
		armor:  1.000,
		shell:  1.000,
		
		crit:  1.000,
		resi:  1.000,
		
		aspd:  3.000,
		cspd:  3.000,
	},
	
	
	combatStatCalc:{
		mhp: { level:30.000, vit: 5.400, str: 1.100, }, 
		mmp: { level: 5.000, wis:  .800, mnd:  .125, }, 
		msp: { level: 1.000, str:  .125, dex:  .125, agi:  .125, vit:  .125, mnd:  .125, wis:  .125, },
		
		rhp: { level:  .050, vit:  .007, str:  .003, },
		rmp: { level:  .020, wis:  .002, mnd:  .001, },
		rsp: { level:  .010, str:  .001, dex:  .001, agi:  .001, vit:  .001, mnd:  .001, wis:  .001, },
		
		patk: { level: 4.000, str: 2.000, dex: 1.000, },
		pdef: { level:  .000, vit:  .000, agi:  .000, },
		pacc: { level:  .002, dex:  .002, agi:  .001, },
		peva: { level:  .000, agi:  .000, dex:  .000, },
		
		matk: { level: 4.500, mnd: 2.150, wis: 1.020, },
		mdef: { level:  .000, vit:  .000, wis:  .000, },
		macc: { level:  .002, mnd:  .001, wis:  .002, },
		meva: { level:  .000, wis:  .000, agi:  .000, },
		
		aspd: { level:  .010, agi:  .007, dex:  .004, },
		cspd: { level:  .010, dex:  .007, wis:  .004, },
		
		crit: { level:  .000, agi:  .001, dex:  .001, mnd:  .001, },
		resi: { level:  .000, str:  .001, vit:  .001, wis:  .001, },
		
		armor: { level:  .000, vit: 4.000, agi: 2.000, },
		shell: { level:  .000, vit: 4.000, wis: 2.000, },
		
		rflex: { level:  .000, agi: 4.000, dex: 2.000, },
		intut: { level:  .000, wis: 4.000, agi: 2.000, },
		
		sight: { level:  .000, dex: 4.000, agi: 2.000, mnd: 2.000, },
		tough: { level:  .000, vit: 4.000, str: 2.000, wis: 2.000, },
		
	},
	
}


var vitals = statCalcData.vitals;
var baseStats = statCalcData.baseStats;
var baseStatCalc = statCalcData.baseStatCalc;
var combatRatios = statCalcData.combatStats;
var intermediate = statCalcData.intermediate;
var resistances = statCalcData.resistances;
var affinities = statCalcData.affinities;
var floors = statCalcData.floors;
var conversions = statCalcData.conversions;
var rules = statCalcData.rules;
var groupCombine = statCalcData.groupCombine;
var combineRules = statCalcData.combineRules;
var curves = statCalcData.curves;
var baseCombatStats = statCalcData.baseCombatStats;
var combatStatCalc = statCalcData.combatStatCalc;


