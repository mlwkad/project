const config = {
    name: '旅游信息分享平台',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: '24h',

    // URL配置
    baseUrl: 'https://vkxvigkepssq.sealosbja.site',
    wsUrl: 'wss://vkxvigkepssq.sealosbja.site',

    // CORS配置
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    logLevel: 'info'
}

module.exports = config