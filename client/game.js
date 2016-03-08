inCombat = function() {
	var data = Gameinfo.findOne();
	return data && data.combat != null;
}

_pause = false;
_inCombat = false;


Template.game.helpers({
	gameInfoExists: function() {
		var data = Gameinfo.findOne();
		if (data) { return true; }
		return false;
	},
	gameInfoUnits: function() {
		var data = Gameinfo.findOne();
		//console.log("gameInfoUnits: " + data)
		return data ? data.units : null;
	},
	combatInfoUnits: function() {
		var data = Combatinfo.findOne();
		//console.log("combatInfoUnits: " + data)
		return data ? data.combatants : null;
	},
	inCombat:  function() {
		var data = Gameinfo.findOne();
		return data && data.combat != null;
	},
	combatRound: function() {
		var data = Combatinfo.findOne();
		return data && (1+data.combo);
	},
	paused: function() {
		return _pause;
	},
	
	startCombatLoop: function() {
		if (_inCombat) { return; }
		var ticks = 0;
		
		var intervalId = setInterval(() => {
			_inCombat = true;
			if (!_pause) {
				ticks += 1;
				var data = {}
				data.time = .2;
				data.sendTime = (new Date()).getTime();

				Meteor.call("elapseTime", data);

				if (Router.current().route.getName() != 'game') {
					clearInterval(intervalId);
					_inCombat = false;
				}
			}
		}, 200); //Interval length
		
	},
	
	combatMessages: function() {
		var data = Combatinfo.findOne();
		if (!data) { return ["no combat data"]; }
		return data.combatlog || ["no messages"];
	},
	fillCombatMessages: function() {
		var data = Combatinfo.findOne();
		var msgs = [];
		if (!data) { msgs = ["no combat data"]; }
		else { msgs = data.combatlog || ["no messages"]; }
		var txt = $("#combatlog");
		
		var msg = "";
		var len = msgs.length;
		var i = 0;
		msgs.each((m)=>{
			msg += m + ((i < len-1) ? "\n" : "");
			i += 1;
			
		});
		
		txt.text(msg)
		txt.scrollTop(txt[0].scrollHeight)
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
		//console.log(data);
		
		
		Meteor.call('startCombat', data)
		return false;
	},
	
	'click #pause': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
		_pause = !_pause;
		var btn = $("#pause");
		
		if (_pause) {
			btn.removeClass("green").addClass("red").text("PAUSED")
		} else {
			btn.addClass("green").removeClass("red").text("pause");
		}
		
		var units = Unitinfo.find().fetch();
		units.each((u) => {
			console.log(u);
		})
		
		
	}
});

Template.game.onRendered( function() {
	
	
	//console.log("fuck " + inCombat() + " " +  Gameinfo.find().count());
	
})