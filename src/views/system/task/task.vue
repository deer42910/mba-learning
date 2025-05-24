<template>
  <div class="_task">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="10" style="padding: 10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">课程名称:</span>
            <el-input
              style="margin-top: 10px"
              size="mini"
              placeholder="请输入课程名称"
              v-model="search.name"
              class="custom-input"
            ></el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">教师名称:</span>
            <el-input
              style="margin-top: 10px"
              size="mini"
              placeholder="请输入教师名称"
              v-model="search.teacherName"
              class="custom-input"
            ></el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">状态:</span>
            <el-select
              clearable
              style="margin-top: 10px"
              size="mini"
              v-model="search.state"
              placeholder="请选择"
              class="custom-select"
            >
              <el-option label="上架" value="0"></el-option>
              <el-option label="下架" value="1"></el-option>
              <el-option label="待审核" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">所属专业:</span>
            <el-select
              clearable
              style="margin-top: 10px"
              size="mini"
              v-model="search.major"
              placeholder="请选择"
              class="custom-select"
            >
              <el-option
                v-for="(item, index) in major"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">所属分类:</span>
            <el-cascader
              clearable
              style="margin-top: 10px"
              size="mini"
              v-model="search.classification"
              :options="categoryTree"
              :props="{ checkStrictly: true, label: 'name', value: 'name' }"
              placeholder="请选择分类"
              filterable
              class="custom-cascader"
            ></el-cascader>
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
        <el-row style="padding-top: 10px; margin-left: 10px">
          <el-button
            size="mini"
            icon="el-icon-plus"
            plain
            class="add-button"
            @click="add"
          >
            新增
          </el-button>
          <el-button
            :disabled="update.length != 1"
            size="mini"
            icon="el-icon-edit"
            plain
            class="update-button"
            @click="updateDataBtn"
          >
            修改
          </el-button>
          <el-button
            :disabled="update.length <= 0"
            size="mini"
            icon="el-icon-delete"
            plain
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
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="课程名称" width="100"></el-table-column>
          <el-table-column prop="major" label="所属专业" width="100"></el-table-column>
          <el-table-column prop="classification" label="所属分类" width="80"></el-table-column>
          <el-table-column prop="teacherName" label="教师名称" width="80"></el-table-column>
          <el-table-column prop="state" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0" type="success">已上架</el-tag>
              <el-tag v-if="scope.row.state == 1" type="warning">已下架</el-tag>
              <el-tag v-if="scope.row.state == 2" type="info">待审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="学生数量" width="100"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" class="comment-button" @click="toTaskComment(scope.row.id)">评论</el-button>
              <el-button size="mini" type="success" class="student-button" @click="toTaskStudent(scope.row.id)">学生</el-button>
              <el-button size="mini" type="primary" class="study-button" @click="toTaskStudy(scope.row.id)">学习情况</el-button>
              <el-button size="mini" type="info" class="chapter-button" @click="toChapter(scope.row.id, scope.row.name)">章节</el-button>
              <el-button size="mini" type="warning" class="article-button" @click="toArticle(scope.row.id, scope.row.name)">笔记</el-button>
              <el-button
                size="mini"
                v-if="scope.row.state == 0"
                type="primary"
                class="off-shelf-button"
                @click="offShelf(scope.row.id)"
              >
                下架
              </el-button>
              <el-button
                size="mini"
                v-if="scope.row.state == 2 || scope.row.state == 1"
                type="primary"
                class="listing-button"
                @click="listing(scope.row.id)"
              >
                上架
              </el-button>
              <el-button
                size="mini"
                class="update-button"
                @click="updateData(scope.row.id)"
              >
                修改
              </el-button>
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
        ></el-pagination>
      </div>
    </div>
    <add @addFalse="addFalse" flag="1" :addVisible="addVisible"></add>
    <update
      @updateFalse="updateFalse"
      flag="1"
      :updateId="updateId"
      :updateVisible="updateVisible"
    ></update>
  </div>
</template>

<script>
import {
  getApeTaskPage,
  removeApeTask,
  getCategoryTree,
  getApeMajorList,
  editApeTask,
} from '../../../api/api';
import add from '../../../components/system/task/addTask';
import update from '../../../components/system/task/updateTask';

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
        name: '',
        taskDescribe: '',
        teacherName: '',
        state: '',
        major: '',
        classification: '',
        pageNumber: 1,
        pageSize: 10,
        type: 0,
      },
      total: 0,
      tableData: [],
      major: [],
      categoryTree: [],
    };
  },
  components: {
    add,
    update,
  },
  methods: {
    toTaskStudy(id) {
      var param = {
        name: '学习情况',
        url: '/studyInfo?id=' + id,
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/studyInfo?id=' + id);
      this.$store.commit('menu/setActiveMenu', '/studyInfo?id=' + id);
    },
    toTaskComment(id) {
      var param = {
        name: '评论列表',
        url: '/taskComment?id=' + id,
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/taskComment?id=' + id);
      this.$store.commit('menu/setActiveMenu', '/taskComment?id=' + id);
    },
    toTaskStudent(id) {
      var param = {
        name: '学生列表',
        url: '/taskStudent?id=' + id,
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/taskStudent?id=' + id);
      this.$store.commit('menu/setActiveMenu', '/taskStudent?id=' + id);
    },
    toArticle(id, name) {
      var param = {
        name: '笔记管理',
        url: '/article?id=' + id + '&name=' + name + '&type=0',
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/article?id=' + id + '&name=' + name + '&type=0');
      this.$store.commit('menu/setActiveMenu', '/article?id=' + id + '&name=' + name + '&type=0');
    },
    toChapter(id, name) {
      var param = {
        name: '章节管理',
        url: '/chapter?id=' + id + '&name=' + name + '&type=0',
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/chapter?id=' + id + '&name=' + name + '&type=0');
      this.$store.commit('menu/setActiveMenu', '/chapter?id=' + id + '&name=' + name + '&type=0');
    },
    listing(id) {
      var param = {
        id: id,
        state: 0,
      };
      editApeTask(param).then((res) => {
        if (res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: '上架成功',
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
      var param = {
        id: id,
        state: 1,
      };
      editApeTask(param).then((res) => {
        if (res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: '下架成功',
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
    getApeMajorList() {
      getApeMajorList().then((res) => {
        if (res.code == 1000) {
          this.major = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    getCategoryData() {
      this.loading = true;
      getCategoryTree().then((res) => {
        if (res.code == 1000) {
          this.categoryTree = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '网络错误，请稍后重试',
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    searchPage() {
      this.search.pageNumber = 1;
      if (Array.isArray(this.search.classification) && this.search.classification.length > 0) {
        this.search.classification = this.search.classification[this.search.classification.length - 1];
      }
      this.query();
    },
    query() {
      getApeTaskPage(this.search).then((res) => {
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
      this.search.name = '';
      this.search.taskDescribe = '';
      this.search.teacherName = '';
      this.search.state = '';
      this.search.major = '';
      this.search.classification = '';
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
        var item = val[i];
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
      removeApeTask({ ids: ids }).then((res) => {
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
    this.getApeMajorList();
    this.getCategoryData();
    this.query();
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap');

._task {
  background-color: #f7fafc;
  height: 100%;
  font-family: 'Noto Sans SC', sans-serif;
}

.search-table {
  width: 100%;
}

.search {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 10px;
  margin-bottom: 5px;
}

.table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
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

.el-input,
.el-select,
.el-cascader {
  width: 100%;
  max-width: 200px;
}

.custom-input :deep(.el-input__inner),
.custom-select :deep(.el-input__inner),
.custom-cascader :deep(.el-input__inner) {
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

.add-button {
  background: linear-gradient(90deg, #4A2B90, #6B46C1);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #6B46C1, #4A2B90);
  }
}

.update-button {
  background: linear-gradient(90deg, #34d399, #10b981);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #10b981, #34d399);
  }
}

.delete-button {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #dc2626, #ef4444);
  }
}

.comment-button {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #d97706, #f59e0b);
  }
}

.student-button {
  background: linear-gradient(90deg, #34d399, #10b981);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #10b981, #34d399);
  }
}

.study-button {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #2563eb, #3b82f6);
  }
}

.chapter-button {
  background: linear-gradient(90deg, #6b7280, #4b5563);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #4b5563, #6b7280);
  }
}

.article-button {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #d97706, #f59e0b);
  }
}

.off-shelf-button,
.listing-button {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;

  &:hover {
    background: linear-gradient(90deg, #2563eb, #3b82f6);
  }
}

.el-table {
  padding: 10px;
  font-family: 'Noto Sans SC', sans-serif;
  border-radius: 8px;
  overflow: hidden;

  // 添加表头圆角
  :deep(.el-table__header-wrapper) {
    border-radius: 8px 8px 0 0; // 圆角只应用在顶部，底部不需要
    overflow: hidden; // 确保内部元素不会溢出圆角
  }

  :deep(.el-table__row) {
    height: 48px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f9f9ff;
    }
  }

  :deep(.el-table__body-wrapper) {
    border-radius: 0 0 6px 6px; // 确保表格主体部分的底部也有圆角，形成整体效果
  }
}

.el-tag {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  border-radius: 4px;
}

.el-tag--success {
  background-color: #d1fae5;
  color: #10b981;
  border-color: #d1fae5;
}

.el-tag--warning {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fef3c7;
}

.el-tag--info {
  background-color: #e5e7eb;
  color: #4b5563;
  border-color: #e5e7eb;
}

.custom-pagination {
  margin-top: 15px;
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