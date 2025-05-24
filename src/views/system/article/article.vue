<template>
  <div class="_article">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="20" style="padding: 10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">课程名称:</span>
            <el-input
              :disabled="type == 0 ? true : false"
              size="small"
              placeholder="请输入课程名称"
              v-model="search.taskName"
              class="custom-input"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">标题:</span>
            <el-input
              size="small"
              placeholder="请输入标题"
              v-model="search.title"
              class="custom-input"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">状态:</span>
            <el-select
              clearable
              size="small"
              v-model="search.state"
              placeholder="请选择"
              class="custom-select"
            >
              <el-option label="审核通过" value="0" />
              <el-option label="未通过" value="1" />
              <el-option label="待审核" value="2" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="display: flex; align-items: center">
            <el-button
              size="small"
              icon="el-icon-search"
              :style="{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }"
              @click="searchPage"
            >
              查询
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh"
              :style="{ background: 'linear-gradient(90deg, #a0aec0, #718096)', color: '#fff', border: 'none' }"
              @click="refresh"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-row style="padding: 15px 10px">
          <el-button
            size="small"
            icon="el-icon-plus"
            plain
            @click="add"
            :style="{ background: 'linear-gradient(90deg, #4A2B90, #6B46C1)', color: '#fff', border: 'none' }"
          >
            新增
          </el-button>
          <el-button
            size="small"
            :disabled="update.length !== 1"
            icon="el-icon-edit"
            plain
            @click="updateDataBtn"
            :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
          >
            修改
          </el-button>
          <el-button
            size="small"
            :disabled="update.length <= 0"
            icon="el-icon-delete"
            plain
            @click="deleteDataBtn"
            :style="{ background: 'linear-gradient(90deg, #EF4444, #DC2626)', color: '#fff', border: 'none' }"
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
            fontFamily: 'PingFang SC, sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '12px 0',
          }"
          :row-style="{
            color: '#555',
            fontSize: '14px',
            fontFamily: 'PingFang SC, sans-serif',
            whiteSpace: 'normal',
            transition: 'all 0.3s',
          }"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%; height: calc(100vh - 200px);"
          :row-class-name="() => 'custom-row'"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="taskName" label="课程名称" min-width="100" show-overflow-tooltip />
          <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
          <el-table-column prop="state" label="状态" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0" type="success">通过</el-tag>
              <el-tag v-if="scope.row.state == 1" type="danger">未通过</el-tag>
              <el-tag v-if="scope.row.state == 2" type="warning">待审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建者" min-width="100" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" min-width="150" show-overflow-tooltip />
          <el-table-column label="操作" min-width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                v-if="scope.row.state == 0"
                type="danger"
                @click="offShelf(scope.row.id)"
                :style="{ background: 'linear-gradient(90deg, #F59E0B, #D97706)', color: '#fff', border: 'none' }"
              >
                审核未通过
              </el-button>
              <el-button
                size="small"
                v-if="scope.row.state == 2 || scope.row.state == 1"
                type="success"
                @click="listing(scope.row.id)"
                :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
              >
                审核通过
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="toArticleComment(scope.row.id)"
                :style="{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }"
              >
                评论
              </el-button>
              <el-button
                size="small"
                type="success"
                @click="updateData(scope.row.id)"
                :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
              >
                修改
              </el-button>
              <el-popconfirm
                style="margin-left: 5px"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-question"
                icon-color="#DC2626"
                title="确认删除选中的数据？"
                @confirm="deleteDate(scope.row.id)"
              >
                <el-button
                  slot="reference"
                  size="small"
                  type="danger"
                  :style="{ background: 'linear-gradient(90deg, #EF4444, #DC2626)', color: '#fff', border: 'none' }"
                >
                  删除
                </el-button>
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
    <add @addFalse="addFalse" flag="1" :taskId="taskId" :type="type" :addVisible="addVisible" />
    <update @updateFalse="updateFalse" flag="1" :taskId="taskId" :type="type" :updateId="updateId" :updateVisible="updateVisible" />
  </div>
</template>

<script>
import { getApeArticlePage, removeApeArticle, editApeArticle } from '../../../api/api';
import add from '../../../components/system/article/addArticle';
import update from '../../../components/system/article/updateArticle';

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: '',
      addVisible: false,
      updateVisible: false,
      taskId: '',
      type: 1,
      search: {
        title: '',
        state: '',
        taskName: '',
        pageNumber: 1,
        pageSize: 10,
        type: 0,
      },
      total: 0,
      tableData: [],
    };
  },
  components: {
    add,
    update,
  },
  methods: {
    toArticleComment(id) {
      const param = {
        name: '章节作业',
        url: '/articleComment?id=' + id,
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/articleComment?id=' + id);
      this.$store.commit('menu/setActiveMenu', '/articleComment?id=' + id);
    },
    listing(id) {
      const param = {
        id: id,
        state: 0,
      };
      editApeArticle(param).then((res) => {
        if (res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: '审核成功',
          });
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    offShelf(id) {
      const param = {
        id: id,
        state: 1,
      };
      editApeArticle(param).then((res) => {
        if (res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: '审核成功',
          });
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    searchPage() {
      this.search.pageNumber = 1;
      this.query();
    },
    query() {
      getApeArticlePage(this.search).then((res) => {
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
      this.search.title = '';
      this.search.state = '';
      this.search.taskName = '';
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
      }).then(() => {
        this.deleteDate(this.remove.join(','));
      }).catch(() => {});
    },
    deleteDate(ids) {
      removeApeArticle({ ids: ids }).then((res) => {
        if (res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.search.pageNumber = 1;
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
    const name = this.$route.query.name;
    const id = this.$route.query.id;
    const type = this.$route.query.type;
    if (name) {
      this.search.taskName = name;
    }
    if (id) {
      this.taskId = id;
    }
    if (type) {
      this.type = type;
    }
    this.query();
  },
};
</script>

<style scoped lang="scss">
._article {
  padding: 10px;
  background-color: #f7fafc;
  height: calc(100vh - 60px);
  font-family: 'PingFang SC', sans-serif;
}

.search-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
  }
}

.table {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
  }
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.search-title {
  font-family: 'PingFang SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #4A2B90;
  margin-right: 10px;
  width: 63px;
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

.el-button {
  border-radius: 8px;
  font-family: 'PingFang SC', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.el-table {
  font-family: 'PingFang SC', sans-serif;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;

  :deep(.el-table__header-wrapper) {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }

  :deep(.el-table__body-wrapper) {
    border-radius: 0 0 6px 6px;
    height: calc(100% - 48px);
    overflow-y: auto;
  }
}

.el-table .custom-row:hover {
  background-color: #f9f9ff !important;
  transform: scale(1.01);
}

.custom-pagination {
  margin-top: 10px;
  text-align: right;
  font-family: 'PingFang SC', sans-serif;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  :deep(.el-pager li) {
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

  :deep(.btn-prev),
  :deep(.btn-next) {
    border-radius: 4px;
    color: #4A2B90;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e5e7eb;
    }
  }
}

.el-dialog__header {
  border-bottom: 1px solid #e9ecef !important;
  border-radius: 12px 12px 0 0;
}

.el-dialog {
  border-radius: 12px !important;
  font-family: 'PingFang SC', sans-serif;
}
</style>