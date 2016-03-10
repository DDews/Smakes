

baseStatData = {
	player: {
		mhp:150.000,	mmp: 10.000,	msp:  5.000,
		rhp:  0.200,	rmp:  0.100,	rsp:  0.015,
		patk: 10.000,	pacc:  0.500,	pdef:  0.000,	peva:  0.000,
		matk: 10.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
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
		armor:  0.000,	rflex:  1.000,	
		shell:  0.000,	intut:  1.000,	
		sight:  0.000,	tough:  0.000,
	},
	brute:{
		mhp:155.000,	mmp:  5.000,	msp:  9.000,
		rhp:  0.400,	rmp:  0.100,	rsp:  0.015,
		patk: 12.000,	pacc:  0.550,	pdef:  0.100,	peva:  0.010,
		matk:  8.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.020,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor: 20.000,	rflex:  1.000,	
		shell:  0.000,	intut:  1.000,	
		sight:  0.000,	tough:  0.000,
	},
	beast:{
		mhp:175.000,	mmp:  5.000,	msp:  9.000,
		rhp:  0.400,	rmp:  0.100,	rsp:  0.015,
		patk: 15.000,	pacc:  0.550,	pdef:  0.020,	peva:  0.050,
		matk:  8.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.100,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor: 10.000,	rflex: 20.000,	
		shell:  0.000,	intut:  1.000,	
		sight:  0.000,	tough:  0.000,
	},
	dragon:{
		mhp:195.000,	mmp:  5.000,	msp:  9.000,
		rhp:  0.400,	rmp:  0.100,	rsp:  0.015,
		patk: 12.000,	pacc:  0.550,	pdef:  0.100,	peva:  0.010,
		matk: 18.000,	macc:  0.500,	mdef:  0.000,	meva:  0.000,
		crit:  0.020,	resi:  0.000,	aspd:  1.000,	cspd:  1.000,
		armor: 80.000,	rflex:  1.000,	
		shell:  0.000,	intut:  1.000,	
		sight:  0.000,	tough: 80.000,
	},
	
}

monsterData = {
	grizzly: {
		baseCombatStats: "brute",
		statMults: {
			str: 2, agi: 1,
			patk: 0.45, pdef: 0.2, mhp:1.1, aspd: 0.5
		},
		drops: "standard",
	},
	goblin: {
		baseCombatStats: "normal",
		statMults: {
			str: 2, agi: 1,
			patk: 0.45, pdef: 0.2, mhp:.5, aspd: 0.6
		},
		poses: {
			normal:"http://i.imgur.com/SCBp1sk.png",
			ded:"http://i.imgur.com/xrNekfO.png",
			happy:"http://i.imgur.com/fzh3trc.png",
			lowHP:"http://i.imgur.com/gINSucf.png",
			hurt:"http://i.imgur.com/YMNL8Kv.png",
		},
		drops: "standard",
	},
	drake: {
		baseCombatStats: "dragon",
		statMults: {
			str: 3, agi: 1, vit: 3,
			patk: 0.45, pdef: 1.2, mhp:1.5, aspd: 0.4
		},
		drops: "standard",
	},
	troll: {
		baseCombatStats: "brute",
		statMults: {
			str: 2, agi: 1,
			patk: 0.45, pdef: 0.2, mhp:1.5, aspd: 0.2
		},
		drops: "standard",
	},
	kobold: {
		baseCombatStats: "beast",
		statMults: {
			str: 2, agi: 1,
			patk: 0.45, pdef: 0.2, mhp:.5, aspd: 0.4
		},
		poses: {
			normal:"http://i.imgur.com/z1wLRqf.png",
			ded:"http://i.imgur.com/ZXekCd5.png",
			happy:"http://i.imgur.com/A2Bmrhl.png",
			lowHP:"http://i.imgur.com/7qkZ9WW.png",
			hurt:"http://i.imgur.com/se2cWVz.png",
		},
			
		drops: "standard",
	},
}


monster = (type) => { return monsterData[type]; }
