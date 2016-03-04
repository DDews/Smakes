/**
 * Created by Dan on 2/26/2016.
 */
if (Meteor.isClient) {
    Router.route('/', function () {
        Meteor.subscribe("messages");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("topics");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        this.render('home');
    });
    Router.route('/inbox', {
        name: 'inbox',
        template: 'inbox',
        waitOn: function() {
            return [Meteor.subscribe('messages', this.params._id),
                Meteor.subscribe('usernames', this.params._id)];
        }
    });
    Router.route('/inbox/:_id',
    function() {
        Meteor.subscribe("messages");
        this.render('pmPage', {data: this.params._id});
    });
    Router.route('/inbox/:_id/:page',
    function () {
        Meteor.subscribe("messages");
        this.render('pmPage', {data: this.params._id});
    });
    Router.route('/topic/:_id',
    function() {
       Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        this.render('thread', {data: this.params._id});
    });
    Router.route('/topic/:_id/:page',
        function() {
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            this.render('thread', {data: this.params._id});
    });
    Router.route('/posts/:_id',
        function() {
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            this.render('post',{data: this.params._id});
    });
    Router.route('/posts/:_id/:page',
        function() {
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            this.render('post',{data: this.params._id});
    });
    Router.configure({
        layoutTemplate: "bbs",
        loadingTemplate: "loading",
        notFoundTemplate: "notFound"
    });
}