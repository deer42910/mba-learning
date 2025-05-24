<template>
  <div>
    <el-dialog
      title="新增课程"
      width="40%"
      :destroy-on-close="true"
      :visible.sync="addVisible"
      :before-close="handleClose"
      class="add-dialog"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">课程名称:</span>
            <div style="width: 100%">
              <el-form-item prop="name" style="margin-bottom: 0">
                <el-input
                  v-model="form.name"
                  size="mini"
                  placeholder="请输入课程名称"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">课程占比:</span>
            <div style="width: 100%">
              <el-form-item prop="proportion" style="margin-bottom: 0">
                <el-input
                  type="number"
                  min="0"
                  max="100"
                  v-model.number="form.proportion"
                  size="mini"
                  placeholder="请输入视频和作业分数所占比例"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col v-if="flag == 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">教师名称:</span>
            <div style="width: 100%">
              <el-form-item prop="teacherId" style="margin-bottom: 0">
                <el-select
                  clearable
                  style="margin-top: 10px"
                  size="mini"
                  v-model="form.teacherId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in teacher"
                    :key="index"
                    :label="item.userName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">所属专业:</span>
            <div style="width: 100%">
              <el-form-item prop="major" style="margin-bottom: 0">
                <el-select
                  clearable
                  style="margin-top: 10px"
                  size="mini"
                  v-model="form.major"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in major"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">所属分类:</span>
            <div style="width: 100%">
              <el-form-item prop="classification" style="margin-bottom: 0">
                <el-cascader
                  clearable
                  style="margin-top: 10px"
                  size="mini"
                  v-model="form.classification"
                  :options="categoryTree"
                  placeholder="请选择分类"
                  :props="{ checkStrictly: true, value: 'name', label: 'name' }"
                  @change="handleClassificationChange"
                ></el-cascader>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">封面:</span>
            <div style="width: 100%">
              <el-form-item prop="image" style="margin-bottom: 0">
                <el-upload
                  class="banner-uploader"
                  :http-request="handleUpload"
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                >
                  <div v-if="!form.image" class="upload-placeholder">
                    <i class="el-icon-picture-outline"></i>
                    <span>点击上传封面</span>
                  </div>
                  <div v-else class="image-preview-container">
                    <img :src="form.image" class="banner-image" />
                    <div class="image-actions">
                      <i class="el-icon-zoom-in" @click.stop="previewImage"></i>
                      <i class="el-icon-delete" @click.stop="removeImage"></i>
                    </div>
                  </div>
                </el-upload>
                <div class="upload-tips">建议尺寸: 1200×400px，JPG/PNG格式</div>
              </el-form-item>
            </div>
          </el-col>
          <el-col style="margin-top: 25px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">课程描述:</span>
            <div style="width: 100%">
              <el-form-item prop="taskDescribe" style="margin-bottom: 0">
                <el-input
                  type="textarea"
                  v-model="form.taskDescribe"
                  size="mini"
                  placeholder="请输入课程描述"
                  autocomplete="off"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col style="margin-top: 25px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">备注:</span>
            <div style="width: 100%">
              <el-form-item prop="remark" style="margin-bottom: 0">
                <el-input
                  type="textarea"
                  v-model="form.remark"
                  size="mini"
                  placeholder="请输入备注"
                  autocomplete="off"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
        <el-button size="mini" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../../../minix';
import { saveApeTask, getUserListByType, getApeMajorList, getCategoryTree } from '../../../api/api';
import { uploadFile } from '@/utils/upload';

export default {
  mixins: [mixin],
  data() {
    return {
      formLabelWidth: '80px',
      form: {
        name: '',
        taskDescribe: '',
        teacherId: '',
        teacherName: '',
        image: '',
        state: '',
        major: '',
        classification: '',
        num: '',
        remark: '',
        proportion: '',
        type: 0,
      },
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        proportion: [
          { required: true, message: '请输入视频和作业分数占比', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
        ],
        taskDescribe: [
          { required: true, message: '请输入课程描述', trigger: 'blur' },
        ],
        teacherId: [
          { required: true, message: '请选择教师', trigger: 'blur' },
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
        major: [
          { required: true, message: '请选择所属专业', trigger: 'blur' },
        ],
        classification: [
          { required: true, message: '请选择所属分类', trigger: 'blur' },
        ],
        image: [
          { required: true, message: '请上传封面图片', trigger: 'blur' },
        ],
      },
      teacher: [],
      major: [],
      categoryTree: [],
    };
  },
  props: ['addVisible', 'flag'],
  methods: {
    async handleUpload(options) {
      try {
        const url = await uploadFile(options.file);
        this.form.image = url;
        this.$notify.success({
          title: '上传成功',
          message: '封面上传成功',
        });
      } catch (error) {
        this.$notify.error({
          title: '上传失败',
          message: error.message,
        });
      }
    },
    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('上传封面只能是图片格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传封面大小不能超过 2MB!');
      }
      return isImage && isLt2M;
    },
    previewImage() {
      this.dialogImageUrl = this.form.image;
      this.dialogVisible = true;
    },
    removeImage() {
      this.$confirm('确定要删除这张封面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.image = '';
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {});
    },
    getUserListByType() {
      getUserListByType({ type: 1 }).then((res) => {
        if (res.code == 1000) {
          this.teacher = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    getApeMajorList() {
      getApeMajorList().then((res) => {
        if (res.code == 1000) {
          this.major = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    getCategoryTree() {
      getCategoryTree().then((res) => {
        if (res.code == 1000) {
          this.categoryTree = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    handleClassificationChange(value) {
      this.form.classification = value[value.length - 1]; // 取最后一级分类名称
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.flag == 2) {
            this.form.type = 1;
          }
          saveApeTask(this.form).then((res) => {
            if (res.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: '保存成功',
              });
              this.handleClose();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.form = {
        name: '',
        taskDescribe: '',
        teacherId: '',
        teacherName: '',
        image: '',
        state: '',
        major: '',
        classification: '',
        num: '',
        remark: '',
        proportion: '',
        type: 0,
      };
      this.$emit('addFalse');
    },
  },
  mounted() {
    this.getUserListByType();
    this.getApeMajorList();
    this.getCategoryTree();
    if (this.flag == 1) {
      this.form.type = 0;
    } else {
      this.form.type = 1;
    }
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap');

.add-dialog {
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.el-dialog__header) {
  background: linear-gradient(90deg, #A8E6CF, #7CC4A8);
  color: #2D3748;
  font-weight: 600;
  font-size: 16px;
  padding: 15px 20px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

:deep(.el-dialog__title) {
  color: #2D3748;
}

:deep(.el-dialog__body) {
  padding: 16px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
}

.search-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2D3748;
  width: 84px;
  text-align: right;
  margin-right: 10px;
  white-space: nowrap;
}

.el-input,
.el-select,
.el-textarea,
.el-cascader {
  width: 100%;
}

.el-input :deep(.el-input__inner),
.el-select :deep(.el-input__inner),
.el-textarea :deep(.el-textarea__inner),
.el-cascader :deep(.el-input__inner) {
  border-radius: 6px;
  border: 1px solid #A8E6CF;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  color: #4B5563;
  transition: border-color 0.3s ease;
}

.el-input :deep(.el-input__inner:focus),
.el-select :deep(.el-input__inner:focus),
.el-textarea :deep(.el-textarea__inner:focus),
.el-cascader :deep(.el-input__inner:focus) {
  border-color: #7CC4A8;
  box-shadow: 0 0 5px rgba(124, 196, 168, 0.3);
}

.banner-uploader .el-upload {
  border: 1px dashed #A8E6CF;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-uploader .el-upload:hover {
  border-color: #7CC4A8;
  background-color: #F1F5F9;
}

.upload-placeholder {
  width: 240px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F5F7FA;
  border: 1px dashed #C0C4CC;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: #A8E6CF;
  background-color: #ECF5FF;
}

.upload-placeholder i {
  font-size: 32px;
  color: #909399;
  margin-bottom: 8px;
}

.upload-placeholder span {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  color: #606266;
}

.image-preview-container {
  position: relative;
  width: 240px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.3s;
}

.image-preview-container:hover .image-actions {
  opacity: 1;
}

.image-actions i {
  font-size: 20px;
  color: #fff;
  margin: 0 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.image-actions i:hover {
  background-color: rgba(0, 0, 0, 0.6);
  transform: scale(1.1);
}

.upload-tips {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.dialog-footer {
  text-align: right;
  padding: 10px 20px;
  border-top: 1px solid #E5E7EB;
}

.el-button {
  border-radius: 6px;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.el-button[type='primary'] {
  background-color: #A8E6CF;
  border-color: #A8E6CF;
  color: #2D3748;
}

.el-button[type='primary']:hover {
  background-color: #7CC4A8;
  border-color: #7CC4A8;
}

.el-button:not([type]) {
  background-color: #E5E7EB;
  border-color: #E5E7EB;
  color: #2D3748;
}

.el-button:not([type]):hover {
  background-color: #D1D5DB;
  border-color: #D1D5DB;
}
</style>