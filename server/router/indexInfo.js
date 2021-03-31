const express = require('express');
const conn = require('../util/sql.js');
const router = express.Router();
router.use(express.urlencoded());
//注册接口
router.post('/reguser', (req, res) => {
    res.json({ code: 200, msg: 'ok' })
});
//登录接口
router.post('/login', (req, res) => {
    res.json({ code: 200, msg: 'ok' })
});
//导出
module.exports = router;