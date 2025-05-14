/**指令:node src/dropTables.js
 * 只删除数据库中的表，不会重新创建
 */
const pool = require('./config/db')

const dropTables = async () => {
    try {
        await pool.query('DROP TABLE IF EXISTS releases')
        await pool.query('DROP TABLE IF EXISTS users')
        process.exit(0)
    } catch (error) {
        console.error('删除表失败:', error)
        process.exit(1)
    }
}

dropTables()