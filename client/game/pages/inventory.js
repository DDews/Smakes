var _tab = "all";
var _slots = [
	"body",
	"head",
	"gloves",
	"legs",
	"hand",
	"accessory"
]
var displayStats = [
	"quality","patk@","pacc%","pdef%","peva%",
	"matk@","macc%","mdef%","meva%",
	"aspd#","cspd#","crit%","resi%",
	"str@","dex@","wis@","agi@","vit@","int@"
];
Template.inventory.helpers({
	getStackIconBG: (item) => {
		//console.log(item);
		if (itemDB.has(item)) {
			var rarity = Math.floor(itemDB[item].rarity / 10);
			if (rarity < 0) { rarity = 0; }
			if (rarity > 9) { rarity = 9; }
			return "iconbg" + rarity;
		}
		return "iconbg";
	},
	getIconBG: (rarity) => {
		rarity = Math.floor(rarity / 10);
		if (rarity < 0) { rarity = 0; }
		if (rarity > 9) { rarity = 9; }
		return "iconbg" + rarity;
	},
	items: () => { 
		if (_tab == "all") {
			return Iteminfo.find();
		}

		return Iteminfo.find({tab: _tab});
	},
	stacks: () => { 
		var data = Gameinfo.findOne();
		var data = data && data.stacks;
		if (!data) { return null; }
		return data.toPairRay();
	},
	isLocked:function(id) {
		var item = dbget("Iteminfo", id);
		return item && item.locked;
	},
	stackItem: (id) => {
		return itemDB[id];	
	},
	selectedItem: function() {
		var selectedItem = Session.get("selectedItem");
		if (!selectedItem) return null;
		if (itemDB.hasOwnProperty(selectedItem)) return itemDB[selectedItem];
		return Iteminfo.findOne({_id: selectedItem});
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
	equipIcon: function(object) {
		return object.icon;
	},
	getSlot: function(value) {
		if (value.has("slot")) return value.slot;
		return null;
	},
	getName: function(value) {
		return value.name;
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
		return output.toPairRay();
	},
	getStatName: function(stat) {
		if (statName(stat)) return statName(stat);
		return stat;
	},
	getStatAbb: function(val) {
		var stat = unSuffix(val);
		var s = Session.get("selectedItem");
		var iteminfo = Iteminfo.findOne({_id: s});
		if (itemDB.hasOwnProperty(s)) iteminfo = itemDB[s];
		if (iteminfo.hasOwnProperty(stat)) return statName(stat);
		return null;
	},
	getStat: function(val) {
		var stat = unSuffix(val);
		var s = Session.get("selectedItem");
		var iteminfo = Iteminfo.findOne({_id: s});
		if (itemDB.hasOwnProperty(s)) return itemDB[s][stat];
		if (iteminfo.hasOwnProperty(stat)) return getDbStat(val,"Iteminfo",s);
		return null;
	},
	displayStats: function() {
		var s = Session.get("selectedItem");
		if (itemDB.hasOwnProperty(s)) {
			var output = [];
			itemDB[s].each(function(key, value) {
				if(statName(key)) output.push(key);
			});
			return output;
		}
		return displayStats;
	}

});

Template.inventory.events({
	'click #sell': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		if (window.confirm("Are you SURE you want to sell ALL UNLOCKED ITEMS?")) {
			Meteor.call("sellUnlockedItems");
		}
		
		return false;
	},
	'click #uniqueItem': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		//console.log("toggling lock on item")
		var id = event.currentTarget.getAttribute("value");
		
		Meteor.call("toggleUniqueLock", id)
		return false;
	},
	'click #stackItem': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		console.log("TBD: Open dialog for selling stacked items...")
		var id = event.currentTarget.getAttribute("value");
		return false;
	},
	'click #gibsMeDat': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		var data = {};
		data.level = 5;
		data.item = "meleeWeapon";
		Meteor.call('testGiveItem', data);

		
		return false;
	},
	'click #gibsMeDrops': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		var data = {}
		data.table = "standard";
		
		Meteor.call('testGiveDrops', data);
		return false;
	},
	'mouseenter .item': function (event) {
		if (event.preventDefault) event.preventDefault();
		//console.log("wtF");
		var id = event.currentTarget.id;
		//console.log(id);
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		var width = $("[name=tooltip]").width();
		var height = $("[name=tooltip]").height();
		var offset = event.clientX + document.body.scrollLeft + (width / 2) + 12 + "px"
		Session.set("selectedItem", id);
		_event[id] = function (event) {
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
		document.addEventListener('mousemove', _event[id](event), false);
		return false;
	},
	'mouseleave .item': function (event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		//console.log(id);
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		document.removeEventListener('mousemove', _event[id](event), false);
		$("[name=tooltip]").css({
			display: "none"
		});
		$('#' + slot).css({
			display: "none"
		});
		return false;
	},
	
});