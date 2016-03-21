
itemGenData = {
	floor:[
		"patk","matk",
		"str","dex","vit","agi","mnd","wis",
		"armor","shell","rflex","intuit",
		"mhp","mmp","msp",
	],
		
	meleeWeapon:{
		type:"rules",
		itemType:"Weapon",
		id:"eq_gen_melee",
		
		settings:{
			dirk:8,
			sword:5,
			club:5,
			greatsword:3,
		},
		rolls:[
			"suffix",
			"rare",
			"metal",
			"element",
			"prefix",
			"prefix",
			"prefix",
			"quality",
		],
		
		
		dirk:{
			type:"settings",
			id:"dirk",
			name:["Dirk","Dagger","Kris","Shiv"],
			icon:[
				"dagger1",
				"dagger2",
				"dagger3",
				"dagger4",
				"dagger5",
				"dagger6",
				"dagger7",
			],
			equip:true,
			equipSlot:"hand",
			equipSlotIsPrefix: true,
			value:3,
			rarity:1,
			quality:0,
			element:"pierce",
			
			stat:{patk:10, pacc:.0500, aspd:.1000, },
			norm:{patk: 3, pacc:.0001, aspd:.0020, },
			rand:{patk: 5, pacc:.0001, aspd:.0005, },
		},
		sword:{
			type:"settings",
			id:"sword",
			name:["Blade","Sword","Shortsword","Longsword"],
			icon:[
				"sword1",
				"sword3",
				"sword4",
				"sword5",
				"sword6",
				"sword7",
			],
			equip:true,
			equipSlot:"hand",
			equipSlotIsPrefix:true,
			value:6,
			rarity:3,
			quality:0,
			element:"slash",
			
			stat:{patk:15, pacc:.0500, aspd:.0200, },
			norm:{patk:15, pacc:.0003, aspd:.0018, },
			rand:{patk:15, pacc:.0001, aspd:.0002, },
		},
		club:{
			type:"settings",
			id:"club",
			name:["Club","Mallet","Morning Star","Wrench"],
			icon:[
				"mace1",
				"mace2",
				"mace3",
				"mace5",
				"mace6",
			],
			equip:true,
			equipSlot:"hand",
			equipSlotIsPrefix:true,
			value:7,
			rarity:3,
			quality:0,
			element:"crush",
			
			stat:{patk:25, pacc:.050, aspd:.0200, },
			norm:{patk:16, pacc:.001, aspd:.0010, },
			rand:{patk:15, pacc:.002, aspd:.0001, },
		},
		greatsword:{
			type:"settings",
			id:"gsword",
			name:["Greatsword","Heavy Blade","Katana","Bidenhander", "Claymore", "Broadsword", "Zweihander", ],
			icon:[
				"sword27",
				"sword29",
				"sword30",
				"sword37",
				"sword39",
				"sword42",
				"sword47",
				"sword48",
			],
			equip:true,
			equipSlot:"handRight",
			equipSlotIsPrefix:false,
			value:10,
			rarity:5,
			quality:0,
			element:"slash",
			
			stat:{patk:30, pacc:.040, aspd: .0020, },
			norm:{patk:20, pacc:.001, aspd: .0005, },
			rand:{patk:30, pacc:.001, aspd: .0001, },
		},
		
		
	},
	
	heavyArmor:{
		type:"rules",
		itemType:"Armor",
		id:"eq_gen_hvy",
		
		settings:[
			"helmet",
			"body",
			"legs",
			"gloves",
			"sabatons",
		],
		rolls:[
			"suffix",
			"rare",
			"metal",
			"element",
			"prefix",
			"prefix",
			"prefix",
			"quality",
		],
		
		helmet:{
			type:"settings",
			id:"helm",
			name:["Helmet", "Helm", "Gaze", "Headguard", "Headpiece", "Faceguard", "Visage", ],
			icon:{
				helm17:	70,
				helm18:	50,
				helm31:	20,
				helm77:	10,
				helm84:	10,
			},
			equipSlot:"head",
			
			statGroup:"heavyArmorTypes",
			finalMult:.75,
		},
		body:{
			type:"settings",
			id:"body",
			name:["Body", "Chestpiece", "Greatplate", "Chestguard", "Curiass", "Mail"],
			icon:{
				armor25:	120,
				armor7:		100,
				armor8:		90,
				armor17:	80,
				armor9:		20,
				armor26:	5,
				armor37:	5,
				armor48:	5,
			},
			equipSlot:"body",
			statGroup:"heavyArmorTypes",
			finalMult:1.3,
		},
		legs:{
			type:"settings",
			id:"legs",
			name:["Greaves", "Kilt", "Legs", "Legguards", ],
			icon:{
				leg6:	100,
				leg9:	10,
				leg14:	20,
				leg27: 	10,
				leg28: 	10,
			},
			equipSlot:"legs",
			statGroup:"heavyArmorTypes",
			finalMult:1.2,
		},
		gloves:{
			type:"settings",
			id:"gloves",
			name:["Grips", "Gloves", "Grasps", "Gauntlets", "Fists", "Hands", "Warfists", "Handguards", ],
			icon:[
				"glove1"
			],
			equipSlot:"gloves",
			
			statGroup:"heavyArmorTypes",
			finalMult:0.7,
		},
		sabatons:{
			type:"settings",
			id:"sabs",
			name:["Boots", "Warboots", "Walkers", "Spurs", "Feet", "Sabatons", "Treads", "Stompers", ],
			icon:{
				shoes7:		20,
				shoes8:		200,
				shoes21:	50,
				shoes24:	50,
				shoes40:	10,
				shoes41:	10,
				shoes42:	10,
				shoes44:	30,
				shoes45:	30,
			},
			equipSlot:"feet",
			statGroup:"heavyArmorTypes",
			finalMult:0.7,
		},
		
		
		
		
	},
	
	heavyArmorTypes:{
		type:"bonus",
		equip:true,
		subType:"Heavy",
		statGroup:{
			power:	10, 
			plate:	100, 
			chain:	140, 
		},
		power:{
			type:"bonus",
			id:"power",
			prefix:"Power",
			rarity:25,
			value:31,
			stat:{pdef:.040, mdef:.035, resi:.001, armor:10, 
				res_slash:.040, res_pierce:.040, res_crush:.040, },
			frand:{pdef:.020, mdef:.020, resi:.005, 
				res_slash:.030, res_pierce:.030, res_crush:.030, },
			norm:{armor: 5, shell: 5, patk: 5, pacc: .030, },
		},
		
		plate:{
			type:"bonus",
			id:"plate",
			prefix:"Plate",
			rarity:2,
			value:5,
			stat:{pdef:.060, mdef:.040, resi:.001, armor:40,
				res_slash:.080, res_pierce:.080, res_crush:.020, },
			frand:{pdef:.040, mdef:.030, resi:.005,
				res_slash:.040, res_pierce:.040, res_crush:.040, },
			norm:{armor:20, shell: 5, },
		},
		
		chain:{
			type:"bonus",
			id:"chain",
			prefix:"Chain",
			rarity:1,
			value:4,
			stat:{pdef:.040, mdef:.055, resi:.005, 
				res_slash:.050, res_pierce:.050, res_crush:.100, },
			frand:{pdef:.025, mdef:.030, resi:.005, 
				res_slash:.020, res_pierce:.005, res_crush:.020, },
			norm:{ armor:10, shell:10, rflex: 5, },
		},
		
	},
	
	lightArmor:{
		id:"eq_gen_lite",
		type:"rules",
		itemType:"Armor",
		settings:[
			"helmet",
			"body",
			"legs",
			"gloves",
			"boots",
		],
		rolls:[
			"suffix",
			"rare",
			"element",
			"prefix",
			"prefix",
			"prefix",
			"quality",
		],
		helmet:{
			type:"settings",
			id:"helm",
			name:["Helmet", "Helm", "Gaze", "Headguard", "Headpiece", "Faceguard", "Visage", ],
			icon:{
				helm6:	100,
				helm16:	80,
				helm30:	20,
				helm32:	20,
				helm33:	20,
			},
			equipSlot:"head",
			statGroup:"lightArmorTypes",
			finalMult:.75,
		},
		body:{
			type:"settings",
			id:"body",
			name:["Body", "Chestpiece", "Greatplate", "Chestguard", "Curiass", ],
			icon:{
				armor2:		100,
				armor3:		80,
				armor4:		70,
				armor10:	10,
				armor21:	10,
			},	
			equipSlot:"body",
			
			statGroup:"lightArmorTypes",
			finalMult:1.3,
		},
		legs:{
			type:"settings",
			id:"legs",
			name:["Greaves", "Kilt", "Legs", "Legguards", ],
			icon:{
				leg1: 100,
				leg2: 50,
				leg21: 10,
				leg23: 10,
				leg25: 10,
				leg41: 10,
			},
			equipSlot:"legs",
			statGroup:"lightArmorTypes",
			finalMult:1.2,
		},
		gloves:{
			type:"settings",
			id:"gloves",
			name:["Grips", "Gloves", "Grasps", "Gauntlets", "Fists", "Hands", "Warfists", "Handguards", ],
			icon:[
				"glove2",
			],
			equipSlot:"gloves",
			statGroup:"lightArmorTypes",
			finalMult:0.7,
		},
		boots:{
			type:"settings",
			id:"boots",
			name:["Boots", "Warboots", "Walkers", "Spurs", "Feet", "Treads", "Stompers", ],
			icon:{
				shoes2:		100,
				shoes3:		80,
				shoes9:		20,
				shoes11:	10,
				shoes27:	10,
				shoes28:	10,
			},
			equipSlot:"feet",
			
			statGroup:"lightArmorTypes",
			finalMult:0.7,
		},
		
		
		
	},
	
	lightArmorTypes:{
		type:"bonus",
		subType:"Light",
		equip:true,
		statGroup:{
			shade:		10,
			leather:	100, 
			kevlar:		80,
		},
		leather:{
			type:"bonus",
			prefix:"Leather",
			id:"leather",
			stat:{pdef:.020, mdef:.025, resi:.001, peva:.050, meva:.050, 
				res_slash:.050, res_pierce:.010, res_crush:.120, },
			frand:{pdef:.015, mdef:.020, resi:.005, peva:.050, meva:.050, 
				res_slash:.020, res_pierce:.005, res_crush:.080, },
			norm:{ armor: 5, shell: 5, rflex:35, intut:25, },
		},
		
		kevlar:{
			type:"bonus",
			prefix:"Kevlar",
			id:"kevlar",
			stat:{pdef:.030, mdef:.035, resi:.001, peva:.040, meva:.040, 
				res_slash:.050, res_pierce:.050, res_crush:.160, },
			frand:{pdef:.015, mdef:.020, resi:.005, peva:.050, meva:.050, 
				res_slash:.020, res_pierce:.020, res_crush:.050, },
			norm:{ armor:15, shell:15, rflex:15, intuit:15, },
		},
		
		shade:{
			type:"bonus",
			prefix:"Shade",
			id:"shade",
			stat:{pdef:.020, mdef:.025, resi:.001, peva:.050, meva:.080, 
				res_slash:.080, res_pierce:.040, res_crush:.080, },
			frand:{pdef:.015, mdef:.020, resi:.005, peva:.050, meva:.040, 
				res_slash:.040, res_pierce:.020, res_crush:.040, },
			norm:{ armor: 5, shell: 5, rflex:35, intuit:35, patk:15, },
		},
	},
	
	rare:{
		type:"roll",
		chance:.01,
		bonuses:{
			silver:		10,
			gold:		5,
			platinum:	2,
		},
		silver:{
			type:"bonus",
			prefix:"Silver-Trimmed",
			rarity:10,
			quality:1,
			value:25,
			stat:{base:3, },
			rand:{base:2, },
		},
		gold:{
			type:"bonus",
			prefix:"Gold-Trimmed",
			rarity:20,
			quality:4,
			value:55,
			
			stat:{base:5, },
			rand:{base:4, },
		},
		platinum:{
			type:"bonus",
			prefix:"Platinum-Trimmed",
			rarity:40,
			quality:9,
			value:95,
			
			stat:{base:5, }, 
			rand:{base:4, },
		},
	},
	
	prefix:{
		type:"roll",
		chance:.15,
		rarity:5,
		value:4,
		bonuses:{
			strong:		10,
			tact:		10,
			agile:		10,
			lively:		10,
			smart:		10,
			wise:		10,
			
			powerful:	8,
			skilled:	8,
			ingenius:	8,
			
			breach:		5,
			aegis:		5,
			masters:	5,
			
			ruby:		10,
			jade:		10,
			cobalt:		10,
			amber:		10,
			opal:		10,
			zircon:		10,
			onyx:		10,
		},
		strong:	{ 	prefix: "Strong", 	norm:{str:3,}, },
		tact:	{	prefix: "Tact", 	norm:{dex:3,}, },
		agile:	{ 	prefix: "Agile", 	norm:{agi:3,}, },
		lively:	{ 	prefix: "Lively", 	norm:{vit:3,}, },
		smart:	{ 	prefix: "Smart", 	norm:{mnd:3,}, },
		wise:	{	prefix: "Wise", 	norm:{wis:3,}, },
		
		powerful:	{ rarity:5,	quality:3, prefix:"Powerful", 	norm:{str:3, vit:3, }, },
		skilled:	{ rarity:5,	quality:3, prefix:"Skilled", 	norm:{dex:3, agi:3, }, },
		ingenius:	{ rarity:5,	quality:3, prefix:"Ingenius", 	norm:{mnd:3, wis:3, }, },
		
		breach:	{ rarity:15,	quality:6, prefix:"Breach", 	norm:{str:3, dex:3, mnd:3, }, },
		aegis:	{ rarity:15,	quality:6, prefix:"Aegis", 		norm:{vit:3, agi:3, wis:3, }, },
		masters:{ rarity:15,	quality:6, prefix:"Masters", 	norm:{base:2, }, },
		
		ruby:	{ prefix:"Ruby", 	stat: { res_flame:	.05,}, },
		cobalt:	{ prefix:"Cobalt", 	stat: { res_ice:	.05,}, },
		jade:	{ prefix:"Jade", 	stat: { res_wind:	.05,}, },
		amber:	{ prefix:"Amber", 	stat: { res_elec:	.05,}, },
		opal:	{ prefix:"Opal", 	stat: { res_earth:	.05,}, },
		zircon:	{ prefix:"Zircon", 	stat: { res_holy:	.05,}, },
		onyx:	{ prefix:"Onyx", 	stat: { res_dark:	.05,}, },
	},
	
	element:{
		type:"roll",
		chance:.05,
		
		rarity:15,
		quality:0,
		value:5,
		
		bonuses:{
			fire:		10,
			ice:		10,
			wind:		10,
			earth:		10,
			elec:		10,
			holy:		5,
			dark:		5,
			void:		3,
		},
		fire:{
			type:"bonus",
			prefix:["Flaming", "Volcanic", "Blaze", "Inferno", "Pyre", "Hearth", "Scorching", "Searing"],
			blend:.7,
			color:[
				"#EFAC41",
				"#DE8531",
				"#B32900",
				"#6C1305",
				"#FF8207",
				"#D53D0C",
				"#880606",
			],
			hits:[
				{
					element:"flame",
					stat:"patk",
					statMult:.5,
				},
				{
					element:"flame",
					magical:true,
					stat:"matk",
					statMult:.5,
				},
			],
			fnorm:{res_flame:.05, },
			norm:{str:8, dex:5, mnd:8, patk:15, matk:15, },	
		},
		ice:{
			type:"bonus",
			prefix:["Icy", "Permafrost", "Hail", "Sleet", "Winter", "Glacial", "Frigid", "Frozen"],
			blend:.7,
			color:[
				"#16C1C8",
				"#49CCCC",
				"#7CD7CF",
				"#AEE1D3",
				"#E1ECD6",
			],
			hits:[
				{
					element:"ice",
					stat:"patk",
					statMult:.5,
				},
				{
					element:"ice",
					magical:true,
					stat:"matk",
					statMult:.5,
				},
			],
			fnorm:{res_ice:.05, },
			norm:{vit:8, mnd:5, wis:8, pacc:.002, macc:.002, },	
		},
		wind:{
			type:"bonus",
			prefix:["Windy", "Tempestuous", "Stormy", "Storm", "Gusty", "Tornado", "Gust", "Squall"],
			blend:.7,
			color:[
				"#CCEEAD",
				"#A2CCA3",
				"#8FA788",
				"#63BD9B",
				"#BCBFA6",
				"#83A754",
			],
			hits:[
				{
					element:"wind",
					stat:"patk",
					statMult:.5,
				},
				{
					element:"wind",
					magical:true,
					stat:"matk",
					statMult:.5,
				},
			],
			fnorm:{res_wind:.05, },
			norm:{agi:8, wis:5, dex:8, aspd:.015, cspd:.015, },	
		},
		elec:{
			type:"bonus",
			prefix:["Charged", "Energetic", "Dynamic", "Voltiac", "Juiced", "Sparking", "Thunderbolt"],
			blend:.7,
			color:[
				"#D8B125",
				"#D7882E",
				"#DA5D2C",
				"#746C4B",
			],
			hits:[
				{
					element:"wind",
					stat:"patk",
					statMult:.5,
				},
				{
					element:"wind",
					magical:true,
					stat:"matk",
					statMult:.5,
				},
			],
			fnorm:{res_elec:.05, },
			norm:{dex:8, str:5, agi:8, crit:.015, aspd:.015, },	
		},
		earth:{
			type:"bonus",
			prefix:["Earthen", "Terra", "Gaia", "Vale", "Rocky", "Stone", "Solid", "Petrified"],
			blend:.5,
			color:[
				"#2B5A23",
				"#506D41",
				"#828345",
				"#7A682E",
				"#544218",
				"#C9A54D",
				"#A16C40",
			],
			hits:[
				{
					element:"earth",
					stat:"patk",
					statMult:.5,
				},
				{
					element:"earth",
					magical:true,
					stat:"matk",
					statMult:.5,
				},
			],
			fnorm:{res_earth:.05, },
			norm:{vit:8, str:5, wis:8, pdef:.0015, mdef:.0015, },	
		},
		holy:{
			type:"bonus",
			prefix:["Heavenly", "Holy", "Exalted", "Divine", "Angelic", "Hallowed"],
			blend:.7,
			color:[
				"#FFF5CB",
				"#FDF392",
				"#DBC06D",
				"#FFFFB7",
				"#FFE6B5",
			],
			hits:[
				{
					element:"holy",
					stat:"patk",
					statMult:.65,
				},
				{
					element:"holy",
					magical:true,
					stat:"matk",
					statMult:.65,
				},
			],
			fnorm:{res_holy:.01, },
			norm:{base:8, pdef:.0015, mdef:.0015, },	
		},
		dark:{
			type:"bonus",
			prefix:["Evil", "Corrupt", "Wicked", "Vile", "Sinful", "Hallowed"],
			blend:.7,
			color:[
				"#39264D",
				"#312B58",
				"#253258",
				"#4A0820",
				"#40094C",
				"#360050",
				"#6F5D64",
				"#604750",
				"#583E43",
			],
			hits:[
				{
					element:"dark",
					stat:"patk",
					statMult:.65,
				},
				{
					element:"dark",
					magical:true,
					stat:"matk",
					statMult:.65,
				},
			],
			fnorm:{res_dark:.01, },
			norm:{base:8, patk:3, matk:3, },	
		},
		void:{
			type:"bonus",
			prefix:["Ethereal", "Celestial", "Astral", "Ghostly", "Spiritual", "Breach"],
			blend:.7,
			color:[
				"#EEF5F9",
				"#D1EEFB",
				"#BBEAFB",
				"#76D0E3",
				"#049DBF",
				"#048ABF",
				"#035AA6",
			],
			hits:[
				{
					element:"void",
					stat:"patk",
					statMult:.75,
				},
				{
					element:"void",
					magical:true,
					stat:"matk",
					statMult:.75,
				},
			],
			fnorm:{res_void:.01, },
			norm:{base:10, },	
		},
	},
	
	quality:{
		type:"roll",
		chance:1,
		bonuses:{
			crude: 			200,
			fair: 			180,
			average: 		160,
			fine:			80,
			superior: 		40,
			exquisite:		20,
			magnificant:	10,
			legendary:		5,
			peerless:		1,
		},
		crude:{
			type:"bonus",
			prefix:["Crude", "Rusted", "Broken", "Dented", "Moldy", "Stinky", "Rotten", "Awful", "Atrocious", "Pathetic"],
			blend:.6,
			color:[
				"#7A6458",
				"#815138",
				"#94512F",
				"#A94D1F",
			],
			rarity:1,
			quality:0,
			value:2,
			statMult:.75,
			
		},
		fair:{
			type:"bonus",
			prefix:["Fair", "Used", "Inferior", "Dented", "Poor", "Substandard", "Lousy"],
			blend:.3,
			color:[
				"#7A6458",
				"#815138",
				"#94512F",
				"#A94D1F",
			],
			rarity:3,
			quality:0,
			value:5,
			statMult:.90,
			
		},
		average:{
			type:"bonus",
			prefix:["Average", "Mass Produced", "Tolerable", "Satisfactory", "Standard", "Decent"],
			blend:.3,
			color:[
				"#C0C0C0",
				"#D2D2D2",
				"#CDB79E",
				"#9A916B",
			],
			rarity:5,
			quality:0,
			value:8,
			statMult:1.00,
		},
		fine:{
			type:"bonus",
			prefix:["Fine", "Swell", "+1", "Refined", "Keen"],
			blend:.6,
			color:[
				"#C0C0C0",
				"#D2D2D2",
				"#CDB79E",
				"#9A916B",
			],
			rarity:7,
			quality:0,
			value:8,
			statMult:1.05,
			
		},
		superior:{
			type:"bonus",
			prefix:["Superior", "Able", "Dandy", "Hype", "Slick", "Radical"],
			blend:.3,
			color:[
				"#FFFFCC",
				"#FFCCFF",
				"#CCFFFF",
				"#FFCCCC",
				"#CCFFCC",
				"#CCCCFF",
			],
			rarity:9,
			quality:0,
			value:12,
			statMult:1.10,
			
		},
		exquisite:{
			type:"bonus",
			prefix:["Exquisite", "Fancy", "Noble",  "Stellar", "Capital", ],
			blend:.6,
			color:[
				"#FFFFCC",
				"#FFCCFF",
				"#CCFFFF",
				"#FFCCCC",
				"#CCFFCC",
				"#CCCCFF",
			],
			rarity:11,
			quality:0,
			value:18,
			statMult:1.15,
			
		},
		magnificant:{
			type:"bonus",
			prefix:["Magnificant", "Righteous", "Fantabulous", "Fantastic", "Impressive"],
			blend:.3,
			color:[
				"#FFFF44",
				"#FF44FF",
				"#44FFFF",
				"#FF4444",
				"#44FF44",
				"#4444FF",
			],
			rarity:15,
			quality:0,
			value:18,
			statMult:1.20,
			
		},
		legendary:{
			type:"bonus",
			prefix:["Legendary", "Sensational", "Marvelous", "Wonderful"],
			blend:.6,
			color:[
				"#FFFF44",
				"#FF44FF",
				"#44FFFF",
				"#FF4444",
				"#44FF44",
				"#4444FF",
			],
			rarity:20,
			quality:1,
			value:23,
			statMult:1.25,
			
		},
		peerless:{
			type:"bonus",
			prefix:["Peerless", "Unmatched", "Unsurpassed", "Unrivaled"],
			blend:1,
			color:[
				"#FFFF00",
				"#FF00FF",
				"#00FFFF",
				"#FF0000",
				"#00FF00",
				"#0000FF",
			],
			rarity:45,
			quality:5,
			value:45,
			statMult:2.5,
			
		},
	},
	
	metal:{
		type:"roll",
		chance:1,
		bonuses:{
			copper:		300,
			bronze:		250,
			iron:		225,
			steel:		200,
			frorium:	100,
			preocium:	80,
			broedian:	60,
			mithril:	40,
			oridecon:	20,
			adamant:	10,
			edril:		5,
			orichalcum:	2,
		},
		copper:{
			type:"bonus",
			prefix:"Copper",
			blend:.5,
			color:[
				"#97402A",
				"#854421",
				"#39281C",
				"#CFA072",
			],
			rarity:1,
			quality:0,
			value:1,
			statMult:.85,
		},
		bronze:{
			type:"bonus",
			prefix:"Bronze",
			blend:.5,
			color:[
				"#FB7200",
				"#E36700",
				"#D66100",
				"#C75A00",
				"#B65200",
			],
			rarity:3,
			quality:0,
			value:2,
			statMult:.80,
		},
		iron:{
			type:"bonus",
			prefix:"Iron",
			blend:.5,
			color:[
				"#c0c0c0",
				"#d2d2d2",
				"#e1e1e1",
			],
			rarity:5,
			quality:0,
			value:4,
			statMult:.85,
		},
		steel:{
			type:"bonus",
			prefix:"Steel",
			blend:.5,
			color:[
				"#f0f0f0",
				"#d2d2d2",
				"#e1e1e1",
			],
			rarity:7,
			quality:0,
			value:6,
			statMult:.90,
		},
		frorium:{
			type:"bonus",
			prefix:"Frorium",
			blend:.5,
			color:[
				"#a1a1ef",
				"#a4b2d3",
				"#b2a4d3",
			],
			rarity:9,
			quality:0,
			value:8,
			statMult:.95,
		},
		preocium:{
			type:"bonus",
			prefix:"Preocium",
			blend:.5,
			color:[
				"#efa1a1",
				"#d3a4b2",
				"#d3b2a4",
			],
			rarity:11,
			quality:0,
			value:10,
			statMult:1.00,
		},
		broedian:{
			type:"bonus",
			prefix:"Broedian",
			blend:.5,
			color:[
				"#a1efa1",
				"#a4d3b2",
				"#b2d3a4",
			],
			rarity:13,
			quality:0,
			value:13,
			statMult:1.05,
		},
		mithril:{
			type:"bonus",
			prefix:"Mithril",
			blend:.5,
			color:[
				"#AAAAB1",
				"#AFB7CB",
				"#CFD3DB",
				"#8C94A9",
				"#77778C",
			],
			rarity:15,
			quality:0,
			value:16,
			statMult:1.10,
		},
		adamant:{
			type:"bonus",
			prefix:"Adamant",
			blend:.75,
			color:[
				"#53ae55",
				"#54bd3c",
				"#4d9f3a",
				"#39ab5e",
				"#06904e",
			],
			rarity:17,
			quality:0,
			value:19,
			statMult:1.15,
		},
		oridecon:{
			type:"bonus",
			prefix:"Oridecon",
			blend:.75,
			color:[
				"#c4e1f2",
				"#2983a6",
				"#5aadbf",
				"#bad9d9",
			],
			rarity:19,
			quality:0,
			value:24,
			statMult:1.20,
		},
		edril:{
			type:"bonus",
			prefix:"Edril",
			blend:.75,
			color:[
				"#7b52c4",
				"#5832ad",
				"#660066",
				"#800080",
				"#6027a9",
			],
			rarity:21,
			quality:0,
			value:30,
			statMult:1.25,
		},
		orichalcum:{
			type:"bonus",
			prefix:"Orichalcum",
			blend:.75,
			color:[
				"#fdbb1d",
				"#fd9b05",
				"#ff8100",
				"#ffe801",
				"#fff4b3",
			],
			rarity:25,
			quality:0,
			value:35,
			statMult:1.30,
		},
	},
		
}


MakeItem = function(ruleName, level, rarityBonus) {
	var rules = itemGenData[ruleName];
	if (!rules) { return "Could not make item, no rule " + ruleName}
	
	var type = rules.type;
	if (type != "rules") { return "cannot use " + type + " object as rules"; }
	if (!level) { level = 0; }
	if (!rarityBonus) { rarityBonus = 0; }
	
	var itemType = getOrChooseString(rules, "settings");
	var path = ruleName + "." + itemType;
	
	var typeSubrule = subrule(rules, itemType);
	if (typeSubrule == null) { 
		console.log("could not find rule [" + itemType + "]");
	}
	
	var item = {
		name: "",
		itemID: rules.id,
		type: rules.itemType,
		subType: rules.itemType + "_" + itemType,
		color: "#FFFFFF",
		quality: 1 + level,
		value: 0,
		rarity: 0,
		hits: [],
		genHistory: [ {path:path},],
	}
	
	//Magic *snort*
	applyBonus(item, typeSubrule, last(item.genHistory), rarityBonus );
	
	var rolls = rules.rolls;
	if (rolls) {
		rolls.each((roll)=>{
			var rollObj = subrule(rules, roll);
			if (rollObj) {
				var aRoll = Random.value();
				var chance = rollObj.num("chance");
				if (aRoll < chance) {
					item.genHistory.push({path: path + "." + roll })
					applyRoll(item, rollObj, last(item.genHistory), rarityBonus );

				}
			} else {
				console.log("Could not find roll [" + roll + "]")
			}
		})
	} else {
		console.log("Could not find any rolls in [" + ruleName + "]")
	}
	if (item.level) { item.level = 0; }
	return item;
}


reapplyHistory = function(item, level) {
	console.log("rebuilding item at level " + level)
	baseStats.each((stat) => { if (item[stat]) { item[stat] = 0; } })
	combatStats.each((stat) => { if (item[stat]) { item[stat] = 0; } })
	combatRatios.each((stat) => { if (item[stat]) { item[stat] = 0; } })
	item.matchingKeys(resistances).each((stat)=>{ if (item[stat]) { item[stat] = 0; } })
	item.matchingKeys(affinities).each((stat)=>{ if (item[stat]) { item[stat] = 0; } })
	
	item.quality = level;
	if (item.level) { item.level = 0; }
	
	item.genHistory.each((h)=>{
		var path = h.path;
		var rolls = h.rolls;
		
		var rule = subrule(path);
		applyBonus(item, rule, h, 0);
	});
	
	if (item.level) { item.level = 0; }
	
}


function subrule(start, key) {
	if (!start) { return null; }
	
	if (isString(start)) {
		var path = start.split('.');
		var obj = itemGenData;
		
		path.each((o)=> {
			if (obj) { obj = obj[o]; }
			if (!obj) { obj = itemGenData[o]; }
		});
		
		return obj;
	}
	
	if (!key) { return null; }
		
	if (start[key] instanceof Object) {
		return start[key]
	}
	
	return itemGenData[key];
}

function multiplyStat(item, stat, mult) {
	var val = item.num(stat);
	if (val > 0) { item[stat] = val * mult; }
	
}

function multiplyStatRule(item, rule, mult) {
	var matches = item.matchingKeys(rule);
	matches.each((k)=> {
		var val = item.num(k);
		if (val > 0) {
			item[k] = val * mult;
		}
	})
}

function multiplyAllStats(item, mult) {
	baseStats.each((stat) => multiplyStat(item, stat, mult));
	combatStats.each((stat) => multiplyStat(item, stat, mult));
	intermediate.each((stat) => multiplyStat(item, stat, mult));
	multiplyStatRule(item, affinities, mult)
}

function hasRule(ruleName) { return itemGenData.has(ruleName); }



function grabObj(b, k) {
	var obj = b[k];
	if (!obj || isArray(obj)) { return null; }
	if (obj instanceof Object) { return obj; }
	return null;
}

function grabArray(b, k) {
	var arr = b[k];
	if (!arr) { return null; }
	if (isArray(arr)) { return arr; }
	return null;
}


function applyBonus(item, bonus, history, rarityBonus) {
	//if (!bonus) { return null; }
	var path = history.path;
	if (!history.rolls) { history.rolls = {} }
	
	var rolls = history.rolls;
	var firstTime = Object.keys(rolls).length == 0;
	if (firstTime) { rolls["didIt_"] = true; }
	
	var level = item.quality;
	
	var stat = grabObj(bonus, "stat");
	var rand = grabObj(bonus, "rand");
	var norm = grabObj(bonus, "norm");
	var frand = grabObj(bonus, "frand");
	var fnorm = grabObj(bonus, "fnorm");
	
	item.quality = level + bonus.num("quality");
	item.value = item.value + level * bonus.num("value");
	item.rarity = item.rarity + bonus.num("rarity");
	
	if (statMult > 0 && statMult != 1) { multiplyAllStats(item, statMult); }
	
	if (firstTime) {
		if (bonus.has("id")) {
			var id = item.itemID;
			item.itemID = id + bonus.id;
		}
		
		var hits = grabArray(bonus, "hits")
		var colors = grabArray(bonus, "color");

		var element = bonus.element;
		var prefix = getOrChooseString(bonus, "prefix");
		var suffix = getOrChooseString(bonus, "suffix");
		var statMult = bonus.num("statMult") || 1;
		var finalMult = bonus.num("finalMult") || 1;

		if (bonus.has("subType")) { item.subType = getOrChooseString(bonus, "subType"); }
		if (bonus.has("name")) { item.name = getOrChooseString(bonus, "name"); }
		if (bonus.has("icon")) { item.icon = getOrChooseString(bonus, "icon"); }
		if (bonus.has("equipSlot")) { item.slot = getOrChooseString(bonus, "equipSlot"); }
		if (bonus.has("equip")) { item.equip = bonus.equip; }
		if (bonus.has("equipSlotIsPrefix")) { item.equipSlotIsPrefix = bonus.equipSlotIsPrefix; }


		if (element && element.length > 1) { item.element = element; }
		if (prefix && prefix.length > 1) { item.name = prefix + " " + item.name; }
		if (suffix && suffix.length > 1) { item.suffix = suffix; }


		if (hits) {
			hits.each((hit)=>{ item.hits.push(hit); });
		}
	}
	
	applyStats(item, "stat", 	stat,	()=>1, 					1,		rolls, 0 );
	applyStats(item, "frand",	frand,	()=>Random.value(), 	1,		rolls, 0 );	
	applyStats(item, "fnorm",	fnorm,	()=>Random.normal(), 	1,		rolls, 0 );
	applyStats(item, "rand", 	rand,	()=>Random.value(),		level, 	rolls, rarityBonus );
	applyStats(item, "norm", 	norm,	()=>Random.normal(),	level,	rolls, rarityBonus );
	
	if (firstTime) {
		var statGroup = getOrChooseString(bonus, "statGroup");
		var statGroupObj = subrule(bonus, statGroup);
		//WE RECURSING, GRAB THE CALLSTACK!
		if (statGroupObj) { 
			item.genHistory.push({path: path + "." + statGroup})
			applyBonus(item, statGroupObj, last(item.genHistory), rarityBonus); 
						  
	  	}
	}
	
	if (finalMult > 0 && finalMult != 1) { multiplyAllStats(item, finalMult); }
	
	
	//if (colors) {
	//	var hex = chooseFrom(colors);
	//	var c1 = toRGBFromHex(hex)
	//	var c2 = toRGBFromHex(item.color)
	//	var c3 = lerp(c1, c2, blend);
	//	item.color = toHexFromRGB(c3)
	//}
	
	
	return item;
}


function applyStats(item, group, stats, randomizer, scale, rolls, rarityBonus) {
	if (stats) {
		stats.each((k,v)=>{ 
			if (!rolls[group]) { rolls[group] = {}; }
			var statGroup = rolls[group];
			
			if (k == "base") {
				baseStats.each((stat)=>{ applyStat(item, stat, v, randomizer, scale, statGroup, rarityBonus); })
			} else {
				applyStat(item, k, v, randomizer, scale, statGroup, rarityBonus);
			}
		})
	}
	return item
} 

function applyStat(item, stat, v, randomizer, scale, statGroup, rarityBonus) {
	if (statGroup.num(stat)) {
		item[stat] = item.num(stat) + v * statGroup.num(stat) * scale;
	} else {
		var roll = randomizer() ;
		item[stat] = item.num(stat) + v * (rarityBonus + roll) * scale;
		statGroup[stat] = roll;
	}
	return item;
}

function applyRoll(item, roll, history, rarityBonus) {
	var firstTime = !history.rolls;
	
	if (firstTime) { 
		history.rolls = {}
		var chance = roll.num("chance");
		if (chance <= 0 || (Random.value() < chance)) {
			applyBonus(item, roll, history, rarityBonus);

			var bonuses = roll.bonuses;
			if (bonuses) {
				var bonusName = chooseFrom(bonuses);
				var bonusObj = subrule(roll, bonusName);

				if (bonusObj) {
					item.genHistory.push({path: history.path + "." + bonusName})
					applyBonus(item, bonusObj, last(item.genHistory), rarityBonus );
				} else {
					console.log("Could not find bonus " + bonusName);
				}

			}
		}
		
	} else {
		applyBonus(item, roll, history, rarityBonus);
	}
	
	return item;
}










