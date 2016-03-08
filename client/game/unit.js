var getID = function() { return location.href.split('/').pop(); }

var getUnit = function() {
	var id = getID();
	return Unitinfo.findOne(id);
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
	getStat: function(thing) { 
		var num = 0;
		if (thing.suffix("%")) {
			thing = unSuffix(thing)
			num = (getUnit()[thing] * 100)
			return num.toFixed(3) + "%";
		} else if (thing.suffix("#")) {
			thing = unSuffix(thing);
			num = getUnit()[thing]
			return num.toFixed(3);
	   	} else {
			num = getUnit()[thing];
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