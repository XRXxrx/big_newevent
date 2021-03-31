const conn = require('./sql.js');
conn.query('select * from categories', (err, result) => {
    if (err) {
        console.log('服务器请求失败');
        return;
    }
    console.log(result);
});