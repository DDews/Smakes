updateImage = function(type) {
	var img = $('#unitImg-' + type);
	var input = $('#unitPose-' + type);
	img.attr('src', input.val());
}


Template.editunit.events({
	'click #send': function() {
		console.log("Updating unit info...");
		//TBD: check for valid inputs...
		
		var data = {};
		
		data.id = Router.current().params._id;
		
		data.name = $("#unitName").val();
		data.race = $("#unitRace").val();
		data.job = $("#unitJob").val();
		
		data.poses = {};
		
		data.poses.normal = $('#unitPose-normal').val();
		data.poses.ded = $('#unitPose-ded').val();
		data.poses.lowHP = $('#unitPose-lowHP').val();
		data.poses.happy = $('#unitPose-happy').val();
		data.poses.hurt = $('#unitPose-hurt').val();
		
		Meteor.call("updateUnitInfo", data);
		Router.go("/game/unit/"+data.id)
	}
})