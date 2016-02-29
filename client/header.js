/**
 * Created by Dan on 2/28/2016.
 */
Template['header'].helpers({
        unread: function () {
            return Meteor.user() && Messages.find({
                unread: Meteor.user().username
            }).count();
        }
    }
);