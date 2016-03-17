inCombat = function() {
	var data = Gameinfo.findOne();
	return data && data.combat != null;
}

_pause = false;
_inCombat = false;
_retry = false;

_turnsDone = {};


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
	gameSummary: function() {
		var data = Gameinfo.findOne();
		if (!data) { return null; }
		return data.summary;
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
	paused: function() { return _pause; },
	retry: function() { return _retry; },
	retryAndNotInCombat: function() { return _retry && !_inCombat; },
	gameFatigue: function() {
		var data = Gameinfo.findOne();
		if (!data) { return 0; }
		return data.fatigue;	
	},
	gameFatigueColor: function() {
		var data = Gameinfo.findOne();
		if (!data) { return "purple"; }
		return data.fatigue ? "red" : "green";
	},
	gameStamina: function() { 
		var data = Gameinfo.findOne();
		if (!data) { return 0; }
		return data.stamina || 0;
	},
	gameMaxStamina: function() { 
		var data = Gameinfo.findOne();
		if (!data) { return 20; }
		return data.maxStamina || 20;
	},
	gameRetryTime: function() {
		var data = Gameinfo.findOne();
		var time = 5;
		if (data) {
			time = data.retryTime || 5;
		}
		return time.toFixed(2);
	},
	gameRetryTimeout: function() {
		var data = Gameinfo.findOne();
		if (!data) { return 0; }
		return data.retryTimeout || 0;
	},
	gameRetryTimeoutPercent: function() {
		var data = Gameinfo.findOne();
		var inKombat = data && data.combat != null;
		if (inKombat || !_retry) { return 0; }
		
		var data = Gameinfo.findOne();
		if (!data) { return .5; }
		var retryTime = data.retryTime || 5;
		var retryTimeout = data.retryTimeout || 2.5;
		
		return Math.floor(retryTimeout / retryTime * 100);
	},
	startRetryLoop: function() {
		if (!_retry) {
			console.log("not retrying combats...");
			return;
		}
		var ticks = 0;
		var intervalId = setInterval(() => {
			if (!_retry || _inCombat) { 
				clearInterval(intervalId); 
				return; 
			}
			ticks += 1;
			var data = {};
			Meteor.call("elapseRetryTime", data);
			if (Router.current().route.getName() != 'game') {
				clearInterval(intervalId);
			}
			
		}, 200); //interval length
		
	},
	startCombatLoop: function() {
		if (_inCombat) { 
			console.log("combatAlreadyRunning")
			return;
		}
		
		var ticks = 0;
		
		var intervalId = setInterval(() => {
			_inCombat = true;
			if (!_pause) {
				ticks += 1;
				var data = {};
				
				var combatinfo = Combatinfo.findOne();
				if (combatinfo) {
					combatinfo.hits.each((hit) => {
						if (!_turnsDone[hit.turn]) {
							_turnsDone[hit.turn] = ticks;
							//console.log("handled messages for turn " + ticks)
							
							hit.each((_id, data) => {
								if (_id != "turn") {
									//console.log(_id);
									//console.log(data);
									var elem = $("#"+_id+"img");
									//console.log(elem)
									
									showDamage(elem, data.text, data.color, data.bgimg)
								}
							})
							
						}
					})
					
					Meteor.call("elapseTime", data);
				} else {
					console.log("combat ended");
					clearInterval(intervalId);
					_inCombat = false;
				}
				

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
		
		if (txt) {
			var msg = "";
			var len = msgs.length;
			var i = 0;
			msgs.each((m)=>{
				msg += m + ((i < len-1) ? "\n" : "");
				i += 1;

			});

			txt.text(msg)
			if (txt[0]) {
				txt.scrollTop(txt[0].scrollHeight)
			}
		}
	},
	generateName: japaneseName,
});

Template.game.events({
	'click #makeItem': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		Meteor.call('testMakeItem');
		return false;
	},
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
	'click #inventory': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		Router.go("inventory")
		return false;
	},
	
	'click #startCombat': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
		var data = {}
		data.region = $("#region").val();
		data.first = true;
		Session.set("lastRegion",data.region);
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
	},
	
	'click #retry': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
		_retry = !_retry;
		var btn = $("#retry");
		
		if (_retry) {
			btn.removeClass("darken-4").addClass("darken-1").text("Autofight: On")
		} else {
			btn.addClass("darken-4").removeClass("darken-1").text("Autofight: Off");
		}
	},
		
		
	'click #run': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
		Meteor.call('runAway');
	},
	'click #shop': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		
	}
		
		
	
});