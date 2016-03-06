var japaneseSounds = [
	"a", "i", "u", "e", "o",
	"a", "i", "u", "e", "o",
	"ka", "ki", "ku", "ke", "ko",
	"ka", "ki", "ku", "ke", "ko",
	"ga", "gi", "gu", "ge", "go",
	"ga", "gi", "gu", "ge", "go",
	"sa", "shi", "su", "se", "so",
	"sa", "shi", "su", "se", "so",
	"za", "ji", "zu", "ze", "zo",
	"za", "ji", "zu", "ze", "zo",
	"ta", "chi", "tsu", "te", "to",
	"ta", "chi", "tsu", "te", "to",
	"da", "ji", "zu", "de", "do",
	"da", "ji", "zu", "de", "do",
	"na", "ni", "nu", "ne", "no",
	"na", "ni", "nu", "ne", "no",
	"ha", "hi", "fu", "he", "ho",
	"ha", "hi", "fu", "he", "ho",
	"ba", "bi", "bu", "be", "bo",
	"ba", "bi", "bu", "be", "bo",
	"pa", "pi", "pu", "pe", "po",
	"pa", "pi", "pu", "pe", "po",
	"ma", "mi", "mu", "me", "mo",
	"ma", "mi", "mu", "me", "mo",
	"ya",       "yu",       "yo",
	"ya",       "yu",       "yo",
	"kya",      "kyu",      "kyo",
	"sha",      "shu",      "sho",
	"cha",      "chu",      "cho",
	"nya",      "nyu",      "nyo",
	"hya",      "hyu",      "hyo",
	"mya",      "myu",      "myo",
	"rya",      "ryu",      "ryo",
	"gya",      "gyu",      "gyo",
	"ja",       "ju",       "jo",
	"ja",       "ju",       "jo",
	"bya",      "byu",      "byo",
	"pya",      "pyu",      "pyo",
	"ra", "ri", "ru", "re", "ro",
	"ra", "ri", "ru", "re", "ro",
	"wa", "wi",       "we", "wo",
];


Template['game'].helpers({
	gameInfoExists: function() {
		var data = Gameinfo.findOne();
		console.log(data);
		if (data) { return true; }
		return false;
	},
	generateName: function() {
		var cnt = 1 + Math.random() * 4;
		var n = "";
		cnt.times( () => {
			n += japaneseSounds.choose();
		})
		return n.capitalize();
	}
});

Template.game.events({
	'click #newGame': function(event) {
		if (event && event.preventDefault) event.preventDefault();
		alert("Gay")
		
		return false
	}
});