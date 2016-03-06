
Meteor.publish("gamedata", () => {
	if (this.userId) {
		return Gameinfo.findOne( { username: this.userId().username } );
	}
	return null;
	
});


Meteor.methods({
	newGame: () => {
		console.log("dickbutts");
		var username = Meteor.user() && Meteor.user().username;
		
		if (!username) {
			throw new Meteor.Error(422, "Error: You must be logged in");
		}
		
		var unit = new Unit();
		
		
	}
		
});