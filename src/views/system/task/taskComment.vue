<template>
  <div class="_comment">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="10" style="padding: 10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">内容:</span>
            <el-input
              style="margin-top: 10px"
              size="mini"
              placeholder="请输入内容"
              v-model="search.content"
              class="custom-input"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">创建者:</span>
            <el-input
              style="margin-top: 10px"
              size="mini"
              placeholder="请输入评论人"
              v-model="search.createBy"
              class="custom-input"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button
              style="margin-top: 10px"
              size="mini"
              icon="el-icon-search"
              class="search-button"
              @click="searchPage"
            >
              查询
            </el-button>
            <el-button
              style="margin-top: 10px"
              size="mini"
              icon="el-icon-refresh"
              class="reset-button"
              @click="refresh"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-row style="padding: 10px 0; margin-left: 10px">
          <el-button
            :disabled="update.length <= 0"
            size="mini"
            icon="el-icon-delete"
            class="delete-button"
            @click="deleteDataBtn"
          >
            删除
          </el-button>
        </el-row>
        <el-table
          v-loading="loading"
          :data="tableData"
          :header-cell-style="{
            background: 'linear-gradient(90deg, #ECE9F4, #F3F0FF)',
            color: '#4A2B90',
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '12px 0',
          }"
          :row-style="{
            color: '#4B5563',
            fontSize: '14px',
            fontFamily: 'Noto Sans SC, sans-serif',
            whiteSpace: 'nowrap',
          }"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%; height: calc(100vh - 200px);"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
          <el-table-column prop="createBy" label="评论人" min-width="120" show-overflow-tooltip />
          <el-table-column prop="createTime" label="评论时间" min-width="150" show-overflow-tooltip />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-popconfirm
                style="margin-left: 5px"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确认删除选中的数据？"
                @confirm="deleteDate(scope.row.id)"
              >
                <el-button size="mini" slot="reference" class="delete-button">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="search.pageSize"
          :current-page="search.pageNumber"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          class="custom-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getApeTaskCommentPage, removeApeTaskComment } from '../../../api/api';

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: '',
      addVisible: false,
      updateVisible: false,
      search: {
        taskId: '',
        content: '',
        createBy: '',
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
    };
  },
  components: {},
  methods: {
    searchPage() {
      this.search.pageNumber = 1;
      this.query();
    },
    query() {
      getApeTaskCommentPage(this.search).then((res) => {
        if (res.code == 1000) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    refresh() {
      this.search.taskId = '';
      this.search.content = '';
      this.search.createBy = '';
      this.query();
    },
    handleCurrentChange(val) {
      this.search.pageNumber = val;
      this.query();
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.query();
    },
    handleSelectionChange(val) {
      this.update = [];
      this.remove = [];
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        this.update.push(item.id);
        this.remove.push(item.id);
      }
    },
    add() {
      this.addVisible = true;
    },
    addFalse() {
      this.addVisible = false;
      this.query();
    },
    updateFalse() {
      this.updateId = '';
      this.updateVisible = false;
      this.query();
    },
    updateData(id) {
      this.updateId = id;
      this.updateVisible = true;
    },
    updateDataBtn() {
      this.updateData(this.update[0]);
    },
    deleteDataBtn() {
      this.$confirm('确定删除选中的' + this.remove.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteDate(this.remove.join(','));
        })
        .catch(() => {});
    },
    deleteDate(ids) {
      removeApeTaskComment({ ids: ids }).then((res) => {
        if (res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.pageNumber = 1;
          this.query();
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
    const id = this.$route.query.id;
    if (id) {
      this.search.taskId = id;
    }
    this.query();
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap');

._comment {
  padding: 10px;
  background-color: #f7fafc;
  height: calc(100vh - 60px);
  font-family: 'Noto Sans SC', sans-serif;
}

.search-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 10px;
  margin-bottom: 10px;
}

.table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.search-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
  margin-right: 10px;
  margin-top: 10px;
  width: 63px;
  text-align: right;
  white-space: nowrap;
}

.el-input {
  width: 100%;
  max-width: 200px;
}

.custom-input :deep(.el-input__inner) {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  color: #4b5563;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
}

.el-button {
  border-radius: 8px;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-button {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #2563eb, #3b82f6);
  }
}

.reset-button {
  background: linear-gradient(90deg, #a0aec0, #718096);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #718096, #a0aec0);
  }
}

.delete-button {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #dc2626, #ef4444);
  }
}

.el-table {
  font-family: 'Noto Sans SC', sans-serif;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;

  :deep(.el-table__header-wrapper) {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }

  :deep(.el-table__row) {
    height: 48px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f9f9ff;
    }
  }

  :deep(.el-table__body-wrapper) {
    border-radius: 0 0 6px 6px;
    height: calc(100% - 48px);
    overflow-y: auto;
  }
}

.custom-pagination {
  margin-top: 10px;
  text-align: right;
  font-family: 'Noto Sans SC', sans-serif;
}

.custom-pagination :deep(.el-pager li) {
  border-radius: 4px;
  font-size: 13px;
  color: #4A2B90;
  transition: all 0.3s ease;

  &.active {
    background-color: #a8e6cf;
    color: #4A2B90;
  }

  &:hover {
    background-color: #e5e7eb;
    color: #4A2B90;
  }
}

.custom-pagination :deep(.btn-prev),
.custom-pagination :deep(.btn-next) {
  border-radius: 4px;
  color: #4A2B90;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e5e7eb;
  }
}

.el-dialog__header {
  border-bottom: 1px solid #f4f8f9 !important;
}

.el-dialog {
  border-radius: 10px !important;
  font-family: 'Noto Sans SC', sans-serif;
}
</style>