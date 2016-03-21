Template.summary.helpers({
	showSummary: function() {
		var showsum = Session.get("showSummary");
		return showsum;
	}
})

Template.summary.events({
	"click #resetSummary": function(event) {
		Meteor.call('resetSummary');
	},
	"click .toggleSummary": function(event) {
		if (event.preventDefault) event.preventDefault();
		var showsum = Session.get("showSummary");
		if (!showsum) Session.set("showSummary",true);
		else Session.set("showSummary",false);
		return false;
	}
})