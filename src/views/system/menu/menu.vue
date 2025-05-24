<template>
  <div class="_menu">
    <div class="search-table">
      <!-- 搜索区域 -->
      <div class="search">
        <el-row :gutter="20" style="padding: 10px">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <span class="search-title">菜单名称:</span>
            <el-input
              v-model="search.menuName"
              size="small"
              placeholder="请输入菜单名称"
              clearable
              style="margin-top: 8px"
              @clear="query"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <span class="search-title">菜单状态:</span>
            <el-select
              v-model="search.status"
              size="small"
              placeholder="请选择状态"
              clearable
              style="margin-top: 8px"
            >
              <el-option label="正常" value="0" />
              <el-option label="停用" value="1" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" style="display: flex; align-items: center">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              style="margin-top: 8px; margin-right: 10px"
              @click="query"
            >
              查询
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh"
              style="margin-top: 8px; background: #E2E8F0; color: #4A2B90; border: none"
              @click="refresh"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 表格区域 -->
      <div class="table">
        <el-row style="padding: 10px 10px">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="addMenu"
            :style="{ background: 'linear-gradient(90deg, #4A2B90, #6B46C1)', color: '#fff', border: 'none' }"
          >
            新增
          </el-button>
          <el-button
            type="primary"
            size="small"
            :icon="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            plain
            @click="toggleExpand"
            :style="{ background: 'linear-gradient(90deg, #2B6CB0, #4299E1)', color: '#fff', border: 'none' }"
          >
            {{ expand ? '折叠全部' : '展开全部' }}
          </el-button>
        </el-row>
        <el-table
          v-if="refreshTable"
          v-loading="loading"
          :data="tableData"
          row-key="id"
          :default-expand-all="expand"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
          stripe
          style="width: 100%; border-radius: 8px; overflow: hidden"
          :row-class-name="() => 'custom-row'"
        >
          <el-table-column prop="menuName" label="菜单名称" min-width="180">
            <template slot-scope="scope">
              <span
                v-if="scope.row.children && scope.row.children.length"
                class="expand-icon"
                @click="toggleRowExpand(scope.row)"
              >
                <i :class="expandedRows.includes(scope.row.id) ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="margin-right: 8px;"></i>
              </span>
              <span class="text-ellipsis">{{ scope.row.menuName || '暂无名称' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="图标" width="100">
            <template slot-scope="scope">
              <i :class="scope.row.icon" style="font-size: 16px;"></i>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="排序" width="100" />
          <el-table-column prop="perms" label="权限标识" min-width="150" show-overflow-tooltip />
          <el-table-column prop="componentUrl" label="组件路径" min-width="200" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == 0 ? '' : 'warning'">{{ scope.row.status == 0 ? '正常' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160" />

          <el-table-column label="操作" width="150">
  <template slot-scope="scope">
    <el-dropdown trigger="click" @command="handleCommand">
      <el-button
        size="mini"
        :style="{
          background: 'linear-gradient(90deg, #34D399, #10B981)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          transition: 'all 0.3s ease'
        }"
      >
        <i class="el-icon-setting" style="margin-right: 5px;"></i> 操作
      </el-button>
      <el-dropdown-menu slot="dropdown" class="custom-dropdown">
        <el-dropdown-item
          icon="el-icon-plus"
          :command="scope.row.parentIds ? scope.row.parentIds.join(',') + '#add#' + scope.row.id : '0#add#' + scope.row.id"
          class="dropdown-item"
        >
          新增
        </el-dropdown-item>
        <el-dropdown-item
          icon="el-icon-edit"
          :command="scope.row.id + '#edit'"
          class="dropdown-item"
        >
          修改
        </el-dropdown-item>
        <el-dropdown-item
          icon="el-icon-delete"
          :command="scope.row.id + '#remove'"
          class="dropdown-item"
        >
          删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </template>
</el-table-column>
          <!-- <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-dropdown trigger="click" @command="handleCommand">
                <el-button
                  size="mini"
                  :style="{
                    background: 'linear-gradient(90deg, #34D399, #10B981)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }"
                >
                  <i class="el-icon-setting" style="margin-right: 5px;"></i> 操作
                </el-button>
                <el-dropdown-menu slot="dropdown" class="custom-dropdown">
                  <el-dropdown-item
                    icon="el-icon-plus"
                    :command="scope.row.idArrary + '#add#' + scope.row.id"
                    class="dropdown-item"
                  >
                    新增
                  </el-dropdown-item> 
            
                  <el-dropdown-item
                    icon="el-icon-edit"
                    :command="scope.row.id + '#edit'"
                    class="dropdown-item"
                  >
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    icon="el-icon-delete"
                    :command="scope.row.id + '#remove'"
                    class="dropdown-item"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>-->
        </el-table>
      </div>
    </div>
    <add-menu @addMenuFalse="addMenuFalse" :disable="disable" :parentId="parentId" :dropData="tableData" :addMenuVisible="addMenuVisible" />
    <update-menu @updateMenuFalse="updateMenuFalse" :updateId="updateId" :dropData="tableData" :updateMenuVisible="updateMenuVisible" />
  </div>
</template>

<script>
import { getMenuList, removeMenu } from '../../../api/api';
import addMenu from '../../../components/system/menu/addMenu';
import updateMenu from '../../../components/system/menu/updateMenu';

export default {
  data() {
    return {
      loading: true,
      refreshTable: true,
      expand: true,
      addMenuVisible: false,
      updateMenuVisible: false,
      search: {
        menuName: '',
        status: '',
      },
      tableData: [],
      parentId: [],
      disable: false,
      updateId: '',
      style: {
        hover: false,
      },
      expandedRows: [],
    };
  },
  components: {
    addMenu,
    updateMenu,
  },
  methods: {
    query() {
      this.loading = true;
      getMenuList(this.search).then((res) => {
        if (res.code === 1000) {
          this.tableData = res.data;
          this.loading = false;
          if (this.expand) {
            this.expandedRows = this.tableData
              .filter(row => row.children && row.children.length)
              .map(row => row.id);
          } else {
            this.expandedRows = [];
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 3000,
          });
        }
      }).catch(() => {
        this.loading = false;
        this.$notify.error({
          title: '错误',
          message: '网络错误，请稍后重试',
          duration: 3000,
        });
      });
    },
    refresh() {
      this.search = { menuName: '', status: '' };
      this.query();
    },
    toggleExpand() {
      this.expand = !this.expand;
      this.refreshTable = false;
      this.$nextTick(() => {
        this.refreshTable = true;
        if (this.expand) {
          this.expandedRows = this.tableData
            .filter(row => row.children && row.children.length)
            .map(row => row.id);
        } else {
          this.expandedRows = [];
        }
      });
    },
    toggleRowExpand(row) {
      if (this.expandedRows.includes(row.id)) {
        this.expandedRows = this.expandedRows.filter(id => id !== row.id);
      } else {
        this.expandedRows.push(row.id);
      }
      this.refreshTable = false;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    addMenu() {
      this.addMenuVisible = true;
    },
    addMenuFalse() {
      this.addMenuVisible = false;
      this.parentId = [];
      this.disable = false;
      this.query();
    },
    updateMenuFalse() {
      this.updateId = '';
      this.updateMenuVisible = false;
      this.query();
    },
    // handleCommand(command) {
    //   const [idArrary, action, id] = command.split('#');
    //   if (action === 'add') {
    //     const arr = idArrary.split(',');
    //     if (arr[0] !== '0') {
    //       this.parentId = arr.map(Number);
    //     }
    //     this.parentId.push(Number(id));
    //     this.disable = true;
    //     this.addMenu();
    //   } else if (action === 'edit') {
    //     this.updateId = id;
    //     this.updateMenuVisible = true;
    //   } else if (action === 'remove') {
    //     this.deleteDate(id);
    //   }
    // },
    handleCommand(command) {
  const [id, action, extraId] = command.split('#');
  if (action === 'add') {
    const arr = id === '0' ? [] : id.split(',').map(Number); // 假设 id 是 parentIds
    this.parentId = [...arr, Number(extraId)];
    this.disable = true;
    this.addMenu();
  } else if (action === 'edit') {
    this.updateId = id;
    this.updateMenuVisible = true;
  } else if (action === 'remove') {
    this.deleteDate(id);
  }
},
    deleteDate(id) {
      this.$confirm('确定删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        removeMenu({ id }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('删除成功！');
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
      }).catch(() => {});
    },
  },
  mounted() {
    this.query();
  },
}
</script>

<style scoped>
._menu {
  width: 100%;
}

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
  transition: all 0.3s ease;
}

.el-table .custom-row:hover {
  background-color: #f9f9ff !important;
  transform: scale(1.01);
}

.custom-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  padding: 8px 0;
  animation: dropdownFade 0.2s ease-in-out;
}

.dropdown-item {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #555;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: linear-gradient(90deg, #ECE9F4, #F3F0FF);
  color: #4A2B90;
  transform: translateX(5px);
}

.dropdown-item i {
  margin-right: 8px;
  font-size: 16px;
  color: #4A2B90;
}

.expand-icon {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.expand-icon:hover {
  color: #4A2B90;
  transform: scale(1.2);
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rowExpand {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
}

.text-ellipsis {
  display: block;
  white-space: normal;
  word-break: break-all;
  line-height: 1.5;
  color: #555;
}
</style>