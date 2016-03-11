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
		var val = unit[stat];
		return statUpgradeCost(val);
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

var buyStat = function(stat) {
	var data = {};
	data.stat = stat;
	data.unit = getID();
	Meteor.call("buyStat", data);
}

Template.unit.events({
	'click #plusstr': function(event) { buyStat("str"); },
	'click #plusvit': function(event) { buyStat("vit"); },
	'click #plusdex': function(event) { buyStat("dex"); },
	'click #plusagi': function(event) { buyStat("agi"); },
	'click #plusint': function(event) { buyStat("int"); },
	'click #pluswis': function(event) { buyStat("wis"); },
})