var getID = function() { return Router.current().params._id;  }

var getUnit = function() {
	var id = getID();
	return Unitinfo.findOne({_id: id});
}

var displayStats = [
	"patk","pacc%","pdef%","peva%",
	"matk","macc%","mdef%","meva%",
	"aspd","cspd","crit%","resi%",
];

var auxStats = [
	"rhp#", "rmp#", "rsp#",
	"armor", "shell", "tough",
	"rflex", "intut", "sight",
]



Template.unit.helpers({
	displayStats: function() { return displayStats; },
	auxStats: function() { return auxStats; },
	
	getStat: function(stat) { 
		var num = 0;
		if (thing.suffix("%")) {
			stat = unSuffix(stat)
			num = (getUnit()[stat] * 100)
			return num.toFixed(3) + "%";
		} else if (stat.suffix("#")) {
			stat = unSuffix(stat);
			num = getUnit()[stat]
			return num.toFixed(3);
	   	} else {
			num = getUnit()[stat];
		}
		return num;
	},
	
	getCap: function(thing) { return getUnit()["m"+thing] },	
})

Template.unit.rendered = function(){
	//$("[name=region]").material_select();
	console.log("Unit Rendered");
	
}
Template.unit.onRendered(function() {
	$('.tooltipped').tooltip({delay: 50});
	console.log("Unit onRendered");
	
})