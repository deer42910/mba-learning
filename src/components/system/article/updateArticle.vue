<template>
  <div>
    <el-dialog
      title="编辑笔记"
      width="40%"
      :destroy-on-close="true"
      :visible.sync="updateVisible"
      :before-close="handleClose"
      class="custom-dialog"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" class="form-container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">所属课程:</span>
            <div style="width: 100%">
              <el-form-item prop="taskId" style="margin-bottom: 0">
                <el-select
                  :disabled="type == 0 ? true : false"
                  clearable
                  size="small"
                  v-model="form.taskId"
                  placeholder="请选择"
                  class="custom-select"
                >
                  <el-option v-for="(item, index) in task" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">标题:</span>
            <div style="width: 100%">
              <el-form-item prop="title" style="margin-bottom: 0">
                <el-input
                  v-model="form.title"
                  size="small"
                  placeholder="请输入标题"
                  autocomplete="off"
                  class="custom-input"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 20px">
            <span class="search-title">摘要:</span>
            <div style="width: 100%">
              <el-form-item prop="articleDesc" style="margin-bottom: 0">
                <el-input
                  type="textarea"
                  v-model="form.articleDesc"
                  size="small"
                  placeholder="请输入摘要"
                  autocomplete="off"
                  class="custom-textarea"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 20px">
            <span class="search-title">内容:</span>
            <div style="width: 100%">
              <el-form-item prop="content" style="margin-bottom: 0">
                <quill-editor ref="myQuillEditor" :options="editorOption" v-model="form.content" class="custom-quill" />
                <el-upload
                  class="Quill-uploader"
                  :show-file-list="false"
                  accept="image/*"
                  v-show="0"
                  ref="updateUpload"
                  :multiple="false"
                  :action="uploadImageUrl()"
                  :on-success="handleQillSuccess"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 20px">
            <span class="search-title">备注:</span>
            <div style="width: 100%">
              <el-form-item prop="remark" style="margin-bottom: 0">
                <el-input
                  type="textarea"
                  v-model="form.remark"
                  size="small"
                  placeholder="请输入备注"
                  autocomplete="off"
                  class="custom-textarea"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          :style="{ background: 'linear-gradient(90deg, #4A2B90, #6B46C1)', color: '#fff', border: 'none' }"
          @click="submit"
        >
          确定
        </el-button>
        <el-button
          size="small"
          :style="{ background: 'linear-gradient(90deg, #A0AEC0, #718096)', color: '#fff', border: 'none' }"
          @click="handleClose"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../../../minix/index';
import { editApeArticle, getApeArticleById, getApeTaskList, getApeTaskByTeacherId } from '../../../api/api';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import hljs from 'highlight.js';

export default {
  mixins: [mixin],
  components: {
    quillEditor,
  },
  data() {
    return {
      editorOption: {
        placeholder: '请输入文字内容',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean'],
              ['image'],
            ],
            handlers: {
              image(value) {
                if (value) {
                  document.querySelector('.Quill-uploader .el-upload__input').click();
                } else {
                  this.quill.format('image', false);
                }
              },
            },
          },
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
      form: {
        id: '',
        taskId: '',
        title: '',
        articleDesc: '',
        content: '',
        state: '',
        remark: '',
        taskName: '',
      },
      task: [],
      rules: {
        taskId: [{ required: true, message: '请选择课程', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        articleDesc: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
        content: [{ required: true, message: '请输入笔记内容', trigger: 'blur' }],
      },
    };
  },
  props: ['updateVisible', 'updateId', 'taskId', 'type', 'flag'],
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.form.state = '2';
          editApeArticle(this.form).then((res) => {
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
    handleQillSuccess(res) {
      if (res.code == 1000) {
        this.$notify({
          title: '上传成功',
          type: 'success',
        });
        const imgUrl = this.$store.state.configure.HOST + res.message;
        const quill = this.$refs.myQuillEditor.quill;
        const position = quill.getSelection().index;
        quill.insertEmbed(position, 'image', imgUrl);
        quill.setSelection(position + 1);
      } else {
        this.$notify({
          title: '上传失败',
          type: 'error',
        });
      }
    },
    handleClose() {
      this.form = {
        id: '',
        taskId: this.taskId || '',
        title: '',
        articleDesc: '',
        content: '',
        state: '',
        remark: '',
        taskName: '',
      };
      this.$emit('updateFalse');
    },
    getApeTaskList() {
      getApeTaskList().then((res) => {
        if (res.code == 1000) {
          this.task = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    getApeTaskByTeacherId() {
      getApeTaskByTeacherId().then((res) => {
        if (res.code == 1000) {
          this.task = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
  },
  mounted() {
    if (this.flag == 2) {
      this.getApeTaskByTeacherId();
    } else {
      this.getApeTaskList();
    }
    if (this.taskId) {
      this.form.taskId = this.taskId;
    }
  },
  watch: {
    updateId(newVal) {
      if (newVal) {
        getApeArticleById({ id: newVal }).then((res) => {
          if (res.code == 1000) {
            const data = res.data;
            this.form = {
              id: data.id,
              taskId: this.taskId || data.taskId || '',
              title: data.title || '',
              articleDesc: data.articleDesc || '',
              content: data.content || '',
              state: (data.state || '') + '',
              remark: data.remark || '',
              taskName: data.taskName || '',
            };
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message,
            });
          }
        });
      }
    },
    updateVisible(newVal) {
      if (newVal && this.taskId && !this.form.taskId) {
        this.form.taskId = this.taskId;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.custom-dialog {
  font-family: 'PingFang SC', sans-serif;
  border-radius: 12px !important;

  :deep(.el-dialog) {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, #ECE9F4, #F3F0FF);
    color: #4A2B90;
    font-weight: bold;
    border-bottom: 1px solid #e9ecef;
    border-radius: 12px 12px 0 0;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.form-container {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
  }
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
}

.search-title {
  font-family: 'PingFang SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #4A2B90;
  margin-right: 10px;
  width: 84px;
  text-align: right;
  white-space: nowrap;
}

.custom-input :deep(.el-input__inner),
.custom-select :deep(.el-input__inner),
.custom-textarea :deep(.el-textarea__inner) {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-family: 'PingFang SC', sans-serif;
  font-size: 13px;
  color: #4b5563;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4A2B90;
    box-shadow: 0 0 5px rgba(74, 43, 144, 0.3);
  }
}

.custom-textarea :deep(.el-textarea__inner) {
  min-height: 60px !important;
}

.custom-quill :deep(.ql-container) {
  min-height: 200px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #4A2B90;
    box-shadow: 0 0 5px rgba(74, 43, 144, 0.3);
  }
}

.custom-quill :deep(.ql-toolbar) {
  border-radius: 6px 6px 0 0;
  border: 1px solid #d1d5db;
  border-bottom: none;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  .el-button {
    border-radius: 8px;
    font-family: 'PingFang SC', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 8px 16px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>