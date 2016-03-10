/**
 * Created by Dan on 3/4/2016.
 */
Template['editTopic'].helpers({
    badId: function () {
        var topicId = '' + Router.current().params._id;
        return Topics.find({_id: topicId}).count() == 0;
    },
    isAdmin: function() {
        var username = Meteor.user();
        username = username && username.username;
        if (!username) return;
        var user = Userinfo.findOne({username: username});
        var user = user && user.admin;
        return user == true;
    },
    moderator: function() {
        var topicId = '' + Router.current().params._id;
        var topic = Topics.findOne({_id: topicId});
        return topic && topic.moderators;
    },
    usernames: function() {
        return Meteor.users.find().fetch().map(function(it) {
            return it.username;
        });
    },
    topicName: function() {
        var topicId = '' + Router.current().params._id;
        var topic = Topics.findOne({_id: topicId});
        return topic && topic.topic;
    },
    notAdmin: function(username) {
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return null;
        return userinfo.admin != true;
    }
});
Template.editTopic.events({
    'click .buttonbig': function(event) {
        if (event.preventDefault) event.preventDefault();
        var username = $('[name=username]').val();
        var submit = $('[name=add]')[0];
        var topicId = '' + Router.current().params._id;
        submit.disabled = true;
        Meteor.call('addModerator',topicId,username, function(error, result) {
            if (error) $('#error').html(error.reason);
            else {
                $('#error').html('');
                $('[name=username]').val('');
            }
        });
        submit.disabled = false;
        return false;
    },
    'click .delete': function(event) {
        if (event.preventDefault) event.preventDefault();
        var username = event.currentTarget.id;
        var topicId = Router.current().params._id;
        Meteor.call("removeMod",topicId,username);
        return false;
    },
    'click .promote': function(event) {
        if (event.preventDefault) event.preventDefault();
        var username = event.currentTarget.id;
        Meteor.call("makeAdmin",username);
        return false;
    },
    'click .demote': function(event) {
        if (event.preventDefault) event.preventDefault();
        var username = event.currentTarget.id;
        Meteor.call("removeAdmin",username);
        return false;
    }
}
);