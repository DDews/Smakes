/**
 * Created by Dan on 3/3/2016.
 */
var _toggle = false;
Template['post'].helpers({
    threadId: function() {
      return '' + Router.current().params._id;
    },
    postID: function() {
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
        var data = Posts.find({threadId: '' + Router.current().params._id}).count();
        return page <= Math.ceil(data / 10);
    },
    needFirst: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page != 1;
    },
    needLast: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Posts.find({threadId: '' + Router.current().params._id}).count();
        return page != Math.ceil(data / 10);
    },
    needBefore: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - num > 1;
    },
    needAfter: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Posts.find({threadId: '' + Router.current().params._id}).count();
        return page + num < Math.ceil(data / 10);
    },
    needFirstElipsis: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - 2 > 2;
    },
    needSecondElipsis: function() {
        var data = Posts.find({threadId: '' + Router.current().params._id}).count();
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page + 2 < Math.ceil(data / 10) - 1;
    },
    lastPage: function() {
        var data = Posts.find({threadId: '' + Router.current().params._id}).count();
        return Math.ceil(data / 10);
    },
    isFrom: function(id) {
        var user = Meteor.user();
        user = user && user.username;
        var admin = Userinfo.findOne({username: user});
        admin = admin && admin.admin;
        if (admin) return true;
        var threadId = '' + Router.current().params._id;
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return null;
        var topicId = thread.topicId;
        var topic = Topics.findOne({_id: topicId});
        topic = topic && topic.moderators;
        if (_.contains(topic,user)) return true;
        return Meteor.user().username == id;
    },
    message: function () {
        var data = Posts.find({threadId: '' + Router.current().params._id},{sort: {createdAt: 1}}).fetch();
        var page = +Router.current().params.page;
        page = page ? page : 1;
        page -= 1;
        var index = page * 10;
        var messages = data.slice(index,index + 10);
        return messages;
    },
    showpm: function () {
        return Session.get("showpm");
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
    zeroPosts: function() {
        return Posts.find({threadId: '' + Router.current().params._id}).count() == 0;
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
    isEditable: function(id) {
        return Session.get("editable") == id;
    },
    showpmreply: function(position) {
        return Session.get("showpmreply") == position;
    },
    getPosts: function(name) {
        var info = Userinfo.findOne({username: name});
        var posts = info && info.posts;
        return posts;
    },
    notLocked: function() {
        var threadId = '' + Router.current().params._id;
        var thread = Threads.findOne({_id: threadId});
        var locked = thread && thread.locked;
        return !locked;
    },
    isLocked: function () {
        var threadId = '' + Router.current().params._id;
        var thread = Threads.findOne({_id: threadId});
        var locked = thread && thread.locked;
        return locked;
    },
    shouldAdmin: function(username) {
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return false;
        return userinfo.admin;
    },
    shouldMod: function(username) {
        var threadId = '' + Router.current().params._id;
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return false;
        var topicId = thread.topicId;
        var topic = Topics.findOne({_id: topicId});
        if (!topic) return false;
        return _.contains(topic.moderators,username);
    },
    threadExists: function() {
        var threadId = '' + Router.current().params._id;
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return false;
        return true;
    }
});
Template.post.rendered = function() {
    threadId = Router.current().params._id;
    if (!threadId) return;
    if (!Threads.findOne({_id: threadId})) return;
    Meteor.call("increaseView",threadId);
};
Template.post.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var submit = $('[name=submit]')[0];
        var threadId = '' + Router.current().params._id;
        var data = Posts.findOne({threadId: threadId},{sort: {createdAt: 1}});
        var topicId = data.topicId;
        submit.disabled = true;
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        Meteor.call('postReply',topicId,threadId,subject,message,function(error, result) {

            if (error) {
                $("#error").html(error.reason);
                submit.disabled = false;
                return;
            } else {
                $('[name=subject]').val('');
                $('[name=message]').val('');
                Session.set("showpmreply",false);
                $("#error").html('');
                submit.disabled = false;
                var page = +Router.current().params.page;
                page = page ? page : 1;
                data = Posts.find({threadId: threadId}).count();
                if (Math.ceil((data + 1) / 10) > page) Router.go("/posts/" + Router.current().params._id + "/" + Math.ceil((data + 1) / 10));
            }
        });
        return false;
    },
    'click .replytop': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var toggle = Session.get("showpmreply");
        if (toggle != "top") Session.set("showpmreply",'top');
        else Session.set("showpmreply",null);
        return false;
    },
    'click .edit': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var id = event.currentTarget.name;
        if (id == Session.get("editable")) Session.set("editable",null);
        else Session.set("editable",id);
        return false;
    },
    'click .replybottom': function(event) {
        var toggle = Session.get("showpmreply");
        if (toggle != "bottom") Session.set("showpmreply",'bottom');
        else Session.set("showpmreply",null);
        return false;
    },
    'click .deletePM': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        if (!confirm('Are you sure you want to delete this thread?')) return;
        var thread_id = '' + Router.current().params._id;
        Meteor.call("deleteMessage",thread_id, function(error, result) {
            if (error) {
                alert(error.reason);
            }
        });
        Router.go("/inbox");
        return false;
    },
    'click .submitEdit': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var submit = $('[name=submitEdit]')[0];
        submit.disabled = true;
        var post_id = event.currentTarget.id;
        var msg = $("[name=editMessage]").val();
        Meteor.call("editPost",post_id,msg, function(error, result) {
            if (error) {
                submit.disabled = false;
                $("#editError").html(error.reason);
                return false;
            }
            else {
                submit.disabled = false;
                Session.set("editable",null);
            }
        })
        return false;
    }
});