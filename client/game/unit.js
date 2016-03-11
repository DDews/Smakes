var getID = function() { return Router.current().params._id;  }

var getUnit = function() {
	var id = getID();
	return Unitinfo.findOne({_id: id});
}

var displayStats = [
	"patk","pacc%","pdef%","peva%",
	"matk","macc%","mdef%","meva%",
	"aspd#","cspd#","crit%","resi%",
];

var auxStats = [
	"rhp#", "rmp#", "rsp#",
	"armor", "shell", "tough",
	"rflex", "intut", "sight",
]



Template.unit.helpers({
	statCost: function(stat) {
		var unit = getUnit();
		var statsP = unit.statsPurchased || {};
		var val = statsP[stat] || 0;
		return statUpgradeCost(val, 1);
	},
	statCost10: function(stat) {
		var unit = getUnit();
		var statsP = unit.statsPurchased || {};
		var val = statsP[stat] || 0;
		return statUpgradeCost(val, 10);
	},
	unitExists: function() { return getUnit(); },
	displayStats: function() { return displayStats; },
	auxStats: function() { return auxStats; },
	unitEquip: function() {
		console.log(getUnit());
		return getUnit().equipment.toPairRay();	
	},
	getStat: function(stat) {
		return getDbStat(stat, "Unitinfo", getID());
	},
	setTooltips: function() {
		$('.tooltipped').tooltip({delay: 50});
	},
	
	getCap: function(thing) { return getUnit()["m"+thing] },	
})

Template.unit.rendered = function(){
	//$("[name=region]").material_select();
	console.log("Unit Rendered");
	
}
Template.unit.onRendered(function() {
	$('.tooltipped').tooltip({delay: 50});
	console.log("Unit onRendered");
	
})

var buyStat = function(stat, n) {
	var data = {};
	data.n = n;
	data.stat = stat;
	data.unit = getID();
	Meteor.call("buyStat", data);
}

Template.unit.events({
	'click #plusstr': function(event) { buyStat("str", 1); },
	'click #plusvit': function(event) { buyStat("vit", 1); },
	'click #plusdex': function(event) { buyStat("dex", 1); },
	'click #plusagi': function(event) { buyStat("agi", 1); },
	'click #plusint': function(event) { buyStat("int", 1); },
	'click #pluswis': function(event) { buyStat("wis", 1); },
	
	'click #plus10str': function(event) { buyStat("str", 10); },
	'click #plus10vit': function(event) { buyStat("vit", 10); },
	'click #plus10dex': function(event) { buyStat("dex", 10); },
	'click #plus10agi': function(event) { buyStat("agi", 10); },
	'click #plus10int': function(event) { buyStat("int", 10); },
	'click #plus10wis': function(event) { buyStat("wis", 10); },
})