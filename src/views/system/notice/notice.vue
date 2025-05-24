<template>
  <div class="notice">
    <div class="search-table">
      <!-- 搜索区域 -->
      <div class="search">
        <el-row :gutter="10" style="padding:10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">公告标题:</span>
            <el-input
              style="margin-top:10px"
              size="mini"
              placeholder="请输入公告标题"
              v-model="search.title">
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">操作人员:</span>
            <el-input
              style="margin-top:10px"
              size="mini"
              placeholder="请输入操作人员"
              v-model="search.updateBy">
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">类型:</span>
            <el-select clearable style="margin-top:10px" size="mini" v-model="search.type" placeholder="请选择">
              <el-option label="公告" value="0"></el-option>
              <el-option label="通知" value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button
              style="margin-top:10px;margin-left: 25px;"
              size="mini"
              icon="el-icon-search"
              type="primary"
              @click="searchPage"
            >
              查询
            </el-button>
            <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 表格区域 -->
      <div class="table">
        <el-row style="padding: 15px 10px">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            plain
            @click="addNotice"
            :style="{ background: 'linear-gradient(90deg, #4A2B90, #6B46C1)', color: '#fff', border: 'none' }"
          >
            新增
          </el-button>
          <el-button
            type="success"
            :disabled="update.length != 1 ? true : false"
            size="mini"
            icon="el-icon-edit"
            plain
            @click="updateAccountBtn"
            :style="{ background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            :disabled="update.length <= 0 ? true : false"
            size="mini"
            icon="el-icon-delete"
            plain
            @click="deleteDateBtn"
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
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title" label="公告标题" width="180">
            <template slot-scope="scope">
              <span class="text-ellipsis">{{ scope.row.title || '暂无标题' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="公告类型" width="180">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type == 0">公告</el-tag>
              <el-tag v-if="scope.row.type == 1" type="warning">通知</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="180">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0">正常</el-tag>
              <el-tag v-if="scope.row.state == 1" type="warning">关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建人"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <!-- 轮播图设置/取消按钮 -->
              <el-button
                size="mini"
                :type="scope.row.flag == 0 ? 'warning' : 'info'"
                @click="toggleCarousel(scope.row)"
                :style="{ marginRight: '5px', transition: 'all 0.3s' }"
              >
                {{ scope.row.flag == 0 ? '设置为轮播图' : '取消设置' }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="updateAccount(scope.row.id)"
                :style="{ marginRight: '5px', transition: 'all 0.3s', background: 'linear-gradient(90deg, #34D399, #10B981)', color: '#fff', border: 'none' }"
              >
                修改
              </el-button>
              <el-popconfirm
                style="margin-left:5px"
                confirm-button-text='确认'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="确认删除选中的数据？"
                @confirm="deleteDate(scope.row.id)"
              >
                <el-button
                  slot="reference"
                  size="mini"
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
          :style="{ marginTop: '15px', padding: '10px' }"
        />
      </div>

      <!-- 轮播图卡片区域 -->
      <div class="carousel-card">
        <el-card class="el-cardd" shadow="always">
          <div slot="header" class="clearfix">
            <span>轮播图展示</span>
          </div>
          <div class="carousel-images">
            <div v-for="(item, index) in carouselImages" :key="item.id" class="image-wrapper">
              <img :src="item.avatar" class="carousel-image" @click="previewImage(item.avatar)" />
              <div class="image-title">{{ item.title }}</div>
              <div class="image-actions">
                <i class="el-icon-delete" @click="removeCarouselImage(index, item.id)"></i>
              </div>
            </div>
            <div v-if="carouselImages.length === 0" class="empty-text">
              暂无轮播图
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 子组件 -->
    <add-notice @addNoticeFalse="addNoticeFalse" :addNoticeVisible="addNoticeVisible"></add-notice>
    <update-notice @updateNoticeFalse="updateNoticeFalse" :updateId="updateId" :updateNoticeVisible="updateNoticeVisible"></update-notice>
  </div>
</template>

<script>
import { getAccountPage, removeAccount, editAccount } from '../../../api/api';
import addNotice from '../../../components/system/notice/addNotice';
import updateNotice from '../../../components/system/notice/updateNotice';

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      addNoticeVisible: false,
      updateNoticeVisible: false,
      search: {
        title: "",
        updateBy: "",
        state: "",
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      carouselImages: [] // 存储轮播图数据
    };
  },
  components: {
    addNotice,
    updateNotice
  },
  methods: {
    searchPage() {
      this.search.pageNumber = 1;
      this.query();
    },
    query() {
      getAccountPage(this.search).then(res => {
        if (res.code == 1000) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.loading = false;
          // 更新轮播图卡片区域
          this.carouselImages = this.tableData.filter(item => item.flag == 1 && item.avatar);
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      });
    },
    refresh() {
      this.search.title = "";
      this.search.updateBy = "";
      this.search.state = "";
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
    addNotice() {
      this.addNoticeVisible = true;
    },
    addNoticeFalse() {
      this.addNoticeVisible = false;
      this.query();
    },
    updateNoticeFalse() {
      this.updateId = "";
      this.updateNoticeVisible = false;
      this.query();
    },
    updateAccount(id) {
      this.updateId = id;
      this.updateNoticeVisible = true;
    },
    updateAccountBtn() {
      this.updateAccount(this.update[0]);
    },
    deleteDateBtn() {
      this.$confirm('确定删除选中的' + this.remove.length + '条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDate(this.remove.join(","));
      }).catch(() => {});
    },
    deleteDate(ids) {
      removeAccount({ ids: ids }).then(res => {
        if (res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.search.pageNumber = 1;
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      });
    },
    toggleCarousel(row) {
      if (row.flag == 0) {
        // 设置为轮播图
        if (!row.avatar) {
          this.$message.error('请设置图片后添加！');
          return;
        }
        // 更新 flag 为 1
        const updatedRow = { ...row, flag: 1 };
        editAccount(updatedRow).then(res => {
          if (res.code === 1000) {
            this.$message.success('已设置为轮播图！');
            this.query(); // 刷新表格和轮播图区域
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        }).catch(error => {
          this.$notify.error({
            title: '错误',
            message: '设置失败：' + error.message
          });
        });
      } else {
        // 取消设置轮播图
        const updatedRow = { ...row, flag: 0 };
        editAccount(updatedRow).then(res => {
          if (res.code === 1000) {
            this.$message.success('已取消轮播图设置！');
            this.query(); // 刷新表格和轮播图区域
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        }).catch(error => {
          this.$notify.error({
            title: '错误',
            message: '取消设置失败：' + error.message
          });
        });
      }
    },
    previewImage(url) {
      this.$imagePreview({
        url: url,
        zIndex: 3000
      });
    },
    removeCarouselImage(index, id) {
      this.$confirm('确定从轮播图中移除此图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const row = this.tableData.find(item => item.id === id);
        if (row) {
          const updatedRow = { ...row, flag: 0 };
          editAccount(updatedRow).then(res => {
            if (res.code === 1000) {
              this.$message.success('已移除轮播图！');
              this.query();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message
              });
            }
          }).catch(error => {
            this.$notify.error({
              title: '错误',
              message: '移除失败：' + error.message
            });
          });
        }
      }).catch(() => {});
    }
  },
  mounted() {
    this.query();
  }
};
</script>

<style scoped>
.notice {
  padding: 10px;
  background-color: #f7fafc;
}

.search-table {
  width: 100%;
}

.search {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 10px;
  transition: all 0.3s ease;
}

.search:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.table {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  padding: 15px;
  transition: all 0.3s ease;
}

.table:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.carousel-card {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  padding: 10px;
  transition: all 0.3s ease;
}

.carousel-card:hover {
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.el-cardd {
  border-radius: 12px;
  padding-bottom: 20px !important;
  background: transparent;
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

.el-input__inner,
.el-select__input {
  border-radius: 8px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #555;
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

.el-tag {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  border-radius: 4px;
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

.carousel-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-wrapper {
  position: relative;
  width: 120px;
  height: 80px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.image-title {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  color: #606266;
  text-align: center;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.3s;
}

.image-wrapper:hover .image-actions {
  opacity: 1;
}

.image-actions i {
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.image-actions i:hover {
  background-color: rgba(0, 0, 0, 0.6);
  transform: scale(1.1);
}

.empty-text {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #909399;
  text-align: center;
  padding: 20px;
  width: 100%;
}

.text-ellipsis {
  display: block;
  white-space: normal;
  word-break: break-all;
  line-height: 1.5;
  color: #555;
}
</style>