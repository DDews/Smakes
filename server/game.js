var interval;
var SIZE = 50;
var SPEED = 100; // speed in ms
var Heads = {};
var Tails = {};
var Pix = {};
var Snakes = {};
var players = 0;
function makeArray(w, h, val) {
    var arr = [];
    for(i = 0; i < h; i++) {
        arr[i] = [];
        for(j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Published data for game

Meteor.publish("gamedata", function() {
	//console.log("User id for gamedata: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("gamedatas for " + username + " : " + Gameinfo.find({username: username}).count() );

	return Gameinfo.find( { username: username } );

});

Meteor.publish("allInventory", function() {
	return Iteminfo.find({username: "<middleman>"});
})
Meteor.publish("inventory", function() {
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("items for " + username + " : " + Iteminfo.find({username: username}).count() );

	return Iteminfo.find( { username: username } );

})

Meteor.publish("shopitems", function() {
	return Iteminfo.find( { username: "<shop>"} )
})


Meteor.publish("unitinfo", function() {
	//console.log("User id for unitinfo: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("unitinfos for " + username + " : " + Unitinfo.find({username: username}).count() );

	return Unitinfo.find( { username: username } );

});

Meteor.publish("allunits", function() {
	return Unitinfo.find();
})

Meteor.publish("combatinfo", function() {
	//console.log("User id for combatinfo: " + this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log("combatinfos for " + username + " : " + Combatinfo.find({username: username}).count() );

	return Combatinfo.find( { username: username } );

});


//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Messages that can be sent to the server by clients for game logic.

Meteor.methods({

	//Removes the current user's game data.
	stopGame: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    players--;
		Smakes.remove({username: username});
		Pixels.remove({username: username});
		DeadPixels.remove({username: username});
		Meteor.clearInterval(interval);
	},
	newGame: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		Smakes.remove({username: username});
		Pixels.remove({username: username});
		DeadPixels.remove({username: username});
		smakes = Smakes.find({username: username}).fetch();
		pixels = Pixels.find({username: username}).fetch();
		if (smakes.length > 0) {
			smakes.each((d) => { Smakes.remove(d._id); });
		}
		if (pixels.length > 0) {
			pixels.each((d) => { Pixels.remove(d._id); });
		}
		Smakes.insert({username: username, color: "#00FF00", speed: 1, tick: 0, length: 10, dead: false, bot: false, x: 0, y: 0, dx: 1, dy: 0, size: 1, createdAt: +new Date()});
		Smakes.insert({username: username, color: "#FF0000", speed: 1, tick: 0, length: 10, dead: false, bot: true, x: SIZE - 1, y: SIZE - 1, dx: -1, dy: 0, size: 1, createdAt: +new Date()});
    var smake = Smakes.findOne({username: username, bot: {$ne: true}});
		var opponent = Smakes.findOne({username:username, bot: {$ne: false}});
    Pixels.insert({username: username, smake: smake._id, color: "#00FF00", speed: 1, tick: 0, length: 10, dead: false, bot: false, x: 0, y: 0, dx: 1, dy: 0, size: 1, createdAt: +new Date()});
    Pixels.insert({username: username, smake: opponent._id, color: "#FF0000", speed: 1, tick: 0, length: 10, dead: false, bot: true, x: SIZE - 1, y: SIZE - 1, dx: -1, dy: 0, size: 1, createdAt: +new Date()});

		Heads[username] = [
			smake,
			opponent
		];
		Pix[username] = makeArray(100,100,undefined);
		Pix[username][smake.x][smake.y] = 0;
		Pix[username][opponent.x][opponent.y] = 1;
		Snakes[username] = makeArray(2,1,undefined);
		Snakes[username][0] = [{x: smake.x, y: smake.y}];
		Snakes[username][1] = [{x: opponent.x, y: opponent.y}];
    if (players == 0) {
  		interval = Meteor.setInterval(() => {
  				Meteor.call("tick",username)
  			},SPEED);
    }
    players++;
	},
	tick: () => {
    var PixelsRaw = Pixels.rawCollection().initializeUnorderedBulkOp();
    PixelsRaw.executeAsync = Meteor.wrapAsync(PixelsRaw.execute);

    var DeadPixelsRaw = DeadPixels.rawCollection().initializeUnorderedBulkOp();
    DeadPixelsRaw.executeAsync = Meteor.wrapAsync(DeadPixelsRaw.execute);

    var updateDead = false;

    for (var username in Heads) {
  		for (i = 0; i < Heads[username].length; i++) {
        var dying = false;
  			var d = Heads[username][i];
  			var dx = +new Date();
  			dx -= d.createdAt;
  			dx = (SPEED * d.speed) / dx;
  			d.tick++;
  			if (d.tick >= d.speed) {
  				d.tick = 0;
          if (d.speed == 0.5) doubleSpeed = 2;
          else doubleSpeed = 1;
          for (y = 0; y < doubleSpeed; y++) {
            d.size += 1;
    				var newx = d.x + Math.round(d.dx * dx);
    				while (newx >= SIZE) newx -= SIZE;
    				while (newx < 0) newx += SIZE;
    				var newy = d.y + Math.round(d.dy * dx);
    				while (newy >= SIZE) newy -= SIZE;
    				while (newy < 0) newy += SIZE;
    				var n = {
    					smake: d._id,
    					username: username,
    					color: d.color,
    					speed: d.speed,
    					bot: d.bot,
    					x: 0,
    					y: 0,
    					dx: +d.dx,
    					dy: +d.dy,
    					createdAt: +new Date()
    				};
    				d.x += d.dx;
    				if (d.x >= SIZE) d.x -= SIZE;
    				else if (d.x < 0) d.x += SIZE;
    				d.y += d.dy;
    				if (d.y >= SIZE) d.y -= SIZE;
    				else if (d.y < 0) d.y += SIZE;
    				var hit = Pix[username][d.x][d.y];
    				if (hit != undefined) {
              dying = true;
    					for (k = 0; k < Snakes[username][i].length; k++) {
    						var died = Snakes[username][i][k];
    						var j = {
    							username: username,
    							smake: d._id,
    							x: died.x,
    							y: died.y,
    							createdAt: +new Date()
    						};
    						Pix[username][died.x][died.y] = undefined;
    					  DeadPixelsRaw.insert(j);
                updateDead = true;
    					}
              PixelsRaw.find({username: username, smake: d._id}).removeOne();
              DeadPixelsRaw.insert(n);
    					d.x = Math.floor(Math.random() * SIZE);
    					d.y = Math.floor(Math.random() * SIZE);
    					d.dx = 1;
    					d.dy = 0;
    					d.length = 10;
    					d.size = 1;
              console.log(i + ": " + d.x + ", " + d.y);
    					Snakes[username][i] = [{x: d.x, y: d.y}];
    				}
    				n.x = d.x;
    				n.y = d.y;
    				Pix[username][d.x][d.y] = i;
            if (!Snakes[username][i]) Snakes[username][i] = new Array(0);
    				Snakes[username][i].push({x: d.x,y: d.y});
    				d.createdAt = +new Date();
    				n.createdAt = d.createdAt;
    				if (d.size > d.length) {
    					var pos = Snakes[username][i][0];
    					pixel = Pixels.findOne({username: username, smake: d._id, x: pos.x, y: pos.y},{sort: {createdAt: 1}});
    					if (pixel) {
    						PixelsRaw.find({_id: pixel._id}).removeOne();
    						delete pixel._id;
                delete pixel._collection;
    						DeadPixelsRaw.insert(pixel);
                updateDead = true;
    					}
    					Pix[username][pos.x][pos.y] = undefined;
              if (Snakes[username][i] == undefined) Snakes[username][i] = new Array(0).push({x: d.x, y: d.y});
    					if (Snakes[username][i].length > 1) Snakes[username][i].shift();
    					if (Snakes[username][i] == undefined) Snakes[username][i] = new Array(0).push({x: d.x, y: d.y});
    					d.size--;
    				}
    				Smakes.update(d._id, {$set: d});
    				Heads[username][i] = d;
    				PixelsRaw.insert(n);
            if (dying) DeadPixelsRaw.insert(n);
    			}
    			Heads[username][i] = d;
        }
  		}
    }
    PixelsRaw.executeAsync();
    if (updateDead) DeadPixelsRaw.executeAsync();
	},
	removePixel: (id, time) => {
		DeadPixels.remove({smake: id, createdAt: {$lte: time}});
	},
	moveUp: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		if (Heads[username][0].dy == 1) return;
		Heads[username][0].dx = 0;
		Heads[username][0].dy = -1;
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		smake.dx = 0;
  		smake.dy = -1;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	moveDown: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		if (Heads[username][0].dy == -1) return;
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		Heads[username][0].dx = 0;
  		Heads[username][0].dy = 1;
  		smake.dx = 0;
  		smake.dy = 1;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	moveLeft: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		if (Heads[username][0].dx == 1) return;
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		Heads[username][0].dx = -1;
  		Heads[username][0].dy = 0;
  		smake.dx = -1;
  		smake.dy = 0;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	moveRight: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		if (Heads[username][0].dx == -1) return;
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		Heads[username][0].dx = 1;
  		Heads[username][0].dy = 0;
  		smake.dx = 1;
  		smake.dy = 0;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	normalSpeed: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		Heads[username][0].speed = 1;
  		if (smake.speed != 1) smake.speed = 1;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	slowSpeed: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		Heads[username][0].speed = 3;
  		if (smake.speed != 3) smake.speed = 3;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	fastSpeed: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
		smake = Smakes.findOne({username: username, bot: {$ne: true}});
    if (smake) {
  		Heads[username][0].speed = 0.5;
  		if (smake.speed != 0.5) smake.speed = 0.5;
  		Smakes.update(smake._id,{$set: smake});
    }
	},
	purgeSmakes: () => {
		delete Pix[username];
		delete Heads[username];
		delete Tails[username];
		delete Snakes[username];
		Pixels.remove({});
		Smakes.remove({});
		DeadPixels.remove({});
	}
});
