<template>
  <div class="_message">
    <div class="search-table">
      <!-- 搜索区域 -->
      <div class="search">
        <el-row :gutter="20" style="padding: 15px">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <span class="search-title">用户昵称:</span>
            <el-input
              v-model="search.userName"
              size="small"
              placeholder="请输入用户昵称"
              clearable
              style="margin-top: 8px"
              @clear="searchPage"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <span class="search-title">提问内容:</span>
            <el-input
              v-model="search.content"
              size="small"
              placeholder="请输入提问内容"
              clearable
              style="margin-top: 8px"
              @clear="searchPage"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <span class="search-title">回复:</span>
            <el-input
              v-model="search.answer"
              size="small"
              placeholder="请输入回复"
              clearable
              style="margin-top: 8px"
              @clear="searchPage"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" style="display: flex; align-items: center">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              style="margin-top: 8px; margin-right: 10px"
              @click="searchPage"
            >
              查询
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh"
              style="margin-top: 8px"
              @click="refresh"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 表格区域 -->
      <div class="table">
        <el-row style="padding: 15px 10px">
          <el-button
            type="success"
            :disabled="update.length !== 1"
            size="small"
            icon="el-icon-edit"
            plain
            @click="updateDataBtn"
            :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
          >
            回复
          </el-button>
          <el-button
            type="danger"
            :disabled="update.length <= 0"
            size="small"
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
            fontWeight: 'bold',
          }"
          :row-style="{
            color: '#555',
            fontSize: '14px',
            fontFamily: 'PingFang SC, sans-serif',
            transition: 'all 0.3s',
          }"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%; border-radius: 8px; overflow: hidden"
          :row-class-name="() => 'custom-row'"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="userName" label="用户昵称" width="150">
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.userName || '未知用户' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="提问内容" min-width="250">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.content || '暂无内容'" placement="top">
                <span class="text-ellipsis">{{ scope.row.content || '暂无内容' }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="回复" min-width="250">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.answer || '未回复'" placement="top">
                <span class="text-ellipsis">{{ scope.row.answer || '未回复' }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="updateData(scope.row.id)"
                :style="{ marginRight: '5px', transition: 'all 0.3s', background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
                @mouseover="style.hover = true"
                @mouseleave="style.hover = false"
              >
                回复
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
                  :style="{ transition: 'all 0.3s', background: 'linear-gradient(90deg, #EF4444, #DC2626)', color: '#fff', border: 'none' }"
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
    </div>
    <update @updateFalse="updateFalse" :updateId="updateId" :updateVisible="updateVisible" />
  </div>
</template>

<script>
import { getApeMessagePage, removeApeMessage } from '../../../api/api'
import update from '../../../components/system/message/updateMessage'

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
        userId: '',
        userName: '',
        content: '',
        answer: '',
        flag: 1,
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      style: {
        hover: false,
      },
    }
  },
  components: {
    update,
  },
  methods: {
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      this.loading = true
      getApeMessagePage(this.search).then(res => {
        if (res.code === 1000) {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
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
    },
    refresh() {
      this.search = {
        userId: '',
        userName: '',
        content: '',
        answer: '',
        flag: 1,
        pageNumber: 1,
        pageSize: 10,
      }
      this.query()
    },
    handleCurrentChange(val) {
      this.search.pageNumber = val
      this.query()
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.query()
    },
    handleSelectionChange(val) {
      this.update = val.map(item => item.id)
      this.remove = val.map(item => item.id)
    },
    add() {
      this.addVisible = true
    },
    addFalse() {
      this.addVisible = false
      this.query()
    },
    updateFalse() {
      this.updateId = ''
      this.updateVisible = false
      this.query()
    },
    updateData(id) {
      this.updateId = id
      this.updateVisible = true
    },
    updateDataBtn() {
      this.updateData(this.update[0])
    },
    deleteDataBtn() {
      this.$confirm('确定删除选中的' + this.remove.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteDate(this.remove.join(','))
      }).catch(() => {})
    },
    deleteDate(ids) {
      removeApeMessage({ ids }).then(res => {
        if (res.code === 1000) {
          this.$message.success('删除成功!')
          this.search.pageNumber = 1
          this.query()
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 3000,
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '网络错误，请稍后重试',
          duration: 3000,
        })
      })
    },
  },
  mounted() {
    this.query()
  },
}
</script>

<style scoped>
.search-table {
  width: 100%;
}

.search {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: all 0.3s ease;
}

.search:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.table {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
  padding: 15px;
  transition: all 0.3s ease;
}

.table:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.el-col {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-title {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #4A2B90;
  white-space: nowrap;
  width: 80px;
  text-align: right;
  margin-right: 10px;
}

.el-input,
.el-select {
  flex: 1;
}

.el-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table .custom-row:hover {
  background-color: #f9f9ff !important;
  transform: scale(1.01);
}

.el-pagination {
  border-radius: 8px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.el-dialog {
  border-radius: 12px !important;
}

.el-dialog__header {
  border-bottom: 1px solid #e9ecef !important;
  border-radius: 12px 12px 0 0;
}

.text-ellipsis {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  color: #555;
  max-width: 100%;
}
</style>