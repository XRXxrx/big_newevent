const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
//引入中间件
const userInfo = require('./router/user.js');
const indexInfo = require('./router/indexInfo.js');
const articleInfo = require('./router/article.js');
const server = express();
server.use(cors());
server.use('/uploads', express.static('uploads'));

// app.use(jwt().unless());
// jwt() 用于解析token， 并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'xrx', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

server.all('*', (req, res, next) => {
    next();
});
server.use('/api', userInfo);
server.use('/my', indexInfo);
server.use('/my/article', articleInfo);

server.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ status: 1, message: '身份认证失败！' });
    }
});
server.get('/', (req, res) => {
    res.json({ code: 200, msg: 'ok' });
});
server.listen(3003, () => {
    console.log('run.................');
});