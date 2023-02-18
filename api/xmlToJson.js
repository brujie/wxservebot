const epxress = require("express");
var parseString = require('xml2js').parseString;
const router = epxress.Router();
router.post('/xmlData', async (req, res, next) => {
  try {
    // 获取api中的地址val参数
    const xmlData = req.body.xmlData;
    parseString(xmlData,{"includeWhiteChars":true}, function (err, result) {
      // 文章列表
      let articleList = result.msg.appmsg[0].mmreader[0].category[0].item.map(item =>{
        // console.log(item)
        return {
          title:item.title[0],
          url:item.url[0],
        }
      })
      let object = {
        title:result.msg.appmsg[0].title[0],
        nickname:result.msg.appinfo[0].appname[0],
        ghNameId:result.msg.fromusername[0],
        articleList
      }
      if (result) {
        res.json({
          result: object
        })
      } else {
        res.status(404).json("No url found");
      }
    });
    
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;