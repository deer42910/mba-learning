<template>
  <div class="_chapter" style="display: flex; height: calc(100vh - 60px);">
    <!-- 左边：课程名称列表 -->
    <div class="course-list" style="width: 30%; padding: 10px; background: #f7fafc; border-right: 1px solid #e5e7eb;">
      <el-input
        v-model="courseSearch"
        size="small"
        placeholder="搜索课程名称"
        clearable
        style="margin-bottom: 10px"
        @clear="fetchCourses"
        @input="fetchCoursesDebounced"
      />
      <el-table
        :data="courseData"
        height="calc(100% - 40px)"
        :header-cell-style="{
          background: 'linear-gradient(90deg, #ECE9F4, #F3F0FF)',
          color: '#4A2B90',
          fontWeight: 'bold',
        }"
        :row-style="{ color: '#555', fontSize: '14px', fontFamily: 'Noto Sans SC, sans-serif' }"
        @row-click="selectCourse"
        style="border-radius: 8px; overflow: hidden;"
      >
        <el-table-column prop="name" label="课程名称" min-width="200">
          <template slot-scope="scope">
            <span class="text-ellipsis">{{ scope.row.name || '暂无名称' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 右边：章节模块 -->
    <div class="chapter-section" style="width: 70%; padding: 10px; background: #fff;">
      <el-row v-if="selectedTaskId" style="padding: 15px 10px; margin-bottom: 10px; display: flex; align-items: center;">
        <el-input
          v-model="chapterSearch"
          size="small"
          placeholder="搜索章节名称"
          clearable
          style="margin-right: 10px; width: 200px;"
          @clear="searchChapter"
          @input="searchChapterDebounced"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="searchChapter"
          class="search-button"
        >
          搜索
        </el-button>
        <div style="flex: 1;"></div>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          plain
          @click="add"
          class="add-button"
        >
          新增
        </el-button>
        <el-button
          type="success"
          :disabled="update.length !== 1"
          size="small"
          icon="el-icon-edit"
          plain
          @click="updateDataBtn"
          class="update-button"
        >
          修改
        </el-button>
        <el-button
          type="danger"
          :disabled="update.length <= 0"
          size="small"
          icon="el-icon-delete"
          plain
          @click="deleteDataBtn"
          class="delete-button"
        >
          删除
        </el-button>
      </el-row>
      <div v-if="selectedTaskId">
        <el-table
          v-loading="loading"
          :data="tableData"
          :header-cell-style="{
            background: 'linear-gradient(90deg, #ECE9F4, #F3F0FF)',
            color: '#4A2B90',
            fontWeight: 'bold',
          }"
          :row-style="{
            color: '#555',
            fontSize: '14px',
            fontFamily: 'Noto Sans SC, sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }"
          @selection-change="handleSelectionChange"
          stripe
          style="border-radius: 8px; overflow: hidden;"
          :row-class-name="() => 'custom-row'"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="章节名称" min-width="200">
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.name || '暂无章节' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="150">
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.createTime || '暂无时间' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="toStudyInfo(scope.row.id)"
                class="study-button"
                @mouseover="style.hover = true"
                @mouseleave="style.hover = false"
              >
                学习情况
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="toHomework(scope.row.id)"
                class="homework-button"
                @mouseover="style.hover = true"
                @mouseleave="style.hover = false"
              >
                作业
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="updateData(scope.row.id)"
                class="update-button"
                @mouseover="style.hover = true"
                @mouseleave="style.hover = false"
              >
                修改
              </el-button>
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-question"
                icon-color="#DC2626"
                title="确认删除选中的数据？"
                @confirm="deleteDate(scope.row.id)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  class="delete-button"
                  @mouseover="style.hover = true"
                  @mouseleave="style.hover = false"
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
          :style="{ marginTop: '15px', padding: '10px' }"
        />
      </div>
      <div v-else style="text-align: center; color: #999; padding: 20px;">
        请从左侧选择一个课程
      </div>

      <!-- 新增对话框 -->
      <add
        v-if="addVisible"
        :addVisible="addVisible"
        :taskId="taskId"
        :taskName="search.taskName"
        :type="type"
        :flag="flag"
        @update:addVisible="addVisible = $event"
        @addFalse="addFalse"
      />

      <!-- 修改对话框 -->
      <update
        v-if="updateVisible"
        :updateVisible="updateVisible"
        :updateId="updateId"
        :taskId="taskId"
        :taskName="search.taskName"
        :type="type"
        :flag="flag"
        @update:updateVisible="updateVisible = $event"
        @updateFalse="updateFalse"
      />
    </div>
  </div>
</template>

<script>
import { getApeTaskList, getApeChapterByTaskId, removeApeChapter } from '@/api/api';
import add from '../../../components/system/chapter/addChapter';
import update from '../../../components/system/chapter/updateChapter';
import _ from 'lodash';

export default {
  data() {
    return {
      loading: false,
      update: [],
      remove: [],
      updateId: '',
      addVisible: false,
      updateVisible: false,
      taskId: '',
      type: 1,
      flag: 1,
      courseSearch: '',
      chapterSearch: '',
      selectedTaskId: null,
      search: {
        type: 0,
        taskName: '',
        name: '',
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      courseData: [],
      style: {
        hover: false,
      },
    };
  },
  components: {
    add,
    update,
  },
  computed: {
    fetchCoursesDebounced() {
      return _.debounce(this.fetchCourses, 300);
    },
    searchChapterDebounced() {
      return _.debounce(this.searchChapter, 300);
    },
  },
  methods: {
    fetchCourses() {
      getApeTaskList({ name: this.courseSearch, pageNumber: 1, pageSize: 100 }).then((res) => {
        if (res.code === 1000) {
          this.courseData = res.data;
          console.log('Fetched courses:', this.courseData);
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 3000,
          });
        }
      }).catch((error) => {
        console.error('API Error:', error);
        this.$notify.error({
          title: '错误',
          message: '网络错误，请稍后重试或检查后端服务',
          duration: 3000,
        });
      });
    },
    selectCourse(row) {
      this.selectedTaskId = row.id;
      this.taskId = row.id;
      this.search.taskName = row.name || '未命名课程';
      this.chapterSearch = '';
      console.log('Selected course:', { taskId: this.taskId, taskName: this.search.taskName });
      this.query();
    },
    searchChapter() {
      this.search.pageNumber = 1;
      this.query();
    },
    query() {
      if (this.selectedTaskId) {
        this.loading = true;
        getApeChapterByTaskId({ id: this.selectedTaskId }).then((res) => {
          if (res.code === 1000) {
            const allChapters = res.data;
            const filteredChapters = allChapters.filter((chapter) =>
              chapter.name.toLowerCase().includes(this.chapterSearch.toLowerCase())
            );
            const start = (this.search.pageNumber - 1) * this.search.pageSize;
            const end = start + this.search.pageSize;
            this.tableData = filteredChapters.slice(start, end);
            this.total = filteredChapters.length;
            this.loading = false;
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message,
              duration: 3000,
            });
          }
        }).catch((error) => {
          console.error('API Error:', error);
          this.loading = false;
          this.$notify.error({
            title: '错误',
            message: '网络错误，请稍后重试',
            duration: 3000,
          });
        });
      } else {
        this.tableData = [];
        this.total = 0;
      }
    },
    toStudyInfo(id) {
      var param = {
        name: '学习情况',
        url: '/chapterStudy?id=' + id,
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/chapterStudy?id=' + id);
      this.$store.commit('menu/setActiveMenu', '/chapterStudy?id=' + id);
    },
    toHomework(id) {
      var param = {
        name: '章节作业',
        url: '/homework?id=' + id,
      };
      this.$store.commit('menu/addActiveMenu', param);
      this.$router.push('/homework?id=' + id);
      this.$store.commit('menu/setActiveMenu', '/homework?id=' + id);
    },
    refresh() {
      this.chapterSearch = '';
      this.search = {
        type: 0,
        taskName: this.search.taskName,
        name: '',
        pageNumber: 1,
        pageSize: 10,
      };
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
      this.update = val.map((item) => item.id);
      this.remove = val.map((item) => item.id);
      console.log('Selected IDs:', this.update);
    },
    add() {
      if (!this.selectedTaskId) {
        this.$message.warning('请先选择一个课程');
        return;
      }
      this.addVisible = true;
      console.log('Opening add dialog with:', { taskId: this.taskId, taskName: this.search.taskName });
      console.log('addVisible set to:', this.addVisible);
    },
    addFalse() {
      this.addVisible = false;
      this.query();
      console.log('Add dialog closed');
    },
    updateFalse() {
      this.updateId = '';
      this.updateVisible = false;
      this.query();
      console.log('Update dialog closed');
    },
    updateData(id) {
      this.updateId = id;
      this.updateVisible = true;
      console.log('Update dialog opened with:', {
        updateVisible: this.updateVisible,
        updateId: this.updateId,
        taskId: this.taskId,
        taskName: this.search.taskName,
      });
    },
    updateDataBtn() {
      if (this.update.length === 1) {
        this.updateData(this.update[0]);
      }
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
      removeApeChapter({ ids }).then((res) => {
        if (res.code === 1000) {
          this.$message.success('删除成功!');
          this.search.pageNumber = 1;
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 3000,
          });
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '网络错误，请稍后重试',
          duration: 3000,
        });
      });
    },
  },
  mounted() {
    var name = this.$route.query.name;
    var id = this.$route.query.id;
    var type = this.$route.query.type;
    if (name) {
      this.search.taskName = name;
    }
    if (id) {
      this.taskId = id;
      this.selectedTaskId = id;
    }
    if (type) {
      this.type = type;
    }
    this.fetchCourses();
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap');

._chapter {
  padding: 10px;
  background-color: #f7fafc;
  height: calc(100vh - 60px);
  font-family: 'Noto Sans SC', sans-serif;
  display: flex;
}

.course-list,
.chapter-section {
  padding: 10px;
}

.course-list {
  width: 30%;
  background: #f7fafc;
  border-right: 1px solid #e5e7eb;
}

.chapter-section {
  width: 70%;
  background: #fff;
}

.el-input {
  :deep(.el-input__inner) {
    border-radius: 6px;
    border: 1px solid #a8e6cf;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 13px;
    color: #555;
    transition: all 0.3s ease;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
    }
  }
}

.el-table {
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table__header) {
    border-radius: 8px 8px 0 0 !important;
  }

  :deep(.el-table__body) {
    border-radius: 0 0 8px 8px !important;
  }

  :deep(.custom-row) {
    &:hover {
      background-color: #f9f9ff !important;
      transform: scale(1.01);
      transition: all 0.3s ease;
    }
  }
}

.el-button {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.search-button {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #2563eb, #3b82f6);
  }
}

.add-button {
  background: linear-gradient(90deg, #4A2B90, #6B46C1);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #6B46C1, #4A2B90);
  }
}

.update-button {
  background: linear-gradient(90deg, #34D399, #10B981);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #10B981, #34D399);
  }
}

.delete-button {
  background: linear-gradient(90deg, #EF4444, #DC2626);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #DC2626, #EF4444);
  }
}

.study-button {
  background: linear-gradient(90deg, #F59E0B, #D97706);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #D97706, #F59E0B);
  }
}

.homework-button {
  background: linear-gradient(90deg, #3B82F6, #2563EB);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #2563EB, #3B82F6);
  }
}

.el-pagination {
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

.el-dialog {
  border-radius: 12px !important;

  :deep(.el-dialog__header) {
    border-bottom: 1px solid #e9ecef !important;
    border-radius: 12px 12px 0 0;
    background: linear-gradient(90deg, #4A2B90, #6B46C1);
    color: #fff;
  }
}

.text-ellipsis {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555;
}
</style>