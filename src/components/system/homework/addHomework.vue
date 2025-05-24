<template>
  <div>
    <el-dialog
      title="新增作业"
      width="40%"
      :destroy-on-close="true"
      :visible.sync="addVisible"
      :before-close="handleClose"
      class="custom-dialog"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" class="form-container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">题目:</span>
            <div style="width: 100%">
              <el-form-item prop="title" style="margin-bottom: 0">
                <el-input
                  v-model="form.title"
                  size="small"
                  placeholder="请输入题目"
                  autocomplete="off"
                  class="custom-input"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">序号:</span>
            <div style="width: 100%">
              <el-form-item prop="sort" style="margin-bottom: 0">
                <el-input-number
                  v-model="form.sort"
                  size="small"
                  :min="1"
                  label="请输入序号"
                  class="custom-input-number"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">类型:</span>
            <div style="width: 100%">
              <el-form-item prop="type" style="margin-bottom: 0">
                <el-select
                  clearable
                  size="small"
                  v-model="form.type"
                  placeholder="请选择"
                  class="custom-select"
                >
                  <el-option label="单选" value="0" />
                  <el-option label="多选" value="1" />
                  <el-option label="填空" value="2" />
                  <el-option label="判断" value="3" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col v-if="form.type == 0 || form.type == 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">题目内容:</span>
            <div style="width: 100%">
              <el-form-item prop="content" style="margin-bottom: 0">
                <div class="content-item" v-for="(item, index) in content" :key="index">
                  <div style="width: 100px; margin-right: 10px">
                    <el-input
                      v-model="item.value"
                      size="small"
                      placeholder="选项"
                      autocomplete="off"
                      class="custom-input"
                    />
                  </div>
                  <el-input
                    v-model="item.option"
                    size="small"
                    placeholder="选项内容"
                    autocomplete="off"
                    class="custom-input"
                  />
                  <div
                    v-if="index == content.length - 1"
                    @click="addContent"
                    class="icon-button"
                    style="margin-left: 10px"
                  >
                    <i class="el-icon-circle-plus-outline"></i>
                  </div>
                  <div
                    v-if="index != 0"
                    @click="minusContent(index)"
                    class="icon-button"
                    style="margin-left: 10px"
                  >
                    <i class="el-icon-remove-outline"></i>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">答案:</span>
            <div style="width: 100%">
              <el-form-item prop="answer" style="margin-bottom: 0">
                <el-input
                  type="textarea"
                  v-model="form.answer"
                  size="small"
                  placeholder="请输入答案（多选多个答案用英文逗号分隔）"
                  autocomplete="off"
                  class="custom-textarea"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">分数:</span>
            <div style="width: 100%">
              <el-form-item prop="score" style="margin-bottom: 0">
                <el-input-number
                  v-model="form.score"
                  size="small"
                  :min="1"
                  label="请输入分数"
                  class="custom-input-number"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
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
import { saveApeHomework } from '../../../api/api';

export default {
  data() {
    return {
      formLabelWidth: '80px',
      form: {
        chapterId: '',
        chapterName: '',
        title: '',
        sort: '',
        answer: '',
        type: '0',
        content: '',
        score: '',
        remark: '',
      },
      content: [
        {
          value: '',
          option: '',
        },
      ],
      rules: {
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
    };
  },
  props: ['addVisible', 'chapterId'],
  methods: {
    addContent() {
      const param = {
        value: '',
        option: '',
      };
      this.content.push(param);
    },
    minusContent(index) {
      this.content.splice(index, 1);
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.form.type == 0 || this.form.type == 1) {
            for (let index = 0; index < this.content.length; index++) {
              const element = this.content[index];
              if (!element.value) {
                this.$message({
                  message: '请完善选项',
                  type: 'warning',
                });
                return;
              }
              if (!element.option) {
                this.$message({
                  message: '请完善选项内容',
                  type: 'warning',
                });
                return;
              }
            }
            this.form.content = JSON.stringify(this.content);
          } else {
            this.form.content = '';
          }
          saveApeHomework(this.form).then((res) => {
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
        chapterId: this.form.chapterId,
        chapterName: '',
        title: '',
        sort: '',
        answer: '',
        type: '0',
        score: '',
        content: '',
        remark: '',
      };
      this.content = [
        {
          value: '',
          option: '',
        },
      ];
      this.$emit('addFalse');
    },
  },
  mounted() {
    this.form.chapterId = this.chapterId;
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

.custom-input,
.custom-select,
.custom-textarea,
.custom-input-number {
  width: 100%;
}

.custom-input :deep(.el-input__inner),
.custom-select :deep(.el-input__inner),
.custom-textarea :deep(.el-textarea__inner),
.custom-input-number :deep(.el-input__inner) {
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

.content-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icon-button {
  cursor: pointer;
  color: #4A2B90;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    color: #6B46C1;
    transform: scale(1.2);
  }
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