/**
 * Created by Dan on 3/4/2016.
 */
Template['controlpanel'].helpers({
    numChars: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return 400;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 400;
        var karma = userinfo.totalKarma || 0;
        var chars = 200 + 10 * karma;
        return chars;
    },
    getSignature: function () {
        var user = Meteor.user();
        var username = user && user.username;
        if (!username) return null;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return null;
        return userinfo.signature;

    },
    isAdmin: function() {
        var user = Meteor.user();
        var username = user && user.username;
        if (!username) return false;;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo && userinfo.admin;
    }
});
Template.controlpanel.events({
	'click #purgeGame' : function() {
		if (event.preventDefault) event.preventDefault();
		Meteor.call("purgeGame");
		return false;
	},
	'click #purgeCombat' : function() {
		if (event.preventDefault) event.preventDefault();
		Meteor.call("purgeCombat");
		return false;
	},
	
	
    'click .buttoncolor': function(event){
        if (event.preventDefault) event.preventDefault();
        var submit = $('[name=submit]')[0];
        submit.disabled = true;
        var signature = $('[name=signature]').val();
        var newpassword = $('[name=newpassword]').val();
        var newpassword2 = $('[name=newpassword2]').val();
        var stringpassword = $('[name=password]').val();
        var password = Package.sha.SHA256(stringpassword)
        var user = Meteor.user();
        var username = user && user.username;
        if (!username) return null;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return null;
        var oldsignature = userinfo.signature;
        if (signature != oldsignature) {
            Meteor.call("setSignature",signature,password, function(error, result) {
                if (error) {
                    $('#error').html(error.reason);
                    submit.disabled = false;
                    return false;
                }
                else {
                    $('#error').html('Updated');
                    return false;
                }
            });
        }
        if (newpassword) {
            if (newpassword != newpassword2) {
                $('#error').html("New passwords don't match");
                submit.disabled = false;
                return false;
            } else {
                Accounts.changePassword(stringpassword,newpassword, function (error) {
                    if (error) $('#error').html(error.reason);
                    else {
                        $('[name=newpassword]').val('');
                        $('[name=newpassword2]').val('');
                        $('[name=password]').val('');
                        $('#error').html('Updated');
                    }
                });
            }
        }
        submit.disabled = false;
        return false;
    },
	'click #purgeAllCombats': function(event) {
		if (event.preventDefault) event.preventDefault();
		Meteor.call("purgeAllCombats");
		return false;
	},
    'click #dropGameDB': function(event) {
        if (event.preventDefault) event.preventDefault();
        Meteor.call("dropGameDB");
        return false;
    },
    'click #gitPull': function(event) {
        if (event.preventDefault) event.preventDefault();
        Meteor.call("gitPull");
        return false;
    },
});