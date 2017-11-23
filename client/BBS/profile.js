/**
 * Created by Dan on 3/4/2016.
 */
Template['profile'].helpers({
    modof: function() {
        var username = Router.current().params.username;
        var topics = Topics.find({moderators: username}).fetch();
        var x = 0;
        var array = [];
        for (x = 0; x < topics.length; x++) {
            array.push(topics[x].topic);
        }
        return array;
    },
    getId: function(topicName) {
        var topic = Topics.findOne({topic: topicName});
        return topic && topic._id;
    },
    userExists: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo;
    },
    username: function() {
        var username = Router.current().params.username;
        return username;
    },
    isAdmin: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo && userinfo.admin;
    },
    notAdmin: function() {
      var username = Router.current().params.username;
      var userinfo = Userinfo.findOne({username: username});
      if (userinfo) return !userinfo.admin;
      return false;
    },
    isMod: function() {
        var username = Router.current().params.username;
        return Topics.find({moderators: username}).count() > 0;
    },
    posts: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo && userinfo.posts;
    },
    totalKarma: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        if (userinfo && userinfo.totalKarma) return userinfo.totalKarma;
        return 0;
    },
    toggleFollow: function(author) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return "Subscribe";
        var userinfo = Userinfo.findOne({username: username});
        var authors = userinfo.authors;
        if (!authors) return "Subscribe";
        if (authors.has(author)) return "Unsubscribe";
        return "Subscribe";
    },
    isOnline: function() {
        var name = Router.current().params.username;
        var user = Meteor.users.findOne({username: name});
        if (user.status && user.status.online) return "Online";
        return "Offline";
    }
});
Template.profile.events({
    'click .Subscribe': function(event) {
        if (event.preventDefault) event.preventDefault();
        var author = event.currentTarget.id;
        Meteor.call("followAuthor", author);
        return false;
    },
    'click .Unsubscribe': function(event) {
        if (event.preventDefault) event.preventDefault();
        var author = event.currentTarget.id;
        Meteor.call("removeAuthor", author);
        return false;
    },
    'click .promote': function(event) {
      if (event.preventDefault) event.preventDefault();
      var user = Meteor.user();
      var username = user & user.username;
      if (!username) return;
      Meteor.call("makeAdmin",Router.current().params.username);
    },
    'click .demote': function(event) {
      if (event.preventDefault) event.preventDefault();
      var user = Meteor.user();
      var username = user & user.username;
      if (!username) return;
      Meteor.call("removeAdmin",Router.current().params.username);
    }
});
