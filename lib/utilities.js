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


Unitinfo = makeCollection("Unitinfo")
Combatinfo = makeCollection("Combatinfo")
Gameinfo = makeCollection("Gameinfo")

dbinsert = function(collection, object) {
	var coll = collections[collection]
	var _id = coll.insert(object);
	object._id = _id;
	object._collection = collection;
	
	coll.update(_id, {$set: {_collection:collection}})
}

dbupdate = function(object) {
	var _id = object._id;
	var _collection = object._collection;
	if (_id && _collection) {
		var coll = collections[_collection]
		if (coll) {
			coll.remove(_id);
			coll.insert(object);
			
		} else {
			console.log("Collection " + _collection + " does not exist.");
		}
		
	} else {
		console.log("Cannot update object, does not have _id or _collection field");
	}
}

dbget = function(collection, id) {
	var coll = collections[collection];
	
	if (coll) {
		return coll.find(id).fetch()[0];
	} else {
		console.log("Cannot get object, collection " + collection + " does not exist");
	}
	return null;
}


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





Number.prototype.padLeft = function(base,chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};
boldFunc = function(str, p1, offset, s) {
    return '<b>'+p1+'</b>'
};

italicFunc = function (str, p1, offset, s) {
    return '<em>'+p1+'</em>'
};

underlinedFunc = function (str, p1, offset, s) {
    return '<span class="un">'+p1+'</span>'
};
codeFunc = function (str, p1, offsset, s) {
	return '<code>'+p1+'</code>';
}


// The array of regex patterns to look for
var $format_search =  [
    /\[b\](.*?)\[\/b\]/ig,
    /\[i\](.*?)\[\/i\]/ig,
    /\[u\](.*?)\[\/u\]/ig,
	/\[code\](.*?)\[\/code\]/ig
]; // NOTE: No comma after the last entry

// The matching array of strings to replace matches with
var $format_replace = [
    boldFunc,
    italicFunc,
    underlinedFunc,
	codeFunc
];

// Perform the actual conversion
bbcodify = function(str) {
    var msg = str;
    for (var i =0;i<$format_search.length;i++) {
        msg = msg.replace($format_search[i], $format_replace[i]);
    }
    return msg;
};
urlify = function(text) {
    var urlRegex = /(https?:\/\/[^\s<>]+)/g;
    if (text.match(urlRegex)) {
        if (text.match(/(jpg|png|gif|bmp)$/)) return text.replace(urlRegex, function (url) {
            return '<img class="maximage" src="' + url + '">';
        });
        return text.replace(urlRegex, function (url) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        });
    }
    return text;
};

