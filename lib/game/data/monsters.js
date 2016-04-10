

baseStatData = {
	player: {
		mhp:150.000,	mmp: 10.000,	msp:  5.000,
		rhp:  0.200,	rmp:  0.100,	rsp:  0.015,
		patk: 25.000,	pacc:  0.500,	pdef:  0.000,	peva:  0.000,
		matk: 25.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.000,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor:  0.000,	rflex:  1.000,	
		shell:  0.000,	intut:  1.000,	
		sight:  0.000,	tough:  0.000,
	},
	normal: {
		mhp:100.000,	mmp: 10.000,	msp:  5.000,
		rhp:  0.200,	rmp:  0.100,	rsp:  0.015,
		patk: 10.000,	pacc:  0.500,	pdef:  0.000,	peva:  0.000,
		matk: 10.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.000,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor: 25.000,	rflex: 25.000,	
		shell: 25.000,	intut: 25.000,	
		sight: 25.000,	tough: 25.000,
	},
	avian: {
		mhp: 40.000,	mmp: 35.000,	msp: 15.000,
		rhp:  0.200,	rmp:  0.100,	rsp:  0.015,
		patk: 10.000,	pacc:  0.700,	pdef:  0.000,	peva:  0.200,
		matk: 10.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.000,	resi:  0.000,	aspd:  1.000,	cspd:  1.100,
		armor: 10.000,	rflex: 35.000,	
		shell: 10.000,	intut: 35.000,	
		sight:  5.000,	tough:  5.000,
	},
	weak: {
		mhp: 20.000,	mmp: 10.000,	msp:  5.000,
		rhp:  0.200,	rmp:  0.100,	rsp:  0.015,
		patk:  5.000,	pacc:  0.300,	pdef:  0.000,	peva:  0.000,
		matk: 10.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.000,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor:  1.000,	rflex:  1.000,	
		shell:  1.000,	intut:  1.000,	
		sight:  1.000,	tough:  1.000,
	},
	brute:{
		mhp:255.000,	mmp:  3.000,	msp:  4.000,
		rhp:  0.400,	rmp:  0.100,	rsp:  0.015,
		patk: 12.000,	pacc:  0.550,	pdef:  0.100,	peva:  0.010,
		matk:  8.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.020,	resi:  0.000,	aspd:  0.700,	cspd:  1.000,
		armor:160.000,	rflex: 15.000,	
		shell:  0.000,	intut: 15.000,	
		sight:  5.000,	tough: 55.000,
	},
	beast:{
		mhp:175.000,	mmp:  5.000,	msp: 29.000,
		rhp:  0.400,	rmp:  0.100,	rsp:  0.015,
		patk: 15.000,	pacc:  0.550,	pdef:  0.020,	peva:  0.050,
		matk:  8.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.100,	resi:  0.000,	aspd:  1.100,	cspd:  1.000,
		armor: 30.000,	rflex: 35.000,	
		shell: 20.000,	intut: 10.000,	
		sight: 20.000,	tough: 15.000,
	},
	dragon:{
		mhp:195.000,	mmp: 25.000,	msp: 19.000,
		rhp:  0.400,	rmp:  0.100,	rsp:  0.015,
		patk: 13.000,	pacc:  0.550,	pdef:  0.100,	peva:  0.010,
		matk: 18.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.020,	resi:  0.000,	aspd:  0.800,	cspd:  1.000,
		armor: 80.000,	rflex: 10.000,	
		shell:160.000,	intut: 10.000,	
		sight:  5.000,	tough: 80.000,
	},
	
}

monsterData = {
	
	template: {
		baseCombatStats: "normal",
		statMults: {
			
		},
		drops: [
			"equipment",
		],
		poses: {
			normal:	"",
			ded:	"",
			happy:	"",
			lowHP:	"",
			hurt:	"",
		},
	},
	minotaur: {
		baseCombatStats: "brute",
		statMults: {
			str:5,
			patk:3,sight:5,aspd:.7,pacc:.7,crit:1.5
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/bull",
	},
	ghoul: {
		baseCombatStats: "normal",
		statMults: {
			vit: 2, armor:.5, mhp:3,
			shell: 5, 
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/ghoul",
	},
	golem: {
		baseCombatStats: "brute",
		statMults: {
			vit:2, wis:2, agi:.5,
			mhp:3, armor:1.5, aspd:.3, shell:.1,
			peva:.3
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/golem",
	},
	lizard: {
		baseCombatStats: "brute",
		statMults: {
			str:3, dex:1.5, mhp:.7,
			aspd:.7, shell:16
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/lizard",
	},
	gargoyle: {
		baseCombatStats: "brute",
		statMults: {
			str:2, dex:2, mhp:1.1,
			aspd:.7, armor:8,
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/garg",
	},
	gryphon: {
		baseCombatStats: "avian",
		statMults: {
			vit:2, wis:5, mhp:1.5,
			shell: 5, 
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/bird",
	},
	emu: {
		baseCombatStats: "avian",
		statMults: {
			agi:3, dex:4, mhp:.8,
			armor:.5, cspd:2,
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/emu",
	},
	roc: {
		baseCombatStats: "avian",
		statMults: {
			vit:2, wis:3, dex:2,
			armor:3, cspd:1.5,
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/roc",
	},
	phoenix: {
		baseCombatStats: "avian",
		statMults: {
			vit:5, matk:2, macc:1.1
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/phoenix",
	},
	wolfman: {
		baseCombatStats: "beast",
		statMults: {
			agi:3, dex:5, mhp:1.6,
			aspd:.6, pdef:.6
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/wolf",
	},
	dragon: {
		baseCombatStats: "dragon",
		statMults: {
			str:3, vit:5, mhp:2.6,
			aspd:.6, pdef:.6
		},
		drops: [
			"equipment",
		],
		poses: "/monsters/dragon",
	},
	dino: {
		baseCombatStats: "dragon",
		statMults: {
			agi:4, aspd:.9, patk:.6,
			mhp:.5, pdef:.1
		},
		drops: [
			"equipment",
			{item:"mat_scale", 			chance:".3", qty:10},
			{item:"mat_largeScale", 	chance:".1", qty:5},
			{item:"mat_fang", 			chance:".1", qty:5},
			{item:"mat_claw", 			chance:".1", qty:5},
			{item:"mat_stickyLiquid", 	chance:".1", qty:5},
		],
		poses: "/monsters/dino",
	},
	grizzly: {
		baseCombatStats: "beast",
		statMults: {
			str: 3, agi: 1.5, vit: 5, 
			mhp:2.5, aspd: 0.5
		},
		drops: [
			"equipment",
		],
		poses: {
			normal:	"http://i.imgur.com/wojiszw.png",
			ded:	"http://i.imgur.com/GlpC9jY.png",
			happy:	"http://i.imgur.com/OtX0Rfq.png",
			lowHP:	"http://i.imgur.com/pTA9KmH.png",
			hurt:	"http://i.imgur.com/vETWzvk.png",
		},
	},
	bat: {
		baseCombatStats: "weak",
		statMults: {
			str: 2, agi: 1.5, vit: .5, 
			patk: 0.55, pdef: 0.3, mhp: .5, aspd: .5
		},
		drops: [
			"equipment",
		],
		poses: {
			normal:	"http://i.imgur.com/TVdNPEF.png",
			ded:	"http://i.imgur.com/u5vWc7a.png",
			happy:	"http://i.imgur.com/jJtJf7h.png",
			lowHP:	"http://i.imgur.com/lhkdZ9C.png",
			hurt:	"http://i.imgur.com/UmTCuil.png",
		},
	},
	goblin: {
		baseCombatStats: "normal",
		statMults: {
			str: 2, agi: 1, dex: 3,
			aspd: 0.6
		},
		drops: [
			"equipment",
			{item:"mat_steel", 	chance:".3", qty:5},
			{item:"mat_stickyLiquid", 	chance:".1", qty:5},
			{item:"food_soda", 		chance:".1", qty:3},
			{item:"food_hamburger", chance:".1", qty:2},
		],
		poses: "/monsters/goblin",
	},
	drake: {
		baseCombatStats: "dragon",
		statMults: {
			str: 3, agi: 1, vit: 3,
			pdef: 1.2, mhp:2.5, aspd: 0.4
		},
		drops: [
			"equipment",
			{item:"mat_stickyLiquid", 	chance:".1", qty:5},
		],
		poses: "/monsters/drake",
	},
	kobold: {
		baseCombatStats: "beast",
		statMults: {
			str: 3, agi: 1, dex:2.5,
			aspd: 0.45
		},
		drops: [
			"equipment",	
			{item:"mat_bronze", 	chance:".1", qty:5},
			{item:"mat_copper", 	chance:".1", qty:5},
			{item:"mat_log", 		chance:".1", qty:5},
			{item:"mat_frorium", chance:".1", qty:5},
			{item:"food_beer", 		chance:".1", qty:3},
			{item:"food_chiliDog", chance:".1", qty:2},
		],
		poses: "/monsters/kobold",
	},
}


monster = (type) => { return monsterData[type]; }
