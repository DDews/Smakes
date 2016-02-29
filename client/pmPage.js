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
    }
});
Template.pmPage.events({
    'submit form': function() {
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
    }
});