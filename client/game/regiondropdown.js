Template.regiondropdown.rendered = function(){
	$("[name=region]").material_select();
	console.log("Dropdown Rendered");
	
}
Template.regiondropdown.onRendered(function() {
	$("[name=region]").material_select();
	console.log("Dropdown onRendered");
	
})


Template.regiondropdown.helpers({
	regionLevel: function(region) {
		return region.level;
	},
	ifSelected: function(key) {
		var lastRegion = Session.get("lastRegion");
		if (lastRegion == key) return "selected";
		return null;
	}
});