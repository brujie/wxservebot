const epxress = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const router = epxress.Router();

router.get('/', async (req, res, next) => {
  try {
    // 获取api中的地址val参数
    const url = req.query.url;
    // console.log(url)
    let data = await new Promise((resolve, reject) => {
      axios({
        url,
      }).then(result => {
        let body = result.data;
        filterWeixinArticle(body, res);
      })
    })
    if (!data) {
      res.status(404).json("No url found");
    }
  } catch (error) {
    res.status(500).json("Server error");
  }
});

function filterWeixinArticle(html, res) {
  var $ = cheerio.load(html);
  var main = $('#js_article');

  var imgPathArr = main.find('img');
  var imgPath;
  var imgtype;
  var o;
  var srcArr = [];

  var back_img1;
  var back_img2;
  var len2;
  var back_img3;
  var back_arr = [];
  imgPathArr.each(function () {
    imgPath = $(this).attr('data-src');
    imgtype = $(this).attr('data-type');
    if (imgPath && imgtype) {
      back_img1 = imgPath.split('?');
      back_img2 = back_img1[0].toString().split('/');
      len2 = back_img2.length;
      back_img2[len2 - 1] = '640';
      back_img3 = back_img2.join('/') + '?' + back_img1[1].toString() + '&tp=webp&wxfrom=5&wx_lazy=1';
      back_arr.push(back_img3);
      o = {
        'url': imgPath,
        'type': imgtype
      };
      srcArr.push(o);
      o = {};
    }
  });

  var my_title = $('#activity-name').text();
  var my_user = $('#post-user').text();
  var my_em_arr = [];
  var my_em;
  $('#img-content').find('em').each(function () {
    my_em = $(this);
    if (my_em.text() && my_em.text().length > 0) {
      my_em_arr.push(my_em.text());
    }

  });
  var my_span_arr = [];
  var my_span;
  var order = 0;
  var isort = 0; //用来表示back_arr 的索引
  var h;
  $('#img-content').find('p').each(function () {
    my_span = $(this);
    if ((my_span.text() && my_span.text().length > 0) && (my_span.text() !== " ")) {
      h = {
        'content': my_span.text(),
        'contentType': 0,
        'order': order
      };
      my_span_arr.push(h);
      h = {};
      order++;
    }

    if (my_span.children('img').length) {
      h = {
        'content': back_arr[isort],
        'contentType': 1,
        'order': order
      };
      my_span_arr.push(h);
      h = {};
      isort++;
      order++;
    }
  });

  my_span_arr.splice(0, 1); //删除第一行

  var my = {
    title: my_title,
    cover: back_arr[0],
    summary: my_span_arr[1].content,
    author: my_user,
    time: my_em_arr[0],
    entry: my_span_arr,
  };

  res.json({
    code: 200,
    rows: my,
  })
}

module.exports = router;