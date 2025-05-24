<template>
  <div class="category-management">
    <!-- 左侧父级分类列表 -->
    <div class="left-panel">
      <div class="parent-list">
        <h3>父级分类</h3>
        <el-table
          :data="parentCategories"
          style="width: 100%; border-radius: 8px; overflow: hidden"
          @row-click="handleParentClick"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="name" label="分类名称" min-width="120" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click.stop="openEditParentDialog(scope.row)"
                :style="{ background: 'linear-gradient(90deg, #FDBA74, #FF8C42)', color: '#fff', border: 'none', marginRight: '5px' }"
              >
                修改
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click.stop="deleteParent(scope.row.id)"
                :style="{ background: 'linear-gradient(90deg, #EF4444, #DC2626)', color: '#fff', border: 'none' }"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openAddParentDialog"
        :style="{ background: 'linear-gradient(90deg, #FF6F61, #FF9F1C)', color: '#fff', border: 'none', marginTop: '10px' }"
      >
        添加父级分类
      </el-button>
      <el-dialog
        title="添加父级分类"
        :visible.sync="addParentDialogVisible"
        width="30%"
        :before-close="closeAddParentDialog"
        custom-class="custom-dialog"
      >
        <el-form :model="parentForm" :rules="parentRules" ref="parentForm" label-position="right" label-width="80px">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="parentForm.name" size="small" placeholder="请输入分类名称" clearable />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input v-model="parentForm.description" size="small" type="textarea" :rows="3" placeholder="请输入描述" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeAddParentDialog">取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitParentForm"
            :loading="parentLoading"
            :style="{ background: 'linear-gradient(90deg, #FF6F61, #FF9F1C)', color: '#fff', border: 'none' }"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="修改父级分类"
        :visible.sync="editParentDialogVisible"
        width="30%"
        :before-close="closeEditParentDialog"
        custom-class="custom-dialog"
      >
        <el-form :model="editParentForm" :rules="parentRules" ref="editParentForm" label-position="right" label-width="80px">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="editParentForm.name" size="small" placeholder="请输入分类名称" clearable />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input v-model="editParentForm.description" size="small" type="textarea" :rows="3" placeholder="请输入描述" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeEditParentDialog">取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitEditParentForm"
            :loading="parentLoading"
            :style="{ background: 'linear-gradient(90deg, #FDBA74, #FF8C42)', color: '#fff', border: 'none' }"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 右侧子分类列表 -->
    <div class="right-panel">
      <div class="header">
        <h3 v-if="selectedParentId">子分类列表 (父分类: {{ selectedParentName }})</h3>
        <h3 v-else>请选择左侧父级分类</h3>
        <el-button
          v-if="selectedParentId"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openAddChildDialog"
          :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
        >
          添加子分类
        </el-button>
      </div>
      <el-table
        v-if="selectedParentId"
        v-loading="loading"
        :data="childrenData"
        :header-cell-style="{ background: 'linear-gradient(90deg, #ECE9F4, #F3F0FF)', color: '#4A2B90', fontWeight: 'bold' }"
        :row-style="{ color: '#555', fontSize: '14px', fontFamily: 'PingFang SC, sans-serif' }"
        style="width: 100%; margin-top: 10px; border-radius: 8px; overflow: hidden"
      >
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="140" />
        <el-table-column prop="updatedAt" label="更新时间" width="140" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click.stop="openEditChildDialog(scope.row)"
              :style="{ background: 'linear-gradient(90deg, #68D391, #38A169)', color: '#fff', border: 'none', marginRight: '5px' }"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click.stop="deleteChild(scope.row.id)"
              :style="{ background: 'linear-gradient(90deg, #EF4444, #DC2626)', color: '#fff', border: 'none' }"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加子分类"
        :visible.sync="addChildDialogVisible"
        width="30%"
        :before-close="closeAddChildDialog"
        custom-class="custom-dialog"
      >
        <el-form :model="childForm" :rules="childRules" ref="childForm" label-position="right" label-width="80px">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="childForm.name" size="small" placeholder="请输入分类名称" clearable />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input v-model="childForm.description" size="small" type="textarea" :rows="3" placeholder="请输入描述" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeAddChildDialog">取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitChildForm"
            :loading="childLoading"
            :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="修改子分类"
        :visible.sync="editChildDialogVisible"
        width="30%"
        :before-close="closeEditChildDialog"
        custom-class="custom-dialog"
      >
        <el-form :model="editChildForm" :rules="childRules" ref="editChildForm" label-position="right" label-width="80px">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="editChildForm.name" size="small" placeholder="请输入分类名称" clearable />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input v-model="editChildForm.description" size="small" type="textarea" :rows="3" placeholder="请输入描述" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeEditChildDialog">取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitEditChildForm"
            :loading="childLoading"
            :style="{ background: 'linear-gradient(90deg, #68D391, #38A169)', color: '#fff', border: 'none' }"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCategoryTree, getCategoryChildren, saveCategory, editCategory, removeCategory } from '../../../api/api';

export default {
  data() {
    return {
      loading: false,
      parentLoading: false,
      childLoading: false,
      addParentDialogVisible: false,
      editParentDialogVisible: false,
      addChildDialogVisible: false,
      editChildDialogVisible: false,
      selectedParentId: null,
      selectedParentName: '',
      parentCategories: [],
      childrenData: [],
      parentForm: {
        parentId: 0,
        name: '',
        description: '',
      },
      editParentForm: {
        id: null,
        parentId: 0,
        name: '',
        description: '',
      },
      childForm: {
        parentId: null,
        name: '',
        description: '',
      },
      editChildForm: {
        id: null,
        parentId: null,
        name: '',
        description: '',
      },
      parentRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        description: [{ max: 255, message: '描述长度不能超过255字符', trigger: 'blur' }],
      },
      childRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        description: [{ max: 255, message: '描述长度不能超过255字符', trigger: 'blur' }],
      },
    };
  },
  methods: {
    openAddParentDialog() {
      this.addParentDialogVisible = true;
    },
    closeAddParentDialog() {
      this.$refs['parentForm'].resetFields();
      this.addParentDialogVisible = false;
    },
    submitParentForm() {
      this.$refs['parentForm'].validate((valid) => {
        if (valid) {
          this.parentLoading = true;
          saveCategory(this.parentForm).then(res => {
            this.parentLoading = false;
            if (res.code === 1000) {
              this.$notify.success({ title: '成功', message: '添加父级分类成功' });
              this.closeAddParentDialog();
              this.fetchParentCategories();
            } else {
              this.$notify.error({ title: '错误', message: res.message });
            }
          }).catch(() => {
            this.parentLoading = false;
            this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
          });
        }
      });
    },
    openEditParentDialog(row) {
      this.editParentForm = { ...row };
      this.editParentDialogVisible = true;
    },
    closeEditParentDialog() {
      this.$refs['editParentForm'].resetFields();
      this.editParentDialogVisible = false;
    },
    submitEditParentForm() {
      this.$refs['editParentForm'].validate((valid) => {
        if (valid) {
          this.parentLoading = true;
          editCategory(this.editParentForm).then(res => {
            this.parentLoading = false;
            if (res.code === 1000) {
              this.$notify.success({ title: '成功', message: '修改父级分类成功' });
              this.closeEditParentDialog();
              this.fetchParentCategories();
              if (this.selectedParentId === this.editParentForm.id) {
                this.selectedParentName = this.editParentForm.name;
                this.fetchChildren();
              }
            } else {
              this.$notify.error({ title: '错误', message: res.message });
            }
          }).catch(() => {
            this.parentLoading = false;
            this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
          });
        }
      });
    },
    deleteParent(id) {
      this.$confirm('确定删除该父分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        getCategoryChildren({ parentId: id }).then(res => {
          if (res.code === 1000 && res.data.length > 0) {
            this.$notify.error({ title: '错误', message: '该父分类包含子分类，无法删除' });
            return;
          }
          removeCategory({ id }).then(res => {
            if (res.code === 1000) {
              this.$message.success('删除成功');
              this.fetchParentCategories();
              if (this.selectedParentId === id) {
                this.selectedParentId = null;
                this.selectedParentName = '';
                this.childrenData = [];
              }
            } else {
              this.$notify.error({ title: '错误', message: res.message });
            }
          }).catch(() => {
            this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
          });
        }).catch(() => {
          this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
        });
      });
    },
    openAddChildDialog() {
      if (!this.selectedParentId) {
        this.$notify.warning({ title: '提示', message: '请选择父级分类' });
        return;
      }
      this.childForm.parentId = this.selectedParentId;
      this.addChildDialogVisible = true;
    },
    closeAddChildDialog() {
      this.$refs['childForm'].resetFields();
      this.addChildDialogVisible = false;
    },
    submitChildForm() {
      this.$refs['childForm'].validate((valid) => {
        if (valid) {
          this.childLoading = true;
          saveCategory(this.childForm).then(res => {
            this.childLoading = false;
            if (res.code === 1000) {
              this.$notify.success({ title: '成功', message: '添加子分类成功' });
              this.closeAddChildDialog();
              this.fetchChildren();
            } else {
              this.$notify.error({ title: '错误', message: res.message });
            }
          }).catch(() => {
            this.childLoading = false;
            this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
          });
        }
      });
    },
    openEditChildDialog(row) {
      this.editChildForm = { ...row };
      this.editChildDialogVisible = true;
    },
    closeEditChildDialog() {
      this.$refs['editChildForm'].resetFields();
      this.editChildDialogVisible = false;
    },
    submitEditChildForm() {
      this.$refs['editChildForm'].validate((valid) => {
        if (valid) {
          this.childLoading = true;
          editCategory(this.editChildForm).then(res => {
            this.childLoading = false;
            if (res.code === 1000) {
              this.$notify.success({ title: '成功', message: '修改子分类成功' });
              this.closeEditChildDialog();
              this.fetchChildren();
            } else {
              this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
            }
          }).catch(() => {
            this.childLoading = false;
            this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
          });
        }
      });
    },
    fetchParentCategories() {
      this.loading = true;
      getCategoryTree({ parentId: 0 }).then(res => {
        this.loading = false;
        if (res.code === 1000) {
          this.parentCategories = res.data;
        } else {
          this.$notify.error({ title: '错误', message: res.message });
        }
      }).catch(() => {
        this.loading = false;
        this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
      });
    },
    handleParentClick(row) {
      this.selectedParentId = row.id;
      this.selectedParentName = row.name;
      this.fetchChildren();
    },
    fetchChildren() {
      if (!this.selectedParentId) return;
      this.loading = true;
      getCategoryChildren({ parentId: this.selectedParentId }).then(res => {
        this.loading = false;
        if (res.code === 1000) {
          this.childrenData = res.data;
        } else {
          this.$notify.error({ title: '错误', message: res.message });
        }
      }).catch(() => {
        this.loading = false;
        this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
      });
    },
    deleteChild(id) {
      this.$confirm('确定删除该子分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        removeCategory({ id }).then(res => {
          if (res.code === 1000) {
            this.$message.success('删除成功');
            this.fetchChildren();
          } else {
            this.$notify.error({ title: '错误', message: res.message });
          }
        }).catch(() => {
          this.$notify.error({ title: '错误', message: '网络错误，请稍后重试' });
        });
      });
    },
    tableRowClassName({ row }) {
      if (row.id === this.selectedParentId) {
        return 'selected-row';
      }
      return '';
    },
  },
  mounted() {
    this.fetchParentCategories();
  },
}
</script>

<style scoped>
.category-management {
  display: flex;
  height: calc(100vh - 60px);
  background: #f9f9ff;
  padding: 10px;
}

.left-panel {
  width: 30%;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}

.right-panel {
  flex: 1;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.parent-list h3 {
  font-size: 16px;
  color: #4A2B90;
  margin-bottom: 8px;
}

.right-panel .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.right-panel h3 {
  font-size: 16px;
  color: #4A2B90;
}

.el-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-dialog {
  border-radius: 12px !important;
  overflow: hidden;
}

.custom-dialog .el-dialog__header {
  background: #F3F0FF;
  border-bottom: 1px solid #e9ecef;
  border-radius: 12px 12px 0 0;
  padding: 10px;
}

.custom-dialog .el-dialog__body {
  padding: 15px;
}

.dialog-footer {
  text-align: right;
  padding: 8px 15px;
  border-top: 1px solid #e9ecef;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table th,
.el-table td {
  padding: 8px 4px;
  font-size: 13px;
}

.el-table .selected-row {
  background-color: #f0f4ff !important;
  font-weight: bold;
}

.el-table .custom-row:hover {
  background-color: #f9f9ff;
}
</style>