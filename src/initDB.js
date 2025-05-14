/** 指令:node src/initDB.js
 * 用于重置并初始化数据库(删除表后重新创建,带测试数据)
 */
const mysql = require('mysql2/promise')

const rootPool = mysql.createPool({
    host: 'travel-app-mysql.ns-bpj63jw3.svc',
    user: 'root',
    password: '5tgwjn6h',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const pool = require('./config/db')
const userModel = require('./models/userModel')
const releaseModel = require('./models/releaseModel')

const initializeDatabase = async () => {
    try {
        await rootPool.query('CREATE DATABASE IF NOT EXISTS `travel-app`')
        await pool.query('DROP TABLE IF EXISTS releases')
        await pool.query('DROP TABLE IF EXISTS users')
        await userModel.initTable()
        await releaseModel.initTable()
        process.exit(0)
    } catch (error) {
        console.error('数据库初始化失败:', error)
        process.exit(1)
    }
}

initializeDatabase()