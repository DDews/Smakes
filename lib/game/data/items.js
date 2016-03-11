
shop = {
	general: ["pot_red", "pot_red_elixer", "mat_ironOre", 
			 "cryst_lesser_str", "eq_starter_sword"],
}


dropData = {
	standard: {type: "all", drops: ["equipment", "rareGems"]},
	rareGems: {type: "all", drops:[
		{item: "mat_ruby", 		chance: 0.01, rolls: 1},
		{item: "mat_sapphire", 	chance: 0.01, rolls: 1},
		{item: "mat_emerald", 	chance: 0.01, rolls: 1},
		{item: "mat_diamond", 	chance: 0.01, rolls: 1},
	]},
	equipment: { type: "one", drops: [
		{item: "meleeWeapon", 	chance: 0.10, rolls: 1},
		{item: "heavyArmor", 	chance: 0.10, rolls: 1},
		{item: "lightArmor", 	chance: 0.10, rolls: 1},
	]},
	
}


itemDB = {
	pot_red:{
		id:"pot_red",
		name:"Red Potion",
		icon:"pot_red",
		desc:"A bottle containing red liquid",
		type:"Healing",
		stacks:true,
		maxStack:0,
		value: 100,
		rarity: 12,
		
		hp:100,
		
	},
	pot_redElixer:{
		id:"pot_redElixer",
		name:"Red Elixer",
		icon:"pot_orange",
		desc:"A bottle containing bubbling red liquid",
		type:"Healing",
		stacks:true,
		maxStack:0,
		value: 100,
		rarity: 12,
		
		hp:1,
		
	},
	mat_ironOre:{
		id:"mat_ironOre",
		name:"Iron Ore",
		icon:"gem20",
		desc:"Rock chunk containing Iron.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:10,
		rarity:15,
		
	},
	cryst_lesserStr:{
		id:"cryst_lesserStr",
		name:"Lesser Strength Crystal",
		icon:"gem5",
		desc:"Imbues a monster with a little bit of STR",
		type:"MonsterFood",
		stacks:true,
		maxStack:0,
		
		value:1000,
		rarity:22,
		
		str:1,
	},
	eq_starter_sword:{
		id:"eq_starter_sword",
		name:"Wooden Sword",
		icon:"sword2",
		desc:"An ineffective weapon.",
		type:"Equipment",
		slot:"hand",
		
		stacks:false,
		element:"slash",
		
		value: 50,
		rarity:2,
		quality:1,
		
		patk:15,
		pacc:.05,
		aspd:.3,
		
	}
	
}
