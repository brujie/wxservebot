// https://www.e7wei.com/?qudao=bdscq#make
const epxress = require("express");
const axios = require("axios");
const router = epxress.Router();

router.post('/', async (req, res, next) => {
  try {
    // 获取api中的地址val参数
    const url = req.body.url;
    let data = await new Promise((resolve, reject) => {
      axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Cookie: "PHPSESSID=srdh4aeeu6b0vgsmku51hp28a7; e7weicom_qudao=bdscq_home; Hm_lvt_0a3090a45d79e6f06817d797102a79b5=1674970955; e7weicom_userid=835695; Hm_lpvt_0a3090a45d79e6f06817d797102a79b5=1674971002"
        },
        url: `https://www.e7wei.com/link/postlink`,
        data: {
          gid: '',
          url,
        }
      }).then(res => {
        let data = res.data;
        resolve(data)
      })
    })
    if (data) {
      res.json({
        data
      })
    } else {
      res.status(404).json("No url found");
    }
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;