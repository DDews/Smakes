/**
 * Created by Dan on 2/28/2016.
 */
Template['header'].helpers({
        isProfile: function () {
            var data = Session.get("nav");
            if (data == undefined) return null;
            if (!data instanceof Array) return null;
            if (data[0] == "profile") return data[1];
            else return null;
        },
        unread: function () {
            return Meteor.user() && Messages.find({
                unread: Meteor.user().username
            }).count();
        },
        unreadColor: function () {
            var user = Meteor.user() && Meteor.user().username;
            if (Messages.find({ unread: user}).count() > 0) return 'alarm';
            return 'normal';
        },
        isInbox: function() {
            var inbox = Session.get("nav");
            if (inbox == undefined) return false;
            if (inbox instanceof Array) inbox = inbox[0];
            return inbox == 'inbox';
        },
        isTopic: function() {
            var topic = Session.get("nav");
            if (topic == undefined) return false;
            if (!topic instanceof Array) topic = Session.get("nav");
            else { topic = topic[0]; id = Session.get("nav")[1]; }
            return topic == 'topic';
        },
        isThread: function() {
            var thread = Session.get("nav");
            if (thread == undefined) return false;
            var istrue = thread;
            if (!thread instanceof Array) thread = Session.get("nav");
            else thread = thread[0];
            if (thread == 'thread') {
                if (!Threads.findOne({_id: istrue[1]})) return false;
                return true;
            }
        },
        isSearch: function() {
            return Session.get("nav") == "search";
        },
        isUsers: function() {
            return Session.get("nav") == "users";
        },
        isCP: function() {
            return Session.get("nav") == 'control panel';
        },
        isIndex: function() {
            var index = Session.get("nav");
            return this == 'home';
        },
        threadName: function() {
            var threadId = '' + Session.get("nav")[1];
            var thread = Threads.findOne({_id: threadId});
            return thread && thread.subject;
        },
        topicName: function() {
            var topicId = Session.get("nav")[1];
            var topic = Topics.findOne({_id: topicId});
            return topic && topic.topic;
        },
        messageName: function() {
            var message = '' + Session.get("nav")[1];
            var thread = Messages.findOne({_id: message});
            var messages = thread && thread.messages;
            if (!messages) return null;
            return messages[0].subject;
        },
        id: function() {
            return Session.get("nav")[1];
        },
        topicId: function() {
            var threadId = Session.get("nav")[1];
            var thread = Threads.findOne({_id: threadId});
            var topicId = thread && thread.topicId;
            return topicId;
        },
        getTopicName: function() {
            var threadId = Session.get("nav")[1];
            var thread = Threads.findOne({_id: threadId});
            var topicId = thread && thread.topicId;
            if (!topicId) return null;
            var topic = Topics.findOne({_id: topicId});
            return topic && topic.topic;
        },
        getUsername: function() {
            return Meteor.user() && Meteor.user().username;
        },
        isGame: function() {
            return Session.get("nav") == "game";
        },
        isUnit: function() {
            var session = Session.get("nav");
            if (!session instanceof Array) return null;
            if (session[0] == "unit") return session[1];
            return null;
        },
        isNotGame: function() {
            var session = Session.get("nav");
            if (session == "game") return false;
            if (session instanceof Array && session[0] == "unit") return false;
            return true;
        },
        numNewFollowed: function() {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return "0 new";
            var userinfo = Userinfo.findOne({username: username});
            if (!userinfo) return "0 new";
            var tracked = userinfo.track || {};
            var num = 0;
            var posts;
            tracked.each(function(thread,count) {
                    posts = Posts.find({threadId: thread}).count();
                    if (tracked.has(thread) && posts > tracked[thread]) num += 1;
                }
            );
            var authors = userinfo.authors || {};
            authors.each(function(author,posts) {
                num += posts.length;
            });
            return '' + num + " new";
        },
        followedThread: function() {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return "0 new";
            var userinfo = Userinfo.findOne({username: username});
            if (!userinfo) return null;
            var tracked = userinfo.track || {};
            return tracked.toPairRay();
        },
        followedThreads: function() {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return "0 new";
            var userinfo = Userinfo.findOne({username: username});
            if (!userinfo) return null;
            return !jQuery.isEmptyObject(userinfo.track);
        },
        ifNew: function(threadId) {
            var posts = Posts.find({threadId: threadId}).count();
            var userinfo = Userinfo.findOne({username: Meteor.user().username});
            if (!userinfo) return null;
            var tracked = userinfo.track;
            if (posts > tracked[threadId]) return "new ";
            return null;
        },
        newPosts: function(threadId) {
            var posts = Posts.find({threadId: threadId}).count();
            var userinfo = Userinfo.findOne({username: Meteor.user().username});
            var tracked = userinfo.track;
            return posts - tracked[threadId];
        },
        followedThreadName: function(threadId) {
            var thread = Threads.findOne({_id: threadId});
            if (!thread) return null;
            return thread.subject + " ";
        },
        lastPost: function(threadId) {
            var posts = Posts.find({threadId: threadId}).count();
            return Math.ceil(posts / 10);
        },
        isSubscriptions: function() {
            return Session.get("nav") == "subscriptions";
        },
        followedAuthors: function() {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return false;
            var userinfo = Userinfo.findOne({username: username});
            if (!userinfo) return false;
            var authors = userinfo.authors || {};
            if (Object.keys(authors).length > 0) return true;
            return false;
        },
        followedAuthor: function() {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return false;
            var userinfo = Userinfo.findOne({username: username});
            var authors = userinfo.authors || {};
            return authors.toPairRay();
        },
        ifNewAuthor: function(author) {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return null;
            var userinfo = Userinfo.findOne({username: username});
            var authors = userinfo.authors || {};
            if (authors[author].length > 0) return "new ";
            else return null;
        },
        newAuthorPosts: function(author) {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return false;
            var userinfo = Userinfo.findOne({username: username});
            var authors = userinfo.authors || {};
            return authors[author].length;
        }

    }
);