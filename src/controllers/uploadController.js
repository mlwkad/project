/**
 * 上传控制器
 * 处理文件上传相关功能
 * 
 * 使用Sealos对象存储服务保存所有上传的文件
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk'); // 用于连接Sealos对象存储（兼容S3协议）

// Sealos对象存储配置
const s3Config = {
    accessKeyId: 'bpj63jw3',
    secretAccessKey: '99446hj4zd7wtdg6',
    endpoint: 'https://objectstorageapi.bja.sealos.run', // 外部端点
    s3ForcePathStyle: true, // 必须设置为true以使用自定义endpoint
    signatureVersion: 'v4',
    region: 'default'
};

// 存储桶名称
const bucketName = 'bpj63jw3-travel-app-uploads';

// 创建S3客户端
const s3Client = new AWS.S3(s3Config)

// 配置临时存储
// 使用内存存储，避免写入本地文件系统
const storage = multer.memoryStorage();

// 从MIME类型判断文件类型
function getFileTypeFromMimetype(mimetype) {
    if (mimetype.startsWith('image/')) {
        return 'image';
    } else if (mimetype.startsWith('video/')) {
        return 'video';
    } else {
        return 'unknown';
    }
}

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];

    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型'), false);
    }
};

// 配置上传限制和处理
const uploadHandler = multer({
    storage: storage, // 使用内存存储
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 限制100MB
        files: 10 // 一次最多上传10个文件
    }
});

/**
 * 上传文件到Sealos对象存储
 * @param {Object} file - multer处理后的文件对象
 * @param {String} fileType - 文件类型(image/video/cover)
 * @returns {Promise<Object>} - 返回上传后的文件信息
 */
const uploadToSealosStorage = async (file, fileType) => {
    try {
        // 生成文件名和存储路径
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 10);
        const originalExt = path.extname(file.originalname) || '.jpg';
        const filename = `${timestamp}-${randomString}${originalExt}`;
        const key = `${fileType}/${filename}`;

        // 设置上传参数
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer, // 使用内存中的buffer
            ContentType: file.mimetype,
            ACL: 'publicRead' // 设置为公开可读，便于直接访问
        };

        // 上传到对象存储
        const result = await s3Client.upload(params).promise();

        // 返回文件信息
        return {
            originalname: file.originalname,
            filename: filename,
            url: result.Location,
            size: file.size,
            mimetype: file.mimetype,
            type: fileType
        };
    } catch (error) {
        console.error('上传到Sealos对象存储失败:', error);
        throw error;
    }
};

/**
 * 上传文件处理函数
 * 使用中间件预处理，然后在控制器中完成剩余逻辑
 * 
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Object} req.query - 查询参数
 * @param {string} [req.query.type] - 文件类型，可选值：image, video, cover
 * @param {Array} req.files - 上传的文件数组
 */
const uploadFiles = async (req, res) => {
    try {
        // 中间件已处理文件上传，此处检查结果
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: '没有上传任何文件'
            });
        }

        // 处理所有上传的文件
        const uploadPromises = req.files.map(file => {
            // 确定文件类型，优先使用查询参数
            const fileType = req.query.type || getFileTypeFromMimetype(file.mimetype);

            // 上传到Sealos对象存储
            return uploadToSealosStorage(file, fileType);
        });

        // 等待所有文件上传完成
        const files = await Promise.all(uploadPromises);

        // 按类型分组文件URL
        const pictures = files.filter(file => file.type === 'image').map(file => file.url);
        const videos = files.filter(file => file.type === 'video').map(file => file.url);
        const covers = files.filter(file => file.type === 'cover').map(file => file.url);

        // 返回成功响应
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
        });
    } catch (error) {
        console.error('文件上传失败:', error);
        res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error.message
        });
    }
};

// 修改uploadController.js中的中间件配置
// 支持多个可能的字段名
const uploadMiddleware = (req, res, next) => {
    // 尝试不同的字段名
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 100 * 1024 * 1024, files: 10 }
    }).any(); // 接受任何字段名的文件

    upload(req, res, function (err) {
        if (err) {
            console.error('Multer错误:', err);
            return res.status(400).json({
                success: false,
                message: '文件上传配置错误',
                error: err.message
            });
        }

        // 继续处理
        next();
    });
};

module.exports = {
    // 导出中间件和控制器函数
    uploadMiddleware,
    uploadFiles
}; 