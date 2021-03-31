const express = require('express');
const conn = require('../util/sql.js');
const router = express.Router();
router.use(express.urlencoded());
//获取文章分类列表接口
let Id = null;
router.get('/cates', (req, res) => {
    let { id } = req.query;
    // console.log(id);
    Id = id;
    let sql;
    if (!id) {
        sql = `select * from categories`;
        conn.query(sql, (err, result) => {
            if (err) {
                res.json({ status: 1, message: '获取文章分类列表失败' });
                return;
            }
            res.json({ status: 0, message: '获取文章分类列表成功', data: result });
        });
    } else {
        sql = `select * from categories where id="${id}"`;
        conn.query(sql, (err, result) => {
            if (err) {
                res.json({ status: 1, message: '获取文章分类列表失败' });
                return;
            }
            res.json({ status: 0, message: '获取文章分类列表成功', data: { name: result[0].name, alias: result[0].slug } });
        });
    };
});
//新增文章分类
router.post('/addcates', (req, res) => {
    let { name, alias } = req.body;
    // console.log(name, alias);
    conn.query(`insert into categories(name,slug) value("${name}","${alias}")`, (err, result) => {
        // console.log(result);
        if (err) {
            res.json({ status: 1, message: '新增文章分类失败！' });
            return;
        };
        res.json({ status: 0, message: '新增文章分类成功！' });
    });
});
//根据 Id 删除文章分类
router.get('/deletecate', (req, res) => {
    let { id } = req.query;
    // console.log(id);
    conn.query(`delete from categories where id="${id}"`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '删除文章分类失败！' });
            return;
        }
        res.json({ status: 0, message: '删除文章分类成功！' });
    });
});
//根据 Id 获取文章分类数据
router.get('/getCatesById', (req, res) => {
    let { id } = req.query;
    // console.log(id);
    conn.query(`select * from categories where id="${id}"`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取文章分类数据失败！' });
            return;
        }
        res.json({
            status: 0,
            message: '获取文章分类数据成功！',
            data: {
                id: result[0].id,
                name: result[0].name,
                slug: result[0].slug
            }
        });
    });
});
//根据 Id 更新文章分类数据
router.post('/updatecate', (req, res) => {
    let { name, alias } = req.body;
    // console.log(Id, name, alias);
    conn.query(`update categories set name="${name}",slug="${alias}" where id="${Id}"`, (err, result) => {
        // console.log(result);
        if (err) {
            res.json({ status: 1, message: '更新分类信息失败！' });
            return;
        };
        if (result.affectedRows > 0) {
            res.json({ status: 0, message: '更新分类信息成功！' });
        }
    });
});
module.exports = router;