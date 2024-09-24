const router = require("koa-router")();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs-tts");
const TtsClient = tencentcloud.tts.v20190823.Client;

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

// 一、百度语音合成
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

// 二、国外 elevenlabs.io 语音大模型
async function loadAudio2(text, ctx) {
  var options = {
    method: "POST",
    url: "https://api.elevenlabs.io/v1/text-to-speech/hkfHEbBvdQFNX4uWHqRF",
    responseType: "arraybuffer", // 设置响应类型为 arraybuffer
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "xi-api-key": "sk_37fa3355b94ebdfdfd3c4419f5fc0e8bf4e04311a22df266",
    },
    data: {
      text,
      model_id: "eleven_multilingual_v2",
    },
  };
  const response = await axios(options);
  console.log(response.data);
  // 将下载的文件保存到本地，文件名取时间戳的月日时分秒
  // 截取text的前10个字符
  // 保留中英文数字，去除符号
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "labs" +
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

// 三、腾讯云语音合成

function generateTencentAudio(text) {
  return new Promise(async (resolve, reject) => {
    // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
    // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
    // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
    const clientConfig = {
      credential: {
        secretId: "AKIDTkndLq7AzayINFtJXfdOvEKCvQhkozAG",
        secretKey: "AF7rPp6EC2lKekcGgAQq8D5oJbfURGyV",
      },
      region: "ap-beijing",
      profile: {
        httpProfile: {
          endpoint: "tts.tencentcloudapi.com",
        },
      },
    };
    // 实例化要请求产品的client对象,clientProfile是可选的
    const client = new TtsClient(clientConfig);
    const params = {
      Text: text,
      SessionId: "",
      VoiceType: 301037,
    };
    client.TextToVoice(params).then(
      (data) => {
        // console.log(data);
        resolve(data.Audio);
      },
      (err) => {
        console.error("error", err);
      }
    );
  });
}

async function loadAudio3(text, ctx) {
  const response = await generateTencentAudio(text);
  // 将下载的文件保存到本地，文件名取时间戳的月日时分秒
  // 截取text的前10个字符
  // 保留中英文数字，去除符号
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "Tencent_" +
      text.slice(0, 12).replace(/[^\w\u4e00-\u9fa5]/g, "") +
      dayjs().format("_MM-DD_HH-mm-ss") +
      ".mp3"
  );
  // 写入文件,成功后执行下一步
  await writeFile(filePath, Buffer.from(response, "base64"));
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

// 接口配置
router.post("/toSilk", async (ctx, next) => {
  // 取出文字
  const text = ctx.request.body.text;
  const res = await loadAudio3(text, ctx);
  ctx.body = {
    code: 200,
    data: res,
  };
});

module.exports = router;
