inCombat = function() {
	var data = Gameinfo.findOne();
	return data && data.combat != null;
}

_pause = false;
_inCombat = false;


Template['game'].helpers({
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
	findUnit: function(s) {
		return Unitinfo.findOne(s);	
	},
	inCombat:  function() {
		var data = Gameinfo.findOne();
		return data && data.combat != null;
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
				//console.log("tick-"+intervalId+"-"+ticks);
				ticks += 1;
				var data = {}
				data.time = .2;
				data.sendTime = (new Date()).getTime();
				
				Meteor.call("elapseTime", data);
				//console.log("elapsing .2s " + ticks);

				//console.log(Router.current().route.getName());
				if (Router.current().route.getName() != 'game') {
					clearInterval(intervalId);
					_inCombat = false;
				}

				//if (ticks > 10) { clearInterval(intervalId); }
			}
		}, 200);
	},
	combatInfoUnits: function() {
		var data = Combatinfo.findOne();
		//console.log("combatInfoUnits: " + data)
		return data ? data.combatants : null;
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
	cardName: function(id) { 
		var unit = Unitinfo.findOne(id);
		return unit && unit.name;
	},
	
	isPlayer: function(id) {
		var unit = Unitinfo.findOne(id);
		if (!unit) { return false; }
		return unit.team == 'player'
	},
	cardColor: function(id) { 
		var unit = Unitinfo.findOne(id);
		if (!unit) { return "purple"; }
		var team = unit.team;
		if (team == 'player') { 
			return unit.dead() ? "blue-grey" : "blue" 
		}
		return unit.dead() ? "brown" : "deep-orange" ;
	},
	cardHeader: function(id) { 
		var unit = Unitinfo.findOne(id);
		if (!unit) { return "NO UNIT TO MAKE HEADER"; }
		var str = "lv. " + unit.level + " " + unit.race + " " + unit.job + " (" + unit.team + ")";
		return str;
	},
	unitPercentHp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return .5; }
		return Math.floor(unit.hp / unit.mhp * 100);
	},
	unitPercentMp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return .5; }
		return Math.floor(unit.mp / unit.mmp * 100);
	},
	unitPercentSp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return .5; }
		return Math.floor(unit.sp / unit.msp * 100);
	},
	unitPercentExp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return .5; }
		return Math.floor(unit.exp / unit.tnl * 100);
	},
	unitPercentTimer: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return .5; }
		return Math.floor(unit.timer / unit.timeout * 100);
	},
	unitVitalHp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return "hp: 50/100"; }
		return "hp: " + Math.floor(unit.hp) + " / " + unit.mhp;
	},
	unitVitalMp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return "mp: 50/100"; }
		return "mp: " + Math.floor(unit.mp) + " / " + unit.mmp;
	},
	unitVitalSp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return "sp: 50/100"; }
		return "sp: " + Math.floor(unit.sp) + " / " + unit.msp;
	},
	unitVitalExp: function(id) {	
		var unit = Unitinfo.findOne(id);
		if (!unit) { return "exp: 50/100"; }
		return "exp: " + Math.floor(unit.exp) + " / " + unit.tnl;
	},
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