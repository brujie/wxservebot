require("./src/server");
const ws = require("ws");
const axios = require("axios");
const path = require("path");
const tool = require("./src/tool.js");
const config = require("./config/config");
let timer = null;

const sock = new ws("ws://127.0.0.1:5555");

sock.on("open", function () {
  console.log("微信连接成功!");
});
// 与微信连接发生错误的回调函数
sock.on("error", function (err) {
  console.log('微信断开连接');
});
// 主动与微信断开连接的回调函数
sock.on("close", function () {
  console.log('微信断开连接');
});

sock.on("message", function (msg) {
  const data = JSON.parse(msg.toString());
  // console.log('接收到消息:', data);
  switch (data.type) {
    case tool.PERSONAL_INFO: //收到个人信息
      break;
    case tool.HEART_BEAT: //收到心跳
      break;
    case tool.PERSONAL_INFO: // 自己的消息
      break;
    case tool.RECV_TXT_MSG: //收到文字消息
      handle_recv_msg(data);
      break;
    case tool.RECV_PIC_MSG: //收到图片消息
      break;
    case tool.USER_LIST: // 获取联系列表
      break;
    case tool.GH_MESSAGE: // 公众号xml消息
      handle_gh_message(data)
    default:
      break;
  }
});


async function handle_recv_msg(j) {
  const content = j.content;
  console.log(j.content)
  if (content.search("抢购") != -1) {
    timer = setInterval(async () => {
      let data = await handleBuyGoods(content.substr(2))
      if (data.message == '抢购成功!') {
        clearInterval(timer)
        sock.send(tool.send_txt_msg(j.wxid, data.message));
        return
      } else {
        sock.send(tool.send_txt_msg(j.wxid, data.message));
      }
    }, 300);
  }
  if (content.search("停止") != -1) {
    clearInterval(timer)
    sock.send(tool.send_txt_msg(j.wxid, '停止抢购!'));
  }
  if (content.search("解析") != -1) {
    if (content.substr(2).indexOf('mp.weixin.qq.com') == -1) {
      return
    }
    handleArticle('文章', content.substr(2), j)
  }

  if (content.search("行情") != -1) {
    if (content.substr(2).indexOf('mp.weixin.qq.com') == -1) {
      return
    }
    let url = await handleQuotation(content.substr(2), j)
    sock.send(tool.send_txt_msg(j.wxid, '解析:行情图片\n' + url));
  }
  // 处理获取消息
  handleToRoomJd(j)
}

// 处理京东消息转群聊
async function handleToRoomJd(j, flag = false) {
  const collection = config.collection;
  const sendList = config.sendList;
  if (j.type == 1 && j.wxid.search('chatroom') != -1) {
    // 处理京东消息
    for (const item of collection) {
      if (flag || j.wxid == item.wxid && j.jd1 == item.jd1) {
        for (const send of sendList) {
          sock.send(tool.send_txt_msg(send, await handleJdUrl(j.content)));
          setTimeout(() => {
            sock.send(tool.send_pic_msg(send, path.resolve(__dirname, './images/jdImage.png')));
          }, 200)
        }
      }
    }
  }

  if (j.wxid == 'rujie121411' && j.content.search('jd') != -1) {
    for (const send of sendList) {
      sock.send(tool.send_txt_msg(send, await handleJdUrl(j.content)));
      setTimeout(() => {
        sock.send(tool.send_pic_msg(send, path.resolve(__dirname, './images/jdImage.png')));
      }, 500)
    }
  }
}

// 处理京东转链接
async function handleJdUrl(content) {
  let {
    result
  } = await urlToJDUrl(content);
  return result;
}

function urlToJDUrl(content) {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${config.baseUrl}/jdApi`,
      data: {
        content
      }
    }).then(res => {
      resolve(res.data)
    })
  })
}

function handleBuyGoods(auth) {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${config.baseUrl}/nft`,
      data: {
        auth
      }
    }).then(res => {
      resolve(res.data)
    })
  })
}


function handleArticle(title, url, j) {
  // console.log(j)
  return new Promise((resolve, reject) => {
    axios({
      url: `${config.baseUrl}/article/?url=${url}`,
    }).then(res => {
      let result = res.data;
      let content = result.rows.entry; // 获取内容
      console.log(content)
      let reg = /(【|】)/;
      let str = `活动:${title}相关内容\n\n`;
      content.map(item => {
        if (reg.test(item.content)) {
          str += `${item.content}\n`;
        }
      })
      // 获取关键商品内容名称
      let str1 = handleNameBuyList(str);
      // 当在房间内的时候只发送房间
      if (j.id2.search('room') != -1) {
        sock.send(tool.send_txt_msg(j.id2, str))
      } else {
        sock.send(tool.send_txt_msg(j.wxid, str))
      }
      // 获取文章关键内容通知
      if (str1) {
        setTimeout(() => {
          if (j.id2.search('room') != -1) {
            sock.send(tool.send_txt_msg(j.id2, str1))
          } else {
            sock.send(tool.send_txt_msg(j.wxid, str1))
          }
        }, 5000)
      }
    })
  })
}

function handleQuotation(url, j) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${config.baseUrl}/article/?url=${url}`,
    }).then(res => {
      let result = res.data;
      let content = result.rows.entry; // 获取内容
      for (const index in content) {
        if (content[index].content == '今日行情记录') {
          let item = content[parseInt(index) + 1];
          let imgUrl = item.content;
          resolve(imgUrl)
        }
      }
    })
  })
}

function handleNameBuyList(str) {
  let list = [];
  let reg = /\「(.*?)」/g;
  while ((temp = reg.exec(str))) {
    list.push(temp[0].slice(1, -1));
  }
  let filterList = ['嫦娥', '后羿', '钻研'];
  let nameList = list.filter(item => {
    return !filterList.includes(item)
  })
  return '关键词搜索:\n' + nameList.toString().replace(/,/g, '\n');
}


// 处理公众号消息
async function handle_gh_message(data) {
  if (data.content.id1.search('gh') == -1) {
    return
  }
  console.log("处理公众号消息")
  let xmlData = data.content.content
  let result = await xmlToJson(xmlData)
  // console.log(result)
  let {
    nickname,
    ghNameId,
    articleList
  } = result.result;
  let strData = `--- ${nickname} 总(${articleList.length})  --- \n\n`
  let articleStr = "";
  for (const index in articleList) {
    const item = articleList[index];
    articleStr += `[${Number(index)+1}]${item.title}\n${item.url}\n`
  }
  let oneArtList = config.oneArtList;
  let oneArtStatus = Object.keys(oneArtList).includes(ghNameId);
  let str = strData + articleStr;
  sock.send(tool.send_txt_msg(config.bossId, str))
  if (oneArtStatus) {
    sock.send(tool.send_txt_msg(config.roomId, str)) // 唯一通知群
  }
}

function xmlToJson(xmlData) {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${config.baseUrl}/xmlToJson/xmlData`,
      data: {
        xmlData
      }
    }).then(res => {
      resolve(res.data)
    })
  })
}