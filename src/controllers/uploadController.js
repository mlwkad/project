const multer = require('multer')
const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk') // 用于连接Sealos对象存储（兼容S3协议）

// Sealos对象存储配置
const s3Config = {
    accessKeyId: 'bpj63jw3',
    secretAccessKey: '99446hj4zd7wtdg6',
    endpoint: 'https://objectstorageapi.bja.sealos.run',
    s3ForcePathStyle: true, // 设置为true以使用自定义endpoint
    signatureVersion: 'v4',
    region: 'default'
};

// 存储桶名称
const bucketName = 'bpj63jw3-travel-app-uploads'

// 创建S3客户端
const s3Client = new AWS.S3(s3Config)

// 配置临时存储
// 使用内存存储，避免写入本地文件系统
const storage = multer.memoryStorage()

// 从MIME类型判断文件类型
function getFileTypeFromMimetype(mimetype) {
    if (mimetype.startsWith('image/')) {
        return 'image'
    } else if (mimetype.startsWith('video/')) {
        return 'video'
    } else {
        return 'unknown'
    }
}

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('不支持的文件类型'), false)
    }
}

// 配置上传限制和处理
const uploadHandler = multer({
    storage: storage, // 使用内存存储
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 限制100MB
        files: 10 // 一次最多上传10个文件
    }
})

/**
 * 上传文件到Sealos对象存储
 * @param {Object} file - multer处理后的文件对象
 * @param {String} fileType - 文件类型(image/video/cover)
 * @returns {Promise<Object>} - 返回上传后的文件信息
 */
const uploadToSealosStorage = async (file, fileType) => {
    try {
        console.log(`[uploadToSealosStorage] 开始上传文件: ${file.originalname}, 类型: ${fileType}, 大小: ${file.size} bytes`)
        // 生成文件名和存储路径
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 10)
        const originalExt = path.extname(file.originalname) || '.jpg'
        const filename = `${timestamp}-${randomString}${originalExt}`
        const key = `${fileType}/${filename}`
        console.log(`[uploadToSealosStorage] 生成的文件路径: ${key}`)
        // 设置上传参数
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer, // 使用内存中的buffer
            ContentType: file.mimetype,
            ACL: 'publicRead' // 设置为公开可读，便于直接访问
        }
        console.log(`[uploadToSealosStorage] 准备上传到存储桶: ${bucketName}`)
        // 上传到对象存储
        const result = await s3Client.upload(params).promise()
        console.log(`[uploadToSealosStorage] 上传成功, URL: ${result.Location}`)
        // 返回文件信息
        return {
            originalname: file.originalname,
            filename: filename,
            url: result.Location,
            size: file.size,
            mimetype: file.mimetype,
            type: fileType
        }
    } catch (error) {
        console.error(`[uploadToSealosStorage] 上传失败: ${error.message}`, error)
        throw error
    }
}

/**
 * 上传文件处理函数
 * 
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Object} req.query - 查询参数
 * @param {string} [req.query.type] - 文件类型，可选值：image, video, cover
 * @param {Array} req.files - 上传的文件数组
 */
const uploadFiles = async (req, res) => {
    console.log(`[uploadFiles] 接收到上传请求，IP: ${req.ip}, 查询参数:`, req.query);
    try {
        // 中间件已处理文件上传，此处检查结果
        if (!req.files || req.files.length === 0) {
            console.warn(`[uploadFiles] 未检测到文件, req.files: ${JSON.stringify(req.files)}`)
            return res.status(400).json({
                success: false,
                message: '没有上传任何文件'
            })
        }
        console.log(`[uploadFiles] 检测到 ${req.files.length} 个文件待上传`)
        req.files.forEach((file, index) => {
            console.log(`[uploadFiles] 文件 ${index + 1}: 名称=${file.originalname}, 大小=${file.size}字节, 类型=${file.mimetype}`)
        })
        // 处理所有上传的文件
        console.log(`[uploadFiles] 开始处理上传的文件`)
        const uploadPromises = req.files.map(file => {
            const fileType = req.query.type || getFileTypeFromMimetype(file.mimetype)
            console.log(`[uploadFiles] 为文件 ${file.originalname} 确定类型: ${fileType}`)
            // 上传到Sealos对象存储
            return uploadToSealosStorage(file, fileType)
        })
        // 等待所有文件上传完成
        console.log(`[uploadFiles] 等待所有文件上传完成...`)
        const files = await Promise.all(uploadPromises)
        console.log(`[uploadFiles] 所有文件上传完成, 共 ${files.length} 个文件`)
        // 按类型分组文件URL
        const pictures = files.filter(file => file.type === 'image').map(file => file.url)
        const videos = files.filter(file => file.type === 'video').map(file => file.url)
        const covers = files.filter(file => file.type === 'cover').map(file => file.url)
        console.log(`[uploadFiles] 文件分类统计: 图片=${pictures.length}, 视频=${videos.length}, 封面=${covers.length}`)
        // 返回成功响应
        console.log(`[uploadFiles] 上传流程完成，返回成功响应`)
        res.status(200).json({
            success: true,
            message: '文件上传成功',
            files: files,
            data: {
                pictures,
                videos,
                covers,
                total: files.length
            }
        })
    } catch (error) {
        console.error(`[uploadFiles] 文件上传失败: ${error.message}`, error)
        console.error(`[uploadFiles] 错误堆栈: ${error.stack}`)
        res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error.message
        })
    }
}

// 修改uploadController.js中的中间件配置
// 支持多个可能的字段名
const uploadMiddleware = (req, res, next) => {
    console.log(`[uploadMiddleware] 开始处理文件上传请求, 内容类型: ${req.headers['content-type']}`);
    // 尝试不同的字段名
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 100 * 1024 * 1024, files: 10 }
    }).any() // 接受任何字段名的文件
    upload(req, res, function (err) {
        if (err) {
            console.error(`[uploadMiddleware] Multer错误: ${err.message}`, err)
            return res.status(400).json({
                success: false,
                message: '文件上传配置错误',
                error: err.message
            })
        }
        console.log(`[uploadMiddleware] Multer处理完成, 检测到 ${req.files ? req.files.length : 0} 个文件`)
        // 继续处理
        next()
    })
}

module.exports = {
    uploadMiddleware,
    uploadFiles
}