Template.unitcard.helpers({
	inCombat:  function() {
		var data = Gameinfo.findOne();
		return data && data.combat != null;
	},
	
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
})