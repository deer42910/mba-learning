<template>
  <div class="_homework">
    <div class="search-table">
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
          style="width: 100%; height: calc(100vh - 150px);"
          :row-class-name="() => 'custom-row'"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="chapterName" label="章节名称" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.chapterName || '暂无章节' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="题目" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.title || '暂无题目' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="序号" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.sort || '0' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="答案" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.answer || '暂无答案' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type == 0">单选</el-tag>
              <el-tag v-if="scope.row.type == 1" type="warning">多选</el-tag>
              <el-tag v-if="scope.row.type == 2" type="primary">填空</el-tag>
              <el-tag v-if="scope.row.type == 3" type="success">判断</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.createTime || '暂无时间' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                @click="updateData(scope.row.id)"
                :style="{ marginRight: '5px', transition: 'all 0.3s', background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
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
                  :style="{ transition: 'all 0.3s', background: 'linear-gradient(90deg, #EF4444, #DC2626)', color: '#fff', border: 'none' }"
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
    <add @addFalse="addFalse" :chapterId="search.chapterId" :addVisible="addVisible" />
    <update @updateFalse="updateFalse" :chapterId="search.chapterId" :updateId="updateId" :updateVisible="updateVisible" />
  </div>
</template>

<script>
import { getApeHomeworkByChapterId, removeApeHomework } from '../../../api/api';
import add from '../../../components/system/homework/addHomework';
import update from '../../../components/system/homework/updateHomework';

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
        chapterId: '',
        pageNumber: 1,
        pageSize: 10,
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
    query() {
      this.loading = true;
      const params = {
        id: this.search.chapterId, // 修改参数名，从 chapterId 改为 id
        pageNumber: this.search.pageNumber,
        pageSize: this.search.pageSize,
      };
      getApeHomeworkByChapterId(params).then((res) => {
        if (res.success && res.code === 1000) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message || '获取数据失败',
          });
          this.loading = false;
        }
      }).catch(() => {
        this.loading = false;
        this.$notify.error({
          title: '错误',
          message: '网络错误，请稍后重试',
        });
      });
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
      removeApeHomework({ ids: ids }).then((res) => {
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
    this.search.chapterId = this.$route.query.id;
    this.query();
  },
};
</script>

<style scoped lang="scss">
._homework {
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

.el-tag {
  font-family: 'PingFang SC', sans-serif;
  font-size: 12px;
  border-radius: 4px;
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