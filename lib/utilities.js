/**
 * Created by Dan on 2/28/2016.
 */
collections = {};

function makeCollection(name) {
	collections[name] = new Mongo.Collection(name.toLowerCase());
	return collections[name];
}

Messages = makeCollection("Messages")
Topics = makeCollection("Topics")
Threads = makeCollection("Threads")
Posts = makeCollection("Posts")
Userinfo = makeCollection("Userinfo")
Gameinfo = makeCollection("Gameinfo")


ensureExists = function(query, collection, thing, defaultValue) {
	var coll = collections[collection];
	var doc = coll.findOne(query);
	if (doc) {
		if (!doc.has(thing)) { 
			var objSet = {};
			objSet[thing] = defaultValue;
			coll.update(doc._id, {$set:objSet});
			return false;
		}
		return true;
	}
	
	throw new Meteor.Error(422, "Could not find a " + collection + " doc with the query " + query)
}

//ensureExists({username: poster}, "Userinfo", "wallet", {karma:1, gold:100})
//ensureExists({username: poster}, "Userinfo", "totalKarma", 1)





Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
urlify = function(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    if (text.match(urlRegex)) {
        if (text.match(/(jpg|png|gif|bmp)$/)) return text.replace(urlRegex, function (url) {
            return '<img class="maximage" src="' + url + '">';
        });
        return text.replace(urlRegex, function (url) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        });
    }
}

