const mysql = require('mysql');

module.exports = {
    query: function(sql, callback) {
        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'big_event'
        });
        conn.connect((err) => {
            if (err) {
                console.log('数据库连接失败');
                return;
            }
            console.log('数据库连接成功');
        });
        conn.query(sql, callback);
        conn.end();
    }
}