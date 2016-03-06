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
        Session.set("nav","home");
        this.render('home', {data: "home"});
    });
    Router.route('/inbox', function() {
        Meteor.subscribe("messages");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("usernames");
        Session.set("nav","inbox");
        this.render('inbox', {data: "inbox"});
    });
    Router.route('/inbox/:_id',
    function() {
        Meteor.subscribe("messages");
        Session.set("nav",["inbox",this.params._id]);
        this.render('pmPage', {data: ["inbox",this.params._id]});
    });
    Router.route('/inbox/:_id/:page',
    function () {
        Meteor.subscribe("messages");
        Session.set("nav",["inbox",this.params._id]);
        this.render('pmPage', {data: ["inbox",this.params._id]});
    });
    Router.route('/topic/:_id',
    function() {
        Meteor.subscribe("topics");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Session.set("nav",["topic",this.params._id]);
        this.render('thread', {data: ["topic",this.params._id]});
    });
    Router.route('/topic/:_id/:page',
        function() {
            Meteor.subscribe("topics");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            this.render('thread', {data: ["topic",this.params._id]});
    });
    Router.route('/posts/:_id',
        function() {
            Meteor.subscribe("topics");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Session.set("nav",["thread",this.params._id]);
            this.render('post',{data: this.params._id});
    });
    Router.route('/posts/:_id/:page',
        function() {
            Meteor.subscribe("topics");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Session.set("nav",["thread",this.params._id]);
            this.render('post',{data: ["thread",this.params._id]});
    });
    Router.route('/cp', function() {
       Meteor.subscribe("userinfo");
        Session.set("nav","control panel");
        this.render('controlpanel');
    });
    Router.route('/editTopic/:_id',
        function() {
            Meteor.subscribe("topics");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("usernames");
            Session.set("nav",["editTopic",this.params._id]);
            this.render('editTopic');
        });
    Router.route('/profile/:username',
        function() {
            Meteor.subscribe("userinfo");
            Meteor.subscribe("posts");
            Meteor.subscribe("topics");
            Session.set("nav",["profile",this.params.username]);
            this.render('profile');
    });
    Router.route('/pm/:username',
        function() {
            Meteor.subscribe("usernames");
            Meteor.subscribe("userinfo");
            Session.set("nav","inbox");
            this.render('inbox');
        });
    Router.route('/search',
        function() {
            Meteor.subscribe("usernames");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("topics", function() {
                $('select').material_select();
            });
            Session.set("nav","search");
            this.render('search');
    });
	Router.route('/game',
		function() {
			Meteor.subscribe("gamedata");
			Session.set("nav","game");
			this.render('game');
	});
    Router.configure({
        layoutTemplate: "bbs",
        loadingTemplate: "loading",
        notFoundTemplate: "notFound"
    });
    Router.route('/find', function() {
        Meteor.subscribe("usernames");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("topics");
        Meteor.subscribe("posts");
        Session.set("nav","search");
        // this.response.write(body);
        this.render('find');
    });

}