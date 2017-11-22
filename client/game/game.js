var SIZE = 100.0;
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
var drawApple = function () {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	var w = c.width;
	var h = c.height;
	var px = w / SIZE;
	var py = h / SIZE;
	apple = Apple.findOne({});
	if (apple) {
		ctx.beginPath();
		ctx.rect(Math.floor(apple.x * px),Math.floor(apple.y * py), Math.ceil(px), Math.ceil(py));
		ctx.lineWidth=px;
		ctx.fillStyle = "#FFFFFF";
		ctx.closePath();
		ctx.fill();
	}
}
var _first = function () {
	_keys = keyboard.start();
	_playing = true;
	requestAnimationFrame(mainLoop);
	var c = document.getElementById("canvas");
	if (c) {
		c.width = window.innerWidth;
		c.height = window.innerHeight;
		var user = Meteor.user();
		var username = user && user.username;
		var ctx = c.getContext("2d");
		var w = c.width;
		var h = c.height;
		var px = w / SIZE;
		var py = h / SIZE;
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
		var px = w / SIZE;
		var py = h / SIZE;
		ctx.lineWidth=px;
		Smakes.find().forEach(smake => {
			ctx.beginPath();
			ctx.rect(Math.floor(smake.x * px),Math.floor(smake.y * py), Math.ceil(px), Math.ceil(py));
			ctx.fillStyle = smake.color;
			ctx.closePath();
			ctx.fill();
			console.log(smake.username + ": " + smake.color);
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
