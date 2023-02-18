const express = require('express');
var bodyParser = require('body-parser'); // 处理post请求参数
const port = 5000;
const app = express();
app.use(express.json({
  extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(__dirname));
app.use('/xmlToJson', require('../api/xmlToJson.js'));
app.use('/article', require('../api/article.js'));
app.use('/nft', require('../api/nft.js'));
app.use('/jdApi', require('../api/jd.js'));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});