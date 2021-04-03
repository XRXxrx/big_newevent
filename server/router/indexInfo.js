const express = require('express');
const conn = require('../util/sql.js');
const multer = require('multer');
const router = express.Router();
router.use(express.urlencoded());
//获取用户的基本信息接口
router.get('/userinfo', (req, res) => {
    let { name } = req.user;
    // console.log(name);
    conn.query(`select * from users where username="${name}"`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取用户信息失败' });
            return;
        }
        // console.log(result);
        res.json({
            status: 0,
            message: '获取用户基本信息成功！',
            data: {
                id: result[0].id,
                username: result[0].username,
                nickname: result[0].nickname,
                email: result[0].email,
                userPic: result[0].userPic,
                password: result[0].password
            }
        });
    });
});
//更新用户的基本信息接口
router.post('/userinfo', (req, res) => {
    let { name } = req.user;
    let { nickname, email } = req.body;
    // console.log(name, nickname, email);
    conn.query(`update users set nickname="${nickname}",email="${email}" where username="${name}"`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '修改用户信息失败' });
            return;
        }
        res.json({ status: 0, message: '获取用户信息成功' });
    });
});
//上传用户头像
// 精细化去设置，如何去保存文件(保存的文件位置不会自动创建，要先手动创建好)
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function(req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName);
    }
});
const upload = multer({ storage });
router.post('/update/avatar', upload.single('file_data'), function(req, res, next) {
    // req.file 是 `file_data` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    // let { fileName } = req.file;
    // console.log(req.file);
    res.json({
        status: 0,
        message: "http://127.0.0.1:3003/uploads/" + req.file.filename
    });
});
//更新头像信息
router.post('/uploadPic', (req, res) => {
    let { name } = req.user;
    let { userPic } = req.body;
    console.log(name, userPic);
    conn.query(`update users set userPic="${userPic}" where username="${name}"`, (err, result) => {
        // console.log(result);
        if (err) {
            res.json({
                status: 1,
                message: '更新图片失败'
            });
        }

        if (result.affectedRows > 0) {
            res.json({
                status: 0,
                message: '更新图片成功'
            })
        }
    });
});
//重置密码
router.post('/updatepwd', (req, res) => {
    let { name } = req.user;
    let { oldPwd, newPwd } = req.body;
    // console.log(name, password, newpassword);
    conn.query(`update users set password="${newPwd}" where username="${name}" and password="${oldPwd}"`, (err, result) => {
        // console.log(result);
        if (err) {
            res.json({ status: 1, message: '更新密码失败' });
        };
        if (result.affectedRows > 0) {
            res.json({ status: 0, message: '更新密码成功' });
        };
    });
});
//导出
module.exports = router;