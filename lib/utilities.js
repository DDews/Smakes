/**
 * Created by Dan on 2/28/2016.
 */
Messages = new Mongo.Collection("messages");
Topics = new Mongo.Collection("topics");
Threads = new Mongo.Collection("threads");
Posts = new Mongo.Collection("posts");
Userinfo = new Mongo.Collection("userinfo");

Gameinfo = new Mongo.Collection("gameinfo");

Number.prototype.padLeft = function(base,chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};
boldFunc = function(str, p1, offset, s) {
    return '<b>'+encodeURIComponent(p1)+'</b>'
};

italicFunc = function (str, p1, offset, s) {
    return '<em>'+encodeURIComponent(p1)+'</em>'
};

underlinedFunc = function (str, p1, offset, s) {
    return '<span class="un">'+encodeURIComponent(p1)+'</span>'
};


// The array of regex patterns to look for
var $format_search =  [
    /\[b\](.*?)\[\/b\]/ig,
    /\[i\](.*?)\[\/i\]/ig,
    /\[u\](.*?)\[\/u\]/ig
]; // NOTE: No comma after the last entry

// The matching array of strings to replace matches with
var $format_replace = [
    boldFunc,
    italicFunc,
    underlinedFunc
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
    var urlRegex = /(https?:\/\/[^\s]+)/g;
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

