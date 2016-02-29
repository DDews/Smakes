/**
 * Created by Dan on 2/26/2016.
 */
if (Meteor.isClient) {
    Router.route('/', function () {
        Meteor.subscribe("messages");
        this.render('home');
    });
    Router.route('/inbox', {
        name: 'inbox',
        template: 'inbox',
        subscriptions: function() {
            return Meteor.subscribe("messages");
        }
    });
    Router.route('/inbox/:_id',
    function() {
        Meteor.subscribe("messages");
        this.render('pmPage', {data: this.params._id});
    });
    Router.configure({
        layoutTemplate: "bbs",
        loadingTemplate: "loading",
        notFoundTemplate: "notFound"
    });
}