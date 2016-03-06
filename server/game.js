
Meteor.publish("gamedata", function() {
	console.log(this.userId);
	var user = Meteor.users.findOne(this.userId)
	var username = user && user.username
	console.log(username);
	
	return Gameinfo.find( { username: username } );
	
});


Meteor.methods({
	newGame: (data) => {
		console.log("dickbutts");
		var username = Meteor.user() && Meteor.user().username;
		
		if (!username) {
			throw new Meteor.Error(422, "Error: You must be logged in");
		}
		
		if (Gameinfo.findOne({username: username})) {
			throw new Meteor.Error(422, "You already have a game!");
		}
		
		var unit = new Unit();
		unit.name = data.name;
		unit.job = data.job;
		
		console.log(unit);
		
		var gameData = {
			username: username,
			units: [unit],
			items: [],
			combat: null,
		}
			
		console.log(gameData);
		Gameinfo.insert(gameData);
		
	}
		
});