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
var _arraysize = {

}
Template.shop.helpers({
	testIcons: function() {
		var items = itemDB.toPairRay();
		//var items2 = itemDB.toPairRay();
		var x = 0;
		for (x = 0; x < 7; x++) {
			items = items.concat(items);
		}
		return items;
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
	getBgColor2: function(key) {
		var rarity = key.rarity;
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
		} else { return "lowerStat"; }
	},
	getIncrease: function(stat,value) {
		var currentItem = Session.get("selectedItem");
		currentItem = itemDB[currentItem];
		if (stat == "desc") return null;
		if (stat == "rarity") return null;
		if (stat == "value") return null;
		if (!currentItem) return null;
		if (currentItem.hasOwnProperty(stat)) {
			if (currentItem[stat] < value) return "-" + fixZeroes(value - currentItem[stat]);
			if (currentItem[stat] > value) return "+" + fixZeroes(currentItem[stat] - value);
		} else { return "-" + fixZeroes(value); }
	},
	selectedItem: function() {
		var selectedItem = Session.get("selectedItem");
		if (selectedItem) return itemDB[selectedItem];
	},
	lostStats: function(obj) {
		var selectedItem = Session.get("selectedItem");
		if (!selectedItem) return null;
		var output = {};
		var item = itemDB[selectedItem];
		item.each(function(key, value) {
			if (key != "stacks" && key != "maxStack" && key != "rarity" && key != "quality" && key != "element") {
				if (!obj.hasOwnProperty(key)) {
					var object = {};
					output[key] = value;
				}
			}
		});
		console.log(output);
		return output.toPairRay();
	},
	getStatName: function(stat) {
		if (statName(stat)) return statName(stat);
		return stat;
	}
});
_event = {};
Template.shop.events({
	'mouseenter .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		var width = $("[name=tooltip]").width();
		var height = $("[name=tooltip]").height();
		var offset = event.clientX + document.body.scrollLeft + (width / 2) + 12 + "px"
		Session.set("selectedItem",id);
		_event[id] = function(event) {
			var left;
			if (event.clientX + document.body.scrollLeft + (width / 2) > $(window).width()) left = $(window).width() - width - 12;
			else left = event.clientX + document.body.scrollLeft - (width / 2);
			if (event.clientX + document.body.scrollLeft - (width / 2) < 0) left = 0;
			var top = event.clientY + document.body.scrollTop + 20;
			var top2 = top;
			if (event.clientY + document.body.scrollTop + 20 + $('#' + slot).height() > $(document).height()) {
				top = event.clientY + document.body.scrollTop - height - 10;
				top2 = event.clientY + document.body.scrollTop - $('#' + slot).height() - 10;
			}
			$("[name=tooltip]").css({
				position: "absolute",
				display: "inline",
				top: top + "px",
				left: left + "px"
			});
			if (left + (2 * width) + 12 > $(window).width()) offset = left - 12 - width + "px";
			else offset = left + width + 12 + "px";
			$('#' + slot).css({
				position: "absolute",
				display: "inline",
				top: top2 + "px",
				left: offset
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
		$("[name=tooltip]").css({
			display: "none"
		});
		$('#' + slot).css({
			display: "none"
		});
		return false;
	}
});