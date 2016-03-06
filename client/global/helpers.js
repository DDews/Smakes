Handlebars.registerHelper('currentUserWalletExists', () => {
	var username = Meteor.user();
	username = username && username.username;
	if (!username) return;
	
	var user = Userinfo.findOne({username: username});
	var wallet = user && user.wallet;
	
	if (!wallet) {
		Meteor.call("newWallet", username);
		return null;
	}
	
	return wallet;
})

Handlebars.registerHelper('currentUserWallet', () => {
	var username = Meteor.user();
	username = username && username.username;
	if (!username) return null;
	
	var user = Userinfo.findOne({username: username});
	var wallet = user && user.wallet;
	
	if (!wallet) {
		Meteor.call("newWallet", username);
		return null;
	}
	
	return wallet.toPairRay();
})

function div(clas, content, style) { 
	if (style) {
		return '<div class="' + clas + '" style="' + style+ '">' + content + '</div>'
	}
	return '<div class="' + clas + '">' + content + '</div>'
}
function span(clas, content) { 
	return '<span class="' + clas + '">' + content + '</span>' 
}

var br = "<br />"

var progressBack = "progress lighten-3 "
var progressFront = "determinate "

function unCamelCase(string) {
	return string.replace(/[A-Z]/g, function(x) { return " " + x; }).capitalize();
}

Handlebars.registerHelper('unCamelCase', unCamelCase)

Handlebars.registerHelper('healthbar', (val, max, color) => {
	if (!max) { max = 1.0; }
	var fill = Math.floor(val / max * 100);
	if (!color) { color = "green"; }
	
	return div(progressBack + color, 
			   div(progressFront + color, "", "width: " + fill + "%")
			  );
	
})

Handlebars.registerHelper('regions', () => { return areaData.toPairRay(); })


Handlebars.registerHelper('regionDropdown', () => {
	var str = '<div class="input-field col s12"><select name="area">'
	areaData.each((name, data) => {
		str += '<option value="' + name + '">' + name + '</option>'
	});
	str += '</select>'
	str += '</div>' + br + "urmomolololoollol"
	
	return str;
})


function vitalContent(unit, vital, color, mvital) {
	var healthbar = Blaze._globalHelpers['healthbar']
	mvital = (mvital || "m" + vital);
	var mval = unit[mvital];
	var val = unit.has(vital) ? unit[vital] : mval * .5;
	
	var str = div("small", vital + ": " + Math.floor(val) + " / " + Math.floor(mval));
	str += healthbar(val, mval, color);
	
	return str;
}
function vitalContentNoText(unit, vital, color, mvital) {
	var healthbar = Blaze._globalHelpers['healthbar']
	mvital = (mvital || "m" + vital);
	var mval = unit[mvital];
	var val = unit.has(vital) ? unit[vital] : mval * .5;
	
	return healthbar(val, mval, color);
}

Handlebars.registerHelper('unitCard', (_id) => {
	var unit = Unitinfo.find(_id).fetch()[0];
	console.log(unit);
	console.log("unit: " + _id);
	
	console.log(Unitinfo.find().count())
	
	var card = '<div class="col s12 m6 l3 card blue-grey darken-4">'
	card += '<div class="card-content white-text">'
	card += '<span class="card-title">' + unit.name + '</span>'
	card += br + "lv. " + unit.level + " " + unit.job + " (" + unit.team + ")" + br + br;
	
	card += vitalContent(unit, "hp", "green")
	card += vitalContent(unit, "mp", "blue")
	card += vitalContent(unit, "sp", "red")
	card += vitalContent(unit, "exp", "purple", "tnl")
	card += vitalContentNoText(unit, "timer", "cyan", "timeout")
	
	card += '</div>'
	
	card += '<div class="card-action">'
	
	card += '</div>'
	
	card += '</div>'
	
	return card;
})