<template>
  <div class="_student">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="20" style="padding: 10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">学生姓名:</span>
            <el-input
              style="margin-top: 8px"
              size="small"
              placeholder="请输入学生姓名"
              v-model="search.userName"
              clearable
              @clear="searchPage"
              class="custom-input"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="display: flex; align-items: center">
            <el-button
              style="margin-top: 8px; margin-right: 10px"
              size="small"
              icon="el-icon-search"
              :style="{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }"
              @click="searchPage"
            >
              查询
            </el-button>
            <el-button
              style="margin-top: 8px"
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
        <el-row style="padding: 15px 10px"></el-row>
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
          style="width: 100%; height: calc(100vh - 180px);"
          :row-class-name="() => 'custom-row'"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="userName" label="学生姓名" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.userName || '暂无姓名' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="课程名称" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.taskName || '暂无课程' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="章节名称" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ chapter.name || '暂无章节' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="视频" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.video || '0' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="作业" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.homework || '0' }}</span>
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
import { getApeTaskStudentPage, getApeChapterById, getHomeworkStudentFlag, getTaskStudentPage } from '../../../api/api';

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: '',
      addVisible: false,
      updateVisible: false,
      chapterId: '',
      chapter: {},
      search: {
        chapterId: '',
        taskId: '',
        userName: '',
        state: '',
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
      getTaskStudentPage(this.search).then((res) => {
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
      this.search.userName = '';
      this.search.state = '';
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
  },
  mounted() {
    this.chapterId = this.$route.query.id;
    this.search.chapterId = this.$route.query.id;
    getApeChapterById({ id: this.chapterId }).then((res) => {
      if (res.code == 1000) {
        this.chapter = res.data;
        this.search.taskId = res.data.taskId;
        this.query();
      }
    });
  },
};
</script>

<style scoped lang="scss">
._student {
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
}

.search:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
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
}

.table:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
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
  margin-top: 8px;
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
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #e9ecef !important;
  border-radius: 12px 12px 0 0;
}

.el-dialog {
  border-radius: 12px !important;
  font-family: 'PingFang SC', sans-serif;
}

.text-ellipsis {
  display: block;
  white-space: normal;
  word-break: break-all;
  line-height: 1.5;
  color: #555;
}
</style>