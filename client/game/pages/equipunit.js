var _slots = [
	"body",
	"head",
	"gloves",
	"legs",
	"hand",
	"accessory",
	"feet"
];
var displayStats = [
	"quality","patk@","pacc%","pdef%","peva%",
	"matk@","macc%","mdef%","meva%",
	"aspd#","cspd#","crit%","resi%",
	"str@","dex@","wis@","agi@","vit@","int@"
];
getAbb = function(stat,value) {
	var num;
	if (stat.suffix("%")) {
		num = (+value * 100)
		return num.toFixed(3) + "%";
	} else if (stat.suffix("#")) {
		num = +value;
		return num.toFixed(3);
	} else if (stat.suffix("@")) {
		num = +value;
		return num.toFixed(0);
	} else {
		num = +value;
	}
	return num;
}
Template.equipunit.helpers({
	slotColor: function(slot) {
		var activeSlot = Session.get("activeSlot");
		
		if (activeSlot == slot) { return "equipmentSelected"; }
		return "equipment";
	},
	selectFirstSlotOnLoad: function() {
		var unit = getUnit();
		if (unit) {
			//console.log(unit);
			var slot = Session.get("activeSlot");
			if (!slot) {
				Session.set("activeSlot", unit.equipmentSlots[0]);
			}
		}
		
	},
	itemsForSlot: function() {
		var activeSlot = Session.get("activeSlot");
	},
	itemFor: function(slot) {
		var unit = getUnit();
		if (unit.equipment[slot]) {
			return unit.equipment[slot];
		}
		return null;
	},
	invItemsForSlot: function() {
		var slot = Session.get("activeSlot");
		var items = Iteminfo.find().fetch();
		var result = [];
		if (!slot) {
			return result; 
		}
		
		items.each((item)=>{
			if (item.equipSlotIsPrefix && slot.prefix(item.slot)) {
				result.push(item);
			} else if (slot == item.slot) {
				result.push(item);
			}
		});
		
		return result;
	},
	slotIcon: function(slot) {
		return slot.replace(/\d/, "");
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
		var unit = getUnit();
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
	upOrDown: function(val,equip) {
		var stat = unSuffix(val);
		var currentItem = Session.get("selectedItem");
		currentItem = Iteminfo.findOne({_id: currentItem});
		if (!currentItem) return null;
		if (currentItem.hasOwnProperty(stat)) {
			if (currentItem[stat] < equip[stat]) return "lowerStat";
			if (currentItem[stat] > equip[stat]) return "higherStat";
		} else { return "lowerStat"; }
	},
	getIncrease: function(val,equip) {
		var stat = unSuffix(val);
		var currentItem = Session.get("selectedItem");
		currentItem = Iteminfo.findOne({_id: currentItem});
		if (!currentItem) return null;
		if (currentItem.hasOwnProperty(stat)) {
			if (currentItem[stat] < equip[stat]) return "-" + getAbb(val,equip[stat] - currentItem[stat]);
			if (currentItem[stat] > equip[stat]) return "+" + getAbb(val,currentItem[stat] - equip[stat]);
		} else { return "-" + getAbb(val,equip[stat]); }
	},
	lostStats: function(obj) {
		var selectedItem = Session.get("selectedItem");
		if (!selectedItem) return null;
		var output = {};
		var item = Iteminfo.findOne({_id: selectedItem});
		if (!item) return null;
		var stat;
		for (var i = 0, j = displayStats.length; i < j; i++) {
			stat = unSuffix(displayStats[i]);
			if (item.hasOwnProperty(stat) && !obj.hasOwnProperty(stat)) {
				output[displayStats[i]] = item[stat];
			}
		}
		/*item.each(function(key, value) {
			if (key != "stacks" && key != "maxStack" && key != "rarity" && key != "quality" && key != "element" && key != "_id" && key != "Iteminfo") {
				if (!obj.hasOwnProperty(key)) {
					var object = {};
					output[key] = value;
				}
			}
		});*/
		return output.toPairRay();
	},
	getStatName: function(stat) {
		if (statName(stat)) return statName(stat);
		return stat;
	},
	getStatAbb2: function(val, equip) {
		var stat = unSuffix(val);
		if (equip.hasOwnProperty(stat)) return statName(stat);
		return null;
	},
	getStatAbb: function(val) {
		var stat = unSuffix(val);
		var s = Session.get("selectedItem");
		var iteminfo = Iteminfo.findOne({_id: s});
		if (itemDB.hasOwnProperty(s)) iteminfo = itemDB[s];
		if (iteminfo.hasOwnProperty(stat)) return statName(stat);
		return null;
	},
	getStat2: function(val,equip) {
		var stat = unSuffix(val);
		return getAbb(val,equip[stat]);
	},
	getStat3: function(stat,val) {
		return getAbb(stat,val);
	},
	getStatNumber: function(val) {
		var stat = unSuffix(val);
		var s = Session.get("selectedItem");
		var iteminfo = Iteminfo.findOne({_id: s});
		if (!iteminfo) return null;
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


Template.equipunit.events({
	"click #setSlot":function(event) {
		if (event.preventDefault) { event.preventDefault(); }
		var slot = event.currentTarget.getAttribute("value")
		if (slot) {
			Session.set("activeSlot", slot);
		}
		return false;
	},
	"click #equip":function(event) {
		var data = {};
		data.unit = getID();
		data.item = event.currentTarget.getAttribute("value")
		data.slot = Session.get("activeSlot");
		
		Meteor.call("equipItem", data)
	},
	'mouseenter .item': function (event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
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

Template.equipunit.onRendered(function(){
	
});