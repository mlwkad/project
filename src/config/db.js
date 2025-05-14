const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'travel-app-mysql.ns-bpj63jw3.svc',
    user: 'root',
    password: '5tgwjn6h',
    database: 'travel-app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool