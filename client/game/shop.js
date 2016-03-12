var test1 = [
	"sword1",
	"sword2",
	"sword3",
	"sword4",
	"sword5",
	"sword6",
	"dagger6",
	"glove1",
	"glove2",
	"pot_yellow",
	"pot_red",
	"ass",
	"bow6",
	"axe6",
	"katar6",
	"mace6",
	"arrow6",
	"shield6",
	"helm6",
	"armor6",
	"shoes6",
	"leg6",
	"gem6",
	
]
var _slots = [
	"body",
	"head",
	"gloves",
	"legs",
	"hand",
	"accessory"
]

Template.shop.helpers({
	testIcons: function() {
		return itemDB.toPairRay();
	},
	partyMember: function() {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) return null;
		var gameinfo = Gameinfo.findOne({username: username});
		if (!gameinfo) return null;
		var unitId = Session.get("unitId");
		var units = gameinfo.units;
		if (!unitId && units[0]) Session.set("unitId",units[0]);
		var players = [];
		var x;
		for (x = 0; x < units.length; x++) {
			players.push(Unitinfo.findOne({_id: units[x]}));
		}
		return players;
	},
	normalPose: function(poses) {
		if (!poses) return null;
		return poses.normal;
	}
	,
	icon: function(object) {
		return itemDB[object].icon;
	},
	getName: function(value) {
		return value.name;
	},
	getType: function(value) {
		return value.type;
	},
	getBgColor: function(value) {
		var rarity = value.rarity;
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
	slots: function() {
		return _slots;
	},
	equipment: function(slot) {
		var equip = [];
		var unitId = Session.get("unitId");
		var unit = Unitinfo.findOne({_id: unitId});
		if (!unit) return null;
		var equips = unit.equipment;
		for (var property in equips) {
			if (equips.hasOwnProperty(property)) {
				if (property.match(RegExp("^" + slot,"i"))) {
					equip.push(equips[property]);
				}
			}
		}
		return equip.toPairRay();
	},
	equipIcon: function(object) {
		return object.icon;
	},
	getSlot: function(value) {
		if (value.has("slot")) return value.slot;
		return null;
	},
	upOrDown: function(stat,value) {
		var currentItem = Session.get("selectedItem");
		currentItem = itemDB[currentItem];
		if (stat == "desc") return null;
		if (stat == "rarity") return null;
		if (stat == "value") return null;
		if (!currentItem) return null;
		if (currentItem.hasOwnProperty(stat)) {
			if (currentItem[stat] < value) return "lowerStat";
			if (currentItem[stat] > value) return "higherStat";
		}
	},
	getIncrease: function(stat,value) {
		var currentItem = Session.get("selectedItem");
		console.log(currentItem);
		currentItem = itemDB[currentItem];
		if (stat == "desc") return null;
		if (stat == "rarity") return null;
		if (stat == "value") return null;
		if (!currentItem) return null;
		if (currentItem.hasOwnProperty(stat)) {
			if (currentItem[stat] < value) return "-" + fixZeroes(value - currentItem[stat]);
			if (currentItem[stat] > value) return "+" + fixZeroes(currentItem[stat] - value);
		}
	}
});
_event = {};
Template.shop.events({
	'mouseenter .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		var width = $("[name=" + id +"]").width();
		Session.set("selectedItem",id);
		_event[id] = function(event) {
			$("[name=" + id + "]").css({
				position: "absolute",
				display: "inline",
				top: event.clientY + document.body.scrollTop + 20 + "px",
				left: event.clientX + document.body.scrollLeft - (width / 2) + "px"
			});
			$('#' + slot).css({
				position: "absolute",
				display: "inline",
				top: event.clientY + document.body.scrollTop + 20 + "px",
				left: event.clientX + document.body.scrollLeft + (width / 2) + 12 + "px"
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
		$('#' + slot).css({
			display: "none"
		});
		return false;
	}
});