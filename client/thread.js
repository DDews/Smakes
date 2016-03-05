/**
 * Created by Dan on 3/3/2016.
 */
var _toggle = true;
Template['thread'].helpers({
    topicID: function() {
        return '' + Router.current().params._id;
    },
    pageNumber: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page;
    },
    correctPage: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Threads.find({topicId: '' + Router.current().params._id}).count();
        return page <= Math.ceil(data / 20);
    },
    needFirst: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page != 1;
    },
    needLast: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Threads.find({topicId: '' + Router.current().params._id}).count();
        return page != Math.ceil(data / 20);
    },
    needBefore: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - num > 1;
    },
    needAfter: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Threads.find({topicId: '' + Router.current().params._id}).count();
        return page + num < Math.ceil(data / 20);
    },
    needFirstElipsis: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - 2 > 2;
    },
    needSecondElipsis: function() {
        var data = Threads.find({topicId: '' + Router.current().params._id}).count();
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page + 2 < Math.ceil(data / 20) - 1;
    },
    lastPage: function() {
        var data = Threads.find({topicId: '' + Router.current().params._id}).count();
        return Math.ceil(data / 20);
    },
    lastPost: function(id) {
        return Math.ceil(Posts.find({threadId: id}).count() / 10);
    },
    isFrom: function(id) {
        var posts = Posts.find({threadId: id}).fetch();
        var post = _.last(posts);
        return post && post.from;
    },
    thread: function () {
        var data = Threads.find({topicId: '' + Router.current().params._id},{sort: {modified: -1}}).fetch();
        var page = +Router.current().params.page;
        page = page ? page : 1;
        page -= 1;
        var index = page * 20;
        var messages = data.slice(index,index + 20);
        return messages;
    },
    showpm: function () {
        return Session.get("showpm");
    },
    lastDate: function(id) {
        var posts = Posts.find({threadId: id}).fetch();
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
    myDate: function (d) {
        if (!d) return null;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    numReplies: function(id) {
        return Posts.find({threadId: id}).count() - 1;
    },
    zeroThreads: function() {
        return Threads.find({topicId: '' + Router.current().params._id}).count() == 0;
    },
    pageBefore: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - num;
    },
    pageAfter: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page + num;
    },
    toggle: function() {
        if (_toggle) {
            _toggle = false;
            return 'postOne';
        }
        _toggle = true;
        return 'postTwo';
    },
    hasPriveledges: function() {
        var user = Meteor.user();
        user = user && user.username;
        if (!user) return false;
        var admin = Userinfo.findOne({username: user});
        admin = admin && admin.admin;
        if (admin) return true;
        var topic = '' + Router.current().params._id;
        topic = Topics.findOne({_id: topic});
        var moderators = topic && topic.moderators;
        if (_.contains(moderators,Meteor.user().username)) return true;
        return false;
    },
    isAdmin: function() {
        var user = Meteor.user();
        user = user && user.username;
        if (!user) return false;
        var admin = Userinfo.findOne({username: user});
        return admin && admin.admin;
    }
});
Template.thread.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var message = $('[name=message]').val();
        var submit = $('[name=submit]')[0];
        var subject = $('[name=subject]').val();
        submit.disabled = true;
        Meteor.call('newThread','' + Router.current().params._id,subject,message,function(error, result) {

            if (error) {
                $("#error").html(error.reason);
                submit.disabled = false;
                return false;
            } else {
                $('[name=message]').val('');
                $('[name=subject]').val('');
                Session.set("showpm",false);
                $("#error").html('');
                submit.disabled = false;
            }
        });
        return false;
    },
    'click .newThread': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var showpm = Session.get("showpm");
        if (showpm) Session.set("showpm",false);
        else Session.set("showpm",true);
        Meteor.typeahead.inject();
        return false;
    },
    'click .lock': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        Meteor.call('lockThread',id);
        return false;
    },
    'click .delete': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        if (!confirm('Are you sure you want to delete this thread?')) return;
        Meteor.call('deleteThread',id);
        return false;
    }
});