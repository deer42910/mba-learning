<template>
  <div class="upload-container">
    <div class="upload-form">
      <el-upload
        class="upload-box"
        action="http://localhost:8080/upload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept="image/*,.ppt,.pptx,.pdf,video/*"
      >
        <i class="el-icon-plus upload-icon"></i>
        <div class="upload-text">点击上传文件</div>
      </el-upload>
    </div>
    
    <div v-if="uploadStatus" :class="['result', uploadStatus.type]">
      <template v-if="uploadStatus.type === 'success'">
        <div v-if="fileUrl">
          <div v-if="isImage">
            <img :src="fileUrl" class="preview-image" />
          </div>
          <div class="file-url">
            文件URL: <a :href="fileUrl" target="_blank">{{ fileUrl }}</a>
          </div>
        </div>
      </template>
      <template v-else>
        {{ uploadStatus.message }}
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data() {
    return {
      fileUrl: '',
      isImage: false,
      uploadStatus: null
    }
  },
  methods: {
    beforeUpload(file) {
      // 文件类型检查
      const isImage = file.type.indexOf('image/') !== -1
      const isDocument = file.type.indexOf('application/') !== -1
      const isVideo = file.type.indexOf('video/') !== -1
      
      this.isImage = isImage
      
      // 文件大小限制 (10MB)
      const isLt10M = file.size / 1024 / 1024 < 10
      
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB!')
        return false
      }
      
      this.uploadStatus = { type: 'loading', message: '上传中...' }
      return true
    },
    handleSuccess(response, file) {
      console.log('上传成功:', response)
      
      if (response.imageUrl) {
        this.fileUrl = response.imageUrl
      } else if (response.documentUrl) {
        this.fileUrl = response.documentUrl
      } else if (response.videoUrl) {
        this.fileUrl = response.videoUrl
      } else {
        this.fileUrl = ''
      }
      
      this.uploadStatus = { 
        type: 'success', 
        message: '上传成功' 
      }
      
      // 通知父组件上传成功
      this.$emit('upload-success', this.fileUrl)
    },
    handleError(err) {
      console.error('上传失败:', err)
      this.uploadStatus = { 
        type: 'error', 
        message: `上传失败: ${err.message || '未知错误'}` 
      }
      
      // 通知父组件上传失败
      this.$emit('upload-error', err)
    }
  }
}
</script>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.upload-form {
  margin-bottom: 20px;
}

.upload-box {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-box:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-text {
  color: #606266;
  font-size: 14px;
  margin-top: 10px;
}

.result {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  word-wrap: break-word;
}

.result.error {
  color: red;
  border-color: red;
}

.result.success {
  color: green;
  border-color: green;
}

.result.loading {
  color: #409EFF;
  border-color: #409EFF;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  margin-bottom: 10px;
}

.file-url {
  word-break: break-all;
  margin-top: 10px;
}
</style>