const express = require('express');
const cors = require('cors');
//引入中间件
const userInfo = require('./router/user.js');
const indexInfo = require('./router/indexInfo.js')
const server = express();
server.use(cors());
server.use('/api', userInfo);
server.use('/my', indexInfo);
server.get('/', (req, res) => {
    res.json({ code: 200, msg: 'ok' });
});
server.listen(3003, () => {
    console.log('run.................');
});