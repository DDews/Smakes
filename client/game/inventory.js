var _tab = "all";


Template.inventory.helpers({
	items: () => { 
		if (_tab == "all") {
			console.log("All Items: " + Iteminfo.find().count())
			return Iteminfo.find();
		}
		
		console.log(tab + " Items: " + Iteminfo.find({tab: _tab}).count())
		return Iteminfo.find({tab: _tab});
	},
	stacks: () => { 
		var data = Gameinfo.findOne();
		if (!data.stacks) { return null }
		return data.stacks.toPairRay();
	},
	stackItem: (id) => {
		return itemDB[id];	
	},
	
});

Template.inventory.events({
	'click #gibsMeDat': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		var data = {};
		data.level = 5;
		data.item = "meleeWeapon";
		Meteor.call('testGiveItem', data);
		
		console.log("Ur mom lol");
		
		return false;
	},
	'click #gibsMeDrops': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		var data = {}
		data.table = "standard";
		
		Meteor.call('testGiveDrops', data);
		return false;
	}
	
	
});