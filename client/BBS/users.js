/**
 * Created by Dan on 3/6/2016.
 */
Template['users'].helpers({
    person: function() {
        var sortby = Session.get("sort");
        if (sortby == "name" || !sortby) return Userinfo.find({},{sort: {username: 1}});
        return Userinfo.find({},{sort: { totalKarma: -1}});
    },
    getKarma: function(username) {
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 0;
        return userinfo.totalKarma ? userinfo.totalKarma : 0;
    },
    getStatus: function(username) {
        var user = Meteor.users.findOne({username: username});
        if (user.status.online) return "onlinestatus";
        return "offlinestatus";
    }
});
Template.users.events({
    'click .sortKarma': function(event) {
        if (event.preventDefaul) event.preventDefault();
        Session.set("sort","karma");
        return false;
    },
    'click .sortName': function(event) {
        if (event.preventDefault) event.preventDefault();
        Session.set("sort","name");
        return false;
    }
});