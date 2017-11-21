/**
 * Created by Dan on 2/26/2016.
 */
Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: '6LcluzkUAAAAAFJKVPYtuaqZzEVgLQxQ5Zw8yYRS'
    });
});
Template.login.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
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
                return false;
            }
            var captchaData = reCAPTCHA.getResponse("captcha_widget_id");
            Meteor.call('formSubmissionMethod',username, password, captchaData, function(error, result) {
                // reset the captcha
                reCAPTCHA.reset("captcha_widget_id");

                if (error) {
                    if (error.reason == "missing-input-response")
                        $("#error").html('You must complete the reCAPTCHA.');
                    else $("#error").html('There was an error: ' + error.reason);
                    submit.disabled = false;
                    return false;
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
            return false;
        }
    },
    'click .login': function(event){
        if (event && event.preventDefault) event.preventDefault();
        $("#error").html('');
        Session.set("form",false);
        return false;
    },
    'click .register': function(event){
        if (event && event.preventDefault) event.preventDefault();
        $("#error").html('');
        Session.set("form",true);
        return false;
    }
})
Template['login'].helpers({
    form: function () {
        return Session.get("form");
    }
});
