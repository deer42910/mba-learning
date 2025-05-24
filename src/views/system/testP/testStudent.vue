<template>
  <div class="_student">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="20" style="padding: 10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">学生姓名:</span>
            <el-input
              style="margin-top: 10px"
              size="mini"
              placeholder="请输入学生姓名"
              v-model="search.userName"
              class="custom-input"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="display: flex; align-items: center; justify-content: flex-end">
            <el-button
              style="margin-top: 10px; margin-left: 10px"
              size="mini"
              icon="el-icon-search"
              type="primary"
              @click="searchPage"
              class="custom-button"
            >
              查询
            </el-button>
            <el-button
              style="margin-top: 10px; margin-left: 10px"
              size="mini"
              icon="el-icon-refresh"
              @click="refresh"
              class="custom-button reset-button"
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
            fontSize: '15px',
            fontFamily: 'PingFang SC, sans-serif',
            whiteSpace: 'normal',
            transition: 'all 0.3s',
          }"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%; height: calc(100vh - 220px);"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="createBy" label="学生姓名" min-width="120" />
          <el-table-column prop="testName" label="考试名称" min-width="150" />
          <el-table-column prop="totalScore" label="总分" width="100" />
          <el-table-column prop="totalGetScore" label="得分" width="100" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="yuejuan(scope.row)"
                class="custom-button edit-button"
              >
                阅卷
              </el-button>
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
    <el-dialog
      title="阅卷"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      class="custom-dialog"
    >
      <div class="testInfo-item" v-for="(item, index) in assign" :key="index">
        <div style="margin-top: 10px; margin-left: 10px">
          {{ index + 1 }}. {{ item.title }}
          <span style="color: red">正确答案：{{ item.answer }}</span>
          <span style="color: green; margin-left: 10px; width: 50px">
            得分：
            <el-input
              style="width: 100px"
              type="number"
              v-model.number="item.point"
              size="mini"
              class="custom-input"
              @change="validateScore(item)"
            />
          </span>
          <span style="margin-left: 10px">自动评分：{{ item.autoScore }}</span>
        </div>
        <div style="margin-top: 10px; margin-left: 10px; margin-bottom: 10px">
          <el-radio-group disabled v-model="item.solution" v-if="item.type == '0'">
            <el-radio
              v-for="(e, s) in item.content"
              :key="s"
              :label="e.value"
              class="custom-radio"
            >
              {{ e.value }}. {{ e.option }}
            </el-radio>
          </el-radio-group>
          <el-checkbox-group disabled v-model="item.solution" v-if="item.type == '1'">
            <el-checkbox
              v-for="(e, s) in item.content"
              :key="s"
              :label="e.value"
              class="custom-checkbox"
            >
              {{ e.value }}. {{ e.option }}
            </el-checkbox>
          </el-checkbox-group>
          <el-input
            disabled
            v-model="item.solution"
            v-if="item.type == '2'"
            size="mini"
            placeholder="请输入答案"
            class="custom-input"
          />
          <el-radio-group disabled v-model="item.solution" v-if="item.type == '3'">
            <el-radio label="正确" class="custom-radio">正确</el-radio>
            <el-radio label="错误" class="custom-radio">错误</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            disabled
            v-model="item.solution"
            v-if="item.type == '4'"
            size="mini"
            placeholder="请输入答案"
            class="custom-input"
          />
          <el-input
            type="textarea"
            disabled
            v-model="item.solution"
            v-if="item.type == '5'"
            size="mini"
            placeholder="请输入答案"
            class="custom-input"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose" class="custom-button reset-button">取消</el-button>
        <el-button size="mini" type="primary" @click="submit" class="custom-button">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTestStudent, getTestStudentItem, editApeTestStudent } from '../../../api/api';

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: '',
      addVisible: false,
      updateVisible: false,
      dialogVisible: false,
      search: {
        testId: '',
        userName: '',
        pageNumber: 1,
        pageSize: 10,
      },
      assign: [],
      total: 0,
      tableData: [],
    };
  },
  methods: {
    searchPage() {
      this.search.pageNumber = 1;
      this.query();
    },
    submit() {
      var param = {
        list: this.assign,
      };
      editApeTestStudent(param).then((res) => {
        if (res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: '阅卷成功',
          });
          this.handleClose();
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      });
    },
    query() {
      getTestStudent(this.search).then((res) => {
        if (res.code == 1000) {
          // 聚合相同 test_id 和 user_id 的记录
          const groupedData = {};
          res.data.records.forEach((item) => {
            const key = `${item.testId}_${item.userId}`;
            if (!groupedData[key]) {
              groupedData[key] = {
                id: item.id,
                testId: item.testId,
                userId: item.userId,
                createBy: item.createBy || '未知',
                testName: item.testName || '未命名',
                totalScore: item.totalScore || 0,
                totalGetScore: item.totalGetScore || 0,
              };
            } else {
              groupedData[key].totalGetScore += item.totalGetScore || 0;
            }
          });

          this.tableData = Object.values(groupedData);
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
    yuejuan(row) {
      if (!row.testId || !row.userId) {
        this.$notify.error({
          title: '错误',
          message: '缺少 testId 或 userId，无法进行阅卷',
        });
        console.error('Invalid row data:', row);
        return;
      }
      console.log('Calling getTestStudentItem with:', { testId: row.testId, userId: row.userId });
      getTestStudentItem({ testId: row.testId, userId: row.userId }).then((res) => {
        if (res.code == 1000) {
          this.assign = res.data.map((item) => {
            const newItem = { ...item };
            if (item.type === '0' || item.type === '1') {
              newItem.content = item.content ? JSON.parse(item.content) : [];
              if (item.type === '1' && item.solution) {
                newItem.solution = item.solution.split(',');
              } else if (item.type === '1' && !item.solution) {
                newItem.solution = [];
              } else {
                newItem.solution = item.solution || '';
              }
            } else {
              newItem.content = [];
              newItem.solution = item.solution || '';
            }
            newItem.autoScore = this.calculateAutoScore(newItem);
            return newItem;
          });
          this.dialogVisible = true;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      }).catch((err) => {
        this.$notify.error({
          title: '请求失败',
          message: '无法获取阅卷数据：' + err.message,
        });
      });
    },
    calculateAutoScore(item) {
      if (!item.solution || !item.answer) return 0;

      switch (item.type) {
        case '0': // 单选
          return item.solution === item.answer ? item.score : 0;
        case '1': // 多选
          const solutionArray = item.solution.sort();
          const answerArray = item.answer.split(',').sort();
          return JSON.stringify(solutionArray) === JSON.stringify(answerArray) ? item.score : 0;
        case '2': // 填空
        case '3': // 判断
          return item.solution.trim() === item.answer.trim() ? item.score : 0;
        case '4': // 问答题
        case '5': // 计算题
          // 对于主观题，返回 0，需人工评分
          return 0;
        default:
          return 0;
      }
    },
    validateScore(item) {
      if (item.point < 0) {
        item.point = 0;
      }
      if (item.point > item.score) {
        item.point = item.score;
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.assign = [];
    },
    refresh() {
      this.search.userName = '';
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
    },
  },
  mounted() {
    this.search.testId = this.$route.query.id;
    this.query();
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

.custom-button {
  border-radius: 8px;
  font-family: 'PingFang SC', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.reset-button {
  background: linear-gradient(90deg, #a0aec0, #718096);
  color: #fff;
  border: none;
  margin-left: 10px;

  &:hover {
    background: linear-gradient(90deg, #718096, #4a5568);
  }
}

.edit-button {
  background: linear-gradient(90deg, #FBBF24, #F59E0B);
  color: #fff;
  border: none;

  &:hover {
    background: linear-gradient(90deg, #F59E0B, #D97706);
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

.el-table :deep(.custom-row:hover) {
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

.custom-dialog {
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #ffffff, #f9f9ff);
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    background: #f9f9ff;
    max-height: 60vh; // 限制内容区域最大高度
    overflow-y: auto; // 启用纵向滚动
    box-sizing: border-box; // 确保 padding 不影响高度

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #4A2B90;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #3a1f6e;
    }
  }

  :deep(.el-dialog__footer) {
    padding: 15px;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    text-align: right;
  }
}

.custom-radio :deep(.el-radio__label),
.custom-checkbox :deep(.el-checkbox__label) {
  font-family: 'PingFang SC', sans-serif;
  font-size: 13px;
  color: #555;
}

.testInfo-item {
  margin-bottom: 15px;
}

// 限制 textarea 的高度，防止单个题目过长
.custom-input :deep(textarea) {
  max-height: 100px;
  overflow-y: auto;
}
</style>