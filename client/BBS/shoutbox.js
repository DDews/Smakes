Template['shoutbox'].helpers({
    isShown: function() {
        var hidden = Session.get("hideShout");
        if (hidden) return false;
        return true;
    },
    hideOrShow: function() {
        var hidden = Session.get("hideShout");
        if (hidden) return "show";
        return "hide";
    },
    shoutMessage: function() {
        return Shoutmessages.find();
    },
    scrollBottom: function() {
        var height;
        $(".shoutbox").each( function()
        {
            var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
            height = scrollHeight - this.clientHeight;
            if (this.scrollTop == height) setTimeout(function() { $(".shoutbox").each( function()
            {
                var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
                this.scrollTop = scrollHeight - this.clientHeight;
            }); }, 100);
        });
        console.log("see?");
    },
    maxChars: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return 100;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 100;
        var karma = userinfo.totalKarma || 0;
        var chars = 100 + 5 * karma;
        return chars;
    },
    getDate: function(d) {
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    }
});
Template.shoutbox.events({
    'submit form': function (event) {
        if (event && event.preventDefault) event.preventDefault();
        var submit = $('[name=send]')[0];
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        submit.disabled = true;
        var message = $('[name=shout]').val();
        Meteor.call('sendShout', message, function (error, result) {

            if (error) {
                $("#shouterror").html(error.reason);
                submit.disabled = false;
                return;
            } else {
                $('[name=shout]').val('');
                $("#shouterror").html('');
                submit.disabled = false;
            }
        });
        return false;
    },
    'click .hideShout': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var hidden = Session.get("hideShout");
        if (hidden) Session.set("hideShout",false);
        else Session.set("hideShout",true);
        setTimeout(function() { $(".shoutbox").each( function()
        {
            var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
            this.scrollTop = scrollHeight - this.clientHeight;
        }); }, 200);
    }
});