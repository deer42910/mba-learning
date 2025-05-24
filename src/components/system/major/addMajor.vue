<template>
  <div>
    <el-dialog
      title="新增专业表"
      width="40%"
      :destroy-on-close="true"
      :visible.sync="addVisible"
      :before-close="handleClose"
      custom-class="custom-dialog"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="名称:" prop="name">
              <el-input
                v-model="form.name"
                size="small"
                placeholder="请输入专业名称"
                autocomplete="off"
                clearable
                @input="handleInput"
                :style="{ transition: 'all 0.3s ease' }"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="介绍:" prop="intro">
              <el-input
                v-model="form.intro"
                size="small"
                type="textarea"
                :rows="4"
                placeholder="请输入专业方向介绍"
                clearable
                @input="handleInput"
                :style="{ transition: 'all 0.3s ease' }"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="handleClose"
          :style="{ borderRadius: '8px', transition: 'all 0.3s ease' }"
          @mouseover="style.cancelHover = true"
          @mouseleave="style.cancelHover = false"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="submit"
          :style="{
            background: 'linear-gradient(90deg, #4A2B90, #6B46C1)',
            border: 'none',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            color: '#fff',
          }"
          @mouseover="style.submitHover = true"
          @mouseleave="style.submitHover = false"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveApeMajor } from '../../../api/api'

export default {
  data() {
    return {
      form: {
        name: '',
        intro: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入专业名称', trigger: 'blur' },
          { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' },
        ],
        intro: [
          { required: true, message: '请输入专业介绍', trigger: 'blur' },
          { min: 5, max: 500, message: '介绍长度在 5 到 500 个字符之间', trigger: 'blur' },
        ],
      },
      loading: false,
      style: {
        submitHover: false,
        cancelHover: false,
      },
    }
  },
  props: ['addVisible'],
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          saveApeMajor(this.form).then(res => {
            this.loading = false
            if (res.code === 1000) {
              this.$notify.success({
                title: '成功',
                message: '保存成功',
                duration: 2000,
              })
              this.handleClose()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message,
                duration: 3000,
              })
            }
          }).catch(() => {
            this.loading = false
            this.$notify.error({
              title: '错误',
              message: '网络错误，请稍后重试',
              duration: 3000,
            })
          })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$refs['ruleForm'].resetFields()
      this.form = { name: '', intro: '' }
      this.$emit('addFalse')
    },
    handleInput() {
      this.$refs['ruleForm'].validateField('name')
      this.$refs['ruleForm'].validateField('intro')
    },
  },
}
</script>

<style scoped>
.custom-dialog {
  border-radius: 12px !important;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.custom-dialog .el-dialog__header {
  background: linear-gradient(90deg, #ECE9F4, #F3F0FF);
  border-bottom: 1px solid #e9ecef !important;
  border-radius: 12px 12px 0 0;
  padding: 15px 20px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-weight: bold;
  color: #4A2B90;
}

.custom-dialog .el-dialog__title {
  font-size: 16px;
}

.custom-dialog .el-dialog__body {
  padding: 20px 30px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #4A2B90;
  font-weight: 500;
  text-align: right;
}

.el-input,
.el-textarea {
  transition: all 0.3s ease;
}

.el-input:hover,
.el-textarea:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 43, 144, 0.1);
}

.el-input .el-input__inner,
.el-textarea .el-textarea__inner {
  border-radius: 8px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #555;
}

.dialog-footer {
  text-align: right;
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  background: #fff;
  border-radius: 0 0 12px 12px;
}

.el-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-button[type="primary"]:hover {
  background: linear-gradient(90deg, #5C3BA6, #7D5AD8) !important;
}

.el-button:not([type="primary"]):hover {
  background: #f1f3f5;
}
</style>