/**
 * Created by Dan on 3/9/2016.
 */
var _toggle = false;
Template['subs'].helpers({
    subscribedAuthor: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return null;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return null;
        var authors = userinfo.authors || {};
        return authors.toPairRay();
    },
    usernames: function() {
        return Meteor.users.find().fetch().map(function(it) {
            return it.username;
        });
    },
    followedThread: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return null;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return null;
        var tracked = userinfo.track;
        return tracked.toPairRay();
    },
    toggle: function() {
        if (_toggle) {
            _toggle = false;
            return 'postOne';
        }
        _toggle = true;
        return 'postTwo';
    },
    isSticky: function(threadId) {
        var thread = Threads.findOne({_id: threadId});
        if(!thread) return false;
        return thread.modified.getTime() == new Date(8640000000000000).getTime();
    },
    subject: function(threadId) {
        var thread = Threads.findOne({_id: threadId});
        if(!thread) return null;
        return thread.subject;
    },
    from: function(threadId) {
        var thread = Threads.findOne({_id: threadId});
        if(!thread) return null;
        return thread.from;
    },
    myDate: function(threadId) {
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return null;
        var d = thread.createdAt;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    numReplies: function(threadId) {
        var posts = Posts.find({threadId: threadId}).count();
        return posts - 1;
    },
    views: function(threadId) {
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return null;
        return thread.views;
    },
    lastPost: function(threadId) {
        Math.ceil(Posts.find({threadId: threadId}).count() / 10);
    },
    isFrom: function(threadId) {
        var posts = Posts.find({threadId: threadId}).fetch();
        var post = _.last(posts);
        return post && post.from;
    },
    lastDate: function(threadId) {
        var posts = Posts.find({threadId: threadId}).fetch();
        var post = _.last(posts);
        var d = post && post.createdAt;
        if (!d) return null;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    followedThreads: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return false;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return false;
        return !jQuery.isEmptyObject(userinfo.track);
    },
    checked: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return null;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return null;
        if (userinfo.sendemail) return "checked";
    },
    getEmail: function() {
        var emails = Meteor.user().emails;
        if (!emails instanceof Array) return null;
        return emails[0].address;
    }
});
Template.subs.events({
    'click #submit': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var author = $('[name=author]').val();
        Meteor.call("followAuthor",author);
        return false;
    },
    'click .delThread': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var threadId = event.currentTarget.id;
        Meteor.call("track",threadId);
        return false;
    },
    'click .remove': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var author = event.currentTarget.id;
        Meteor.call("removeAuthor",author);
        return false;
    },
    'click #emailme': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var checked = $('#emailme').is(":checked");
        Meteor.call("emailMe",checked);
        return false;
    },
    'click #save': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var email = $('[name=email]').val();
        if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            $('#error').html("Invalid email");
            return;
        }
        Meteor.call("updateEmail",email, function(error, result) {
            if (error) {
                $('#error').html(error.reason);
                return false;
            }
            else {
                $('#error').html('Updated');
            }
        });
        return false;
    }
});