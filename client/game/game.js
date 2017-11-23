var SIZE = 100;
var _moving = 'right';
var _keys = new Set();
var _started = false;
var _speed = "normal";
var _timeout;
var _playing = false;
var _stop = function (key) {
	keyboard.stop();
};
function mainLoop (time) {
	if (_keys.ArrowUp || _keys.KeyW) {
		if (_moving != "up") {
			Meteor.call("moveUp");
			_moving = "up";
		}
	}
	if (_keys.ArrowDown || _keys.KeyS) {
		if (_moving != "down") {
			Meteor.call("moveDown");
			_moving = "down";
		}
	}
	if (_keys.ArrowLeft || _keys.KeyA) {
		if (_moving != "left") {
			Meteor.call("moveLeft");
			_moving = "left";
		}
	}
	if (_keys.ArrowRight || _keys.KeyD) {
		if (_moving != "right") {
			Meteor.call("moveRight");
			_moving = "right";
		}
	}
	if (_keys.Space) {
		if (_speed != "slow") {
			Meteor.call("slowSpeed");
			_speed = "slow";
		}
	}
	else if (_keys.ShiftLeft || _keys.ShiftRight) {
		if (_speed != "fast") {
			Meteor.call("fastSpeed");
			_speed = "fast";
		}
	} else if (_speed != "normal") {
		Meteor.call("normalSpeed");
		_speed = "normal";
	}
	requestAnimationFrame(mainLoop);
}
const keyboard = (() => {
    var active = false;
    const keys = {
        ArrowLeft : false,  // only add keys you are interested in
        ArrowRight : false,
				ArrowDown: false,
				ArrowUp: false,
				KeyW: false,
				KeyA: false,
				KeyS: false,
				KeyD: false,
        Space : false,
				ShiftLeft: false,
				ShiftRight: false,
        anyKey : false,
    };
    // map keyCodes to named code.
    const keyCodeMap = {
         k37 : "ArrowLeft",
         k39 : "ArrowRight",
         k32 : "Space",
    };
    function keyEvents (e) {
				if (_started && document.activeElement.name != "shout") {
	        var code = e.code;
	        if (! code) { // if no support for code
	            code = keyCodeMap["k" + e.keyCode];
	        }
	        if (keys[code] !== undefined) {
	            keys[code] = e.type === "keydown";
	            e.preventDefault();
	        }
	        keys.anyKey = true;
				}
    }
    const API = {
        start () {
            if (!active) {
                addEventListener("keyup", keyEvents);
                addEventListener("keydown", keyEvents);
                active = true;
            }
            return keys;
        },
        stop () {
            if (active) {
                removeEventListener("keyup", keyEvents);
                removeEventListener("keydown", keyEvents);
                active = false;
             }
        }
    }
    return API;
})();
var _oldApple = {x: 50, y: 50};
var drawApple = function () {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	var w = c.width;
	var h = c.height;
	var px = w / SIZE;
	var py = h / SIZE;
	ctx.clearRect(Math.floor(_oldApple.x * px - px * 0.5),Math.floor(_oldApple.y * py - py * 0.5), Math.ceil(px) * 2, Math.ceil(py) * 2);
	apple = Apple.findOne({});
	if (apple) {
		_oldApple = apple;
		ctx.beginPath();
		ctx.rect(Math.floor(apple.x * px - px * 0.5),Math.floor(apple.y * py - py * 0.5), Math.ceil(px) * 2, Math.ceil(py) * 2);
		ctx.lineWidth=px;
		ctx.fillStyle = "#FFFFFF";
		ctx.closePath();
		ctx.fill();
	}
}
var _first = function () {
	var user = Meteor.user();
	var username = user && user.username;
	if (!username) return;
	_keys = keyboard.start();
	_playing = true;
	requestAnimationFrame(mainLoop);
	var c = document.getElementById("canvas");
	if (c) {
		c.width = window.innerWidth;
		c.height = window.innerHeight;
		var ctx = c.getContext("2d");
		var w = c.width;
		var h = c.height;
		var px = Math.round(w / SIZE);
		var py = Math.round(h / SIZE);
		ctx.clearRect(0, 0, w, h);
		ctx.lineWidth=px;
		Pixels.find({}).forEach(smake => {
			ctx.beginPath();
			ctx.rect(Math.floor(smake.x * px),Math.floor(smake.y * py), Math.ceil(px), Math.ceil(py));
			ctx.fillStyle = smake.color;
			ctx.closePath();
			ctx.fill();
		_started = true;
		});
		drawApple();
	}
};
var _smakes = {};
var _draw = function () {
	if (!_started) {
		_first();
		return;
	}
	var c = document.getElementById("canvas");
	if (c) {
		var user = Meteor.user();
		var username = user && user.username;
		var ctx = c.getContext("2d");
		var w = c.width;
		var h = c.height;
		var px = Math.round(w / SIZE);
		var py = Math.round(h / SIZE);
		ctx.lineWidth = 10;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		Smakes.find().forEach(smake => {
			if (smake.username in _smakes && (_smakes[smake.username].x == smake.x || _smakes[smake.username].y == smake.y)) {
				var s = _smakes[smake.username];
				var a = smake;
				if (Math.abs(smake.x - s.x) < 10 && Math.abs(smake.y - s.y) < 10) {
					var dx = 0;
					var dy = 0;

					if (s.x - smake.x < 0) dx = 1;
					else if (s.x - smake.x > 0) dx = -1;
					if (s.y - smake.y < 0) dy = 1;
					else if (s.y - smake.y > 0) dy = -1;
					if (dx == 0 && dy == 0) {
						ctx.beginPath();
						ctx.rect(Math.floor(smake.x * px),Math.floor(smake.y * py), Math.ceil(px), Math.ceil(py));
						ctx.fillStyle = smake.color;
						ctx.closePath();
						ctx.fill();
					}
					else {
						while (Math.floor(s.x) != Math.floor(smake.x) || Math.floor(s.y) != Math.floor(smake.y)) {
							s.x += dx;
							s.y += dy;
							ctx.beginPath();
							ctx.rect(Math.floor(s.x * px),Math.floor(s.y * py), Math.ceil(px), Math.ceil(py));
							ctx.fillStyle = smake.color;
							ctx.closePath();
							ctx.fill();
						}
					}
					/*
				//	ctx.beginPath();
				//	ctx.rect(Math.floor(s.x * px),Math.floor(s.y * py), Math.abs(smake.x - s.x) * px, Math.abs(smake.y - s.y) * py);
				//	ctx.fillStyle = smake.color;
				//	ctx.closePath();
				//	ctx.fill();
					var ax = Math.floor(s.x * px + px * 0.5);
					var ay = Math.floor(s.y * py + py * 0.5);
					var bx = Math.floor(a.x * px + px * 0.5);
					var by = Math.floor(a.y * py + py * 0.5);
					ax -= ax % 5;
					bx += bx % 5;
					ay += ay % 5;
					by += by % 5;
					ctx.beginPath();
					ctx.moveTo(ax,ay);
					//ctx.lineTo(Math.floor(a.x * px) + Math.floor(px),Math.floor(a.y * py));
					ctx.lineTo(bx,by);
					//ctx.lineTo(Math.floor(s.x * px), Math.floor(a.y * py) + Math.floor(py));
					//ctx.lineTo(Math.floor(s.x * px),Math.floor(s.y * py));
					ctx.strokeStyle = smake.color;
					ctx.closePath();
					ctx.stroke();
					*/
				}
				// ctx.lineWidth = 10;
			}
			else {
				ctx.beginPath();
				ctx.rect(Math.floor(smake.x * px),Math.floor(smake.y * py), Math.ceil(px), Math.ceil(py));
				ctx.fillStyle = smake.color;
				ctx.closePath();
				ctx.fill();
			}
			_smakes[smake.username] = {x: smake.x, y: smake.y};

		});
		var smakes = {};
		var mostRecent = 0;
		DeadPixels.find().forEach(smake => {
			ctx.clearRect(Math.floor(smake.x * px),Math.floor(smake.y * py), Math.ceil(px), Math.ceil(py));
			if (!(smake.username in smakes)) {
				smakes[smake.username] = smake.createdAt;
			}
			if (smake.createdAt > mostRecent) mostRecent = smake.createdAt;
		});
		for (var smake in smakes) {
			Meteor.call("removePixel",smake, mostRecent);
		}
		drawApple();
	}
};
Tracker.autorun(function () {
	var user = Meteor.user();
	var username = user && user.username;
	var smakes = Smakes.find({username: username}).fetch();
	var deadpixels = DeadPixels.find({username: username}).fetch();
	_draw();
});
Template.game.onRendered( function () {
	_started = false;
	_first();
});
Template.game.onDestroyed( function () {
	_stop();
	Meteor.call("stopGame");
});
Template.game.helpers({

});

Template.game.events({
	'click #makeItem': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		Meteor.call('testMakeItem');
		return false;
	},
	'keydown input': function(event) {
		console.log(event);
	}



});
