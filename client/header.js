/**
 * Created by Dan on 2/28/2016.
 */
Template['header'].helpers({
        isProfile: function () {
            var data = Session.get("nav");
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
            if (inbox instanceof Array) inbox = inbox[0];
            return inbox == 'inbox';
        },
        isTopic: function() {
            var topic = Session.get("nav");
            if (!topic instanceof Array) topic = Session.get("nav");
            else { topic = topic[0]; id = Session.get("nav")[1]; }
            return topic == 'topic';
        },
        isThread: function() {
            var thread = Session.get("nav");
            var istrue = thread;
            if (!thread instanceof Array) thread = Session.get("nav");
            else thread = thread[0];
            if (thread == 'thread') {
                if (!Threads.findOne({_id: istrue[1]})) return false;
                return true;
            }
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
        }
    }
);