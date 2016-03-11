/**
 * Created by Dan on 2/28/2016.
 */
Template['pmPage'].helpers({
    numChars: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return 400;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 400;
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        return chars;
    },
    correctPage: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return page <= Math.ceil(data.messages.length / 10);
    },
    needFirst: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page != 1;
    },
    needLast: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return page != Math.ceil(data.messages.length / 10);
    },
    threadID: function () {
      return '' + Router.current().params._id;
    },
    needBefore: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - num > 1;
    },
    needAfter: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return page + num < Math.ceil(data.messages.length / 10);
    },
    pageNumber: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page;
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
    lastPage: function() {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return Math.ceil(data.messages.length / 10);
    },
    needFirstElipsis: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - 2 > 2;
    },
    needSecondElipsis: function() {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page + 2 < Math.ceil(data.messages.length / 10) - 1;
    },
    post: function () {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var messages = data && data.messages;
        var page = +Router.current().params.page;
        page = page ? page : 1;
        page -= 1;
        var index = page * 10;
        messages = messages.slice(index,index + 10);
        return messages;
    },
    page: function() {
        var page = +Router.current().params.page;
        return page ? page : 0;
    },
    pages: function() {
        var messages = Messages.findOne({_id: '' + Router.current().params._id});
        return Math.ceil(messages / 10);
    },
    target: function () {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        if (data == null) return null;
        var name = data.to;
        if (data.to == Meteor.user().username) name = data.from;
        Meteor.call('markAsRead','' + Router.current().params._id);
        return name;
    },
    showpmreply: function (position) {
        return Session.get("showpmreply") == position;
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
    isFrom: function(from) {
        return Meteor.user().username == from;
    },
    postColor: function(_id) {
        var even = _id % 2;
        if (even) return 'postOne';
        return 'postTwo';
    },
    isEditable: function(_id) {
        return Session.get("editable") == _id;
    },
    exists: function(_id) {
        if (!Messages.findOne({_id: '' + Router.current().params._id})) return false;
        return true;
    },
    deleted: function(user, id) {
        var thread = Messages.findOne({_id: '' + Router.current().params._id});
        if (!thread) return null;
        return !_.contains(thread.showTo,user);
    },
    getSubject: function(subject) {
        var id = '' + Router.current().params._id;
        var array = Messages.findOne({_id: id});
        if (!array) return null;
        return subject ? subject : 'Re: ' + array.subject;
    },
    urlify: function(message) {
        return urlify(message);
    }

});
Template.pmPage.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var submit = $('[name=submit]')[0];
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        submit.disabled = true;
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        Meteor.call('sendPMReply','' + Router.current().params._id,subject,message,function(error, result) {

            if (error) {
                $("#pmerror").html(error.reason);
                submit.disabled = false;
                return;
            } else {
                $('[name=subject]').val('');
                $('[name=message]').val('');
                Session.set("showpmreply",false);
                $("#pmerror").html('');
                submit.disabled = false;
                var page = +Router.current().params.page;
                page = page ? page : 1;
                if (Math.ceil((data.messages.length + 1) / 10) > page) Router.go("/inbox/" + Router.current().params._id + "/" + Math.ceil((data.messages.length + 1) / 10));
            }
        });
        return false;
    },
    'click .replypm': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var toggle = Session.get("showpmreply");
        $('#pmerror').html('');
        if (toggle != "top") Session.set("showpmreply",'top');
        else Session.set("showpmreply",null);
        return false;
    },
    'click .edit': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var num = +event.currentTarget.name;
        if (num == Session.get("editable")) Session.set("editable",null);
        else Session.set("editable",+event.currentTarget.name);
        return false;
    },
    'click .bottomReply': function(event) {
        var toggle = Session.get("showpmreply");
        $('#pmerror').html('');
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
        var post_id = +event.currentTarget.id;
        var msg = $("[name=editMessage]").val();
        var id = '' + Router.current().params._id;
        Meteor.call("editPM",id,post_id,msg, function(error, result) {
            if (error) {
                submit.disabled = false;
                $("#editError").html(error.reason);
                return;
            }
            else {
                submit.disabled = false;
                Session.set("editable",null);
            }
        });
        return false;
    }
});