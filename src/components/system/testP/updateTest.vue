<template>
  <div>
    <el-dialog title="编辑考试" width="40%" :destroy-on-close="true" :visible.sync="updateVisible" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">考试名称:</span>
            <div style="width: 100%">
              <el-form-item prop="name" style="margin-bottom: 0">
                <el-input v-model="form.name" size="mini" placeholder="请输入考试名称" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">所属课程:</span>
            <div style="width: 100%">
              <el-form-item prop="taskId" style="margin-bottom: 0">
                <el-select
                  clearable
                  style="margin-top: 10px"
                  size="mini"
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
            <span class="search-title">总分:</span>
            <div style="width: 100%">
              <el-form-item prop="totalScore" style="margin-bottom: 0">
                <el-input type="number" v-model="form.totalScore" size="mini" placeholder="请输入总分" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">考试时长:</span>
            <div style="width: 100%">
              <el-form-item prop="totalTime" style="margin-bottom: 0">
                <el-input type="number" v-model="form.totalTime" size="mini" placeholder="请输入考试时长" autocomplete="off" class="custom-input" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">开始时间:</span>
            <div style="width: 100%">
              <el-form-item prop="startTime" style="margin-bottom: 0">
                <el-date-picker
                  size="mini"
                  v-model="form.startTime"
                  type="date"
                  placeholder="开始时间"
                  class="custom-date"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">截止时间:</span>
            <div style="width: 100%">
              <el-form-item prop="endTime" style="margin-bottom: 0">
                <el-date-picker
                  size="mini"
                  v-model="form.endTime"
                  type="date"
                  placeholder="截止时间"
                  class="custom-date"
                />
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
import { editApeTest, getApeTestById, getApeTaskList, getApeTaskByTeacherId } from '../../../api/api';

export default {
  data() {
    return {
      formLabelWidth: '80px',
      form: {
        name: '',
        taskId: '',
        taskName: '',
        totalScore: '',
        totalTime: '',
        startTime: '',
        endTime: '',
        state: '',
        remark: '',
      },
      task: [],
      rules: {
        name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
        taskId: [{ required: true, message: '请选择课程', trigger: 'blur' }],
        totalScore: [{ required: true, message: '请输入总分', trigger: 'blur' }],
        totalTime: [{ required: true, message: '请输入考试时长', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入截止时间', trigger: 'blur' }],
      },
    };
  },
  props: ['updateVisible', 'updateId', 'flag'],
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          editApeTest(this.form).then((res) => {
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
  },
  watch: {
    updateId(newVal) {
      if (newVal) {
        getApeTestById({ id: newVal }).then((res) => {
          if (res.code == 1000) {
            this.form = res.data;
            this.form.state = res.data.state + '';
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message,
            });
          }
        });
      }
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
.custom-select :deep(.el-input__inner),
.custom-date :deep(.el-input__inner) {
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
</style>