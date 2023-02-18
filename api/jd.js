const epxress = require("express");
const axios = require("axios");
const router = epxress.Router();
const path = require("path");
const fs = require("fs");

let appid = 2104211103492005;
let appkey = "hpMZoXZz1vEvx6oMDt89oEu4q6vyWtBy";
let union_id = 2011367895;
let baseUrl = "https://api.jingpinku.com/get_goods_link/api";
let ctxUrl = "https://api.jingpinku.com/get_powerful_link/api";
// let content = ``
router.post('/', async (req, res, next) => {
  try {
    // 获取api中的地址url参数
    // const content = req.query.url;
    const content = req.body.content;
    // console.log("请求参数获取:",content)
    let data = await new Promise((resolve, reject) => {
      axios({
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: `${ctxUrl}?union_id=${union_id}&content=${escape(
          content
        )}&appid=${appid}&appkey=${appkey}`,
      }).then(async result => {
        // console.warn("获取返回数据",result.data)
        // 保存最新的一张图片到本地
        if(result.data.images.length >= 1){
          await saveImg(result.data.images[0])
        }
        let ctx = result.data.content;
        let data = ResChinese(ctx);
        // console.log("响应内容获取",data)
        resolve(data)
      })
    })
    if (data) {
      res.json({
        "result": data
      })
    } else {
      res.status(404).json("No url found");
    }
  } catch (error) {
    res.status(500).json("Server error");
  }
});

function ResChinese(str) {
  return unescape(str.replace(/&#x/g, "%u").replace(/; /g, ""));
}

// 保存图片
async function saveImg(imgurl) {
  let {
    data
  } = await axios({
    url: imgurl,
    headers: {
      'content-type': 'multipart/form-data',
    },
    responseType: 'arraybuffer',
  })
  await fs.promises.writeFile(path.resolve(__dirname,'../images/jdImage.png'), data, 'binary',(err)=>{
    if(err){
      console.log('image save fail!')
    } else {
      console.log('image save success!')
    }
  });
}

module.exports = router;