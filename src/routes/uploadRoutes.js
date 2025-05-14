const express = require('express')
const router = express.Router()
const { uploadMiddleware, uploadFiles } = require('../controllers/uploadController')

/**
 * @route POST /api/upload
 * @desc 上传文件（图片/视频/封面图）
 * @access 公开
 * @param {Array} files - 要上传的文件
 * @param {String} [type] - 文件类型，可选值：image, video, cover
 * @returns {Object} 包含上传后文件URL的对象
 * 
 * 使用示例:
 * - 普通上传: POST /api/upload
 * - 上传: POST /api/upload?type=可选值：image, video, cover
 */
router.post('/upload', uploadMiddleware, uploadFiles)

module.exports = router