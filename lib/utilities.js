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
