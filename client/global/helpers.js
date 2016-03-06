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


Handlebars.registerHelper('healthbar', (val, max, color) => {
	if (!max) { max = 1.0; }
	var fill = Math.floor(val / max * 100);
	if (!color) { color = "green"; }
	
	var bar = '<div class="progress ' + color + ' lighten-3">'
	bar += '<div class="determinate ' + color + '" style="width:' + fill + '%"></div>'
	bar += '</div>'
	
	return bar;
})

