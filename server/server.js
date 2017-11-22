Meteor.publish("messages", function() {
    var user = Meteor.users.findOne(this.userId);
    if (user == null) return null;
    return Messages.find({
        showTo:{$elemMatch:{$eq:user.username}},
        $or: [
            { to: user.username },
            { from: user.username }
        ]
    })
});
Meteor.publish("shoutmessages", function() {
    return Shoutmessages.find();
});
Meteor.publish("smakes", function() {
  return Smakes.find();
});
Meteor.publish("apple", function() {
  return Apple.find();
})
Meteor.publish("games", function() {
  var user = Meteor.users.findOne(this.userId);
  if (user == null) return null;
  return Games.find({username: user.username});
});
Meteor.publish("deadpixels", function() {
  var user = Meteor.users.findOne(this.userId);
  if (user == null) return null;
  return DeadPixels.find();
});
Meteor.publish("pixels", function() {
  var user = Meteor.users.findOne(this.userId);
  if (user == null) return null;
  return Pixels.find();
})
badchars = ["̀","́","̂","̃","̄","̅","̆","̇","̈","̉","̊","̋","̌","̍","̎","̏","̐","̑","̒","̓","̔","̕","̖","̗","̘","̙","̚","̛","̜","̝","̞","̟","̠","̡","̢","̣","̤","̥","̦","̧","̨","̩","̪","̫","̬","̭","̮","̯","̰","̱","̲","̳","̴","̵","̶","̷","̸","̹","̺","̻","̼","̽","̾","̿","̀","́","͂","̓","̈́","ͅ","͆","͇","͈","͉","͊","͋","͌","͍","͎","͏","͐","͑","͒","͓","͔","͕","͖","͗","͘","͙","͚","͛","͜","͝","͞","͟","͠","͡","͢","ͣ","ͤ","ͥ","ͦ","ͧ","ͨ","ͩ","ͪ","ͫ","ͬ","ͭ","ͮ","ͯ","҃","҄","҅","҆","҇","҈","҉","֑","֒","֓","֔","֕","֖","֗","֘","֙","֚","֛","֜","֝","֞","֟","֠","֡","֢","֣","֤","֥","֦","֧","֨","֩","֪","֫","֬","֭","֮","֯","ְ","ֱ","ֲ","ֳ","ִ","ֵ","ֶ","ַ","ָ","ֹ","ֺ","ֻ","ּ","ֽ","ֿ","ׁ","ׂ","ׄ","ׅ","ׇ","ؐ","ؑ","ؒ","ؓ","ؔ","ؕ","ؖ","ؗ","ؘ","ؙ","ؚ","ً","ٌ","ٍ","َ","ُ","ِ","ّ","ْ","ٓ","ٔ","ٕ","ٖ","ٗ","٘","ٙ","ٚ","ٛ","ٜ","ٝ","ٞ","ٟ","ٰ","ۖ","ۗ","ۘ","ۙ","ۚ","ۛ","ۜ","۟","۠","ۡ","ۢ","ۣ","ۤ","ۧ","ۨ","۪","۫","۬","ۭ","ܑ","ܰ","ܱ","ܲ","ܳ","ܴ","ܵ","ܶ","ܷ","ܸ","ܹ","ܺ","ܻ","ܼ","ܽ","ܾ","ܿ","݀","݁","݂","݃","݄","݅","݆","݇","݈","݉","݊","ަ","ާ","ި","ީ","ު","ޫ","ެ","ޭ","ޮ","ޯ","ް","߫","߬","߭","߮","߯","߰","߱","߲","߳","ࠖ","ࠗ","࠘","࠙","ࠛ","ࠜ","ࠝ","ࠞ","ࠟ","ࠠ","ࠡ","ࠢ","ࠣ","ࠥ","ࠦ","ࠧ","ࠩ","ࠪ","ࠫ","ࠬ","࠭","࡙","࡚","࡛","ࣣ","ࣤ","ࣥ","ࣦ","ࣧ","ࣨ","ࣩ","࣪","࣫","࣬","࣭","࣮","࣯","ࣰ","ࣱ","ࣲ","ࣳ","ࣴ","ࣵ","ࣶ","ࣷ","ࣸ","ࣹ","ࣺ","ࣻ","ࣼ","ࣽ","ࣾ","ࣿ","ऀ","ँ","ं","ऺ","़","ु","ू","ृ","ॄ","ॅ","ॆ","े","ै","्","॑","॒","॓","॔","ॕ","ॖ","ॗ","ॢ","ॣ","ঁ","়","ু","ূ","ৃ","ৄ","্","ৢ","ৣ","ਁ","ਂ","਼","ੁ","ੂ","ੇ","ੈ","ੋ","ੌ","੍","ੑ","ੰ","ੱ","ੵ","ઁ","ં","઼","ુ","ૂ","ૃ","ૄ","ૅ","ે","ૈ","્","ૢ","ૣ","ଁ","଼","ି","ୁ","ୂ","ୃ","ୄ","୍","ୖ","ୢ","ୣ","ஂ","ீ","்","ఀ","ా","ి","ీ","ె","ే","ై","ొ","ో","ౌ","్","ౕ","ౖ","ౢ","ౣ","ಁ","಼","ಿ","ೆ","ೌ","್","ೢ","ೣ","ഁ","ു","ൂ","ൃ","ൄ","്","ൢ","ൣ","්","ි","ී","ු","ූ","ั","ิ","ี","ึ","ื","ุ","ู","ฺ","็","่","้","๊","๋","์","ํ","๎","ັ","ິ","ີ","ຶ","ື","ຸ","ູ","ົ","ຼ","່","້","໊","໋","໌","ໍ","༘","༙","༵","༷","༹","ཱ","ི","ཱི","ུ","ཱུ","ྲྀ","ཷ","ླྀ","ཹ","ེ","ཻ","ོ","ཽ","ཾ","ྀ","ཱྀ","ྂ","ྃ","྄","྆","྇","ྍ","ྎ","ྏ","ྐ","ྑ","ྒ","ྒྷ","ྔ","ྕ","ྖ","ྗ","ྙ","ྚ","ྛ","ྜ","ྜྷ","ྞ","ྟ","ྠ","ྡ","ྡྷ","ྣ","ྤ","ྥ","ྦ","ྦྷ","ྨ","ྩ","ྪ","ྫ","ྫྷ","ྭ","ྮ","ྯ","ྰ","ྱ","ྲ","ླ","ྴ","ྵ","ྶ","ྷ","ྸ","ྐྵ","ྺ","ྻ","ྼ","࿆","ိ","ီ","ု","ူ","ဲ","ဳ","ဴ","ဵ","ံ","့","္","်","ွ","ှ","ၘ","ၙ","ၞ","ၟ","ၠ","ၱ","ၲ","ၳ","ၴ","ႂ","ႅ","ႆ","ႍ","ႝ","፝","፞","፟","ᜒ","ᜓ","᜔","ᜲ","ᜳ","᜴","ᝒ","ᝓ","ᝲ","ᝳ","឴","឵","ិ","ី","ឹ","ឺ","ុ","ូ","ួ","ំ","៉","៊","់","៌","៍","៎","៏","័","៑","្","៓","៝","᠋","᠌","᠍","ᢩ","ᤠ","ᤡ","ᤢ","ᤧ","ᤨ","ᤲ","᤹","᤺","᤻","ᨗ","ᨘ","ᨛ","ᩖ","ᩘ","ᩙ","ᩚ","ᩛ","ᩜ","ᩝ","ᩞ","᩠","ᩢ","ᩥ","ᩦ","ᩧ","ᩨ","ᩩ","ᩪ","ᩫ","ᩬ","ᩳ","ᩴ","᩵","᩶","᩷","᩸","᩹","᩺","᩻","᩼","᩿","᪰","᪱","᪲","᪳","᪴","᪵","᪶","᪷","᪸","᪹","᪺","᪻","᪼","᪽","᪾","ᬀ","ᬁ","ᬂ","ᬃ","᬴","ᬶ","ᬷ","ᬸ","ᬹ","ᬺ","ᬼ","ᭂ","᭫","᭬","᭭","᭮","᭯","᭰","᭱","᭲","᭳","ᮀ","ᮁ","ᮢ","ᮣ","ᮤ","ᮥ","ᮨ","ᮩ","᮫","ᮬ","ᮭ","᯦","ᯨ","ᯩ","ᯭ","ᯯ","ᯰ","ᯱ","ᰬ","ᰭ","ᰮ","ᰯ","ᰰ","ᰱ","ᰲ","ᰳ","ᰶ","᰷","᳐","᳑","᳒","᳔","᳕","᳖","᳗","᳘","᳙","᳚","᳛","᳜","᳝","᳞","᳟","᳠","᳢","᳣","᳤","᳥","᳦","᳧","᳨","᳭","᳴","᳸","᳹","᷀","᷁","᷂","᷃","᷄","᷅","᷆","᷇","᷈","᷉","᷊","᷋","᷌","᷍","᷎","᷏","᷐","᷑","᷒","ᷓ","ᷔ","ᷕ","ᷖ","ᷗ","ᷘ","ᷙ","ᷚ","ᷛ","ᷜ","ᷝ","ᷞ","ᷟ","ᷠ","ᷡ","ᷢ","ᷣ","ᷤ","ᷥ","ᷦ","ᷧ","ᷨ","ᷩ","ᷪ","ᷫ","ᷬ","ᷭ","ᷮ","ᷯ","ᷰ","ᷱ","ᷲ","ᷳ","ᷴ","᷵","᷼","᷽","᷾","᷿","⃐","⃑","⃒","⃓","⃔","⃕","⃖","⃗","⃘","⃙","⃚","⃛","⃜","⃝","⃞","⃟","⃠","⃡","⃢","⃣","⃤","⃥","⃦","⃧","⃨","⃩","⃪","⃫","⃬","⃭","⃮","⃯","⃰","⳯","⳰","⳱","⵿","ⷠ","ⷡ","ⷢ","ⷣ","ⷤ","ⷥ","ⷦ","ⷧ","ⷨ","ⷩ","ⷪ","ⷫ","ⷬ","ⷭ","ⷮ","ⷯ","ⷰ","ⷱ","ⷲ","ⷳ","ⷴ","ⷵ","ⷶ","ⷷ","ⷸ","ⷹ","ⷺ","ⷻ","ⷼ","ⷽ","ⷾ","ⷿ","〪","〫","〬","〭","゙","゚","꙯","꙰","꙱","꙲","ꙴ","ꙵ","ꙶ","ꙷ","ꙸ","ꙹ","ꙺ","ꙻ","꙼","꙽","ꚞ","ꚟ","꛰","꛱","ꠂ","꠆","ꠋ","ꠥ","ꠦ","꣄","꣠","꣡","꣢","꣣","꣤","꣥","꣦","꣧","꣨","꣩","꣪","꣫","꣬","꣭","꣮","꣯","꣰","꣱","ꤦ","ꤧ","ꤨ","ꤩ","ꤪ","꤫","꤬","꤭","ꥇ","ꥈ","ꥉ","ꥊ","ꥋ","ꥌ","ꥍ","ꥎ","ꥏ","ꥐ","ꥑ","ꦀ","ꦁ","ꦂ","꦳","ꦶ","ꦷ","ꦸ","ꦹ","ꦼ","ꧥ","ꨩ","ꨪ","ꨫ","ꨬ","ꨭ","ꨮ","ꨱ","ꨲ","ꨵ","ꨶ","ꩃ","ꩌ","ꩼ","ꪰ","ꪲ","ꪳ","ꪴ","ꪷ","ꪸ","ꪾ","꪿","꫁","ꫬ","ꫭ","꫶","ꯥ","ꯨ","꯭","ﬞ","︀","︁","︂","︃","︄","︅","︆","︇","︈","︉","︊","︋","︌","︍","︎","️","︠","︡","︢","︣","︤","︥","︦","︧","︨","︩","︪","︫","︬","︭","︮","︯","𐇽","𐋠","𐍶","𐍷","𐍸","𐍹","𐍺","𐨁","𐨂","𐨃","𐨅","𐨆","𐨌","𐨍","𐨎","𐨏","𐨸","𐨹","𐨺","𐨿","𐫥","𐫦","𑀁","𑀸","𑀹","𑀺","𑀻","𑀼","𑀽","𑀾","𑀿","𑁀","𑁁","𑁂","𑁃","𑁄","𑁅","𑁆","𑁿","𑂀","𑂁","𑂳","𑂴","𑂵","𑂶","𑂹","𑂺","𑄀","𑄁","𑄂","𑄧","𑄨","𑄩","𑄪","𑄫","𑄭","𑄮","𑄯","𑄰","𑄱","𑄲","𑄳","𑄴","𑅳","𑆀","𑆁","𑆶","𑆷","𑆸","𑆹","𑆺","𑆻","𑆼","𑆽","𑆾","𑇊","𑇋","𑇌","𑈯","𑈰","𑈱","𑈴","𑈶","𑈷","𑋟","𑋣","𑋤","𑋥","𑋦","𑋧","𑋨","𑋩","𑋪","𑌀","𑌁","𑌼","𑍀","𑍦","𑍧","𑍨","𑍩","𑍪","𑍫","𑍬","𑍰","𑍱","𑍲","𑍳","𑍴","𑒳","𑒴","𑒵","𑒶","𑒷","𑒸","𑒺","𑒿","𑓀","𑓂","𑓃","𑖲","𑖳","𑖴","𑖵","𑖼","𑖽","𑖿","𑗀","𑗜","𑗝","𑘳","𑘴","𑘵","𑘶","𑘷","𑘸","𑘹","𑘺","𑘽","𑘿","𑙀","𑚫","𑚭","𑚰","𑚱","𑚲","𑚳","𑚴","𑚵","𑚷","𑜝","𑜞","𑜟","𑜢","𑜣","𑜤","𑜥","𑜧","𑜨","𑜩","𑜪","𑜫","𖫰","𖫱","𖫲","𖫳","𖫴","𖬰","𖬱","𖬲","𖬳","𖬴","𖬵","𖬶","𖾏","𖾐","𖾑","𖾒","𛲝","𛲞","𝅧","𝅨","𝅩","𝅻","𝅼","𝅽","𝅾","𝅿","𝆀","𝆁","𝆂","𝆅","𝆆","𝆇","𝆈","𝆉","𝆊","𝆋","𝆪","𝆫","𝆬","𝆭","𝉂","𝉃","𝉄","𝨀","𝨁","𝨂","𝨃","𝨄","𝨅","𝨆","𝨇","𝨈","𝨉","𝨊","𝨋","𝨌","𝨍","𝨎","𝨏","𝨐","𝨑","𝨒","𝨓","𝨔","𝨕","𝨖","𝨗","𝨘","𝨙","𝨚","𝨛","𝨜","𝨝","𝨞","𝨟","𝨠","𝨡","𝨢","𝨣","𝨤","𝨥","𝨦","𝨧","𝨨","𝨩","𝨪","𝨫","𝨬","𝨭","𝨮","𝨯","𝨰","𝨱","𝨲","𝨳","𝨴","𝨵","𝨶","𝨻","𝨼","𝨽","𝨾","𝨿","𝩀","𝩁","𝩂","𝩃","𝩄","𝩅","𝩆","𝩇","𝩈","𝩉","𝩊","𝩋","𝩌","𝩍","𝩎","𝩏","𝩐","𝩑","𝩒","𝩓","𝩔","𝩕","𝩖","𝩗","𝩘","𝩙","𝩚","𝩛","𝩜","𝩝","𝩞","𝩟","𝩠","𝩡","𝩢","𝩣","𝩤","𝩥","𝩦","𝩧","𝩨","𝩩","𝩪","𝩫","𝩬","𝩵","𝪄","𝪛","𝪜","𝪝","𝪞","𝪟","𝪡","𝪢","𝪣","𝪤","𝪥","𝪦","𝪧","𝪨","𝪩","𝪪","𝪫","𝪬","𝪭","𝪮","𝪯","𞣐","𞣑","𞣒","𞣓","𞣔","𞣕","𞣖","󠄀","󠄁","󠄂","󠄃","󠄄","󠄅","󠄆","󠄇","󠄈","󠄉","󠄊","󠄋","󠄌","󠄍","󠄎","󠄏","󠄐","󠄑","󠄒","󠄓","󠄔","󠄕","󠄖","󠄗","󠄘","󠄙","󠄚","󠄛","󠄜","󠄝","󠄞","󠄟","󠄠","󠄡","󠄢","󠄣","󠄤","󠄥","󠄦","󠄧","󠄨","󠄩","󠄪","󠄫","󠄬","󠄭","󠄮","󠄯","󠄰","󠄱","󠄲","󠄳","󠄴","󠄵","󠄶","󠄷","󠄸","󠄹","󠄺","󠄻","󠄼","󠄽","󠄾","󠄿","󠅀","󠅁","󠅂","󠅃","󠅄","󠅅","󠅆","󠅇","󠅈","󠅉","󠅊","󠅋","󠅌","󠅍","󠅎","󠅏","󠅐","󠅑","󠅒","󠅓","󠅔","󠅕","󠅖","󠅗","󠅘","󠅙","󠅚","󠅛","󠅜","󠅝","󠅞","󠅟","󠅠","󠅡","󠅢","󠅣","󠅤","󠅥","󠅦","󠅧","󠅨","󠅩","󠅪","󠅫","󠅬","󠅭","󠅮","󠅯","󠅰","󠅱","󠅲","󠅳","󠅴","󠅵","󠅶","󠅷","󠅸","󠅹","󠅺","󠅻","󠅼","󠅽","󠅾","󠅿","󠆀","󠆁","󠆂","󠆃","󠆄","󠆅","󠆆","󠆇","󠆈","󠆉","󠆊","󠆋","󠆌","󠆍","󠆎","󠆏","󠆐","󠆑","󠆒","󠆓","󠆔","󠆕","󠆖","󠆗","󠆘","󠆙","󠆚","󠆛","󠆜","󠆝","󠆞","󠆟","󠆠","󠆡","󠆢","󠆣","󠆤","󠆥","󠆦","󠆧","󠆨","󠆩","󠆪","󠆫","󠆬","󠆭","󠆮","󠆯","󠆰","󠆱","󠆲","󠆳","󠆴","󠆵","󠆶","󠆷","󠆸","󠆹","󠆺","󠆻","󠆼","󠆽","󠆾","󠆿","󠇀","󠇁","󠇂","󠇃","󠇄","󠇅","󠇆","󠇇","󠇈","󠇉","󠇊","󠇋","󠇌","󠇍","󠇎","󠇏","󠇐","󠇑","󠇒","󠇓","󠇔","󠇕","󠇖","󠇗","󠇘","󠇙","󠇚","󠇛","󠇜","󠇝","󠇞","󠇟","󠇠","󠇡","󠇢","󠇣","󠇤","󠇥","󠇦","󠇧","󠇨","󠇩","󠇪","󠇫","󠇬","󠇭","󠇮","󠇯"];

isZalgo = function(string) {
    return string.match(RegExp(badchars.join('|')));
}
isHTML = function(string) {
    var array = string.match(/(<|>)/);
    if (array) return array[1];
    return false;
}
var isWhitespace = function(string) {
    return !string.replace(/\s/g, '').length
}
Meteor.publish("usernames", function() {
   return Meteor.users.find({},{username: 1, status: 1});
});
Meteor.publish("userinfo", function() {
   return Userinfo.find();
});
Meteor.publish("topics", function() {
    return Topics.find();
})
Meteor.publish("threads", function() {
    return Threads.find();
});
Meteor.publish("posts", function() {
    return Posts.find();
});
Accounts.validateNewUser(function (user) {
    var matches = user.username.match(/[a-zA-Z][a-zA-Z0-9]*/);
    if (user.username && matches != null && matches.length <= 1)
        return true;
    throw new Meteor.Error(403, "Username must start with a letter and only contain numbers and letters.");
});

Meteor.startup(function() {
    Future = Npm.require("fibers/future");
    // Load exec
    exec = Npm.require("child_process").exec;
    reCAPTCHA.config({
        privatekey: '6LcluzkUAAAAAMECc9iTkYqTlhM2VukrdTYc4ztj'
    });
    if (!Meteor.users.findOne({username: 'admin'})) {
        Accounts.createUser({
            password: 'admin',
            username: 'admin',
            admin: true,
            createdAt: new Date(),
        });
        Userinfo.insert(
            {
                username: 'admin',
                admin: true,
                posts: 0,
                points: 0
            }
        );
    }
});
replaceHTML = function(message) {
    message = message.replace(RegExp("<","g"),"&lt;").replace(RegExp(">","g"),"&gt;");
    message = bbcodify(message);
    var matching = /\[quote=\"([^\[\]]*)\"\]([^\[\]]*?)\[\/quote\]/;
    while (message.match(matching)) {
        message = message.replace(/\[quote=\"([^\[\]]*)\"\]([^\[\]]*?)\[\/quote\]/,'<blockquote class="blockquote"><div><cite>$1 wrote:</cite><p>$2</p></div></blockquote>');
    }
    return urlify(message);
}
checkThreadSubscriptions = function(author, threadId, postId, subject, message) {
    var users = Userinfo.find().fetch();
    var x = 0;
    var tracked;
    var authors;
    var threadSubject = Threads.findOne({_id: threadId}).subject;
    for (x = 0; x < users.length; x++) {
        tracked = users[x].track || {};
        if (tracked.has(threadId)) {
            authors = users[x].authors || {};
            if (!authors.has(author) && (users[x].username != author)) {
                if (users[x].sendemail) {
                    var emails = Meteor.users.findOne({username: users[x].username});
                    if (emails) {
                        var posts = Math.ceil(Posts.find({threadId: threadId}).count() / 10);
                        var email = emails.emails[0].address;
                        message = replaceHTML(message);
                        Email.send({
                            to: email,
                            from: "noreply@desynched.loganshouse.com",
                            subject: author + " replied to thread: " + threadSubject,
                            html: '<h4>' + subject + '</h4><br>from ' + author + ':<br>' + message + '<br><br>------------------------------------------------<br>Click <a href="http://desynched.loganshouse.com:3000/posts/' + threadId + '/' + posts + '">here</a> to see the thread.</body></html>'
                        });
                    }
                }
            }
        }
    }
}
updateSubscriptions = function(author, postId, subject, message) {
    var users = Userinfo.find().fetch();
    var x = 0;
    var authors;
    var value;
    for (x = 0; x < users.length; x++) {
        authors = users[x].authors || {};
        if (authors.has(author)) {
            value = authors[author];
            value.push(postId);
            authors[author] = value;
            Userinfo.update(users[x]._id,{$set:{authors: authors}});
            var userinfo = Userinfo.findOne({_id: users[x]._id});
            if (userinfo.sendemail) {
                var post = Posts.findOne({_id: postId});
                var threadId = post.threadId;
                var posts = Math.ceil(Posts.find({threadId: threadId}).count() / 10);
                var emails = Meteor.users.findOne({username: users[x].username});
                if (emails) {
                    var email = emails.emails[0].address;
                    message = replaceHTML(message);
                    Email.send({
                        to: email,
                        from: "noreply@desynched.loganshouse.com",
                        subject: author + ": " + subject,
                        html: '<h4>' + subject + '</h4><br>from ' + author + ':<br>' + message + '<br><br>------------------------------------------------<br>Click <a href="http://desynched.loganshouse.com:3000/posts/' + threadId + '/' + posts + '">here</a> to see the thread.</body></html>'
                    });
                }
            }

        }
    }
}
cleanSubscriptions = function() {
    var users = Userinfo.find().fetch();
    var x = 0;
    var authors;
    for (x = 0; x < users.length; x++) {
        console.log(users[x].username);
        authors = users[x].authors || {};
        authors.each(function(author,posts) {
            var y = 0;
            var output = posts;
            for (y = 0; y < posts.length; y++) {
                if (!Posts.findOne({_id: posts[y]})) {
                    output = _.without(output,posts[y]);
                }
            }
            authors[author] = output || [];
        });
        Userinfo.update(users[x]._id,{$set:{authors: authors}});
    }
}
Meteor.methods({
    gitPull: function() {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422,"Error: you must be logged in");
        var isAdmin = Userinfo.findOne({username: username});
        var isAdmin = isAdmin && isAdmin.admin;
        if (!isAdmin) throw new Meteor.Error(422,"Error: unauthorized");
        this.unblock();
        var future = new Future();
        exec("git pull origin master", function (error,stdout,stderr) {
            if (error) {
                console.log(error);
                throw new Meteor.Error(500,"git pull origin master failed");
            }
            future.return(stdout.toString());
        });
        return future.wait();
    },
    formSubmissionMethod: function(username, password, captchaData) {
        if (username.length > 20) throw new Meteor.Error(422,"Username is longer than 20 characters");
        var verifyCaptchaResponse = {success: true};/*reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);*/

        if (!verifyCaptchaResponse.success) {
            throw new Meteor.Error(422,verifyCaptchaResponse[Object.keys(verifyCaptchaResponse)[1]]);
        } else {
            var response = Accounts.createUser({
                password: password,
                username: username,
                createdAt: new Date(),
            });
            if (!Userinfo.findOne({username: RegExp('^' + username + '$',"i")})) {
				Userinfo.insert({
                    username: username,
                    admin: false,
                    posts: 0,
					totalKarma: 0,
					wallet: {
						karma: 0,
						gold: 100,
					},
                });
			}
        }
    },
    sendShout: function(msg) {
        var username = Meteor.user() && Meteor.user().username;
        if (isZalgo(msg)) throw new Meteor.Error(422,"Error: Zalgo text detected");
        if (!username) throw new Meteor.Error(422,"Error: you must be logged in");
        if (msg.length <= 0) throw new Meteor.Error(422, "Error: empty message");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 100 + 5 * karma;
        if (msg.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        if (Shoutmessages.find().count() > 20) {
            var firstmsg = Shoutmessages.findOne({},{sort: {createdAt: 1 }});
            Shoutmessages.remove(firstmsg._id);
        }
        Shoutmessages.insert(
            {
                createdAt: new Date(),
                username: username,
                message: msg
            }
        );
    },
    createTopic: function(topic, subject) {
        var username = Meteor.user() && Meteor.user().username;
        if (isZalgo(topic)) throw new Meteor.Error(422,"Error: Zalgo text detected");
        //if (isHTML(topic) || isHTML(subject)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var isAdmin = Userinfo.findOne({username: username});
        var isAdmin = isAdmin && isAdmin.admin;
        if (!isAdmin) throw new Meteor.Error(422,"Error: unauthorized");
        if (!topic) throw new Meteor.Error(422,"Error: topic is empty");
        var exists = Topics.findOne({topic: RegExp('^' + topic + '$',"i")});
        if (exists) throw new Meteor.Error(422, "Error: topic already exists");
        var topicId;
        Topics.insert(
            {
                topic: topic,
                subject: subject,
                createdAt: new Date(),
                moderators: []
            });
    },
    newThread: function(topicId, subject, message) {
        var topic = Topics.findOne({_id: topicId});
        if (isWhitespace(subject) || isWhitespace(message)) throw new Meteor.Error(422,"Error: cannot only be whitespace");
        if (subject.length > 50) throw new Meteor.Error(422,"Subject is more than 50 characters");
        //if (isHTML(subject) || isHTML(message)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (!topic) throw new Meteor.Error(422,"Error: topic doesn't exist");
        if (isZalgo(subject)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        if (!subject) throw new Meteor.Error(422,"Error: subject is empty");
        if (!message) throw new Meteor.Error(422,"Error: message is empty");
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        var _id;
        Threads.insert({
                topicId: topicId,
                from: Meteor.user().username,
                createdAt: new Date(),
                subject: subject,
                modified: new Date(),
                views: 0,
                locked: null
            },
            function(err, docsInserted) {
                _id = docsInserted;
                Posts.insert({
                    threadId: _id,
                    topicId: topicId,
                    subject: subject,
                    from: Meteor.user().username,
                    createdAt: new Date(),
                    editedBy: null,
                    modified: null,
                    post: message,
                    likes: [],
                    dislikes: [],
                },
                    function(err, docsInserted) {
                        updateSubscriptions(Meteor.user().username,docsInserted);
                    });
            });
        var posts = Userinfo.findOne({username: Meteor.user().username});
        posts = posts && posts.posts;
        if (posts == undefined) return;
        posts += 1;
        var userid = Userinfo.findOne({username: Meteor.user().username});
        userid = userid && userid._id;
        if (!userid) return;
        Userinfo.update(userid,{$set:{posts: posts}});
        return _id;
    },
    newSticky: function(topicId, subject, message) {
        var topic = Topics.findOne({_id: topicId});
        if (subject.length > 50) throw new Meteor.Error(422,"Subject length is longer than 50 characters");
        if (isWhitespace(subject) || isWhitespace(message)) throw new Meteor.Error(422,"Error: cannot only be whitespace");
        //if (isHTML(subject) || isHTML(message)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (!topic) throw new Meteor.Error(422,"Error: topic doesn't exist");
        if (isZalgo(subject)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        if (!subject) throw new Meteor.Error(422,"Error: subject is empty");
        if (!message) throw new Meteor.Error(422,"Error: message is empty");
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        var admin = Userinfo.findOne({username: username});
        admin = admin && admin.admin;
        topic = Topics.findOne({_id: topicId});
        var moderators = topic && topic.moderators;
        if (!(_.contains(moderators,Meteor.user().username) || admin)) throw new Meteor.Error(422,"Error: not authorized");
        var _id;
        Threads.insert({
                topicId: topicId,
                from: Meteor.user().username,
                createdAt: new Date(),
                subject: subject,
                modified: new Date(8640000000000000),
                views: 0,
                locked: null
            },
            function(err, docsInserted) {
                _id = docsInserted;
                Posts.insert({
                    threadId: _id,
                    topicId: topicId,
                    subject: subject,
                    from: Meteor.user().username,
                    createdAt: new Date(),
                    editedBy: null,
                    modified: null,
                    post: message,
                    likes: [],
                    dislikes: [],
                },
                    function(err, docsInserted) {
                        updateSubscriptions(Meteor.user().username,docsInserted);
                    });
            });
        var posts = Userinfo.findOne({username: Meteor.user().username});
        posts = posts && posts.posts;
        if (posts == undefined) return;
        posts += 1;
        var userid = Userinfo.findOne({username: Meteor.user().username});
        userid = userid && userid._id;
        if (!userid) return;
        Userinfo.update(userid,{$set:{posts: posts}});
        return _id;
    },
    postReply: function(topicId, threadId, subject, message) {
        var username = Meteor.user() && Meteor.user().username;
        if (subject.length > 55) throw new Meteor.Error(422,"Subject length is more than 50 characters");
        if (isWhitespace(message)) throw new Meteor.Error(422,"Error: cannot only be whitespace");
        //if (isHTML(subject) || isHTML(message)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (isZalgo(subject)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        if (!Topics.findOne({_id: topicId})) throw new Meteor.Error(422,"Error: you are in a deleted topic");
        var thread = Threads.findOne({_id: threadId});
        if (!thread) throw new Meteor.Error(422,"Error: thread does not exist");
        var locked = thread && thread.locked;
        if (locked) throw new Meteor.Error(422, "Error: this thread is locked");
        if (!message) throw new Meteor.Error(422,"Error: message is empty");
        var post = Posts.findOne({threadId: threadId},{sort: {createdAt: 1}});
        if (!post) throw new Meteor.Error(422,"Internal error");
        if (!subject) subject = 'Re: ' + Posts.findOne({threadId: threadId},{sort: {createdAt: 1}}).subject;
        Posts.insert({
            threadId: threadId,
            topicId: topicId,
            subject: subject,
            from: Meteor.user().username,
            createdAt: new Date(),
            editedBy: null,
            modified: null,
            post: message,
            likes: [],
            dislikes: [],
        },
            function(err, docsInserted) {
                updateSubscriptions(Meteor.user().username,docsInserted,subject,message);
                checkThreadSubscriptions(Meteor.user().username,threadId,docsInserted,subject,message);
            });
        var thread = Threads.findOne({_id: threadId});
        if (thread.modified.getTime() != new Date(8640000000000000).getTime()) Threads.update(threadId,{ $set: { modified: new Date()}});
        var posts = Userinfo.findOne({username: Meteor.user().username});
        posts = posts && posts.posts;
        if (posts == undefined) return;
        posts += 1;
        var userid = Userinfo.findOne({username: Meteor.user().username});
        userid = userid && userid._id;
        if (!userid) return;
        Userinfo.update(userid,{$set:{posts: posts}});
    },
    sendPM: function(messageTo, subject, message, attachments) {
        if (isWhitespace(message)) throw new Meteor.Error(422,"Error: cannot only be whitespace");
        //if (isHTML(subject) || isHTML(message)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (messageTo == Meteor.user().username) throw new Meteor.Error(422,"Error: cannot send messages to self");
        var messageTo = Meteor.users.findOne({username: RegExp('^' + messageTo + '$',"i")});
        if (subject.length > 50) throw new Meteor.Error(422,"Subject length is longer than 50 characters");
        if (isZalgo(subject)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        if (!messageTo) throw new Meteor.Error(422,"Error: username doesn't exist");
        if(!message) throw new Meteor.Error(422,"Error: message is empty");
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        var messageTo = messageTo.username;
        if (typeof attachments != "undefined" && attachments != null) {
            attachments.each(function (item, count) {
                var info = null;
                info = Iteminfo.findOne({_id: item});
                if (info == null) {
                    throw new Meteor.Error(422,"Attachments corrupted.");
                }
                if (info.username != username) {
                    throw new Meteor.Error(422,"Attachments corrupted: item not currently owned by sender");
                }
                if (item.price < 0) {
                    throw new Meteor.Error(422,"Attachments corrupted: item has negative price");
                }
                if (item.bought == true) {
                    throw new Meteor.Error(422, "Attachments corrupted: item bought already");
                }
                info.username = "<middleman>";
                dbupdate(info);
            });
        }
        Messages.insert(
            {
                to: messageTo,
                from: Meteor.user().username,
                subject: subject,
                createdAt: new Date(),
                modified: new Date(),
                showTo: [messageTo, Meteor.user().username],
                unread: [messageTo],
                messages: [
                    {
                        _id: 0,
                        from: Meteor.user().username,
                        subject: subject,
                        createdAt: new Date(),
                        modified: new Date(),
                        edited: false,
                        attachments: attachments,
                        message: message
                    }
                ]
            }
        );
    },
    sendPMReply: function(id, subject, message, attachments) {
        if (isWhitespace(message)) throw new Meteor.Error(422,"Error: cannot only be whitespace");
        //if (isHTML(subject) || isHTML(message)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (!message) throw new Meteor.Error(422,"Error: Your message is emtpy");
        if (subject.length > 55) throw new Meteor.Error(422,"Subject length is longer than 50 characters");
        //if (isZalgo(subject) || isZalgo(message)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        var msg = Messages.findOne({_id: id});
        var length = msg && msg.showTo.length;
        if (length == 1) throw new Meteor.Error(422, "Error: This thread is locked.");
        var array = msg && msg.messages;
        if (!array) throw new Meteor.Error(422, "Error: thread not found");
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        if (typeof attachments != "undefined" && attachments != null) {
            attachments.each(function (item, count) {
                var info = null;
                info = Iteminfo.findOne({_id: item});
                if (info == null) {
                    throw new Meteor.Error(422, "Attachments corrupted.");
                }
                if (info.username != username) {
                    throw new Meteor.Error(422, "Attachments corrupted: item not currently owned by sender");
                }
                if (item.price < 0) {
                    throw new Meteor.Error(422, "Attachments corrupted: item has negative price");
                }
                if (item.bought == true) {
                    throw new Meteor.Error(422, "Attachments corrupted: item bought already");
                }
                info.username = "<middleman>";
                dbupdate(info);
            });
        }
        array.push({
            _id: array.length,
            from: Meteor.user().username,
            subject: subject,
            createdAt: new Date(),
            modified: new Date(),
            attachments: attachments,
            edited: false,
            message: message
        });
        Messages.update(id,{$set: { messages: array}});
        array = msg.unread;
        var user = Meteor.user().username;
        if (msg.to == user) user = msg.from;
        else user = msg.to;
        if (_.contains(array,user)) {
            return;
        }
        else {
            array.push(user);
            Messages.update(id,{$set: { unread: array}});
        }
    },
    markAsRead: function(id) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return;
        var array = Messages.findOne({_id: id});
        if (!array) throw new Meteor.Error(422,"Error: thread not found");
        array = array.unread;
        if (!_.contains(array,Meteor.user().username)) {
            return;
        }
        if (_.contains(array,Meteor.user().username)) {
            array = _.without(array,Meteor.user().username);
        } else {
            return;
        }
        Messages.update(id,{ $set: { unread: array}});
    },
    deleteMessage: function(id) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var message = Messages.findOne({_id: id});
        if (!message) throw new Meteor.Error(422,"Error: message not found");
        var array = message.showTo;
        if (array == [] || !_.contains(array,Meteor.user().username)) throw new Meteor.Error(422,"Error: already deleted.");
        array = _.without(array,Meteor.user().username);
        if (array.length <= 0) {
            var messages = message.messages;
            messages.each(function (msg, count) {
                var attachments = msg.attachments;
                attachments.each(function (item, count) {
                    if (!count.bought) {
                        console.log(count);
                        console.log("Giving item " + item + " back to " + attachments[item].from);
                        var iteminfo = Iteminfo.findOne({_id: item});
                        iteminfo.username = attachments[item].from;
                        dbupdate(iteminfo);
                    }
                });
            });
            Messages.remove(id);
            return;
        }
        Messages.update(id,{ $set: { showTo: array}});
    },
    editPost: function(postId,message) {
        if (isWhitespace(message)) throw new Meteor.Error(422,"Error: cannot only be whitespace");
        //if (isHTML(message)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        var username = Meteor.user() && Meteor.user().username;
        //if (isZalgo(message)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        var post = Posts.findOne({_id: postId});
        if (!post) throw new Meteor.Error(422,"Error: post does not exist");
        var threadId = post.threadId;
        var thread = Threads.findOne({_id: threadId});
        if (!thread) throw new Meteor.Error(422,"Error: thread not found");
        var locked = thread.locked;
        if (locked) {
            var username = Meteor.user() && Meteor.user().username;
            if (!username) return;
            var admin = Userinfo.findOne({username: username});
            admin = admin && admin.admin;
            var topicId = thread && thread.topicId;
            var locked = thread.locked;
            topic = Topics.findOne({_id: topicId});
            var moderators = topic && topic.moderators;
            if (locked) locked = false;
            else locked = true;
            if (_.contains(moderators,Meteor.user().username) || admin) {
                console.log(Meteor.user().username + " editing locked post " + post._id);
            }
            else {
                throw new Meteor.Error(422,"Error: Not authorized. Thread is locked.");
            }
        }
        var poster = post.from;
        var user = Meteor.user();
        user = user && user.username;
        var admin = Userinfo.findOne({username: user});
        admin = admin && admin.admin;
        var topic = Topics.findOne({_id: post.topicId});
        topic = topic && topic.moderators;
        if ((_.contains(topic,user)) || (admin) || Meteor.user().username == poster) {
            if (!(_.contains(topic,user) || admin)) {
                if (post.editedBy && post.editedBy != Meteor.user().username) throw new Meteor.Error(422,"Error: You cannot edit your post. A moderator or admin has edited it.");
            }
            Posts.update(postId,{$set: { post: message} });
            Posts.update(postId,{$set: { editedBy: Meteor.user().username}});
            Posts.update(postId,{$set: { modified: new Date()}});
        } else {
            throw new Meteor.Error(422,"Error: not authorized");
        }
    },
    increaseView: function(threadId) {
        if (!Threads.findOne({_id: threadId})) return;
        views = Threads.findOne({_id: threadId}).views + 1;
        Threads.update(threadId,{$set: { views: views}});
    },
    buyAttachment: function(item, message, thread) {
        if (!Messages.findOne({_id: thread})) throw new Meteor.Error(422, "Error: thread not found");
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422,"Error: you must be logged in");
        var iteminfo = Iteminfo.findOne({_id: item});
        if (!iteminfo) throw new Meteor.Error(422,"Error: item not found");
        var info = Messages.findOne({_id: thread});
        if (!info) throw new Meteor.Error(422, "Error: Thread not found");
        var messages = info.messages;
        var post = messages[message];
        var items = post.attachments;
        if (items[item].bought) throw new Meteor.Error(422,"Error: that item has already been purchased");
        items[item].bought = true;
        post.attachments = items;
        messages[message] = post;
        info.messages = messages;
        Messages.update({_id: thread},info);
        var price = +items[item].price;
        var from = items[item].from;
        var userinfo = Userinfo.findOne({username: Meteor.user().username});
        var wallet = userinfo.wallet;
        if (wallet.gold < price) throw new Meteor.Error(422,"You can't afford it");
        wallet.gold = +wallet.gold;
        wallet.gold = wallet.gold - price;
        Userinfo.update(userinfo._id,{$set:{wallet: wallet}});
        userinfo = Userinfo.findOne({username: from});
        wallet = userinfo.wallet;
        wallet.gold = +wallet.gold;
        wallet.gold = wallet.gold + price;
        Userinfo.update(userinfo._id,{$set:{wallet: wallet}});
        iteminfo.username = Meteor.user().username;
        dbupdate(iteminfo);
    },
    editPM: function(id,post_id,msg) {
        if (isWhitespace(msg)) throw new Meteor.Error(422,"Error: cannot be only whitespace");
        //if (isHTML(msg)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (isZalgo(msg)) throw new Meteor.Error(422,"Error: Zalgo text detected.");
        var username = Meteor.user() && Meteor.user().username;
        if (!username) throw new Meteor.Error(422, "Error: you must be logged in");
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 800 + 10 * karma;
        if (message.length > chars) throw new Meteor.Error(422,"Message is longer than " + chars + " characters.");
        var thispost = Messages.findOne({_id: id});
        if (!thispost) throw new Meteor.Error(422,"Error: thread " + id + "does not exist");
        var array = thispost && thispost.messages;
        if (post_id < 0 || post_id >= array.length) throw new Meteor.Error(422, "Error: post does not exist");
        if (!array) throw new Meteor.Error(422,"Error: thread not found");
        var post = array[post_id];
        post.message = msg;
        post.modified = new Date();
        post.edited = true;
        if (post.from != Meteor.user().username) throw new Meteor.Error(422, "Error: not authorized to edit someone else's post");
        array[post_id] = post;
        Messages.update(id, { $set: { messages: array} });
        array = thispost.unread;
        var user = Meteor.user().username;
        if (msg.to == user) user = thispost.from;
        else user = thispost.to;
        if (_.contains(array,user)) {
            return;
        }
        else {
            array.push(user);
            Messages.update(id,{$set: { unread: array}});
        }
    },
    lockThread: function(id) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return;
        var admin = Userinfo.findOne({username: username});
        admin = admin && admin.admin;
        var thread = Threads.findOne({_id: id});
        var topicId = thread && thread.topicId;
        var locked = thread.locked;
        topic = Topics.findOne({_id: topicId});
        var moderators = topic && topic.moderators;
        if (locked) locked = null;
        else locked = Meteor.user().username;
        if (_.contains(moderators,Meteor.user().username) || admin) {
            Threads.update(id,{$set:{locked: locked}});
        }
    },
    makeSticky: function(id) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return;
        var admin = Userinfo.findOne({username: username});
        admin = admin && admin.admin;
        var thread = Threads.findOne({_id: id});
        var topicId = thread && thread.topicId;
        var locked = thread.locked;
        topic = Topics.findOne({_id: topicId});
        var moderators = topic && topic.moderators;
        if (locked) locked = null;
        else locked = Meteor.user().username;
        if (_.contains(moderators,Meteor.user().username) || admin) {
            var threadTime = thread.modified;
            if (threadTime.getTime() == new Date(8640000000000000).getTime()) {
                var post = Posts.findOne({threadId: id},{sort: {createdAt: -1}});
                Threads.update(id,{$set:{modified: post.createdAt }});
            }
            else Threads.update(id,{$set:{modified: new Date(8640000000000000)}});
        }
    },
    deleteThread: function(id) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return;
        var admin = Userinfo.findOne({username: username});
        admin = admin && admin.admin;
        if (admin) {
            Posts.remove({threadId: id});
            Threads.remove(id);
            cleanSubscriptions();
        }
        /*var thread = Threads.findOne({_id: id});
        var topicId = thread && thread.topicId;
        topic = Topics.findOne({_id: topicId});
        var moderators = topic && topic.moderators;
        else locked = Meteor.user().username;
        if (_.contains(moderators,Meteor.user().username) || admin) {
            Threads.remove(id);
        }*/
    },
    deleteTopic: function(id) {
        var username = Meteor.user() && Meteor.user().username;
        if (!username) return;
        var admin = Userinfo.findOne({username: username});
        admin = admin && admin.admin;
        if (admin) {
            Topics.remove(id);
            Posts.remove({topicId: id});
            Threads.remove({topicId: id});
            cleanSubscriptions();
        }
    },
    setSignature: function(signature, password) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var username = Meteor.user().username;
        var userinfo = Userinfo.findOne({username: username});
        var karma = userinfo.totalKarma || 0;
        var chars = 200 + 10 * karma;
        if (signature.length > chars) throw new Meteor.Error(422,"Signature is longer than " + chars + " characters.");
        //if (isHTML(signature)) throw new Meteor.Error(422,"Error: HTML tags detected.");
        if (isZalgo(signature)) throw new Meteor.Error(422, "Zalgo text not allowed.");
        var user = Meteor.user();
        var password = {digest: password, algorithm: 'sha-256'};
        var result = Accounts._checkPassword(user, password);
        var error = result.error;
        if (error != undefined) var reason = error.reason;
        else reason = 0;
        if (reason) throw new Meteor.Error(422,reason);
        var user = Userinfo.findOne({username: Meteor.user().username});
        var userId = user._id;
        console.log(userId);
        Userinfo.update(userId,{$set:{signature: signature}});
        user = Userinfo.findOne({username: Meteor.user().username});
        console.log(user.signature);
    },
    addModerator: function(topicId, username) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var admin = Userinfo.findOne({username: Meteor.user().username});
        admin = admin && admin.admin;
        if (!admin) throw new Meteor.Error(422,"Not authorized");
        var user = Meteor.users.findOne({username: RegExp('^' + username + '$',"i")});
        if (!user) throw new Meteor.Error(422,"User doesn't exist");
        username = user.username;
        var topic = Topics.findOne({_id: topicId});
        if (!topic) throw new Meteor.Error(422,"Topic doesn't exist");
        var array = topic.moderators;
        console.log(_.contains(array,username));
        if (_.contains(array,username)) throw new Meteor.Error(422,'That user is already a moderator');
        array.push(username);
        Topics.update(topicId,{$set:{moderators: array}});
    },
    removeMod: function(topicId, username) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var admin = Userinfo.findOne({username: Meteor.user().username});
        admin = admin && admin.admin;
        if (!admin) throw new Meteor.Error(422,"Not authorized");
        var topic = Topics.findOne({_id: topicId});
        if (!topic) throw new Meteor.Error(422,"Topic not found");
        var moderators = topic.moderators;
        moderators = _.without(moderators,username);
        Topics.update(topicId,{$set:{moderators: moderators}});
    },
    makeAdmin: function(username) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var admin = Userinfo.findOne({username: Meteor.user().username});
        admin = admin && admin.admin;
        if (!admin) throw new Meteor.Error(422,"Not authorized");
        var user = Userinfo.findOne({username: RegExp('^' + username + '$',"i")});
        if (!user) throw new Meteor.Error(422,"User not found");
        var userId = user._id;
        Userinfo.update(userId,{$set:{admin: true}});
    },
    removeAdmin: function(username) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var admin = Userinfo.findOne({username: Meteor.user().username});
        admin = admin && admin.admin;
        if (!admin) throw new Meteor.Error(422,"Not authorized");
        var user = Userinfo.findOne({username: RegExp('^' + username + '$',"i")});
        if (!user) throw new Meteor.Error(422,"User not found");
        var userId = user._id;
        Userinfo.update(userId,{$set:{admin: false}});
    },
	newWallet: function(username) {
		if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
		var user = Userinfo.findOne({username: RegExp('^' + username + '$',"i")});

		if (!user) throw new Meteor.Error(422,"User not found");

		var userId = user._id;
		var requester = Meteor.user().username;
		if (requester != username) throw new Meteor.Error(422,"Don't be a jerk!");

		if (user.wallet) {
			return;
		}

		Userinfo.update(userId, {$set:{wallet:{karma:0, gold:100}}})

	},
    likePost: function(postId) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var post = Posts.findOne({_id: postId});
        if (!post) throw new Meteor.Error(422,"Post not found");
        var likes = post.likes;
        var dislikes = post.dislikes;
        var poster = post.from;
        if (poster == Meteor.user().username) throw new Meteor.Error(422,"You cannot like your own post");
        if (_.contains(likes,Meteor.user().username)) throw new Meteor.Error(422,"User already liked this post");
        if (_.contains(dislikes,Meteor.user().username)) throw new Meteor.Error(422,"User already dislikes this post");
        likes.push(Meteor.user().username);
        Posts.update(postId,{$set:{likes: likes}});
        var userinfo = Userinfo.findOne({username: poster});
        var totalKarma = userinfo.totalKarma;
        var wallet = userinfo.wallet;
        if (!wallet) {
            Userinfo.update(userinfo._id, {$set:{wallet:{karma:1, gold:100}}});
            Userinfo.update(userinfo._id, {$set:{totalKarma: 1}});
        }
        else {
            if (!totalKarma) totalKarma = 0;
            totalKarma += 1;
            wallet.karma += 1;
            Userinfo.update(userinfo._id, {$set: {totalKarma: totalKarma}});
            Userinfo.update(userinfo._id, {$set: {wallet: wallet}});
        }
    },
    dislikePost: function(postId) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var post = Posts.findOne({_id: postId});
        if (!post) throw new Meteor.Error(422,"Post not found");
        var poster = post.from;
        if (poster == Meteor.user().username) throw new Meteor.Error(422,"You cannot dislike your own post");
        var likes = post.likes;
        var dislikes = post.dislikes;
        if (_.contains(likes,Meteor.user().username)) throw new Meteor.Error(422,"User already liked this post");
        if (_.contains(dislikes,Meteor.user().username)) throw new Meteor.Error(422,"User already dislikes this post");
        dislikes.push(Meteor.user().username);
        Posts.update(postId,{$set:{dislikes: dislikes}});
    },

    track: function(threadId) {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        var username = Meteor.user().username;
        var userinfo = Userinfo.findOne({username: username});
        var tracked = userinfo.track || {};
        if (tracked.has(threadId)) delete tracked[threadId];
        else tracked[threadId] = Posts.find({threadId: threadId}).count();
        console.log(tracked);
        Userinfo.update(userinfo._id,{$set:{track: tracked}});
    },
    countViewed: function(threadId) {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        var username = Meteor.user().username;
        var userinfo = Userinfo.findOne({username: username});
        var tracked = userinfo.track || {};
        if (!tracked.has(threadId)) return;
        tracked[threadId] = Posts.find({threadId: threadId}).count();
        if (tracked.has(threadId)) {
            Userinfo.update(userinfo._id,{$set:{track: tracked}});
        }
    },
    followAuthor: function(author) {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        var username = Meteor.user().username;
        var userinfo = Userinfo.findOne({username: username});
        var authorname = Userinfo.findOne({username: RegExp("^" + author + "$","i")});
        if (!authorname) throw new Meteor.Error(422,"Author doesn't exist");
        authorname = authorname.username;
        if (authorname == username) throw new Meteor.Error(422,"You can't follow yourself");
        var authors = userinfo.authors || {};
        authors[authorname] = [];
        Userinfo.update(userinfo._id,{$set:{authors: authors}});
    },
    viewedFollow: function(author, postId) {
        if (!this.userId) throw new Meteor.Error(422,"You must be logged in");
        var username = Meteor.user().username;
        var userinfo = Userinfo.findOne({username: username});
        var authors = userinfo.authors;
        if (!authors.hasOwnProperty(author)) throw new Meteor.Error(422,"User is not following author '" + author + "'");
        var posts = authors[author];
        posts = _.without(posts,postId);
        authors[author] = posts;
        Userinfo.update(userinfo._id,{$set:{authors: authors}});
    },
    removeAuthor: function(author) {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        var username = Meteor.user().username;
        var userinfo = Userinfo.findOne({username: username});
        var authors = userinfo.authors || {};
        delete authors[author];
        Userinfo.update(userinfo._id,{$set:{authors: authors}});
    },
    emailMe: function(bool) {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        var username = Meteor.user().username;
        Userinfo.update({username: username}, {$set: {sendemail: bool}});
    },
    updateEmail: function(email) {
        if (!this.userId) throw new Meteor.Error(422, "You must be logged in");
        if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            throw new Meteor.Error(422,"Invalid email");
        }
        Meteor.users.update({_id: this.userId},{$set: {'emails.0.address': email}});
    }
});
