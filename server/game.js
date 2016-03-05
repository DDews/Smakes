
Meteor.publish("gamedata", () => {
	if (this.userId) {
		return Gameinfo.findOne( { username: this.userId().username } );
	} else {
		return null;
	}
	
	
});
