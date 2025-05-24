<template>
  <div>
    <el-dialog
      title="新增章节"
      width="40%"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :destroy-on-close="true"
      v-if="dialogVisible"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="120px"
        class="custom-form"
      >
        <el-row :gutter="25">
          <el-col :span="24">
            <el-form-item label="所属课程:" prop="taskName">
              <el-input
                v-model="form.taskName"
                size="small"
                :disabled="true"
                placeholder="请选择左侧课程"
                class="custom-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="章节名称:" prop="name">
              <el-input
                v-model="form.name"
                size="small"
                placeholder="请输入章节名称"
                clearable
                class="custom-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="视频:" prop="video">
              <el-upload
                :file-list="fileList"
                ref="videoUpload"
                :action="uploadVideoUrl()"
                accept="video/mp4,video/avi,video/mov,video/wmv"
                :multiple="false"
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="handleAvatorSuccess"
                :on-remove="handleRemove"
                :before-upload="beforeVideoUpload"
                :on-progress="handleUploadProgress"
              >
                <el-button size="small" type="primary" class="upload-button">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">支持 MP4、AVI、MOV、WMV 格式，最大 50MB</div>
              </el-upload>
              <el-progress
                v-if="videoUploading"
                :percentage="uploadProgress"
                :status="uploadProgress === 100 ? 'success' : ''"
                style="margin-top: 10px;"
              ></el-progress>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课件:" prop="courseware">
              <el-upload
                :file-list="fileList1"
                ref="coursewareUpload"
                :action="uploadFileUrl()"
                accept="application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                :multiple="false"
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="handleFileSuccess"
                :on-remove="handleFileRemove"
                :before-upload="beforeCoursewareUpload"
                :on-progress="handleUploadProgress"
              >
                <el-button size="small" type="primary" class="upload-button">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">支持 PPT、PPTX 格式，最大 20MB</div>
              </el-upload>
              <el-progress
                v-if="coursewareUploading"
                :percentage="uploadProgress"
                :status="uploadProgress === 100 ? 'success' : ''"
                style="margin-top: 10px;"
              ></el-progress>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                size="small"
                placeholder="请输入备注"
                :rows="4"
                class="custom-textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose" class="cancel-button" :disabled="submitting">取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="submit"
          class="submit-button"
          :loading="submitting"
          :disabled="submitting"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../../../minix';
import { saveApeChapter } from '../../../api/api';

export default {
  name: 'AddChapter',
  mixins: [mixin],
  props: {
    addVisible: {
      type: Boolean,
      default: false,
    },
    taskId: String,
    taskName: String,
    type: Number,
    flag: Number,
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      fileList1: [],
      form: {
        taskId: '',
        taskName: '',
        name: '',
        videoName: '',
        video: '',
        coursewareName: '',
        courseware: '',
        remark: '',
      },
      rules: {
        taskId: [{ required: true, message: '课程ID不能为空', trigger: 'change' }],
        taskName: [{ required: true, message: '课程名称不能为空', trigger: 'change' }],
        name: [{ required: true, message: '请输入章节名称', trigger: 'blur' }],
        video: [{ required: true, message: '请上传视频', trigger: 'change' }],
      },
      videoUploading: false,
      coursewareUploading: false,
      uploadProgress: 0,
      submitting: false,
    };
  },
  watch: {
    addVisible: {
      immediate: true,
      handler(newVal) {
        console.log('addVisible changed:', newVal);
        this.dialogVisible = newVal;
        if (newVal) {
          console.log('Props received:', { taskId: this.taskId, taskName: this.taskName });
          this.$nextTick(() => {
            this.form.taskId = this.taskId || '';
            this.form.taskName = this.taskName || '未选择课程';
            console.log('dialogVisible set to:', this.dialogVisible);
            console.log('form.taskName set to:', this.form.taskName);
          });
        }
      },
    },
    taskName(newVal) {
      console.log('taskName updated:', newVal);
      this.$nextTick(() => {
        this.form.taskName = newVal || '未选择课程';
        console.log('form.taskName updated to:', this.form.taskName);
      });
    },
    dialogVisible(newVal) {
      console.log('dialogVisible changed:', newVal);
      if (!newVal) {
        this.handleClose();
      }
    },
  },
  created() {
    this.form.taskId = this.taskId || '';
    this.form.taskName = this.taskName || '未选择课程';
    console.log('Created with props:', { taskId: this.taskId, taskName: this.taskName });
    console.log('Initial dialogVisible:', this.dialogVisible);
  },
  methods: {
    beforeVideoUpload(file) {
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      const isValidType = allowedTypes.includes(file.type);
      const isLt50M = file.size / 1024 / 1024 < 50;

      if (!isValidType) {
        this.$message.error('视频格式不支持，仅支持 MP4、AVI、MOV、WMV 格式！');
        return false;
      }
      if (!isLt50M) {
        this.$message.error('视频文件过大，最大支持 50MB！');
        return false;
      }
      this.videoUploading = true;
      this.uploadProgress = 0;
      return true;
    },
    beforeCoursewareUpload(file) {
      const allowedTypes = [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
      const isValidType = allowedTypes.includes(file.type);
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isValidType) {
        this.$message.error('课件格式不支持，仅支持 PPT、PPTX 格式！');
        return false;
      }
      if (!isLt20M) {
        this.$message.error('课件文件过大，最大支持 20MB！');
        return false;
      }
      this.coursewareUploading = true;
      this.uploadProgress = 0;
      return true;
    },
    handleUploadProgress(event) {
      this.uploadProgress = Math.min(100, Math.floor(event.percent));
      if (this.uploadProgress === 100) {
        setTimeout(() => {
          this.videoUploading = false;
          this.coursewareUploading = false;
        }, 500);
      }
    },
    handleAvatorSuccess(res) {
      this.videoUploading = false;
      if (res.code == 1000) {
        this.$message.success('视频上传成功！');
        this.fileList.push({ name: res.data, url: this.$store.state.configure.HOST + res.message });
        this.form.video = res.message;
        this.form.videoName = res.data;
        this.$refs.ruleForm.validateField('video');
      } else {
        this.$notify.error({
          title: '上传失败',
          message: res.message || '视频上传失败，请检查文件或网络！',
        });
        this.fileList = [];
      }
    },
    handleRemove(file, fileList) {
      this.form.video = '';
      this.form.videoName = '';
      this.fileList = [];
      this.$refs.ruleForm.validateField('video');
    },
    handleFileSuccess(res) {
      this.coursewareUploading = false;
      if (res.code == 1000) {
        this.$message.success('课件上传成功！');
        this.fileList1.push({ name: res.data, url: this.$store.state.configure.HOST + res.message });
        this.form.courseware = res.message;
        this.form.coursewareName = res.data;
      } else {
        this.$notify.error({
          title: '上传失败',
          message: res.message || '课件上传失败，请检查文件或网络！',
        });
        this.fileList1 = [];
      }
    },
    handleFileRemove(file, fileList) {
      this.form.courseware = '';
      this.form.coursewareName = '';
      this.fileList1 = [];
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    async submit() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.submitting = true;
          try {
            const res = await saveApeChapter(this.form);
            if (res.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: '保存成功',
              });
              this.handleClose();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message || '保存失败，请稍后重试',
              });
            }
          } catch (error) {
            console.error('Save Error:', error);
            this.$notify.error({
              title: '错误',
              message: '保存失败，请检查网络或后端服务',
            });
          } finally {
            this.submitting = false;
          }
        }
      });
    },
    handleClose() {
      this.form = {
        taskId: '',
        taskName: '',
        name: '',
        videoName: '',
        video: '',
        coursewareName: '',
        courseware: '',
        remark: '',
      };
      this.fileList = [];
      this.fileList1 = [];
      this.videoUploading = false;
      this.coursewareUploading = false;
      this.uploadProgress = 0;
      this.submitting = false;
      this.$refs['ruleForm'].resetFields();
      this.$emit('update:addVisible', false);
      this.$emit('addFalse');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Roboto:wght@400;500&display=swap');

.el-dialog {
  border-radius: 12px;
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
}

.custom-form {
  padding: 20px;
}

.el-form-item__label {
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  line-height: 36px;
  letter-spacing: 0.5px;
}

.custom-input .el-input__inner,
.custom-textarea .el-textarea__inner {
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
  font-size: 14px;
  color: #4a5568;
  border-radius: 8px;
  border-color: #cbd5e0;
  padding: 8px 12px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
}

.custom-textarea .el-textarea__inner {
  resize: vertical;
  min-height: 80px;
}

.upload-button {
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    background: linear-gradient(90deg, #2563eb, #3b82f6);
  }
}

.submit-button {
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #34d399, #10b981);
  color: #fff;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
    background: linear-gradient(90deg, #10b981, #34d399);
  }
}

.cancel-button {
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #a0aec0, #718096);
  color: #fff;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(160, 174, 192, 0.3);
    background: linear-gradient(90deg, #718096, #a0aec0);
  }
}

.el-form-item {
  margin-bottom: 25px;
}

.dialog-footer {
  text-align: right;
  padding: 10px 20px;
}

.el-upload__tip {
  font-family: 'Noto Sans SC', 'Roboto', sans-serif;
  font-size: 12px;
  color: #718096;
  margin-top: 5px;
}
</style>