///Fixed database of item data
itemDB = {
	pot_red:{
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
		name:"Iron Ore",
		icon:"gem24",
		desc:"Rock chunk containing Iron.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:10,
		rarity:15,
		
	},
	mat_fireCrystal:{
		name:"Fire Crystal",
		icon:"gem16",
		desc:"Crystal of fire.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:50,
		rarity:22,
	},
	mat_waterCrystal:{
		name:"Water Crystal",
		icon:"gem17",
		desc:"Crystal of water.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:50,
		rarity:22,
	},
	mat_airCrystal:{
		name:"Flame Crystal",
		icon:"gem18",
		desc:"Crystal of air.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:50,
		rarity:22,
	},
	mat_earthCrystal:{
		name:"Flame Crystal",
		icon:"gem19",
		desc:"Crystal of earth.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:50,
		rarity:22,
	},
	mat_ruby:{
		name:"Raw Ruby",
		icon:"gem10",
		desc:"Raw, unenchanted ruby",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:100,
		rarity:25,
		
	},
	mat_sapphire:{
		name:"Raw Sapphire",
		icon:"gem11",
		desc:"Raw, unenchanted sapphire.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:100,
		rarity:25,
		
	},
	mat_diamond:{
		name:"Raw Diamond",
		icon:"gem12",
		desc:"Raw, unenchanted diamond.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:100,
		rarity:25,
		
	},
	mat_emerald:{
		name:"Raw Emerald",
		icon:"gem14",
		desc:"Raw, unenchanted emerald.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:100,
		rarity:25,
	},
	mat_topaz:{
		name:"Raw Topaz",
		icon:"gem13",
		desc:"Raw, unenchanted topaz.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:100,
		rarity:25,
	},
	mat_amythest:{
		name:"Raw Amythest",
		icon:"gem5",
		desc:"Raw, unenchanted amythest.",
		type:"Material",
		stacks:true,
		maxStack:0,
		
		value:100,
		rarity:25,
	},
	
	cryst_lesserStr:{
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

for (var k in itemDB) {
	itemDB[k].id = k;
}

///Shop tabs
shop = {
	general: ["pot_red", "pot_red_elixer", "mat_ironOre", 
			 "cryst_lesser_str", "eq_starter_sword"],
}

///Drop datas
dropData = {
	standard: { type: "all", drops: [
		"basicMats",
		"equipment", 
		"elementalCrystals",
		"rareGems",
	]},
	template: { type: "all", drops:[
		{item: "a", 			chance: 0.00, qty: 1},
	]},
	elementalCrystals: { type: "all", drops:[
		{item: "mat_fireCrystal",	chance: 0.05, qty: 1},
		{item: "mat_airCrystal",	chance: 0.05, qty: 1},
		{item: "mat_waterCrystal",	chance: 0.05, qty: 1},
		{item: "mat_earthCrystal",	chance: 0.05, qty: 1},
	]},
	basicMats: { type: "all", drops:[
		{item: "mat_ironOre", 		chance: 0.05, qty: 40},
	]},
	rareGems: {type: "all", drops:[
		{item: "mat_ruby", 		chance: 0.01, qty: 1},
		{item: "mat_sapphire", 	chance: 0.01, qty: 1},
		{item: "mat_emerald", 	chance: 0.01, qty: 1},
		{item: "mat_topaz", 	chance: 0.01, qty: 1},
		{item: "mat_amythest", 	chance: 0.01, qty: 1},
		{item: "mat_diamond", 	chance: 0.01, qty: 1},
	]},
	equipment: { type: "one", drops: [
		{item: "meleeWeapon", 	chance: 0.10, qty: 1},
		{item: "heavyArmor", 	chance: 0.10, qty: 1},
		{item: "lightArmor", 	chance: 0.10, qty: 1},
	]},
}

///Roll a table of drops
///If 'rule' is a string, looks it up inside 'dropData'
///If 'rule' is an object, rolls it.
///Returns a results object of items, and how many to give.
rollDropTable = function(table) {
	if (isString(table)) { rule = findTable(table); }
	if (table) {
		var results = {};
		return doRoll(results, table);
	}
	return null;
}


///Roll a table into a results object.
///Chooses from an array of drops
///Table: table of drops to roll
///table.drops (array of objects or strings) drops to roll.
///table.type (default "all")
///			"all" -> rolls for each object in 'drops'
///			"one" -> chooses one 'drops' and rolls it
function rollTable(results, table) {
	var type = table.xt("type", "all");
	var drops = table.drops;
	if (drops) {
		if (type == "one") {
			var roll = drops.choose();
			doRoll(results, roll);
		} else {
			drops.each((val)=>{
				doRoll(results, val);
			});
		}
	} else {
		console.log("Could not find drops in ")
		console.log(table)
	}
	
	return results;
}

///Roll a single roll into results
///roll is either a string or object
///		object -> object describes item to roll for (item, chance, qty)
///		string -> string describes another table to roll
function doRoll(results, roll) {
	if (isString(roll)) {
		var table = findTable(roll);
		if (table) { rollTable(results, table); }
	} else {
		var dropped = rollForDrops(roll);
		if (dropped > 0) { results[roll.item] = results.num(roll.item) + dropped; }
	}
	return results;
}

///Roll an object describing (item, chance, qty)
///		item -> item to roll for (used in calling function)
///		chance -> chance for each roll to succeed (0...1)
///		qty -> max drops from roll (1...inf)
function rollForDrops(roll) {
	if (roll.chance >= 1) { return roll.qty; }
	else if (roll.chance <= 0) { return 0; }
	
	var dropped = 0; var i;
	for (i = 0; i < roll.qty; i+=1) {
		if (Random.value() <= roll.chance) { dropped += 1; }
	}
	return dropped;
}

///Helper to find rule table
function findTable(rule) { return dropData[rule]; }



