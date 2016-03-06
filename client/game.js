

Template['game'].helpers({
	gameInfoExists: function() {
		var data = Gameinfo.findOne();
		console.log(data);
		if (data) { return true; }
		return false;
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
	}
});
