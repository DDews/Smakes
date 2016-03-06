/**
 * Created by Dan on 2/28/2016.
 */
Messages = new Mongo.Collection("messages");
Topics = new Mongo.Collection("topics");
Threads = new Mongo.Collection("threads");
Posts = new Mongo.Collection("posts");
Userinfo = new Mongo.Collection("userinfo");

Gameinfo = new Mongo.Collection("gameinfo");

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

