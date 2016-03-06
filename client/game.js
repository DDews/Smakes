

Template['game'].helpers({
	gameInfoExists: function() {
		var data = Gameinfo.findOne();
		if (data) { return true; }
		return false;
	},
	gameInfoUnits: function() {
		var data = Gameinfo.findOne();
		console.log(data)
		return data ? data.units : null;
	},
	findUnit: function(s) {
		return Unitinfo.findOne(s);	
	},
	inCombat: function() {
		var data = Gameinfo.findOne();
		return data.combat != null;
	},
	generateName: japaneseName,
});

Template.game.events({
	'click #newGame': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
		var data = {}
		data.name = $("#unitName").val()
		data.job = $("#unitJob").val()
		console.log($("#unitName"))
		console.log(data);
		
		Meteor.call('newGame', data)
		
		return false
	},
	
	'click #startCombat': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
		var data = {}
		data.region = $("#region").val()
		console.log(data);
		
		
		
		
		
		Meteor.call('startCombat', data)
		return false;
	}
});