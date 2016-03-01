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
    showpmreply: function () {
        return Session.get("showpmreply");
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
    }
});
Template.pmPage.events({
    'submit form': function(event) {
        event.preventDefault();
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        Meteor.call('sendPMReply','' + this,subject,message,function(error, result) {

            if (error) {
                $("#pmerror").html(error.reason);
                return;
            } else {
                $('[name=subject]').val('');
                $('[name=message]').val('');
                Session.set("showpmreply",false);
                console.log('success!');
                $("#pmerror").html('');
            }
        });
    },
    'click .replypm': function(event){
        event.preventDefault();
        var showpmreply = Session.get("showpmreply");
        if (showpmreply) Session.set("showpmreply",false);
        else Session.set("showpmreply",true);
    },
    'click .edit': function(event){
        event.preventDefault();
        var num = +event.currentTarget.name;
        if (num == Session.get("editable")) Session.set("editable",null);
        else Session.set("editable",+event.currentTarget.name);
    },
    'click .submitEdit': function(event){
        event.preventDefault();
        var post_id = +event.currentTarget.id
        var msg = $("[name=editMessage]").val();
        var id = '' + Router.current().params._id;
        Meteor.call("editPM",id,post_id,msg, function(error, result) {
            if (error) {
                $("#editError").html(error.reason);
                return;
            }
            else {
                Session.set("editable",null);
            }
        });
    }
});