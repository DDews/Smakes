var test1 = [
	"sword1",
	"sword2",
	"sword3",
	"sword4",
	"sword5",
	"sword6",
	"dagger6",
	"glove1",
	"glove2",
	"pot_yellow",
	"pot_red",
	"ass",
	"bow6",
	"axe6",
	"katar6",
	"mace6",
	"arrow6",
	"shield6",
	"helm6",
	"armor6",
	"shoes6",
	"leg6",
	"gem6",
	
]
var _arraysize = {

}
Template.shop.helpers({
	testIcons: function() {
		var items = itemDB.toPairRay();
		return items;
	},
	getSlot: function (value) {
		if (value.has("slot")) return value.slot;
		return null;
	},
	partyMember: function() {
		var username = Meteor.user() && Meteor.user().username;
		if (!username) return null;
		var gameinfo = Gameinfo.findOne({username: username});
		if (!gameinfo) return null;
		var unitId = Session.get("unitId");
		var units = gameinfo.units;
		if (!unitId && units[0]) Session.set("unitId",units[0]);
		var players = [];
		var x;
		for (x = 0; x < units.length; x++) {
			players.push(Unitinfo.findOne({_id: units[x]}));
		}
		return players;
	},
	normalPose: function(poses) {
		if (!poses) return null;
		return poses.normal;
	}
	,
	icon: function(object) {
		return itemDB[object].icon;
	},
	clickedItem: function() {
		var item = Session.get("clickedItem");
		if (!item) return null;
		return itemDB[item];
	}
});
_event = {};
Template.shop.events({
	'mouseenter .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		var width = $("[name=tooltip]").width();
		var height = $("[name=tooltip]").height();
		var offset = event.clientX + document.body.scrollLeft + (width / 2) + 12 + "px"
		Session.set("selectedItem",id);
		_event[id] = function(event) {
			var left;
			if (event.clientX + document.body.scrollLeft + (width / 2) > $(window).width()) left = $(window).width() - width - 12;
			else left = event.clientX + document.body.scrollLeft - (width / 2);
			if (event.clientX + document.body.scrollLeft - (width / 2) < 0) left = 0;
			var top = event.clientY + document.body.scrollTop + 20;
			var top2 = top;
			if (event.clientY + document.body.scrollTop + 20 + $('#' + slot).height() > $(document).height()) {
				top = event.clientY + document.body.scrollTop - height - 10;
				top2 = event.clientY + document.body.scrollTop - $('#' + slot).height() - 10;
			}
			$("[name=tooltip]").css({
				position: "absolute",
				display: "inline",
				top: top + "px",
				left: left + "px"
			});
			if (left + (2 * width) + 12 > $(window).width()) offset = left - 12 - width + "px";
			else offset = left + width + 12 + "px";
			$('#' + slot).css({
				position: "absolute",
				display: "inline",
				top: top2 + "px",
				left: offset
			});
		};
		document.addEventListener('mousemove',_event[id](event),false);
		return false;
	},
	'mouseleave .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		document.removeEventListener('mousemove',_event[id](event),false);
		$("[name=tooltip]").css({
			display: "none"
		});
		$('#' + slot).css({
			display: "none"
		});
		return false;
	},
	'click .item': function(event) {
		if (event.preventDefault) event.preventDefault();
		var id = event.currentTarget.id;
		var slot = id.split(' ')[1];
		id = id.split(' ')[0];
		Session.set("clickedItem",id);
		console.log(id);
		$('#buyError').html('');
		$('#buymenu').openModal();
		return false;
	},
	'click #buy': function(event) {
		var clickedItem = Session.get("clickedItem");
		if (!clickedItem) return false;
		Meteor.call("buyItem",clickedItem,$('[name=numToBuy]').val(), function(error, result) {
			if (error) $('#buyError').html(error.reason);
			else {
				$('#buyError').html('');
				$('#buymenu').closeModal();
			}
		});
	}
});