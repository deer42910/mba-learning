<template>
  <el-dialog
    title="编辑分类"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    class="custom-dialog"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="categoryForm"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="form.name"
          size="small"
          placeholder="请输入分类名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="父分类">
        <el-cascader
          v-model="form.parentId"
          :options="categoryTree"
          :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: true }"
          placeholder="请选择父分类"
          clearable
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入描述"
          :rows="3"
          clearable
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        size="small"
        @click="handleClose"
        :style="{ borderRadius: '8px', transition: 'all 0.3s ease' }"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="submitForm"
        :style="{ background: 'linear-gradient(90deg, #4A2B90, #6B46C1)', color: '#fff', border: 'none', borderRadius: '8px', transition: 'all 0.3s ease' }"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCategoryById, editCategory } from '../../../api/api';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: [String, Number],
      default: null,
    },
    categoryTree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      form: {
        id: null,
        name: '',
        parentId: 0,
        description: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' },
        ],
      },
    };
  },
  watch: {
    categoryId(newVal) {
      if (newVal && this.visible) {
        this.fetchCategory();
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.form = { id: null, name: '', parentId: 0, description: '' };
      }
    },
  },
  methods: {
    fetchCategory() {
      this.loading = true;
      getCategoryById({ id: this.categoryId }).then((res) => {
        this.loading = false;
        if (res.code === 1000) {
          this.form = {
            id: res.data.id,
            name: res.data.name,
            parentId: res.data.parentId || 0,
            description: res.data.description || '',
          };
        } else {
          this.$notify.error({ title: '错误', message: res.message, duration: 3000 });
        }
      }).catch(() => {
        this.loading = false;
        this.$notify.error({ title: '错误', message: '网络错误，请稍后重试', duration: 3000 });
      });
    },
    handleClose() {
      this.$refs.categoryForm.resetFields();
      this.form = { id: null, name: '', parentId: 0, description: '' };
      this.$emit('close');
    },
    submitForm() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          editCategory(this.form).then((res) => {
            this.loading = false;
            if (res.code === 1000) {
              this.$message.success('分类更新成功');
              this.handleClose();
              this.$emit('category-updated');
            } else {
              this.$notify.error({ title: '错误', message: res.message, duration: 3000 });
            }
          }).catch(() => {
            this.loading = false;
            this.$notify.error({ title: '错误', message: '网络错误，请稍后重试', duration: 3000 });
          });
        }
      });
    },
  },
};
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
  border-bottom: 1px solid #e9ecef;
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
.el-cascader {
  transition: all 0.3s ease;
}

.el-input:hover,
.el-cascader:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 43, 144, 0.1);
}

.el-input .el-input__inner,
.el-cascader .el-input__inner {
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

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-button[type="primary"]:hover {
  background: linear-gradient(90deg, #5C3BA6, #7D5AD8) !important;
}
</style>