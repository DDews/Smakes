inCombat = function() {
	var data = Gameinfo.findOne();
	return data && data.combat != null;
}


Template['game'].helpers({
	gameInfoExists: function() {
		var data = Gameinfo.findOne();
		if (data) { return true; }
		return false;
	},
	gameInfoUnits: function() {
		var data = Gameinfo.findOne();
		console.log("gameInfoUnits: " + data)
		return data ? data.units : null;
	},
	findUnit: function(s) {
		return Unitinfo.findOne(s);	
	},
	inCombat:  function() {
		var data = Gameinfo.findOne();
		return data && data.combat != null;
	},
	startCombatLoop: function() {
		var ticks = 0;
		var units = Unitinfo.find().fetch();
		var intervalId = setInterval(() => {
			//console.log("tick-"+intervalId+"-"+ticks);
			ticks += 1;
			units.each((u)=> {
				u.combatUpdate(.1)
				var wid = "" + (100 * u.percentage("timer", "timeout")) + "%";
				//console.log("unit " + u._id + " update: " + wid);
				$("#"+u._id+"timer").width(wid);
			})
			
			//if (ticks > 10) { clearInterval(intervalId); }
		}, 100);
	},
	combatInfoUnits: function() {
		var data = Combatinfo.findOne();
		console.log("combatInfoUnits: " + data)
		return data ? data.combatants : null;
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

Template.game.onRendered( function() {
	
	
	//console.log("fuck " + inCombat() + " " +  Gameinfo.find().count());
	
})