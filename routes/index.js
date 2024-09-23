const router = require("koa-router")();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

// 初始化
const WxVoice = require("wx-voice");
var voice = new WxVoice();

const AK = "kracecKPalma4GYiwFzONVKq";
const SK = "q1qVUfq8deLWR4EeEqtCz7ytfeF2qACx";

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {
  let options = {
    method: "POST",
    url:
      "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" +
      AK +
      "&client_secret=" +
      SK,
  };
  return new Promise((resolve, reject) => {
    axios(options)
      .then((res) => {
        resolve(res.data.access_token);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 写入文件
async function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      }
      console.log("1、文件已保存");
      resolve(filePath);
    });
  });
}
// 文件转换的方法  返回文件路径
async function fileConvert(filePath) {
  return new Promise(async (resolve, reject) => {
    // 将文件转换为silk格式
    await voice.encode(filePath, filePath.replace(".mp3", ".silk"), { format: "silk" }, (file) => {
      resolve(filePath.replace(".mp3", ".silk"));
      console.log("3、转换成功", file);
    });
  });
}

// 统计音频时长
async function getMp3Duration(filePath) {
  return new Promise(async (resolve, reject) => {
    await voice.duration(filePath, (dur) => {
      resolve(dur);
      console.log("2、获取时长成功", dur);
    });
  });
}

// 生成音频
async function loadAudio(text, ctx) {
  var options = {
    method: "POST",
    url: "https://tsn.baidu.com/text2audio",
    responseType: "arraybuffer", // 设置响应类型为 arraybuffer
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
    },
    data: {
      tex: text,
      tok: await getAccessToken(),
      cuid: "6OnEEJKiw0IXhy8Gv3eLj5JlJAU1aNco",
      ctp: "1",
      lan: "zh",
      spd: "6",
      pit: "6",
      vol: "5",
      per: "111",
      aue: "3",
    },
  };
  const response = await axios(options);
  // 将下载的文件保存到本地，文件名取时间戳的月日时分秒
  // 截取text的前10个字符
  // 保留中英文数字，去除符号
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    text.slice(0, 12).replace(/[^\w\u4e00-\u9fa5]/g, "") +
      dayjs().format("_MM-DD_HH-mm-ss") +
      ".mp3"
  );
  // 写入文件,成功后执行下一步
  await writeFile(filePath, response.data);
  // 文件的时长;
  const duration = await getMp3Duration(filePath);

  console.log(duration);
  // 将文件转换为silk格式
  const silkPath = await fileConvert(filePath);
  const basename = path.basename(silkPath);
  return {
    duration,
    url: `${ctx.origin}/${basename}`,
  };
}

router.post("/toSilk", async (ctx, next) => {
  // 取出文字
  const text = ctx.request.body.text;
  const res = await loadAudio(text, ctx);
  ctx.body = {
    code: 200,
    data: res,
  };
});

router.get("/", async (ctx, next) => {
  ctx.body = "koa2 string";
});

module.exports = router;
