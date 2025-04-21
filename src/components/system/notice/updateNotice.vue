<template>
  <div>
    <el-dialog
      title="编辑通知公告"
      width="40%"
      :destroy-on-close="true"
      :visible.sync="updateNoticeVisible"
      :before-close="handleClose"
      class="custom-dialog"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left" label-width="80px">
        <el-row :gutter="20">
          <!-- 标题 -->
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" size="small" placeholder="请输入标题" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>

          <!-- 公告类型 -->
          <el-col :span="12">
            <el-form-item label="公告类型" prop="type">
              <el-select v-model="form.type" size="small" placeholder="请选择" style="width: 100%;">
                <el-option label="公告" value="0"></el-option>
                <el-option label="通知" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 状态 -->
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 轮播图 -->
          <el-col :span="24">
            <el-form-item label="轮播图" prop="showInBanner">
              <div class="banner-switch-container">
                <el-switch v-model="form.showInBanner"></el-switch>
                <transition name="fade">
                  <div v-if="form.showInBanner" class="banner-upload-container">
                    <el-upload
                      class="banner-uploader"
                      :http-request="handleUpload"
                      :show-file-list="false"
                      :before-upload="beforeBannerUpload"
                    >
                      <div v-if="!form.avatar" class="upload-placeholder">
                        <i class="el-icon-picture-outline"></i>
                        <span>点击上传轮播图</span>
                      </div>
                      <div v-else class="image-preview-container">
                        <img :src="form.avatar" class="banner-image" />
                        <div class="image-actions">
                          <i class="el-icon-zoom-in" @click.stop="previewImage"></i>
                          <i class="el-icon-delete" @click.stop="removeImage"></i>
                        </div>
                      </div>
                    </el-upload>
                    <div class="upload-tips">建议尺寸: 1200×400px，JPG/PNG格式</div>
                  </div>
                </transition>
              </div>
            </el-form-item>
          </el-col>

          <!-- 内容 -->
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <quill-editor
                ref="myQuillEditor"
                :options="editorOption"
                v-model="form.content"
                class="custom-quill-editor"
              />
              <el-upload
                class="Quill-uploader"
                :show-file-list="false"
                accept="image/*"
                v-show="0"
                ref="updateUpload"
                :multiple="false"
                :http-request="handleQuillUpload"
              >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
        <el-button size="small" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../../../minix/index';
import { editAccount, getAccountById } from '../../../api/api';
import { uploadFile } from '@/utils/upload'; // 引入封装的上传方法

export default {
  mixins: [mixin],
  data() {
    return {
      editorOption: {
        placeholder: "请输入文字内容",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["image"],
            ],
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('.Quill-uploader .el-upload__input').click();
                } else {
                  this.quill.format('image', false);
                }
              },
            },
          },
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value;
            },
          },
        },
      },
      form: {
        id: "",
        title: "",
        type: "0",
        state: "0",
        content: "",
        showInBanner: false,
        avatar: "",
        flag: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
      },
    };
  },
  props: ['updateNoticeVisible', 'updateId'],
  watch: {
    updateId(newVal) {
      if (newVal) {
        getAccountById({ id: newVal }).then(res => {
          if (res.code === 1000) {
            this.form = {
              id: res.data.id,
              title: res.data.title,
              type: String(res.data.type),
              state: String(res.data.state),
              content: res.data.content,
              showInBanner: res.data.flag === 1,
              avatar: res.data.avatar || "",
              flag: res.data.flag
            };
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        }).catch(error => {
          this.$notify.error({
            title: '错误',
            message: '获取公告详情失败：' + error.message
          });
        });
      }
    },
    'form.showInBanner'(newVal) {
      this.form.flag = newVal ? 1 : 0;
      if (!newVal) {
        this.form.avatar = ''; // 关闭轮播图时清空 avatar
      }
    }
  },
  methods: {
    async handleUpload(options) {
      try {
        const url = await uploadFile(options.file);
        this.form.avatar = url;
        this.$notify.success({
          title: '上传成功',
          message: '轮播图上传成功',
        });
      } catch (error) {
        this.$notify.error({
          title: '上传失败',
          message: error.message,
        });
      }
    },
    async handleQuillUpload(options) {
      try {
        const url = await uploadFile(options.file);
        const quill = this.$refs.myQuillEditor.quill;
        const position = quill.getSelection().index;
        quill.insertEmbed(position, 'image', url);
        quill.setSelection(position + 1);
        this.$notify.success({
          title: '上传成功',
          message: '图片上传成功',
        });
      } catch (error) {
        this.$notify.error({
          title: '上传失败',
          message: error.message,
        });
      }
    },
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.form.showInBanner && !this.form.avatar) {
            this.$notify.error({
              title: '错误',
              message: '请上传轮播图！',
            });
            return;
          }
          editAccount(this.form).then(res => {
            if (res.code === 1000) {
              this.$notify.success({
                title: '成功',
                message: "保存成功",
              });
              this.handleClose();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message,
              });
            }
          }).catch(error => {
            this.$notify.error({
              title: '错误',
              message: '保存失败：' + error.message,
            });
          });
        }
      });
    },
    handleClose() {
      this.form = {
        id: "",
        title: "",
        type: "0",
        state: "0",
        content: "",
        showInBanner: false,
        avatar: "",
        flag: 0
      };
      this.$emit("updateNoticeFalse");
    },
    beforeBannerUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('上传轮播图只能是图片格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传轮播图大小不能超过 2MB!');
      }
      return isImage && isLt2M;
    },
    previewImage() {
      this.$imagePreview({
        url: this.form.avatar,
        zIndex: 3000
      });
    },
    removeImage() {
      this.$confirm('确定要删除这张轮播图吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.avatar = '';
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {});
    }
  },
};
</script>

<style scoped>
.custom-dialog ::v-deep .el-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-dialog ::v-deep .el-dialog__header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8ecef;
  padding: 15px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.custom-dialog ::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.custom-dialog ::v-deep .el-dialog__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-family: '黑体';
  font-size: 14px;
  color: #606266;
}

.el-radio-group {
  display: flex;
  align-items: center;
  height: 32px;
}

.banner-uploader .el-upload {
  border: 1px dashed #d9d9d9;
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
  border-color: #409EFF;
}

.banner-switch-container {
  display: flex;
  align-items: flex-start;
}

.banner-upload-container {
  margin-left: 20px;
  flex: 1;
}

.upload-placeholder {
  width: 240px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border: 1px dashed #c0c4cc;
  border-radius: 6px;
  transition: all 0.3s;
}

.upload-placeholder:hover {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.upload-placeholder i {
  font-size: 32px;
  color: #909399;
  margin-bottom: 8px;
}

.upload-placeholder span {
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
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.custom-quill-editor ::v-deep .ql-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.custom-quill-editor ::v-deep .ql-editor {
  min-height: 150px !important;
  font-size: 14px;
  color: #606266;
}

.dialog-footer {
  text-align: right;
  padding: 10px 20px;
  border-top: 1px solid #e8ecef;
}

.dialog-footer .el-button {
  padding: 8px 16px;
}
</style>