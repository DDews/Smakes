/**
 * Created by Dan on 2/26/2016.
 */
if (Meteor.isClient) {
    Router.route('/', function () {
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("usernames");
        Meteor.subscribe("messages");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("topics");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Session.set("nav","home");
        this.render('home', {data: "home"});
    });
    Router.route('/inbox', function() {
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("messages");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Meteor.subscribe("usernames");
        Meteor.subscribe("inventory");
        Session.set("nav","inbox");
        this.render('inbox', {data: "inbox"});
    });
    Router.route('/inbox/:_id', function() {
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("usernames");
        Meteor.subscribe("messages", function () {
        });
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Meteor.subscribe("inventory");
        Meteor.subscribe("allInventory");
        Session.set("nav",["inbox",this.params._id]);
        this.render('pmPage', {data: ["inbox",this.params._id]});
    });
    Router.route('/inbox/:_id/:page', function () {
        Meteor.subscribe("usernames");
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("messages");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Meteor.subscribe("inventory");
        Session.set("nav",["inbox",this.params._id]);
        this.render('pmPage', {data: ["inbox",this.params._id]});
    });
    Router.route('/topic/:_id', function() {
        Meteor.subscribe("usernames");
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("topics");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("messages");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Session.set("nav",["topic",this.params._id]);
        this.render('thread', {data: ["topic",this.params._id]});
    });
    Router.route('/topic/:_id/:page',
        function() {
            Meteor.subscribe("usernames");
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("topics");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("messages");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            this.render('thread', {data: ["topic",this.params._id]});
    });
    Router.route('/posts/:_id',
        function() {
            Meteor.subscribe("usernames");
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("topics");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("messages");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts", function () {
                Meteor.call("countViewed",this.params._id);
            });
            Session.set("nav",["thread",this.params._id]);
            this.render('post',{data: this.params._id});
    });
    Router.route('/posts/:_id/:page',
        function() {
            Meteor.subscribe("usernames");
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("topics");
            Meteor.subscribe("messages");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Session.set("nav",["thread",this.params._id]);
            this.render('post',{data: ["thread",this.params._id]});
    });

    Router.route('/cp', function() {
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("usernames");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Session.set("nav","control panel");
        this.render('controlpanel');
    });
    Router.route('/editTopic/:_id',
        function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("topics");
            Meteor.subscribe("messages");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("usernames");
            Session.set("nav",["editTopic",this.params._id]);
            this.render('editTopic');
        });
    Router.route('/subscriptions',
        function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("topics");
            Meteor.subscribe("messages");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("usernames");
            Session.set("nav","subscriptions");
            this.render('subs');
        });

    Router.route('/profile/:username',
        function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("messages");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("topics");
            Session.set("nav",["profile",this.params.username]);
            this.render('profile');
    });
    Router.route('/pm/:username',
        function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
            Meteor.subscribe("inventory");
            Session.set("nav","inbox");
            this.render('inbox');
        });
    Router.route('/search',
        function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
            Meteor.subscribe("topics", function() {
                $('select').material_select();
            });
            Session.set("nav","search");
            this.render('search');
    });
	/*Router.route('/game',
		function() {
      var user = Meteor.user();
      Meteor.subscribe("smakes");
      Meteor.subscribe("apple");
      Meteor.subscribe("shoutmessages");
      Meteor.subscribe("usernames");
      Meteor.subscribe("userinfo");
      Meteor.subscribe("posts");
      Meteor.subscribe("games");
      Meteor.subscribe("pixels");
      Meteor.subscribe("deadpixels");
      Meteor.subscribe("messages");
      //Meteor.call("newGame");
			Session.set("nav","game");
			this.render('game');
	});*/
	Router.route('/inventory',
		function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
			Meteor.subscribe("gamedata");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("combatinfo");
            Meteor.subscribe("inventory");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
			Session.set("nav","game");
			this.render('inventory');
	});
	Router.route('/shop',
		function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
			Meteor.subscribe("gamedata");
			Meteor.subscribe("unitinfo");
			Meteor.subscribe("combatinfo");
			Meteor.subscribe("shopitems");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
			Session.set("nav","shop");
			this.render('shop');
	});
	Router.route('/game/unit/:_id',
		function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
			Meteor.subscribe("unitinfo");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
			Session.set("nav", ["unit", this.params._id]);
			this.render('unit', {data:{id: this.params._id}});
	});
	Router.route('/game/unit/:_id/edit',
		function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
			Meteor.subscribe("unitinfo");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
			Session.set("nav", ["editunit", this.params._id]);
			this.render('editunit', {data:{id: this.params._id}});
	});
	Router.route('/game/unit/:_id/equip',
		function() {
            Meteor.subscribe("shoutmessages");
            Meteor.subscribe("usernames");
			Meteor.subscribe("unitinfo");
			Meteor.subscribe("combatinfo");
			Meteor.subscribe("inventory");
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
			Session.set("nav", ["equipunit", this.params._id]);
			this.render('equipunit', {data:{id: this.params._id}});
	});

    Router.route('/game/recruit',
        function() {
            Meteor.subscribe("userinfo");
            Meteor.subscribe("threads");
            Meteor.subscribe("posts");
            Meteor.subscribe("messages");
			Session.set("nav", ["recruit", this.params._id]);
            this.render('recruit');
    });

    Router.configure({
        layoutTemplate: "bbs",
        loadingTemplate: "loading",
        notFoundTemplate: "notFound"
    });
    Router.route('/find', function() {
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("usernames");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("messages");
        Meteor.subscribe("threads");
        Meteor.subscribe("topics");
        Meteor.subscribe("posts");
        Session.set("nav","search");
        // this.response.write(body);
        this.render('find');
    });
    Router.route('/users/',function() {
        Meteor.subscribe("shoutmessages");
        Meteor.subscribe("messages");
        Meteor.subscribe("usernames");
        Meteor.subscribe("topics");
        Meteor.subscribe("userinfo");
        Meteor.subscribe("threads");
        Meteor.subscribe("posts");
        Session.set("nav","users");
        this.render('users');
    });


	Router.onAfterAction(function(){
		setTimeout(function() {
			console.log("setting " + $('.tooltipped').length + " tooltips");
			$('.tooltipped').tooltip({delay: 10});
		}, 1333);
	});
}
