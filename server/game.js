var interval;
var SIZE = 100;
var SPEED = 100; // speed in ms
var Heads = {};
var Tails = {};
var Pix = {};
var playing = false;
var Snakes = {};
var colors = ["#00FF00","#0000FF","#FFFF00","#00FFFF","#FFA500"];
var players = 0;
var apple = {x: 0, y: 0};
var diff = 0;
var interval;
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
function removeFromGame(username) {
  var d = Smakes.findOne({username: username});
  var PixelsRaw = Pixels.rawCollection().initializeUnorderedBulkOp();
  PixelsRaw.executeAsync = Meteor.wrapAsync(PixelsRaw.execute);

  var DeadPixelsRaw = DeadPixels.rawCollection().initializeUnorderedBulkOp();
  DeadPixelsRaw.executeAsync = Meteor.wrapAsync(DeadPixelsRaw.execute);

  if (!(username in Snakes)) return;
  for (k = 0; k < Snakes[username].length; k++) {
    var died = Snakes[username][k];
    var j = {
      username: username,
      smake: d._id,
      x: died.x,
      y: died.y,
      createdAt: +new Date()
    };
    Pix[died.x][died.y] = 0;
    DeadPixelsRaw.insert(j);
    updateDead = true;
  }
  PixelsRaw.find({username: username}).remove();
  PixelsRaw.executeAsync();
  DeadPixelsRaw.executeAsync();

  delete Heads[username];
  delete Snakes[username];
  Smakes.remove({username: username});
  players = Smakes.find().fetch().length;
}
Meteor.methods({

	//Removes the current user's game data.
	stopGame: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }

    removeFromGame(username);

    if (players <= 1) {
      Meteor.clearInterval(interval);
      interval = undefined;
      playing = false;
      delete Heads['bot'];
      Smakes.remove({});
      Pixels.remove({});
      DeadPixels.remove({});
    }
    else {
  		Smakes.remove({username: username});
  		Pixels.remove({username: username});
  		DeadPixels.remove({username: username});
    }
	},
	newGame: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (players >= 3) { throw new Meteor.Error(422, "Error: too many players playing!"); }
		Smakes.remove({username: username});
		Pixels.remove({username: username});
		DeadPixels.remove({username: username});
    players = Smakes.find().fetch().length;
		Smakes.insert({username: username, color: colors[players], speed: 1, tick: 0, length: 10, dead: false, bot: false, x: 0, y: 0, dx: 1, dy: 0, size: 1, createdAt: +new Date()});
		var smake = Smakes.findOne({username: username, bot: {$ne: true}});
    Pixels.insert({username: username, smake: smake._id, color: "#00FF00", speed: 1, tick: 0, length: 10, dead: false, bot: false, x: 0, y: 0, dx: 1, dy: 0, size: 1, createdAt: +new Date()});
    Heads[username] = smake;
    if (!('bot' in Heads)) {
      apple = {x: Math.round(Math.random() * SIZE), y: Math.round(Math.random() * SIZE)};
      Apple.remove({});
      Apple.insert(apple);
      apple = Apple.findOne({});
      Smakes.insert({username: 'bot', color: "#FF0000", speed: 1, tick: 0, length: 10, dead: false, bot: true, x: SIZE - 1, y: SIZE - 1, dx: -1, dy: 0, size: 1, createdAt: +new Date()});
      var opponent = Smakes.findOne({username:'bot'});
      Pixels.insert({username: 'bot', smake: opponent._id, color: "#FF0000", speed: 1, tick: 0, length: 10, dead: false, bot: true, x: SIZE - 1, y: SIZE - 1, dx: -1, dy: 0, size: 1, createdAt: +new Date()});
      Pix = makeArray(100,100,undefined);
  		Pix[smake.x][smake.y] = username;
  		Pix[opponent.x][opponent.y] = username;
      Snakes = {};
      Snakes[username] = [{x: smake.x, y: smake.y}];
      Snakes['bot'] = [{x: opponent.x, y: opponent.y}];
      Heads['bot'] = opponent;
    }
    else {
      Snakes[username] = [{x: smake.x, y: smake.y}];
      Pix[smake.x][smake.y] = username;
    }
    if (!playing && players == 0) {
      if (typeof interval != undefined) Meteor.clearTimeout(interval);
      playing = true;
      diff = +new Date() - SPEED;
      interval = Meteor.setInterval(function() {
        Meteor.call("tick");
      }, SPEED * 0.45);
    }
    players = Object.keys(Heads).length;
	},
	tick: () => {
    var updateDead = false;
    var pixelUpdate = false;
    var PixelsRaw = Pixels.rawCollection().initializeUnorderedBulkOp();
    PixelsRaw.executeAsync = Meteor.wrapAsync(PixelsRaw.execute);

    var DeadPixelsRaw = DeadPixels.rawCollection().initializeUnorderedBulkOp();
    DeadPixelsRaw.executeAsync = Meteor.wrapAsync(DeadPixelsRaw.execute);
    var t = (+new Date()) - diff;
    t /= SPEED;
		for (var username in Heads) {
      var d = Heads[username];
      if (username != 'bot' && !Meteor.users.findOne({username: username}).status.online) {
        removeFromGame(username);
        continue;
      }
      var dying = false;
			d.tick += t;
			if (d.tick >= d.speed) {
        var doubleSpeed = t;
				d.tick = 0;
        if (d.speed == 0.5) doubleSpeed *= 4;
        for (y = 0; y < doubleSpeed; y++) {
          d.size += 1;
  				var n = {
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
  				var hit = Pix[d.x][d.y];
          var a = Apple.findOne({});
  				if (typeof hit == "string") {
            dying = true;
  					for (k = 0; k < Snakes[username].length; k++) {
  						var died = Snakes[username][k];
  						var j = {
  							username: username,
  							smake: d._id,
  							x: died.x,
  							y: died.y,
  							createdAt: +new Date()
  						};
  						Pix[died.x][died.y] = 0;
  					  DeadPixelsRaw.insert(j);
              updateDead = true;
  					}
            PixelsRaw.find({username: username}).remove();
            pixelUpdate = true;
            DeadPixelsRaw.insert(n);
  					d.x = Math.floor(Math.random() * SIZE);
  					d.y = Math.floor(Math.random() * SIZE);
  					d.dx = 1;
  					d.dy = 0;
  					d.length = 10;
  					d.size = 1;
  					Snakes[username] = [{x: d.x, y: d.y}];
  				} else if (d.x >= a.x - 1 && d.y >= a.y - 1 && d.x <= a.x + 1 && d.y <= a.y + 1) {
            apple.x = Math.round(Math.random() * SIZE);
            apple.y = Math.round(Math.random() * SIZE);
            Apple.update(apple._id, {$set: apple});
            d.length = Math.round(d.length * 1.5);
          }
  				n.x = d.x;
  				n.y = d.y;
  				Pix[d.x][d.y] = username;
          if (typeof Snakes[username] == undefined) Snakes[username] = [];
  				Snakes[username].push({x: d.x,y: d.y});
  				d.createdAt = +new Date();
  				n.createdAt = d.createdAt;
  				if (d.size > d.length) {
  					var pos = Snakes[username][0];
						PixelsRaw.find({username: username},{sort: {createdAt: 1}}).removeOne();
            pixelUpdate = true;
						DeadPixelsRaw.insert({
              username: username,
              x: pos.x,
              y: pos.y,
              createdAt: +new Date()
            });
            updateDead = true;
  					Pix[pos.x][pos.y] = 0;
            if (typeof Snakes[username] == undefined) Snakes[username] = [{x: d.x, y: d.y}];
  					if (Snakes[username].length > 1) Snakes[username].shift();
  					if (typeof Snakes[username] == undefined) Snakes[username] = [{x: d.x, y: d.y}];
  					d.size--;
  				}
  				Smakes.update(d._id, {$set: d});
  				PixelsRaw.insert(n);
          pixelUpdate = true;
          if (dying) {
            DeadPixelsRaw.insert(n);
            updateDead = true;
          }
  			}
      }
      Heads[username] = d;
		}
    if (pixelUpdate) PixelsRaw.executeAsync();
    if (updateDead) DeadPixelsRaw.executeAsync();
    diff = +new Date();
	},
	removePixel: (id, time) => {
    var DeadPixelsRaw = DeadPixels.rawCollection().initializeUnorderedBulkOp();
    DeadPixelsRaw.executeAsync = Meteor.wrapAsync(DeadPixelsRaw.execute);
    DeadPixelsRaw.find({username: id, createdAt: {$lte: time}}).remove();
		DeadPixelsRaw.executeAsync();
	},
	moveUp: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
		if (Heads[username].dy == 1) return;
    Heads[username].dx = 0;
		Heads[username].dy = -1;
	},
	moveDown: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
		if (Heads[username].dy == -1) return;
		Heads[username].dx = 0;
		Heads[username].dy = 1;
	},
	moveLeft: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
		if (Heads[username].dx == 1) return;
		Heads[username].dx = -1;
		Heads[username].dy = 0;
	},
	moveRight: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
		if (Heads[username].dx == -1) return;
		Heads[username].dx = 1;
		Heads[username].dy = 0;
	},
	normalSpeed: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
  	Heads[username].speed = 1;
	},
	slowSpeed: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
		Heads[username].speed = 3;
	},
	fastSpeed: () => {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) { throw new Meteor.Error(422, "Error: You must be logged in"); }
    if (!(username in Heads)) return;
    Heads[username].speed = 0.5;
	},
	purgeSmakes: () => {
    playing = false;
		Pix = [];
		Heads = {};
		Snakes = {};
    players = 0;
		Pixels.remove({});
		Smakes.remove({});
		DeadPixels.remove({});
	}
});
