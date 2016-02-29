/**
 * Created by Dan on 2/26/2016.
 */
Template.footer.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});