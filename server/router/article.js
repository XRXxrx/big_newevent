const express = require('express');
const conn = require('../util/sql.js');
const multer = require('multer');
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
    let sql = `select id as Id,title,date as pub_date,state,cate_name from categories`;
    let sqls = `select count(*) as total from categories`;
    if (!cate_id && !state) {
        sql += ` where isDelete=0 limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where isDelete=0`;
    } else if (!cate_id) {
        sql += ` where isDelete=0 and state="${state}" limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where isDelete=0 and state="${state}"`;
    } else if (!state) {
        sql += ` where isDelete=0 and categoryId="${cate_id}" limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where isDelete=0 and categoryId="${cate_id}"`;
    } else {
        sql += ` where isDelete=0 and state="${state}" and categoryId="${cate_id}" limit ${pagesize * (pagenum - 1)},${pagesize}`;
        sqls += ` where isDelete=0 and state="${state}" and categoryId="${cate_id}"`;
    };
    conn.query(sqls, (err, result) => {
        // console.log(sqls);
        // console.log(result[0]);
        let count = result[0].total;
        conn.query(sql, (err, result) => {
            // console.log(sql);
            // console.log(result);
            if (err) {
                res.json({ status: 1, message: '获取文章列表失败！' });
                return;
            }
            res.json({
                status: 0,
                message: '获取文章列表成功！',
                data: result,
                total: count
            });
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
                Id: result[0].id,
                title: result[0].title,
                content: result[0].content,
                cover_img: result[0].cover,
                pub_date: result[0].date,
                state: result[0].state,
                is_delete: result[0].isDelete,
                cate_id: result[0].categoryId,
                author_id: result[0].author
            }
        });
    });
});

let imgSrc = null;
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        imgSrc = file.fieldname + '-' + Date.now();
        cb(null, imgSrc);
    }
});


let upload = multer({
    storage: storage
});
//根据 Id 更新文章信息接口
router.post('/edit', upload.single('cover_img'), (req, res) => {
    // console.log(req.body);

    let { Id, title, cate_id, content, state } = req.body;
    let { file } = req;
    // console.log(req.file);
    // console.log(Id, title, cate_id, content, state);
    let pat = 'http://127.0.0.1:3003/uploads/' + imgSrc;
    // console.log(pat);
    let arr = [];
    if (title) arr.push(`title="${title}"`);
    if (cate_id) arr.push(`categoryId="${cate_id}"`);
    if (content) arr.push(`content="${content}"`);
    if (file) arr.push(`cover="${pat}"`);
    if (state) arr.push(`state="${state}"`);
    // console.log(arr);
    arr = arr.join(',');
    // console.log(arr);
    conn.query(`update categories set ${arr} where id=${Id}`, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '修改文章失败！' });
            return;
        };
        if (result.affectedRows > 0) {
            res.json({ status: 0, message: '修改文章成功！' })
        }
    })
});
//发布新文章接口
// let nam;
router.post('/add', upload.single('cover_img'), (req, res) => {
    // console.log(req.body);

    let { title, cate_id, content, state } = req.body;
    let { file } = req;
    let { name } = req.user;
    // console.log(name);
    let key = [];
    let arrs = [];
    conn.query(`select name from cates where id=${cate_id}`, (err, result) => {
        let nam = result[0].name;
        conn.query(`select id from users where username="${name}"`, (err, result) => {
            let id = result[0].id;
            // console.log(id);
            // console.log(nam);
            // console.log(req.file);
            // console.log(title, cate_id, content, state, nam);
            let pat = 'http://127.0.0.1:3003/uploads/' + imgSrc;
            let date = new Date();
            // console.log(date);
            // console.losg(pat);
            if (title) {
                key.push('title');
                arrs.push(`"${title}"`);
            };
            if (cate_id) {
                key.push('categoryId');
                key.push('cate_name');
                arrs.push(`"${cate_id}"`);
                arrs.push(`"${nam}"`);
            };
            if (content) {
                key.push('content');
                arrs.push(`"${content}"`);
            };
            if (file) {
                key.push('cover');
                arrs.push(`"${pat}"`);
            };
            if (state) {
                key.push('date');
                key.push('state');
                key.push('author');
                arrs.push(`"${date}"`);
                arrs.push(`"${state}"`);
                arrs.push(`"${id}"`);
            };
            // console.log(arr);
            key = key.join(',');
            arrs = arrs.join(',');
            console.log(arrs);
            console.log(key);

            conn.query(`insert into categories(${key}) value(${arrs})`, (err, result) => {
                if (err) {
                    res.json({ status: 1, message: '发布文章失败！' });
                    return;
                };
                res.json({ status: 0, message: '发布文章成功！' });
            })
        });
    });
});
module.exports = router;