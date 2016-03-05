/**
 * Created by Dan on 3/3/2016.
 */
Template['home'].helpers({
    threadsExist: function(id) {
        return Threads.find({topicId: id}).count() != 0;
    },
    record: function() {
        return Topics.find();
    },
    zeroTopics: function() {
        return Topics.find().count() == 0;
    },
    isAdmin: function() {
        var username = Meteor.user();
        username = username && username.username;
        if (!username) return;
        var user = Userinfo.findOne({username: username});
        var user = user && user.admin;
        return user == true;
    },
    showpm: function() {
        return Session.get("showpm");
    },
    threadNumber: function(_id) {
        return Threads.find({topicId: _id}).count();
    },
    numPosts: function(_id) {
        return Posts.find({topicId: _id}).count();
    },
    lastThread: function(_id) {
        var post = Posts.findOne({topicId: _id},{sort: {createdAt: -1}});
        return post && post.subject;
    },
    lastThreadId: function(_id) {
        var post = Posts.findOne({topicId: _id},{sort: {createdAt: -1}});
        return post && post.threadId;
    },
    lastThreadPageNumber: function (_id) {
        var post = Posts.findOne({topicId: _id},{sort: {createdAt: -1}});
        var threadId = post && post.threadId;
        if (!threadId) return null;
        var posts = Posts.find({threadId: threadId}).count();
        return Math.ceil(posts / 10);
    },
    lastThreadUsername: function(_id) {
        var post = Posts.findOne({topicId: _id},{sort: {createdAt: -1}});
        return post && post.from;
    },
    lastThreadDate: function(_id) {
        var thread = Threads.findOne({topicId: _id},{sort: {createdAt: -1}});
        var threadid = thread && thread._id;
        if (!threadid) return null;
        var post = Posts.findOne({threadId: threadid},{sort: {createdAt: -1}});
        var d = post && post.createdAt;
        if (!d) return null;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    }
});
Template.home.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var topic = $('[name=topic]').val();
        var subject = $('[name=subject]').val();
        Meteor.call('createTopic',topic,subject,function(error, result) {

            if (error) {
                $("#error").html(error.reason);
                return false;
            } else {
                $('[name=to]').val('');
                $('[name=message]').val('');
                Session.set("showpm",false);
                $("#error").html('');
            }
        });
        return false;
    },
    'click .newTopic': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var showpm = Session.get("showpm");
        if (showpm) Session.set("showpm",false);
        else Session.set("showpm",true);
        return false;
    }
});