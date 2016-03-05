/**
 * Created by Dan on 2/27/2016.
 */

Meteor.users.deny({
    update: function() { return false },
    remove: function() { return false },
    insert: function() { return false },
});
Messages.deny({
    update: function() { return false; },
    remove: function() { return false; },
    insert: function() { return false; }
});
var scrollToHash = function  (hash, time) {
    time = time || 200;

    // If the link goes to the same (home) page
    if (hash == '/') {
        $('body').animate({
            scrollTop: 0
        }, time);
    }
    else if ($(hash).length) {
        $('body').animate({
            scrollTop: $(hash).offset().top
        }, time);
    }
    else {
        $('body').animate({
            scrollTop: 0
        }, time);
    }
};

Meteor.startup(scrollToHash);