const express = require('express');
const conn = require('../util/sql.js');
const router = express.Router();
router.use(express.urlencoded());
//获取文章分类列表接口
router.get('/cates', (req, res) => {
    // console.log(id);
    let sql = `select * from cates`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取文章分类列表失败' });
            return;
        }
        res.json({ status: 0, message: '获取文章分类列表成功', data: result });
    });
});
router.get('/cates/:id', (req, res) => {
    let { id } = req.params;
    console.log(id);
    let sql = `select * from cates where id="${id}"`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取文章分类列表失败' });
            return;
        }
        res.json({ status: 0, message: '获取文章分类列表成功', data: { id: result[0].id, name: result[0].name, alias: result[0].slug } });
    });

});
//新增文章分类
router.post('/addcates', (req, res) => {
    let { name, alias } = req.body;
    // console.log(name, alias);
    conn.query(`insert into cates(name,slug) value("${name}","${alias}")`, (err, result) => {
        // console.log(result);
        if (err) {
            res.json({ status: 1, message: '新增文章分类失败！' });
            return;
        };
        res.json({ status: 0, message: '新增文章分类成功！' });
    });
});
//根据 Id 删除文章分类
router.get('/deletecate/:id', (req, res) => {
    let { id } = req.params;
    // console.log(id);
    conn.query(`delete from cates where id="${id}"`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '删除文章分类失败！' });
            return;
        }
        res.json({ status: 0, message: '删除文章分类成功！' });
    });
});
//根据 Id 获取文章分类数据
router.get('/getCatesById/:id', (req, res) => {
    let { id } = req.query;
    // console.log(id);
    conn.query(`select * from cates where id="${id}"`, (err, result) => {
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
    let { id, name, alias } = req.body;
    // console.log(id, name, alias);
    conn.query(`update cates set name="${name}",slug="${alias}" where id="${id}"`, (err, result) => {
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


//获取文章的列表数据接口
router.get('/list', (req, res) => {
    let { pagenum, pagesize, cate_id, state } = req.query;
    // console.log(pagenum, pagesize, cate_id, state);
    let sql = `select id as Id,title,pub_date,state,cate_name from categories`;
    let sqls = `select count(*) as total from categories`;
    if (!cate_id && !state) {
        sql += ` where is_delete=0 limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where is_delete=0`;
    } else if (!cate_id) {
        sql += ` where is_delete=0 and state="${state}" limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where is_delete=0 and state="${state}"`;
    } else if (!state) {
        sql += ` where is_delete=0 and Id="${cate_id}" limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where is_delete=0 and Id="${cate_id}"`;
    } else {
        sql += ` where is_delete=0 and state="${state}" and Id="${cate_id}" limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where is_delete=0 and state="${state}" and Id="${cate_id}"`;
    };
    conn.query(sqls, (err, result) => {
        // console.log(sqls);
        // console.log(result[0]);
        let count = result[0].total;
        conn.query(sql, (err, result) => {
            // console.log(sql);
            if (err) {
                res.json({ status: 1, message: '获取文章列表失败！' });
                return;
            }
            res.json({ status: 0, message: '获取文章列表成功！', data: result, total: count });
        });
    });
});
//根据 Id 删除文章数据接口
router.get('/delete/:Id', (req, res) => {
    let { Id } = req.params;
    // console.log(Id);
    conn.query(`update categories set is_delete=1 where Id=${Id}`, (err, result) => {
        console.log(result);
        if (err) {
            res.json({ status: 1, message: '删除失败' });
            return;
        }
        if (result.affectedRows > 0) {
            res.json({ status: 0, message: '删除成功' })
        }
    });
});
//根据 Id 获取文章详情接口
router.get('/:Id', (req, res) => {
    let { Id } = req.params;
    // console.log(Id);
    conn.query(`select * from categories where id=${Id}`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取文章失败' });
            return;
        }
        res.json({
            status: 0,
            message: '获取文章成功',
            data: {
                Id: result[0].Id,
                title: result[0].title,
                content: result[0].content,
                cover_img: result[0].cover_img,
                pub_date: result[0].pub_date,
                state: result[0].state,
                is_delete: result[0].is_delete,
                cate_id: result[0].cate_id,
                author_id: result[0].author_id
            }
        });
    });
});

//根据 Id 更新文章信息接口
router.post('/edit', (req, res) => {
    // console.log(req.body);

    let { title, cate_id, content, cover_img, state } = req.body;
    console.log(title, cate_id, content, cover_img, state);
});
module.exports = router;