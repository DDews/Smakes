/**
 * Created by Dan on 2/27/2016.
 */
var displayStats = [
    "quality","patk@","pacc%","pdef%","peva%",
    "matk@","macc%","mdef%","meva%",
    "aspd#","cspd#","crit%","resi%",
    "str@","dex@","wis@","agi@","vit@","int@"
];
Template['inbox'].helpers({
    numChars: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return 400;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 400;
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        return chars;
    },
    usernameProvided: function() {
        return Router.current().params.username;
    },
    usernames: function() {
        return Meteor.users.find().fetch().map(function(it) {
            return it.username;
        });
    },
    lastPost: function(messages) {
        return Math.ceil(messages.length / 10);
    },
    message: function () {
        return Messages.find();
    },
    showpm: function () {
        if (Router.current().params.username) return true;
        return Session.get("showpm");
    },
    isFrom: function (messages) {
        var post = _.last(messages)
        return post.from;
    },
    marked: function (unread) {
       return _.contains(unread,Meteor.user().username)
    },
    lastDate: function(messages) {
        var post = _.last(messages);
        var d = post.createdAt;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    myDate: function (d) {
            dformat = [(d.getMonth()+1).padLeft(),
                    d.getDate().padLeft(),
                    d.getFullYear()].join('/') +' ' +
                [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    numPosts: function(messages) {
        return messages.length - 1;
    },
    isTo: function(from, to) {
        if (from == Meteor.user().username) return to;
        return from;
    },
    locked: function(showTo) {
        return showTo.length <= 1;
    },
    zeroPosts: function(messages) {
        return Messages.find().fetch().length == 0;
    },
    items: function() {
        return Iteminfo.find({username: Meteor.user().username}).fetch();
    },
    isSelected: function(itemid) {
        if (Session.get("clickedItem") == itemid) return "selectedDiv";
        return null;
    },
    selectedItem: function() {
        var selectedItem = Session.get("selectedItem");
        if (!selectedItem) return null;
        return Iteminfo.findOne({_id: selectedItem});
    },
    displayStats: function() {
        return displayStats;
    },
    getBgColor: function(value) {
        var rarity = value;
        if (rarity < 10) return "r1-10";
        if (rarity < 20) return "r10-20";
        if (rarity < 30) return "r20-30";
        if (rarity < 40) return "r30-40";
        if (rarity < 50) return "r40-50";
        if (rarity < 60) return "r50-60";
        if (rarity < 70) return "r60-70";
        if (rarity < 80) return "r70-80";
        if (rarity < 90) return "r80-90";
        if (rarity < 100) return "r90-100"
        return "r90-100";
    },
    getStatAbb: function(val) {
        var stat = unSuffix(val);
        var s = Session.get("selectedItem");
        var iteminfo = Iteminfo.findOne({_id: s});
        if (itemDB.hasOwnProperty(s)) iteminfo = itemDB[s];
        if (iteminfo.hasOwnProperty(stat)) return statName(stat);
        return null;
    },
    getStat: function(val) {
        var stat = unSuffix(val);
        var s = Session.get("selectedItem");
        var iteminfo = Iteminfo.findOne({_id: s});
        if (itemDB.hasOwnProperty(s)) return itemDB[s][stat];
        if (iteminfo.hasOwnProperty(stat)) return getDbStat(val,"Iteminfo",s);
        return null;
    },
    attachedItems: function() {
        var attach = Session.get("attach");
        if (typeof attach == "undefined") return null;
        var list = [];
        attach.each(function(item,count) {
            if (Iteminfo.findOne({_id: item}) != null) list.push(Iteminfo.findOne({_id: item}));
        });
        if (typeof list[0] == 'undefined') return null;
        return list;
    },
    resetAttachments: function() {
        Session.set("attach",null);
    }
});
Template.inbox.rendered = function() {
    Meteor.typeahead.inject();
};
Template.inbox.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var username = $('[name=to]').val();
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        var attachments = Session.get("attach");
        Meteor.call('sendPM',username,subject,message,attachments,function(error, result) {

            if (error) {
                $("#pmerror").html(error.reason);
                return false;
            } else {
                $('[name=to]').val('');
                $('[name=message]').val('');
                Session.set("showpm",false);
                $("#pmerror").html('');
            }
        });
        return false;
    },
    'click .sendpm': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var showpm = Session.get("showpm");
        if (showpm) Session.set("showpm",false);
        else Session.set("showpm",true);
        Meteor.typeahead.inject();
        return false;
    },
    'click .addInventory': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        $('#attachmenu').openModal();
    },
    'click .deletePM': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var thread_id = event.currentTarget.id;
        Meteor.call("deleteMessage",thread_id, function(error, result) {
            if (error) {
                alert(error.reason);
            }
        });
        return false;
    },
    'click .item': function(event) {
        var id = event.currentTarget.id;
        var slot = id.split(' ')[1];
        id = id.split(' ')[0];
        Session.set("clickedItem",id);
        $('[name=price]').val(Iteminfo.findOne({_id: id}).value);
    },
    'mouseenter .item': function (event) {
        if (event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        var slot = id.split(' ')[1];
        id = id.split(' ')[0];
        var width = $("[name=tooltip]").width();
        var height = $("[name=tooltip]").height();
        Session.set("selectedItem", id);
        _event[id] = function (event) {
            var left;
            if (event.clientX + document.body.scrollLeft + (width / 2) > $(window).width()) left = $(window).width() - width - 12;
            else left = event.clientX + document.body.scrollLeft - (width / 2);
            if (event.clientX + document.body.scrollLeft - (width / 2) < 0) left = 0;
            var top = event.clientY + 10;
            /*if (event.clientY + document.body.scrollTop > $(document).height()) {
                top = event.document.body.scrollTop - height - 10;
            }*/
            $("[name=tooltip]").css({
                position: "fixed",
                display: "inline",
                top: top + "px",
                left: left + "px"
            });
        };
        document.addEventListener('mousemove', _event[id](event), false);
        return false;
    },
    'mouseleave .item': function (event) {
        if (event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        //console.log(id);
        var slot = id.split(' ')[1];
        id = id.split(' ')[0];
        document.removeEventListener('mousemove', _event[id](event), false);
        $("[name=tooltip]").css({
            display: "none"
        });
        return false;
    },
    'click #attach': function(event) {
        if (event.preventDefault) event.preventDefault();
        var attach = Session.get("attach") || {};
        var clicked = Session.get("clickedItem");
        attach[clicked] = {
            from: Meteor.user().username,
            price: $('[name=price]').val(),
            bought: false
        };
        console.log(attach);
        Session.set("attach", attach);
        $('#attachmenu').closeModal();
    }
});