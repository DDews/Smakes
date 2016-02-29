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
})