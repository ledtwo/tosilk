// 初始化
const WxVoice = require("wx-voice");
var voice = new WxVoice();

// 错误处理
voice.on("error", (err) => console.log(err));
// 从 silk 解码至 MP3
// voice.decode("desc.silk", (dur) => console.log(dur));

// voice.duration("desc.mp3", (dur) => console.log(dur));

// 从 silk 解码至 MP3
// voice.decode("desc.silk", "desc2.mp3", { format: "mp3" }, (file) => console.log(file));

// 输出: "10.290"

// 输出: "/path/to/output.mp3"

voice.encode("desc1.mp3", "desc1.silk", { format: "silk" }, (file) => console.log(file));

// 输出: "/path/to/output.silk"
