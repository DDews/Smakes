/**
 * Created by Dan on 2/26/2016.
 */
Meteor.startup(function() {
    reCAPTCHA.config({
        publickey: '6LctbBkTAAAAAAA94uRh_4woHAOZbmADPWO8YAbh'
    });
});
Template.login.events({
    'submit form': function() {
        event.preventDefault();
        var submit = $('[name=submit]')[0];
        submit.disabled = true;
        var login = Session.get("form");
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        if (!login) {
            Meteor.loginWithPassword(username, password, function (error) {
                submit.disabled = false;
                if (error) $("#error").html(error.reason);
                else {
                    Meteor.subscribe("messages");
                }
            });
            $('[name=username]').val('');
            $('[name=password]').val('');
        } else {
            var password2 = $('[name=password2]').val();
            if (password != password2) {
                $("#error").html("Passwords do not match.");
                submit.disabled = false;
                return;
            }
            var captchaData = grecaptcha.getResponse();
            Meteor.call('formSubmissionMethod',username, password, captchaData, function(error, result) {
                // reset the captcha
                grecaptcha.reset();

                if (error) {
                    if (error.reason == "missing-input-response")
                        $("#error").html('You must complete the reCAPTCHA.');
                    else $("#error").html('There was an error: ' + error.reason);
                    submit.disabled = false;
                    return;
                } else {
                    Meteor.loginWithPassword(username, password, function (error) {
                        submit.disabled = false;
                        if (error) $("#error").html(error.reason);
                    });
                    Meteor.subscribe("messages");
                    $('[name=username]').val('');
                    $('[name=password]').val('');
                    $('[name=password2]').val('');
                    Session.set("form",false);
                    $("#error").html('');
                    submit.disabled = false;
                }
            });
        }
    },
    'click .login': function(event){
        event.preventDefault();
        $("#error").html('');
        Session.set("form",false);
    },
    'click .register': function(event){
        event.preventDefault();
        $("#error").html('');
        Session.set("form",true);
    }
})
Template['login'].helpers({
    form: function () {
        return Session.get("form");
    }
});