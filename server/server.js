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
        }
    },
    sendPM: function(messageTo, subject, message) {
        if (messageTo == Meteor.user().username) throw new Meteor.Error(422,"Error: cannot send messages to self");
        var messageTo = Meteor.users.findOne({username: RegExp('^' + messageTo + '$',"i")});
        if (!messageTo) throw new Meteor.Error(422,"Error: username doesn't exist");
        if(!message) throw new Meteor.Error(422,"Error: message is empty");
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
    editPM: function(id,post_id,msg) {
        var thispost = Messages.findOne({_id: id});
        if (!this) throw new Meteor.Error(422,"Error: thread " + id + "does not exist");
        var array = thispost.messages;
        if (post_id < 0 || post_id >= array.length) throw new Meteor.Error(422, "Error: post does not exist");
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