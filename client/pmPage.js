/**
 * Created by Dan on 2/28/2016.
 */
Template['pmPage'].helpers({
    post: function () {
        var data = Messages.findOne({_id: '' + this});
        return data && data.messages;
    },
    target: function () {
        var data = Messages.findOne({_id: '' + this});
        if (data == null) return null;
        var name = data.to;
        if (data.to == Meteor.user().username) name = data.from;
        Meteor.call('markAsRead','' + this);
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
        if (even) return '#40a9ae';
        return '#4DCFD4';
    },
    isEditable: function(_id) {
        return Session.get("editable") == _id;
    },
    exists: function(_id) {
        if (!Messages.findOne({_id: ''+this})) return false;
        return true;
    },
    deleted: function(user, id) {
        var thread = Messages.findOne({_id: '' + this});
        if (!thread) return null;
        return !_.contains(thread.showTo,user);
    },
    getSubject: function(subject) {
        var id = '' + Router.current().params._id;
        var array = Messages.findOne({_id: id});
        if (!array) return null;
        return subject ? subject : 'Re: ' + array.subject;
    }

});
Template.pmPage.events({
    'submit form': function(event) {
        event.preventDefault();
        var submit = $('[name=submit]')[0];
        submit.disabled = true;
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        Meteor.call('sendPMReply','' + this,subject,message,function(error, result) {

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
            }
        });
    },
    'click .replypm': function(event){
        event.preventDefault();
        var toggle = Session.get("showpmreply");
        if (toggle != "top") Session.set("showpmreply",'top');
        else Session.set("showpmreply",null);
    },
    'click .edit': function(event){
        event.preventDefault();
        var num = +event.currentTarget.name;
        if (num == Session.get("editable")) Session.set("editable",null);
        else Session.set("editable",+event.currentTarget.name);
    },
    'click .bottomReply': function(event) {
        var toggle = Session.get("showpmreply");
        if (toggle != "bottom") Session.set("showpmreply",'bottom');
        else Session.set("showpmreply",null);
    },
    'click .deletePM': function(event) {
      event.preventDefault();
        var thread_id = '' + Router.current().params._id;
        Meteor.call("deleteMessage",thread_id, function(error, result) {
            if (error) {
                alert(error.reason);
            }
        });
        Router.go("/inbox");
    },
    'click .submitEdit': function(event){
        event.preventDefault();
        var submit = $('[name=sendedit]')[0];
        submit.disabled = true;
        var post_id = +event.currentTarget.id
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
    },
});