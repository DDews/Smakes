/**
 * Created by Dan on 3/4/2016.
 */
Template['profile'].helpers({
    modof: function() {
        var username = Router.current().params.username;
        var topics = Topics.find({moderators: username}).fetch();
        var x = 0;
        var array = [];
        for (x = 0; x < topics.length; x++) {
            array.push(topics[x].topic);
        }
        return array;
    },
    getId: function(topicName) {
        var topic = Topics.findOne({topic: topicName});
        return topic && topic._id;
    },
    userExists: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo;
    },
    username: function() {
        var username = Router.current().params.username;
        return username;
    },
    isAdmin: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo && userinfo.admin;
    },
    isMod: function() {
        var username = Router.current().params.username;
        return Topics.find({moderators: username}).count() > 0;
    },
    posts: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        return userinfo && userinfo.posts;
    },
    totalKarma: function() {
        var username = Router.current().params.username;
        var userinfo = Userinfo.findOne({username: username});
        console.log(userinfo);
        if (userinfo && userinfo.totalKarma) return userinfo.totalKarma;
        return 0;
    }
});