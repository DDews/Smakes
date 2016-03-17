getID = function() { return Router.current().params._id;  }

getUnit = function() {
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

var unitHelpers = {
	userOwns: function(id) {
		var username = Meteor.user();
		username = username && username.username;
		if (!username) { return false };
		
		var unit = Unitinfo.findOne(id);
		return (unit.username == username && unit.team == 'player');
	},
	
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
	unitExists: function(id) { return Unitinfo.findOne(id); },
	displayStats: function() { return displayStats; },
	auxStats: function() { return auxStats; },
	unitEquip: function() {
		return getUnit().equipment.toPairRay();	
	},
	getStat: function(stat) {
		return getDbStat(stat, "Unitinfo", getID());
	},
	setTooltips: function() {
		$('.tooltipped').tooltip({delay: 50});
	},
	getBgColor: function(value) {
		var rarity = value;
		if (rarity < 10) return "r1-10";
		if (rarity < 20) return "r10-20";
		if (rarity < 30) return "r20-30";
		if (rarity < 40) return "r30-40";
		if (rarity < 50) return "r40-50";
		if (rarity < 60) return "r50-60";
		if (rarity < 70) return "r60-70";
		if (rarity < 80) return "r70-80";
		if (rarity < 90) return "r80-90";
		if (rarity < 100) return "r90-100"
		return "r90-100";
	},
	getCap: function(thing) { return getUnit()["m"+thing] },	
}

Template.unit.helpers(unitHelpers);
Template.editunit.helpers(unitHelpers);
//
//Template.unit.rendered = function(){ }
//Template.unit.onRendered(function() { $('.tooltipped').tooltip({delay: 50}); })



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
	'mouseenter .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var width = $("[name=" + id +"]").width();
		_event[id] = function(event) {
			var left;
			if (event.clientX + $(window).scrollLeft() + (width / 2) > $(window).width()) left = $(window).width() - width - 12;
			else left = event.clientX + $(window).scrollLeft() - (width / 2);
			if (event.clientX + $(window).scrollLeft() - (width / 2) < 0) left = 0;
			$("[name=" + id + "]").css({
				position: "absolute",
				display: "inline",
				top: event.clientY + $(window).scrollTop() + 20,
				left: left
			});

		};
		document.addEventListener('mousemove',_event[id](event),false);
		return false;
	},
	'mouseleave .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		document.removeEventListener('mousemove',_event[id](event),false);
		$("[name=" + id + "]").css({
			display: "none"
		});
		return false;
	}
})