

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
		drops: "standard",
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
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/aea2261.png",
			ded:	"https://i.imgsafe.org/ac22140.png",
			happy:	"https://i.imgsafe.org/aca6507.png",
			lowHP:	"https://i.imgsafe.org/ae2e7b6.png",
			hurt:	"https://i.imgsafe.org/ad33e8f.png",
		},
	},
	ghoul: {
		baseCombatStats: "normal",
		statMults: {
			vit: 2, armor:.5, mhp:3,
			shell: 5, 
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/cc652af.png",
			ded:	"https://i.imgsafe.org/cfce28d.png",
			happy:	"https://i.imgsafe.org/cd93f9f.png",
			lowHP:	"https://i.imgsafe.org/ccc3dec.png",
			hurt:	"https://i.imgsafe.org/cd37c43.png",
		},
	},
	golem: {
		baseCombatStats: "brute",
		statMults: {
			vit:2, wis:2, agi:.5,
			mhp:3, armor:1.5, aspd:.3, shell:.1,
			peva:.3
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/c6940b5.png",
			ded:	"https://i.imgsafe.org/c98629f.png",
			happy:	"https://i.imgsafe.org/c63366a.png",
			lowHP:	"https://i.imgsafe.org/c9168df.png",
			hurt:	"https://i.imgsafe.org/c89dab3.png",
		},
	},
	lizard: {
		baseCombatStats: "brute",
		statMults: {
			str:3, dex:1.5, mhp:.7,
			aspd:.7, shell:16
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/c344930.png",
			ded:	"https://i.imgsafe.org/c40e6eb.png",
			happy:	"https://i.imgsafe.org/c19e0f5.png",
			lowHP:	"https://i.imgsafe.org/c2ca30c.png",
			hurt:	"https://i.imgsafe.org/c255f20.png",
		},
	},
	gargoyle: {
		baseCombatStats: "brute",
		statMults: {
			str:2, dex:2, mhp:1.1,
			aspd:.7, armor:8,
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/d0337bb.png",
			ded:	"https://i.imgsafe.org/d0ec493.png",
			happy:	"https://i.imgsafe.org/d18f2b9.png",
			lowHP:	"https://i.imgsafe.org/d096686.png",
			hurt:	"https://i.imgsafe.org/d1eca5e.png",
		},
	},
	gryphon: {
		baseCombatStats: "avian",
		statMults: {
			vit:2, wis:5, mhp:1.5,
			shell: 5, 
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/ab902ec.png",
			ded:	"https://i.imgsafe.org/a7320ff.png",
			happy:	"https://i.imgsafe.org/a878e92.png",
			lowHP:	"https://i.imgsafe.org/a9b7620.png",
			hurt:	"https://i.imgsafe.org/a923f90.png",
		},
	},
	emu: {
		baseCombatStats: "avian",
		statMults: {
			agi:3, dex:4, mhp:.8,
			armor:.5, cspd:2,
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/d275519.png",
			ded:	"https://i.imgsafe.org/d41fac9.png",
			happy:	"https://i.imgsafe.org/d3af1ab.png",
			lowHP:	"https://i.imgsafe.org/d2ccb69.png",
			hurt:	"https://i.imgsafe.org/d357d99.png",
		},
	},
	roc: {
		baseCombatStats: "avian",
		statMults: {
			vit:2, wis:3, dex:2,
			armor:3, cspd:1.5,
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/bc2000d.png",
			ded:	"https://i.imgsafe.org/bdba02d.png",
			happy:	"https://i.imgsafe.org/be2adf2.png",
			lowHP:	"https://i.imgsafe.org/bc8c986.png",
			hurt:	"https://i.imgsafe.org/be8810d.png",
		},
	},
	phoenix: {
		baseCombatStats: "avian",
		statMults: {
			vit:5, matk:2, macc:1.1
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/bd6594a.png",
			ded:	"https://i.imgsafe.org/c0e1f8a.png",
			happy:	"https://i.imgsafe.org/c067c03.png",
			lowHP:	"https://i.imgsafe.org/bf84b11.png",
			hurt:	"https://i.imgsafe.org/bfe5704.png",
		},
	},
	wolfman: {
		baseCombatStats: "beast",
		statMults: {
			agi:3, dex:5, mhp:1.6,
			aspd:.6, pdef:.6
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/ba666db.png",
			ded:	"https://i.imgsafe.org/bba34d3.png",
			happy:	"https://i.imgsafe.org/bb40bed.png",
			lowHP:	"https://i.imgsafe.org/b9e1a54.png",
			hurt:	"https://i.imgsafe.org/b962e56.png",
		},
	},
	dragon: {
		baseCombatStats: "dragon",
		statMults: {
			str:3, vit:5, mhp:2.6,
			aspd:.6, pdef:.6
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/b436b7f.png",
			ded:	"https://i.imgsafe.org/b07cb16.png",
			happy:	"https://i.imgsafe.org/b34d472.png",
			lowHP:	"https://i.imgsafe.org/b4a5a42.png",
			hurt:	"https://i.imgsafe.org/b3c0ade.png",
		},
	},
	dino: {
		baseCombatStats: "dragon",
		statMults: {
			agi:4, aspd:.9, patk:.6,
			mhp:.5, pdef:.1
		},
		drops: "standard",
		poses: {
			normal:	"https://i.imgsafe.org/b0f1c7d.png",
			ded:	"https://i.imgsafe.org/af2dc2d.png",
			happy:	"https://i.imgsafe.org/af9e9ff.png",
			lowHP:	"https://i.imgsafe.org/b17836e.png",
			hurt:	"https://i.imgsafe.org/b1e3645.png",
		},
	},
	grizzly: {
		baseCombatStats: "beast",
		statMults: {
			str: 5, agi: 1.5, vit: 5, 
			mhp:2.5, aspd: 0.5
		},
		drops: "standard",
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
		drops: "standard",
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
		poses: {
			normal:	"https://i.imgsafe.org/c9e78f6.png",
			ded:	"https://i.imgsafe.org/cacbddb.png",
			happy:	"https://i.imgsafe.org/cb375d3.png",
			lowHP:	"https://i.imgsafe.org/cbf367b.png",
			hurt:	"https://i.imgsafe.org/cb9fac2.png",
		},
		drops: "standard",
	},
	drake: {
		baseCombatStats: "dragon",
		statMults: {
			str: 3, agi: 1, vit: 3,
			pdef: 1.2, mhp:2.5, aspd: 0.4
		},
		poses: {
			normal:	"https://i.imgsafe.org/d4908e1.png",	
			ded: 	"https://i.imgsafe.org/b6df618.png",	
			happy: 	"https://i.imgsafe.org/b663f69.png",	
			lowHP:	"https://i.imgsafe.org/b56d35b.png",	
			hurt:	"https://i.imgsafe.org/b5e0731.png",	
		},
		drops: "standard",
	},
	kobold: {
		baseCombatStats: "beast",
		statMults: {
			str: 3, agi: 1, dex:2.5,
			aspd: 0.45
		},
		poses: {
			normal:	"https://i.imgsafe.org/c47c466.png",
			ded:	"https://i.imgsafe.org/c702582.png",
			happy:	"https://i.imgsafe.org/c768e57.png",
			lowHP:	"https://i.imgsafe.org/c4e6fd6.png",
			hurt:	"https://i.imgsafe.org/c56a6a1.png",
		},
			
		drops: "standard",
	},
}


monster = (type) => { return monsterData[type]; }
