<template>
  <div>
    <el-dialog title="新增考试题目" width="40%" :destroy-on-close="true" :visible.sync="addVisible" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">题目:</span>
            <div style="width: 100%">
              <el-form-item prop="title" style="margin-bottom: 0">
                <el-input v-model="form.title" size="mini" placeholder="请输入题目" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">序号:</span>
            <div style="width: 100%">
              <el-form-item prop="sort" style="margin-bottom: 0">
                <el-input type="number" v-model="form.sort" size="mini" placeholder="请输入序号" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">类型:</span>
            <div style="width: 100%">
              <el-form-item prop="type" style="margin-bottom: 0">
                <el-select
                  clearable
                  style="margin-top: 10px"
                  size="mini"
                  v-model="form.type"
                  placeholder="请选择"
                  class="custom-select"
                >
                  <el-option label="单选" value="0" />
                  <el-option label="多选" value="1" />
                  <el-option label="填空" value="2" />
                  <el-option label="判断" value="3" />
                  <el-option label="问答" value="4" />
                  <el-option label="计算(需人工阅卷)" value="5" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">分数:</span>
            <div style="width: 100%">
              <el-form-item prop="score" style="margin-bottom: 0">
                <el-input type="number" v-model="form.score" size="mini" placeholder="请输入分数" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
          <el-col v-if="form.type == 4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">得分点:</span>
            <div style="width: 100%">
              <el-form-item prop="content" style="margin-bottom: 0">
                <div class="content-item" v-for="(item, index) in keyword" :key="index">
                  <div style="width: 100px; margin-right: 10px">
                    <el-input v-model="item.value" size="mini" placeholder="分数" autocomplete="off" class="custom-input" />
                  </div>
                  <el-input v-model="item.option" size="mini" placeholder="关键词" autocomplete="off" class="custom-input" />
                  <div v-if="index == (keyword.length - 1)" @click="addKeyword" class="action-icon">
                    <i class="el-icon-circle-plus-outline"></i>
                  </div>
                  <div @click="minusKeyword(index)" v-if="index != 0" class="action-icon">
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
                  size="mini"
                  placeholder="请输入答案（多选多个答案用英文逗号分隔）"
                  autocomplete="off"
                  class="custom-input"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col v-if="form.type == 0 || form.type == 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">题目内容:</span>
            <div style="width: 100%">
              <el-form-item prop="content" style="margin-bottom: 0">
                <div class="content-item" v-for="(item, index) in content" :key="index">
                  <div style="width: 100px; margin-right: 10px">
                    <el-input v-model="item.value" size="mini" placeholder="选项" autocomplete="off" class="custom-input" />
                  </div>
                  <el-input v-model="item.option" size="mini" placeholder="选项内容" autocomplete="off" class="custom-input" />
                  <div v-if="index == (content.length - 1)" @click="addContent" class="action-icon">
                    <i class="el-icon-circle-plus-outline"></i>
                  </div>
                  <div @click="minusContent(index)" v-if="index != 0" class="action-icon">
                    <i class="el-icon-remove-outline"></i>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col style="margin-top: 20px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">备注:</span>
            <div style="width: 100%">
              <el-form-item prop="remark" style="margin-bottom: 0">
                <el-input type="textarea" v-model="form.remark" size="mini" placeholder="请输入备注" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submit" class="custom-button">确 定</el-button>
        <el-button size="mini" @click="handleClose" class="custom-button reset-button">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveApeTestItem } from '../../../api/api';

export default {
  data() {
    return {
      formLabelWidth: '80px',
      content: [
        {
          value: '',
          option: '',
        },
      ],
      keyword: [
        {
          value: '',
          option: '',
        },
      ],
      form: {
        testId: '',
        title: '',
        sort: '',
        type: '0',
        score: '',
        keyword: '',
        answer: '',
        content: '',
        remark: '',
      },
      rules: {
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
    };
  },
  props: ['addVisible', 'testId'],
  methods: {
    addContent() {
      var param = {
        value: '',
        option: '',
      };
      this.content.push(param);
    },
    minusContent(index) {
      this.content.splice(index, 1);
    },
    addKeyword() {
      var param = {
        value: '',
        option: '',
      };
      this.keyword.push(param);
    },
    minusKeyword(index) {
      this.keyword.splice(index, 1);
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
          if (this.form.type == 4) {
            for (let index = 0; index < this.keyword.length; index++) {
              const element = this.keyword[index];
              if (!element.value) {
                this.$message({
                  message: '请完善得分点分数',
                  type: 'warning',
                });
                return;
              }
              if (!element.option) {
                this.$message({
                  message: '请完善得分点关键词',
                  type: 'warning',
                });
                return;
              }
            }
            this.form.keyword = JSON.stringify(this.keyword);
          } else {
            this.form.keyword = '';
          }
          this.form.testId = this.testId;
          saveApeTestItem(this.form).then((res) => {
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
      this.content = [
        {
          value: '',
          option: '',
        },
      ];
      this.keyword = [
        {
          value: '',
          option: '',
        },
      ];
      this.form = {
        testId: '',
        title: '',
        sort: '',
        type: '0',
        score: '',
        keyword: '',
        answer: '',
        content: '',
        remark: '',
      };
      this.$emit('addFalse');
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog {
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #ffffff, #f9f9ff);
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    background: #f9f9ff;
  }

  :deep(.el-dialog__footer) {
    padding: 15px;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    text-align: right;
  }
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
}

.search-title {
  font-family: 'PingFang SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #4A2B90;
  width: 84px;
  text-align: right;
  white-space: nowrap;
}

.custom-input :deep(.el-input__inner),
.custom-select :deep(.el-input__inner) {
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

.custom-button {
  border-radius: 8px;
  font-family: 'PingFang SC', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.reset-button {
  background: linear-gradient(90deg, #a0aec0, #718096);
  color: #fff;
  border: none;
  margin-left: 10px;

  &:hover {
    background: linear-gradient(90deg, #718096, #4a5568);
  }
}

.dialog-footer {
  padding: 0;
}

.content-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.action-icon {
  margin-left: 10px;
  cursor: pointer;
  color: #4A2B90;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    color: #6B46C1;
    transform: scale(1.1);
  }
}
</style>