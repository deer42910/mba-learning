/**
 * 文件上传工具模块
 */
import axios from 'axios';

/**
 * 上传文件到 PicList，返回图片 URL
 * @param {File} file - 要上传的文件
 * @returns {Promise<string>} - 图片的 URL
 */
export async function uploadFile(file) {
    try {
        // 校验文件
        if (!file) {
            throw new Error('请选择要上传的文件！');
        }
        const allowedTypes = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('请上传正确的图片格式（支持：jpeg, gif, png, bmp）');
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            throw new Error('上传文件大小不能超过 2MB！');
        }

        // 构造 FormData
        const formData = new FormData();
        formData.append('list', file);

        // 调用 PicList 上传接口
        const response = await axios.post(
            'http://127.0.0.1:36677/upload?picbed=github&configName=imgsHub',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        // 解析响应（假设 PicList 返回格式为 {"success": true, "result": ["url"]})
        if (response.data.success && response.data.result && response.data.result.length > 0) {
            return response.data.result[0];
        } else {
            throw new Error('上传失败：' + (response.data.message || '未知错误'));
        }
    } catch (error) {
        throw new Error('文件上传失败：' + error.message);
    }
}