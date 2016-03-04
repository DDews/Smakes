Meteor.publish("messages", function() {
    var user = Meteor.users.findOne(this.userId);
    if (user == null) return null;
    return Messages.find({
        showTo:{$elemMatch:{$eq:user.username}},
        $or: [
            { to: user.username },
            { from: user.username }
        ]
    })
});
Meteor.publish("usernames", function() {
   return Meteor.users.find({},{fields: {'username': 1}})
});
Meteor.publish("userinfo", function() {
   return Userinfo.find();
});
Meteor.publish("topics", function() {
    return Topics.find();
})
Meteor.publish("threads", function() {
    return Threads.find();
});
Meteor.publish("posts", function() {
    return Posts.find();
});
Accounts.validateNewUser(function (user) {
    var matches = user.username.match(/[a-zA-Z][a-zA-Z0-9]*/);
    if (user.username && matches != null && matches.length <= 1)
        return true;
    throw new Meteor.Error(403, "Username must start with a letter and only contain numbers and letters.");
});
Meteor.startup(function() {
    reCAPTCHA.config({
        privatekey: '6LctbBkTAAAAAD2KnAh9vOiLS0JKM-coZFYV9l4X'
    });
    if (!Meteor.users.findOne({username: 'admin'})) {
        Accounts.createUser({
            password: 'moondied',
            username: 'admin',
            admin: true,
            createdAt: new Date(),
        });
        Userinfo.insert(
            {
                username: 'admin',
                admin: true,
                posts: 0,
                points: 0
            }
        );
    }
});
Meteor.methods({
    formSubmissionMethod: function(username, password, captchaData) {

        var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);

        if (!verifyCaptchaResponse.success) {
            console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
            throw new Meteor.Error(422,verifyCaptchaResponse[Object.keys(verifyCaptchaResponse)[1]]);
        } else {
            var response = Accounts.createUser({
                password: password,
                username: username,
                createdAt: new Date(),
            });
            if (!Userinfo.findOne({username: RegExp('^' + username + '$',"i")})) Userinfo.insert(
                {
                    username: username,
                    admin: false,
                    posts: 0,
                    points: 0
                }
            );
        }
    },
    createTopic: function(topic, subject) {
        var username = Meteor.user().username;
        var isAdmin = Userinfo.findOne({username: username});
        var isAdmin = isAdmin && isAdmin.admin;
        if (!isAdmin) throw new Meteor.Error(422,"Error: unauthorized");
        if (!topic) throw new Meteor.Error(422,"Error: topic is empty");
        var exists = Topics.findOne({topic: RegExp('^' + topic + '$',"i")});
        if (exists) throw new Meteor.Error(422, "Error: topic already exists");
        var topicId;
        Topics.insert(
            {
                topic: topic,
                subject: subject,
                moderators: [],
                thread: [{
                    from: Meteor.user().username,
                    createdAt: new Date(),
                    subject: 'Testing the board',
                    locked: false,
                    post: [{
                        from: Meteor.user().username,
                        createdAt: new Date(),
                        subject: 'Testing the board',
                        editedBy: '',
                        modified: null,
                        post: "Just testing the board. Don't be alarmed.",
                        likes: []
                    }]
                }]
            },
            function(err,docsInserted){
                var topicId = docsInserted;
                Threads.insert({
                    topicId: topicId,
                    from: Meteor.user().username,
                    createdAt: new Date(),
                    subject: 'Testing the board',
                    views: 0,
                    locked: null
                },
                function(err, docsInserted) {
                    var _id = docsInserted;
                    Posts.insert({
                        threadId: _id,
                        topicId: topicId,
                        subject: 'Testing the board',
                        from: Meteor.user().username,
                        createdAt: new Date(),
                        editedBy: null,
                        modified: null,
                        post: "Just teseting the board. Don't be alarmed",
                        likes: [],
                        dislikes: []
                    });
                });
            });
    },
    makeThreads: function(topicId) {
        var i;
        for(i = 0; i < 120; i++) {
            var random = Math.random().toString(36).substring(7);
            Threads.insert({
                    topicId: topicId,
                    from: Meteor.user().username,
                    createdAt: new Date(),
                    subject: random,
                    views: 0,
                    locked: null
                },
                function (err, docsInserted) {
                    var _id = docsInserted;
                    Posts.insert({
                        threadId: _id,
                        topicId: topicId,
                        subject: random,
                        from: Meteor.user().username,
                        createdAt: new Date(),
                        editedBy: null,
                        modified: null,
                        post: "this is computer generated",
                        likes: [],
                        dislikes: [],
                    });
                });
        }
    },
    newThread: function(topicId, subject, message) {
        var topic = Topics.findOne({_id: topicId});
        if (!topic) throw new Meteor.Error(422,"Error: topic doesn't exist");
        if (!subject) throw new Meteor.Error(422,"Error: subject is empty");
        if (!message) throw new Meteor.Error(422,"Error: message is empty");
        if (!Meteor.user().username) throw new Meteor.Error(422, "Error: you must be logged in");
        Threads.insert({
                topicId: topicId,
                from: Meteor.user().username,
                createdAt: new Date(),
                subject: subject,
                views: 0,
                locked: null
            },
            function(err, docsInserted) {
                var _id = docsInserted;
                Posts.insert({
                    threadId: _id,
                    topicId: topicId,
                    subject: subject,
                    from: Meteor.user().username,
                    createdAt: new Date(),
                    editedBy: null,
                    modified: null,
                    post: message,
                    likes: [],
                    dislikes: [],
                });
            });
    },
    postReply: function(topicId, threadId, subject, message) {
        if (!Topics.findOne({_id: topicId})) throw new Meteor.Error(422,"Error: you are in a deleted topic");
        if (!Threads.findOne({_id: threadId})) throw new Meteor.Error(422,"Error: thread does not exist");
        if (!message) throw new Meteor.Error(422,"Error: message is empty");
        if (!subject) subject = 'Re: ' + Posts.findOne({threadId: threadId},{sort: {createdAt: 1}}).subject;
        if (!Meteor.user().username) throw new Meteor.Error(422,"Error: you must be logged in");
        Posts.insert({
            threadId: threadId,
            topicId: topicId,
            subject: subject,
            from: Meteor.user().username,
            createdAt: new Date(),
            editedBy: null,
            modified: null,
            post: message,
            likes: [],
            dislikes: [],
        });
    },
    sendPM: function(messageTo, subject, message) {
        if (messageTo == Meteor.user().username) throw new Meteor.Error(422,"Error: cannot send messages to self");
        var messageTo = Meteor.users.findOne({username: RegExp('^' + messageTo + '$',"i")});
        if (!messageTo) throw new Meteor.Error(422,"Error: username doesn't exist");
        if(!message) throw new Meteor.Error(422,"Error: message is empty");
        if (!Meteor.user().username) throw new Meteor.Error(422, "Error: you must be logged in");
        var messageTo = messageTo.username;
        Messages.insert(
            {
                to: messageTo,
                from: Meteor.user().username,
                subject: subject,
                createdAt: new Date(),
                modified: new Date(),
                showTo: [messageTo, Meteor.user().username],
                unread: [messageTo],
                messages: [
                    {
                        _id: 0,
                        from: Meteor.user().username,
                        subject: subject,
                        createdAt: new Date(),
                        modified: new Date(),
                        edited: false,
                        message: message
                    }
                ]
            }
        );
    },
    sendPMReply: function(id, subject, message) {
        if (!message) throw new Meteor.Error(422,"Error: Your message is emtpy");
        var msg = Messages.findOne({_id: id});
        if (msg.showTo.length == 1) throw new Meteor.Error(422, "Error: This thread is locked.");
        var array = msg.messages;
        if (!Meteor.user().username) throw new Meteor.Error(422, "Error: you must be logged in");
        array.push({
            _id: array.length,
            from: Meteor.user().username,
            subject: subject,
            createdAt: new Date(),
            modified: new Date(),
            edited: false,
            message: message
        });
        Messages.update(id,{$set: { messages: array}});
        array = msg.unread;
        var user = Meteor.user().username;
        if (msg.to == user) user = msg.from;
        else user = msg.to;
        if (_.contains(array,user)) {
            return;
        }
        else {
            array.push(user);
            Messages.update(id,{$set: { unread: array}});
        }
    },
    markAsRead: function(id) {
        var array = Messages.findOne({_id: id});
        if (!array) throw new Meteor.Error(422,"Error: thread not found");
        array = array.unread;
        if (!_.contains(array,Meteor.user().username)) {
            return;
        }
        if (_.contains(array,Meteor.user().username)) {
            array = _.without(array,Meteor.user().username);
        } else {
            return;
        }
        Messages.update(id,{ $set: { unread: array}});
    },
    deleteMessage: function(id) {
        if (!Meteor.user().username) throw new Meteor.Error(422, "Error: you must be logged in");
        var array = Messages.findOne({_id: id});
        if (!array) throw new Meteor.Error(422,"Error: message not found");
        array = array.showTo;
        if (array == [] || !_.contains(array,Meteor.user().username)) throw new Meteor.Error(422,"Error: already deleted.");
        array = _.without(array,Meteor.user().username);
        if (array.length <= 0) {
            Messages.remove(id);
            return;
        }
        Messages.update(id,{ $set: { showTo: array}});
    },
    editPost: function(postId,message) {
        var post = Posts.findOne({_id: postId});
        if (!post) throw new Meteor.Error(422,"Error: post does not exist");
        var poster = post.from;
        var user = Meteor.user();
        user = user && user.username;
        var admin = Userinfo.findOne({username: user});
        admin = admin && admin.admin;
        var topic = Topics.findOne({topicId: post.topicId});
        topic = topic && topic.moderators;
        if ((_.contains(topic,user)) || (admin) || Meteor.user().username == poster) {
            Posts.update(postId,{$set: { post: message} });
            Posts.update(postId,{$set: { editedBy: Meteor.user().username}});
            Posts.update(postId,{$set: { modified: new Date()}});
        } else {
            throw new Meteor.Error(422,"Error: not authorized");
        }
    },
    increaseView: function(threadId) {
        if (!Threads.findOne({_id: threadId})) return;
        views = Threads.findOne({_id: threadId}).views + 1;
        Threads.update(threadId,{$set: { views: views}});
    },
    editPM: function(id,post_id,msg) {
        if (!Meteor.user().username) throw new Meteor.Error(422, "Error: you must be logged in");
        var thispost = Messages.findOne({_id: id});
        if (!thispost) throw new Meteor.Error(422,"Error: thread " + id + "does not exist");
        var array = thispost && thispost.messages;
        if (post_id < 0 || post_id >= array.length) throw new Meteor.Error(422, "Error: post does not exist");
        if (!array) throw new Meteor.Error(422,"Error: thread not found");
        var post = array[post_id];
        post.message = msg;
        post.modified = new Date();
        post.edited = true;
        if (post.from != Meteor.user().username) throw new Meteor.Error(422, "Error: not authorized to edit someone else's post");
        array[post_id] = post;
        Messages.update(id, { $set: { messages: array} });
        array = thispost.unread;
        var user = Meteor.user().username;
        if (msg.to == user) user = thispost.from;
        else user = thispost.to;
        if (_.contains(array,user)) {
            return;
        }
        else {
            array.push(user);
            Messages.update(id,{$set: { unread: array}});
        }
    }
});