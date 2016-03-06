Template.regiondropdown.rendered = function(){
	$("[name=region]").material_select();
	console.log("Rendered");
	
}
Template.regiondropdown.onRendered(function() {
	$("[name=region]").material_select();
	console.log("onRendered");
	
})