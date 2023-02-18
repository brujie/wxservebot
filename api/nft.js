const epxress = require("express");
const axios = require("axios");
const router = epxress.Router();

const goodId = '5020a2bea587da07333186a8f4e6611f';
const baseUrl = 'https://api.theone.art';

router.post('/', async (req, res, next) => {
  try {
    const auth = req.body.auth;
    // 获取api中的地址val参数
    let reply = new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: baseUrl + '/order/api/orderBuy/add',
        headers: {
          authorization: auth
        },
        data: {
          "saleRecordAmount": 1,
          "saleRecordId": goodId
        }
      }).then(result1 => {
        console.log('[1]', result1.data)
        axios({
          method: "post",
          url: baseUrl + '/pay/api/v3/expirePayOrder',
          headers: {
            authorization: auth
          },
          data: {
            orderNo: result1.data,
          }
        }).then(result2 => {
          if (result2.code == 200) {
            console.log('[2]', '生成订单成功!')
            resolve('抢购成功!')
            res.json({
              message:'抢购成功!'
            })
          } else {
            console.log('[2]', result2.data)
            resolve('抢购中...')
            res.json({
              message:result2.data.message
            })
          }
        })
      })
    })
    if (!reply) {
      res.status(404).json("No url found");
    }
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;