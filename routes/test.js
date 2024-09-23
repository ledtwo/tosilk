const WxVoice = require("wx-voice");
var voice = new WxVoice();
// voice.encode(
//   "你好啊我是机器人小喵_09-23_18-31-08.mp3",
//   "你好啊我是机器人小喵_09-23_18-31-08.silk",
//   { format: "silk" },
//   (file) => console.log(file)
// );

voice.encode("desc.mp3", "desc.silk", { format: "silk" }, (file) => console.log(file));
