const express = require('express');
const conn = require('../util/sql.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.use(express.urlencoded());
//注册接口
router.post('/reguser', (req, res) => {
    let { username, password } = req.body;
    // console.log(username, password);
    // console.log(`select username from users where username="${username}"`);
    conn.query(`select username from users where username="${username}"`, (err, result) => {
        if (err) {
            res.json({ code: 500, message: '服务器错误' });
            return;
        };
        if (result.length > 0) {
            res.json({ status: 1, message: '注册失败，该用户名已注册' });
        };
        conn.query(`insert into users(username,password) value("${username}","${password}")`, (err, result) => {
            if (err) {
                res.json({ code: 500, message: '服务器错误' });
                return;
            }
            res.json({ status: 0, message: '注册成功' });
        })
    });
});
//登录接口
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    console.log(username, password);
    conn.query(`select * from users where username="${username}" and password="${password}"`, (err, result) => {
        // console.log(result);
        if (err || result.length == 0) {
            res.json({ status: 1, message: '账号密码错误' });
            return;
        }
        const tokenStr = jwt.sign({ name: username }, 'xrx', { expiresIn: 2 * 60 * 60 * 60 });
        const token = 'Bearer ' + tokenStr;
        res.json({ status: 0, message: '登录成功', token });
    });
});
//导出
module.exports = router;