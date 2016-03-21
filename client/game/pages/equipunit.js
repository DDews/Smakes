
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
			console.log("wtf" + slot);
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
});

Template.equipunit.onRendered(function(){
	
});