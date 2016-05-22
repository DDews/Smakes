/**
 * Created by Dan on 2/28/2016.
 */
var displayStats = [
    "quality","patk@","pacc%","pdef%","peva%",
    "matk@","macc%","mdef%","meva%",
    "aspd#","cspd#","crit%","resi%",
    "str@","dex@","wis@","agi@","vit@","int@"
];
Template['pmPage'].helpers({
    numChars: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return 400;
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return 400;
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        return chars;
    },
    correctPage: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return page <= Math.ceil(data.messages.length / 10);
    },
    needFirst: function () {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page != 1;
    },
    needLast: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return page != Math.ceil(data.messages.length / 10);
    },
    threadID: function () {
      return '' + Router.current().params._id;
    },
    needBefore: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - num > 1;
    },
    needAfter: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return page + num < Math.ceil(data.messages.length / 10);
    },
    pageNumber: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page;
    },
    pageBefore: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - num;
    },
    pageAfter: function(num) {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page + num;
    },
    lastPage: function() {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        return Math.ceil(data.messages.length / 10);
    },
    needFirstElipsis: function() {
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page - 2 > 2;
    },
    needSecondElipsis: function() {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var page = +Router.current().params.page;
        page = page ? page : 1;
        return page + 2 < Math.ceil(data.messages.length / 10) - 1;
    },
    post: function () {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var messages = data && data.messages;
        var page = +Router.current().params.page;
        page = page ? page : 1;
        page -= 1;
        var index = page * 10;
        messages = messages.slice(index,index + 10);
        return messages;
    },
    page: function() {
        var page = +Router.current().params.page;
        return page ? page : 0;
    },
    pages: function() {
        var messages = Messages.findOne({_id: '' + Router.current().params._id});
        return Math.ceil(messages / 10);
    },
    target: function () {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        if (data == null) return null;
        var name = data.to;
        if (data.to == Meteor.user().username) name = data.from;
        Meteor.call('markAsRead','' + Router.current().params._id);
        return name;
    },
    showpmreply: function (position) {
        return Session.get("showpmreply") == position;
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
    isFrom: function(from) {
        return Meteor.user().username == from;
    },
    postColor: function(_id) {
        var even = _id % 2;
        if (even) return 'postOne';
        return 'postTwo';
    },
    isEditable: function(_id) {
        return Session.get("editable") == _id;
    },
    exists: function(_id) {
        if (!Messages.findOne({_id: '' + Router.current().params._id})) return false;
        return true;
    },
    deleted: function(user, id) {
        var thread = Messages.findOne({_id: '' + Router.current().params._id});
        if (!thread) return null;
        return !_.contains(thread.showTo,user);
    },
    getSubject: function(subject) {
        var id = '' + Router.current().params._id;
        var array = Messages.findOne({_id: id});
        if (!array) return null;
        return subject ? subject : 'Re: ' + array.subject;
    },
    urlify: function(message) {
        return urlify(message);
    },
    attachedItems: function(attachments) {
        if (attachments == null || typeof attachments == "undefined") return null;
        var list = [];
        attachments.each(function (item, count) {
            list.push(Iteminfo.findOne({_id: item}));
        });
        return list;
    },
    getPrice: function() {
        var message = Session.get("selectedPost");
        var item = Session.get("selectedItem");
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var messages = data && data.messages;
        var items = messages[message].attachments;
        if (!items[item]) return null;
        var info = items[item].price;
        return info;
    },
    isMine: function() {
        var message = Session.get("selectedPost");
        var item = Session.get("selectedItem");
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var messages = data && data.messages;
        var items = messages[message].attachments;
        var info = items[item].from;
        return info == Meteor.user().username;
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
    notSold: function(item,message) {
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        var messages = data && data.messages;
        var items = messages[message].attachments;
        if (!items) return false;
        if (!items[item]) return false;
        var info = items[item].bought;
        return !info;
    },
    clickedItem: function() {
        var item = Session.get("clickedItem");
        if (!item) return null;
        var iteminfo = Iteminfo.findOne({_id: item[0]});
        return iteminfo;
    },
    attachedItems2: function() {
        var attach = Session.get("attach");
        if (typeof attach == "undefined") return null;
        var list = [];
        if (!attach) return null;
        attach.each(function(item,count) {
            if (Iteminfo.findOne({_id: item}) != null) list.push(Iteminfo.findOne({_id: item}));
        });
        if (typeof list[0] == 'undefined') return null;
        return list;
    },
    resetAttachments: function() {
        Session.set("attach",null);
    },
    items: function() {
        return Iteminfo.find({username: Meteor.user().username}).fetch();
    },
    isSelected: function(itemid) {
        if (Session.get("clickedItem") == itemid) return "selectedDiv";
        return null;
    },

});
Template.pmPage.events({
    'submit form': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        var submit = $('[name=submit]')[0];
        var data = Messages.findOne({_id: '' + Router.current().params._id});
        submit.disabled = true;
        var message = $('[name=message]').val();
        var subject = $('[name=subject]').val();
        var attachments = Session.get("attach");
        Meteor.call('sendPMReply','' + Router.current().params._id,subject,message,attachments,function(error, result) {

            if (error) {
                $("#pmerror").html(error.reason);
                submit.disabled = false;
                return;
            } else {
                $('[name=subject]').val('');
                $('[name=message]').val('');
                Session.set("showpmreply",false);
                $("#pmerror").html('');
                submit.disabled = false;
                var page = +Router.current().params.page;
                page = page ? page : 1;
                if (Math.ceil((data.messages.length + 1) / 10) > page) Router.go("/inbox/" + Router.current().params._id + "/" + Math.ceil((data.messages.length + 1) / 10));
            }
        });
        return false;
    },
    'click .replypm': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var toggle = Session.get("showpmreply");
        $('#pmerror').html('');
        if (toggle != "top") Session.set("showpmreply",'top');
        else Session.set("showpmreply",null);
        return false;
    },
    'click .edit': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var num = +event.currentTarget.name;
        if (num == Session.get("editable")) Session.set("editable",null);
        else Session.set("editable",+event.currentTarget.name);
        return false;
    },
    'click .bottomReply': function(event) {
        var toggle = Session.get("showpmreply");
        $('#pmerror').html('');
        if (toggle != "bottom") Session.set("showpmreply",'bottom');
        else Session.set("showpmreply",null);
        return false;
    },
    'click .deletePM': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        if (!confirm('Are you sure you want to delete this thread?')) return;
        var thread_id = '' + Router.current().params._id;
        Meteor.call("deleteMessage",thread_id, function(error, result) {
            if (error) {
                alert(error.reason);
            }
        });
        Router.go("/inbox");
        return false;
    },
    'click .submitEdit': function(event){
        if (event && event.preventDefault) event.preventDefault();
        var submit = $('[name=submitEdit]')[0];
        submit.disabled = true;
        var post_id = +event.currentTarget.id;
        var msg = $("[name=editMessage]").val();
        var id = '' + Router.current().params._id;
        Meteor.call("editPM",id,post_id,msg, function(error, result) {
            if (error) {
                submit.disabled = false;
                $("#editError").html(error.reason);
                return;
            }
            else {
                submit.disabled = false;
                Session.set("editable",null);
            }
        });
        return false;
    },
    'mouseenter .item': function (event) {
        if (event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        var post = id.split(' ')[0];
        id = id.split(' ')[1];
        var width = $("[name=tooltip]").width();
        var height = $("[name=tooltip]").height();
        Session.set("selectedItem", id);
        Session.set("selectedPost",post);
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
        var post = id.split(' ')[0];
        id = id.split(' ')[1];
        document.removeEventListener('mousemove', _event[id](event), false);
        $("[name=tooltip]").css({
            display: "none"
        });
        return false;
    },
    'click .item': function(event) {
        if (event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        //console.log(id);
        var post = id.split(' ')[0];
        id = id.split(' ')[1];
        Session.set("clickedItem",[id,post]);
        $('#buyError').html('');
        $('#buymenu').openModal();
    },
    'click #buy': function(event) {
        var clickedItem = Session.get("clickedItem");
        if (!clickedItem) return false;
        Meteor.call("buyAttachment",clickedItem[0],clickedItem[1],'' + Router.current().params._id, function(error, result) {
            if (error) $('#buyError').html(error.reason);
            else {
                $('#buyError').html('');
                $('#buymenu').closeModal();
            }
        });
    },
    'mouseenter .item2': function (event) {
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
            $("[name=tooltip2]").css({
                position: "fixed",
                display: "inline",
                top: top + "px",
                left: left + "px"
            });
        };
        document.addEventListener('mousemove', _event[id](event), false);
        return false;
    },
    'mouseleave .item2': function (event) {
        if (event.preventDefault) event.preventDefault();
        var id = event.currentTarget.id;
        //console.log(id);
        var slot = id.split(' ')[1];
        id = id.split(' ')[0];
        document.removeEventListener('mousemove', _event[id](event), false);
        $("[name=tooltip2]").css({
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
    },
    'click .addInventory': function(event) {
        if (event && event.preventDefault) event.preventDefault();
        $('#attachmenu').openModal();
    },
    'click .item2': function(event) {
        var id = event.currentTarget.id;
        var slot = id.split(' ')[1];
        id = id.split(' ')[0];
        Session.set("clickedItem",id);
        $('[name=price]').val(Iteminfo.findOne({_id: id}).value);
    },
});