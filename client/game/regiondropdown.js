Template.regiondropdown.rendered = function(){
	$("[name=region]").material_select();
	console.log("Dropdown Rendered");
	
}
Template.regiondropdown.onRendered(function() {
	$("[name=region]").material_select();
	console.log("Dropdown onRendered");
	
})