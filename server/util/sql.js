const mysql = require('mysql');

module.exports = {
    query: function(sql, callback) {
        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'big_event'
        });
        conn.connect();
        conn.query(sql, callback);
        conn.end();
    }
}