const constant = {
  // ================== 🌐 接口地址 ==================
  baseURL: "http://localhost:4145",
  imBaseURL: "http://localhost:81/im",
  webURL: "http://localhost",

  // 生产环境（注释掉，按需启用）
  // webURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : ''),
  // baseURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/api",
  // imBaseURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/im",

  host: location.hostname + (location.port ? ":" + location.port : ""),

  // ================== 🖼️ 静态资源路径 ==================
  live2d_path:
    "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
  cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/",
  waifuPath: "/webInfo/getWaifuJson",
  img_Path: "https://n5s.cn/TGZImageServer/mybk/",

  // ================== 🌸 第三方 API ==================
  hitokoto: "https://v1.hitokoto.cn",
  shehui: "https://api.oick.cn/yulu/api.php",
  tocbot: "https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.18.2/tocbot.min.js",
  jinrishici: "https://v1.jinrishici.com/all.json",

  // ================== 🔐 加密密钥 ==================
  cryptojs_key: "sarasarasarasara",

  // ================== 🎨 UI 配色 ==================
  before_color_list: [
    "black",
    "rgb(131, 123, 199)",
    "#ee7752",
    "#e73c7e",
    "#23a6d5",
    "#23d5ab",
  ],
  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b, #ec008c)",
  before_color_2: "rgb(131, 123, 199)",
  after_color_2: "linear-gradient(45deg, #f43f3b, #ec008c)",
  tree_hole_color: [
    "rgb(180, 224, 255)",
    "rgb(180, 203, 255)",
    "rgb(246, 223, 255)",
    "rgb(255, 214, 198)",
    "rgb(255, 205, 143)",
    "rgb(238, 255, 143)",
    "rgb(220, 255, 165)",
    "rgb(164, 234, 192)",
    "rgb(202, 241, 233)",
    "rgb(230, 230, 250)",
  ],
  sortColor: [
    "linear-gradient(to right, #358bff, #15c6ff)",
    "linear-gradient(to right, #18e7ae, #1eebeb)",
    "linear-gradient(to right, #ff6655, #ffbf37)",
    "linear-gradient(120deg, rgba(255, 39, 232, 1) 0%, rgba(255, 128, 0, 1) 100%)",
    "linear-gradient(120deg, rgba(91, 39, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)",
  ],

  // ================== 👥 友链信息 ==================
  friendWebName: "GHZ",
  friendAvatar: "https://n5s.cn/mybk/zcls.png",
  friendIntroduction: "这是一个 Vue3 与 SpringBoot 结合的产物～",
  friendCover: "https://s1.ax1x.com/2022/11/10/z9VlHs.png",
  friendUrl:
    location.protocol +
    "//" +
    location.hostname +
    (location.port ? ":" + location.port : ""),

  // ================== 🔥 其他配置 ==================
  pageColor: "#ee7752",
  commentPageColor: "#23d5ab",
  userId: 1,
  source: 0,

  emojiList: [
    "衰",
    "鄙视",
    "再见",
    "捂嘴",
    "摸鱼",
    "奋斗",
    "白眼",
    "可怜",
    "皱眉",
    "鼓掌",
    "烦恼",
    "吐舌",
    "挖鼻",
    "委屈",
    "滑稽",
    "啊这",
    "生气",
    "害羞",
    "晕",
    "好色",
    "流泪",
    "吐血",
    "微笑",
    "酷",
    "坏笑",
    "吓",
    "大兵",
    "哭笑",
    "困",
    "呲牙",
  ],
};

export default constant;
