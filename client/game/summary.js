Template.summary.helpers({
	
})

Template.summary.events({
	"click #resetSummary": function() {
		Meteor.call('resetSummary');
	},
})