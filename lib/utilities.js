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
			var oldject = coll.findOne(_id);
			object.each((k,v) => {
				var setject = {}
				setject[k] = v;
						
				if (oldject.has(k)) {
					if (oldject[k] !== v) { coll.update(_id, {$set: setject}); }
				} else {
					coll.update(_id, {$set: setject})
				}
			})
			
		} else {
			console.log("dbupdate: Collection " + _collection + " does not exist.");
		}
		
	} else {
		console.log("dbupdate: Cannot update object, does not have _id or _collection field");
	}
}

dbupdatef = function(object) {
	var _id = object._id;
	var _collection = object._collection;
	if (_id && _collection) {
		var coll = collections[_collection]
		if (coll) {
			var oldject = coll.findOne(_id);
			object.each((k,v) => {
				var setject = {}
				setject[k] = v;
				coll.update(_id, {$set: setject})
			})
			
		} else {
			console.log("dbupdate: Collection " + _collection + " does not exist.");
		}
		
	} else {
		console.log("dbupdate: Cannot update object, does not have _id or _collection field");
	}
}

dbremove = function(object) {
	var _id = object._id;
	var _collection = object._collection;
	if (_id && _collection) {
		var coll = collections[_collection];
		if (coll) {
			//console.log("dbremove: Successfully removed " + _collection + " : " + _id)
			coll.remove(_id);
		} else {
			console.log("dbremove: Collection " + _collection + " does not exist.")
		}
		
	} else {
		console.log("dbremove: Cannot remove object, does not have _id or _collection field");
	}
}

dbget = function(collection, id) {
	var coll = collections[collection];
	
	if (coll) {
		return coll.find(id).fetch()[0];
	} else {
		console.log("dbget: Cannot get object, collection " + collection + " does not exist");
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
showDamage = function(element,damage, color, bgimg) {
	color = color || "red";
	var div = document.createElement("div");
	
	div.style.width = "100px";
	div.style.height = "100px";
	div.style.background = "";
	if (bgimg) {
		div.style.backgroundImage = "url(" + bgimg + ")";
		div.style.backgroundRepeat = "no-repeat";
		div.style.backgroundSize = "contain";
	}
	
	div.style.color = color;
	div.style.zIndex = 100;
	div.style.textAlign = "center";
	
	div.innerHTML = '' + damage;
	var classname = Math.random().toString(36).substring(7);
	div.className = classname;
	var pos = element.offset();
	var elemWidth = element.width();
	var elemHeight = element.height();
	
	var width = div.offsetWidth;
	var x = pos.left + elemWidth/2 - 50;
	var y = pos.top + elemHeight/2 - 50;
	
	document.body.appendChild(div);
	$('.' + classname).css({
		position: "absolute",
		top: y + "px",
		left: x + "px"
	}).show();
	
	
	
	
	var randomx = Random.range(-1, 1);
	var incy = 3;
	var fontsize = 50;
	var _id = setInterval(function () {
		$("." + classname).css({
			top: y,
			left: x,
			width: (fontsize*1.5),
			height: (fontsize*1.5),
			position: 'absolute',
			"font-size": fontsize
		});
		fontsize -= 0.5;
		x += randomx;
		y -= incy;
		
		incy -= 0.1;
		if (y > $(window).height() || x > $(window).width() || x < 0) {
			$("." + classname).remove();
			clearInterval(_id);
		}
	}, 10);
	setTimeout(function () {
		clearInterval(_id);
		$("." + classname).remove();
	}, 3000);
}
