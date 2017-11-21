var SIZE = 50;
var _moving = 'right';
var _keys = new Set();
var _started = false;
var _timeout;
var _stop = function (key) {
	_keys.delete(key);
	if (key == "ShiftLeft" || key == "ShiftRight") Meteor.call("doubleSpeed");
	else if (key == 'ControlLeft' || key == 'ControlRight') Meteor.call("doubleSpeed");
	console.log(key);
};
var _move = function (key) {
	_keys.add(key);
	switch (key) {
		case 'KeyA':
		case 'ArrowLeft':
			Meteor.call("moveLeft");
			break;
		case 'KeyD':
		case 'ArrowRight':
			Meteor.call("moveRight");
			break;
		case 'KeyW':
		case 'ArrowUp':
			Meteor.call("moveUp");
			break;
		case 'KeyS':
		case 'ArrowDown':
			Meteor.call("moveDown");
			break;
		case 'ShiftLeft':
		case 'ShiftRight':
			Meteor.call("normalSpeed");
			break;
		case 'ControlLeft':
		case 'ControlRight':
			Meteor.call("slowSpeed");
	}
};
var _first = function () {
	var c = document.getElementById("canvas");
	if (c) {
		var user = Meteor.user();
		var username = user && user.username;
		var ctx = c.getContext("2d");
		var w = c.width;
		var h = c.height;
		var px = Math.floor(w / SIZE);
		var py = Math.floor(h / SIZE);
		ctx.clearRect(0, 0, w, h);
		Pixels.find({username: user.username}).forEach(smake => {
			ctx.beginPath();
			ctx.fillStyle = smake.color;
			ctx.rect(smake.x * px,smake.y * py, px, py);
			ctx.lineWidth=px;
			ctx.fill();
		});
	}
	document.addEventListener('keydown', function (e) { _move(e.code); e.preventDefault(); });
	document.addEventListener('keyup', function (e) { if (_timeout) clearTimeout(_timeout); _timeout = setTimeout( function() { _stop(e.code); e.preventDefault(); }, 150) });
	_started = true;
};
var _draw = function () {
	if (!_started) return;
	var c = document.getElementById("canvas");
	if (c) {
		var user = Meteor.user();
		var username = user && user.username;
		var ctx = c.getContext("2d");
		var w = c.width;
		var h = c.height;
		var px = Math.floor(w / SIZE);
		var py = Math.floor(h / SIZE);
		Smakes.find({username: user.username}).forEach(smake => {
			ctx.beginPath();
			ctx.fillStyle = smake.color;
			ctx.lineWidth=px;
			ctx.rect(smake.x * px,smake.y * py, px, py);
			ctx.fill();
			ctx.closePath();
		});
		var mostRecent = {};
		DeadPixels.find({username: user.username}).forEach(smake => {
			ctx.clearRect(smake.x * px, smake.y * py, px, py);
			if (mostRecent[smake.smake]) {
				if (smake.createdAt > mostRecent[smake.smake]) mostRecent[smake.smake] = smake.createdAt;
			} else {
				mostRecent[smake.smake] = smake.createdAt;
			}
		});
		for (var smake in mostRecent) {
			Meteor.call("removePixel",smake, mostRecent[smake]);
		}
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
