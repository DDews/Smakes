/**
 * Created by Dan on 3/5/2016.
 */
var _toggle = false;
var getPageUrl = function(num) {
    var keywords = '&keywords=' + encodeURIComponent(Router.current().params.query.keywords);
    var regexoption = '&regexoption=' + Router.current().params.query.regexoption;
    var author = '&author=' + encodeURIComponent(Router.current().params.query.author);
    var within = '&within=' + Router.current().params.query.within;
    var sortby = '&sortby=' + Router.current().params.query.sortby;
    var sortorder = '&sortorder=' + Router.current().params.query.sortorder;
    var forum = '&forum=' + Router.current().params.query.forum;
    var page = '&page=' + num;
    var url = '/find?' + keywords + regexoption + author + within + sortby + sortorder + forum + page;
    return url;
}
Template['find'].helpers({
    toggle: function() {
        if (_toggle) {
            _toggle = false;
            return 'postOne';
        }
        _toggle = true;
        return 'postTwo';
    },
    shouldAdmin: function(username) {
        var userinfo = Userinfo.findOne({username: username});
        if (!userinfo) return false;
        return userinfo.admin;
    },
    shouldMod: function(username,threadId) {
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return false;
        var topicId = thread.topicId;
        var topic = Topics.findOne({_id: topicId});
        if (!topic) return false;
        return _.contains(topic.moderators,username);
    },
    threadName: function(id) {
        var thread = Threads.findOne({_id: id});
        return thread && thread.subject;
    },
    topicName: function(id) {
        var topic = Topics.findOne({_id: id});
        return topic && topic.topic;
    },
    threadReplies: function(id) {
        var posts = Posts.find({threadId: id}).count();
        return posts - 1;
    },
    threadViews: function(id) {
        var thread = Threads.findOne({_id: id});
        return thread && thread.views;
    },
    getPosts: function(name) {
        var info = Userinfo.findOne({username: name});
        var posts = info && info.posts;
        return posts;
    },
    myDate: function (d) {
        if (!d) return null;
        dformat = [(d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },
    isFrom: function(id) {
        var user = Meteor.user();
        user = user && user.username;
        var admin = Userinfo.findOne({username: user});
        admin = admin && admin.admin;
        if (admin) return true;
        var threadId = '' + Router.current().params._id;
        var thread = Threads.findOne({_id: threadId});
        if (!thread) return null;
        var topicId = thread.topicId;
        var topic = Topics.findOne({_id: topicId});
        topic = topic && topic.moderators;
        if (_.contains(topic,user)) return true;
        return Meteor.user().username == id;
    },
    numposts: function() {
        return Session.get("numposts");
    },
    linkToPage: function(num) {
        var url = getPageUrl(num);
        return url;
    },
    linkPageBefore: function(num) {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        var url = getPageUrl(page - num);
    },
    linkPageAfter: function(num) {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        var url = getPageUrl(page + num);
    },
    linkLastPage: function() {
        var data = +Session.get("numposts");
        return getPageUrl(Math.ceil(data / 10));
    },
    pageBefore: function(num) {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page - num;
    },
    needFirstElipsis: function() {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page - 2 > 2;
    },
    needSecondElipsis: function() {
        var data = +Session.get("numposts");
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page + 2 < Math.ceil(data / 10) - 1;
    },
    lastPage: function() {
        var data = +Session.get("numposts");
        return Math.ceil(data / 10);
    },
    needFirst: function () {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page != 1;
    },
    needLast: function() {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        var data = +Session.get("numposts");
        return page != Math.ceil(data / 10);
    },
    needBefore: function(num) {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page - num > 1;
    },
    needAfter: function(num) {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        var data = +Session.get("numposts");
        return page + num < Math.ceil(data / 10);
    },
    pageAfter: function(num) {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page + num;
    },
    pageNumber: function() {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page;
    },
    correctPage: function () {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        var data = +Session.get("numposts");
        return page <= Math.ceil(data / 10);
    },
    needFirst: function () {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        return page != 1;
    },
    needLast: function() {
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        var data = +Session.get("numposts");
        return page != Math.ceil(data / 10);
    },
    getLikes: function(id) {
        var post = Posts.findOne({_id: id});
        if (!post) return 0;
        return post.likes.length;
    },
    getDislikes: function(id) {
        var post = Posts.findOne({_id: id});
        if (!post) return 0;
        return post.dislikes.length;
    },
    record: function () {
        var keywords = '' + Router.current().params.query.keywords;
        var regexoption = '' + Router.current().params.query.regexoption;
        var author = '' + Router.current().params.query.author;
        var within = '' + Router.current().params.query.within;
        var sortby = '' + Router.current().params.query.sortby;
        var sortorder = +Router.current().params.query.sortorder;
        var forum = '' + Router.current().params.query.forum;
        var query;
        if (author) {
            if (within == 'all') {
                if (sortby == 'createdAt') query = Posts.find(
                    {
                        from: RegExp(author, "i"),
                        topicId: RegExp(forum),
                        $or: [
                            {subject: RegExp(keywords, regexoption)},
                            {post: RegExp(keywords, regexoption)}
                        ]
                    },
                    {
                        sort: {createdAt: sortorder}
                    });
                if (sortby == 'subject') query = Posts.find(
                    {
                        from: RegExp(author, "i"),
                        topicId: RegExp(forum),
                        $or: [
                            {subject: RegExp(keywords, regexoption)},
                            {post: RegExp(keywords, regexoption)}
                        ]
                    },
                    {
                        sort: {subject: sortorder}
                    });
                if (sortby == 'from') query = Posts.find(
                    {
                        from: RegExp(author, "i"),
                        topicId: RegExp(forum),
                        $or: [
                            {subject: RegExp(keywords, regexoption)},
                            {post: RegExp(keywords, regexoption)}
                        ]
                    },
                    {
                        sort: {from: sortorder}
                    });
            } else {
                if (within == 'subject') {
                    if (sortby == 'createdAt') query = Posts.find(
                        {
                            from: RegExp(author, "i"),
                            topicId: RegExp(forum),
                            subject: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {createdAt: sortorder}
                        });
                    if (sortby == 'subject') query = Posts.find(
                        {
                            from: RegExp(author, "i"),
                            topicId: RegExp(forum),
                            subject: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {subject: sortorder}
                        });
                    if (sortby == 'from') query = Posts.find(
                        {
                            from: RegExp(author, "i"),
                            topicId: RegExp(forum),
                            subject: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {from: sortorder}
                        });
                }
                if (within == 'message') {
                    if (sortby == 'createdAt') query = Posts.find(
                        {
                            from: RegExp(author, "i"),
                            topicId: RegExp(forum),
                            post: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {createdAt: sortorder}
                        });
                    if (sortby == 'subject') query = Posts.find(
                        {
                            from: RegExp(author, "i"),
                            topicId: RegExp(forum),
                            post: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {subject: sortorder}
                        });
                    if (sortby == 'from') query = Posts.find(
                        {
                            from: RegExp(author, "i"),
                            topicId: RegExp(forum),
                            post: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {from: sortorder}
                        });
                }
            }
        }
        else {
            if (within == 'all') {
                if (sortby == 'createdAt') query = Posts.find(
                    {
                        topicId: RegExp(forum),
                        $or: [
                            {subject: RegExp(keywords, regexoption)},
                            {post: RegExp(keywords, regexoption)}
                        ]
                    },
                    {
                        sort: {createdAt: sortorder}
                    });
                if (sortby == 'subject') query = Posts.find(
                    {
                        topicId: RegExp(forum),
                        $or: [
                            {subject: RegExp(keywords, regexoption)},
                            {post: RegExp(keywords, regexoption)}
                        ]
                    },
                    {
                        sort: {subject: sortorder}
                    });
                if (sortby == 'from') query = Posts.find(
                    {
                        topicId: RegExp(forum),
                        $or: [
                            {subject: RegExp(keywords, regexoption)},
                            {post: RegExp(keywords, regexoption)}
                        ]
                    },
                    {
                        sort: {from: sortorder}
                    });
            } else {
                if (within == 'subject') {
                    if (sortby == 'createdAt') query = Posts.find(
                        {
                            topicId: RegExp(forum),
                            subject: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {createdAt: sortorder}
                        });
                    if (sortby == 'subject') query = Posts.find(
                        {
                            topicId: RegExp(forum),
                            subject: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {subject: sortorder}
                        });
                    if (sortby == 'from') query = Posts.find(
                        {
                            topicId: RegExp(forum),
                            subject: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {from: sortorder}
                        });
                }
                if (within == 'message') {
                    if (sortby == 'createdAt') query = Posts.find(
                        {
                            topicId: RegExp(forum),
                            post: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {createdAt: sortorder}
                        });
                    if (sortby == 'subject') query = Posts.find(
                        {
                            topicId: RegExp(forum),
                            post: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {subject: sortorder}
                        });
                    if (sortby == 'from') query = Posts.find(
                        {
                            topicId: RegExp(forum),
                            post: RegExp(keywords, regexoption)
                        },
                        {
                            sort: {from: sortorder}
                        });
                }
            }
        }
        var count = query.count();
        if (!count) count = 0;
        Session.set("numposts",count);
        var page = +Router.current().params.query.page;
        page = page ? page : 1;
        page -= 1;
        var index = page * 10;
        var messages = query.fetch().slice(index,index + 10);
        return messages;
    }
});