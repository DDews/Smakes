/**
 * Created by Dan on 2/27/2016.
 */
Template['inbox'].helpers({
    numChars: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return 400;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 400;
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        return chars;
    },
    usernameProvided: function() {
        return Router.current().params.username;
    },
    usernames: function() {
        return Meteor.users.find().fetch().map(function(it) {
            return it.username;
        });
    },
    lastPost: function(messages) {
        return Math.ceil(messages.length / 10);
    },
    message: function () {
        return Messages.find();
    },
    showpm: function () {
        if (Router.current().params.username) return true;
        return Session.get("showpm");
    },
    isFrom: function (messages) {
        var post = _.last(messages)
        return post.from;
    },
    marked: function (unread) {
       return _.contains(unread,Meteor.user().username)
    },
    lastDate: function(messages) {
        var post = _.last(messages);
        var d = post.createdAt;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    myDate: function (d) {
            dformat = [(d.getMonth()+1).padLeft(),
                    d.getDate().padLeft(),
                    d.getFullYear()].join('/') +' ' +
                [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    numPosts: function(messages) {
        return messages.length - 1;
    },
    isTo: function(from, to) {
        if (from == Meteor.user().username) return to;
        return from;
    },
    locked: function(showTo) {
        return showTo.length <= 1;
    },
    zeroPosts: function(messages) {
        return Messages.find().fetch().length == 0;
    }
});
Template.inbox.rendered = function() {
    Meteor.typeahead.inject();
};
Template.inbox.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var username = $('[name=to]').val();
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        Meteor.call('sendPM',username,subject,message,function(error, result) {

            if (error) {
                $("#pmerror").html(error.reason);
                return false;
            } else {
                $('[name=to]').val('');
                $('[name=message]').val('');
                Session.set("showpm",false);
                $("#pmerror").html('');
            }
        });
        return false;
    },
    'click .sendpm': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var showpm = Session.get("showpm");
        if (showpm) Session.set("showpm",false);
        else Session.set("showpm",true);
        Meteor.typeahead.inject();
        return false;
    },
    'click .deletePM': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var thread_id = event.currentTarget.id;
        Meteor.call("deleteMessage",thread_id, function(error, result) {
            if (error) {
                alert(error.reason);
            }
        });
        return false;
    }
});