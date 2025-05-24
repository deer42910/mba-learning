<template>
  <div>
    <el-dialog
      title="编辑菜单"
      width="50%"
      :destroy-on-close="true"
      :visible.sync="updateMenuVisible"
      :before-close="handleClose"
      custom-class="custom-dialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-cascader
                v-model="parentId"
                @change="handleChange"
                size="small"
                :options="dropData"
                :props="{ checkStrictly: true, value: 'id', label: 'menuName', children: 'children' }"
                placeholder="请选择上级菜单"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType" size="small" class="full-width-radio">
                <el-radio label="0">目录</el-radio>
                <el-radio label="1">菜单</el-radio>
                <el-radio label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != '2'" :span="24">
            <el-form-item label="菜单图标">
              <el-autocomplete
                size="small"
                popper-class="my-autocomplete"
                v-model="form.icon"
                :fetch-suggestions="querySearch"
                placeholder="请选择图标"
                style="width: 100%"
              >
                <template slot-scope="{ item }">
                  <div style="text-align: center; padding: 5px">
                    <i :class="item.value" style="font-size: 16px; margin-right: 8px"></i>
                    {{ item.value }}
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input
                v-model="form.menuName"
                size="small"
                placeholder="请输入菜单名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                size="small"
                :min="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != '0'" :span="24">
            <el-form-item label="权限字符" prop="perms">
              <el-input
                v-model="form.perms"
                size="small"
                placeholder="请输入权限字符"
                clearable
              >
                <el-tooltip slot="prefix" content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)">
                  <i class="el-icon-question" style="margin-top: 8px"></i>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != '2'" :span="24">
            <el-form-item label="路由地址" prop="routeUrl">
              <el-input
                v-model="form.routeUrl"
                size="small"
                placeholder="请输入路由地址"
                clearable
              >
                <el-tooltip slot="prefix" content="访问的路由地址，如：`user`，外网地址以`http(s)://`开头">
                  <i class="el-icon-question" style="margin-top: 8px"></i>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == '1'" :span="24">
            <el-form-item label="组件路径" prop="componentUrl">
              <el-input
                v-model="form.componentUrl"
                size="small"
                placeholder="请输入组件路径"
                clearable
              >
                <el-tooltip slot="prefix" content="访问的组件路径，如：`system/user/index`，默认在`views`目录下">
                  <i class="el-icon-question" style="margin-top: 8px"></i>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == '1'" :span="24">
            <el-form-item label="路由参数">
              <el-input
                v-model="form.param"
                size="small"
                placeholder="请输入路由参数"
                clearable
              >
                <el-tooltip slot="prefix" content="访问路由的默认传递参数">
                  <i class="el-icon-question" style="margin-top: 8px"></i>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != '2'" :span="24">
            <el-form-item label="是否外链" prop="target">
              <el-radio-group v-model="form.target" size="small" class="full-width-radio">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != '2'" :span="24">
            <el-form-item label="显示状态" prop="visible">
              <el-radio-group v-model="form.visible" size="small" class="full-width-radio">
                <el-radio label="0">显示</el-radio>
                <el-radio label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != '2'" :span="24">
            <el-form-item label="菜单状态" prop="status">
              <el-radio-group v-model="form.status" size="small" class="full-width-radio">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="handleClose"
          :style="{ borderRadius: '8px', transition: 'all 0.3s ease' }"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="submit"
          :style="{
            background: 'linear-gradient(90deg, #4A2B90, #6B46C1)',
            border: 'none',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            color: '#fff',
          }"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { editMenu, getMenuById } from '../../../api/api';

export default {
  data() {
    return {
      form: {
        id: null,
        idArrary: '',
        menuName: '',
        parentId: '',
        orderNum: 1,
        target: '1',
        routeUrl: '',
        componentUrl: '',
        param: '',
        menuType: '0',
        visible: '0',
        status: '0',
        perms: '',
        icon: '',
      },
      parentId: [],
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' },
        ],
        routeUrl: [
          {
            validator: (rule, value, callback) => {
              if (this.form.menuType !== '2' && !value) {
                callback(new Error('请输入路由地址'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        componentUrl: [
          {
            validator: (rule, value, callback) => {
              if (this.form.menuType === '1' && !value) {
                callback(new Error('请输入组件地址'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        perms: [
          {
            validator: (rule, value, callback) => {
              if (this.form.menuType !== '0' && !value) {
                callback(new Error('请输入权限标识'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      restaurants: [
        { value: 'el-icon-platform-eleme' },
        { value: 'el-icon-eleme' },
        { value: 'el-icon-delete-solid' },
        { value: 'el-icon-delete' },
        { value: 'el-icon-s-tools' },
        { value: 'el-icon-setting' },
        { value: 'el-icon-user-solid' },
        { value: 'el-icon-user' },
        { value: 'el-icon-phone' },
        { value: 'el-icon-phone-outline' },
        { value: 'el-icon-more' },
        { value: 'el-icon-more-outline' },
        { value: 'el-icon-star-on' },
        { value: 'el-icon-star-off' },
        { value: 'el-icon-s-goods' },
        { value: 'el-icon-goods' },
        { value: 'el-icon-warning' },
        { value: 'el-icon-warning-outline' },
        { value: 'el-icon-question' },
        { value: 'el-icon-info' },
        { value: 'el-icon-remove' },
        { value: 'el-icon-circle-plus' },
        { value: 'el-icon-success' },
        { value: 'el-icon-error' },
        { value: 'el-icon-zoom-in' },
        { value: 'el-icon-zoom-out' },
        { value: 'el-icon-remove-outline' },
        { value: 'el-icon-circle-plus-outline' },
        { value: 'el-icon-circle-check' },
        { value: 'el-icon-circle-close' },
        { value: 'el-icon-s-help' },
        { value: 'el-icon-help' },
        { value: 'el-icon-minus' },
        { value: 'el-icon-plus' },
        { value: 'el-icon-check' },
        { value: 'el-icon-close' },
        { value: 'el-icon-picture' },
        { value: 'el-icon-picture-outline' },
        { value: 'el-icon-picture-outline-round' },
        { value: 'el-icon-upload' },
        { value: 'el-icon-upload2' },
        { value: 'el-icon-download' },
        { value: 'el-icon-camera-solid' },
        { value: 'el-icon-camera' },
        { value: 'el-icon-video-camera-solid' },
        { value: 'el-icon-video-camera' },
        { value: 'el-icon-message-solid' },
        { value: 'el-icon-bell' },
        { value: 'el-icon-s-operation' },
        { value: 'el-icon-s-unfold' },
        { value: 'el-icon-s-fold' },
        { value: 'el-icon-s-platform' },
        { value: 'el-icon-s-order' },
        { value: 'el-icon-s-cooperation' },
        { value: 'el-icon-s-promotion' },
        { value: 'el-icon-s-home' },
        { value: 'el-icon-s-release' },
        { value: 'el-icon-s-ticket' },
        { value: 'el-icon-s-management' },
        { value: 'el-icon-s-open' },
        { value: 'el-icon-s-shop' },
        { value: 'el-icon-s-marketing' },
        { value: 'el-icon-s-flag' },
        { value: 'el-icon-s-comment' },
        { value: 'el-icon-s-finance' },
        { value: 'el-icon-s-claim' },
        { value: 'el-icon-s-custom' },
        { value: 'el-icon-s-opportunity' },
        { value: 'el-icon-s-data' },
        { value: 'el-icon-s-check' },
        { value: 'el-icon-s-grid' },
        { value: 'el-icon-menu' },
        { value: 'el-icon-share' },
        { value: 'el-icon-d-caret' },
        { value: 'el-icon-caret-left' },
        { value: 'el-icon-caret-right' },
        { value: 'el-icon-caret-bottom' },
        { value: 'el-icon-caret-top' },
        { value: 'el-icon-bottom-left' },
        { value: 'el-icon-bottom-right' },
        { value: 'el-icon-back' },
        { value: 'el-icon-right' },
        { value: 'el-icon-bottom' },
        { value: 'el-icon-top' },
        { value: 'el-icon-top-left' },
        { value: 'el-icon-top-right' },
        { value: 'el-icon-arrow-left' },
        { value: 'el-icon-arrow-right' },
        { value: 'el-icon-arrow-down' },
        { value: 'el-icon-arrow-up' },
        { value: 'el-icon-d-arrow-left' },
        { value: 'el-icon-d-arrow-right' },
        { value: 'el-icon-video-pause' },
        { value: 'el-icon-video-play' },
        { value: 'el-icon-refresh' },
        { value: 'el-icon-refresh-right' },
        { value: 'el-icon-refresh-left' },
        { value: 'el-icon-finished' },
        { value: 'el-icon-sort' },
        { value: 'el-icon-sort-up' },
        { value: 'el-icon-sort-down' },
        { value: 'el-icon-rank' },
        { value: 'el-icon-loading' },
        { value: 'el-icon-view' },
        { value: 'el-icon-c-scale-to-original' },
        { value: 'el-icon-date' },
        { value: 'el-icon-edit' },
        { value: 'el-icon-edit-outline' },
        { value: 'el-icon-folder' },
        { value: 'el-icon-folder-opened' },
        { value: 'el-icon-folder-add' },
        { value: 'el-icon-folder-remove' },
        { value: 'el-icon-folder-delete' },
        { value: 'el-icon-folder-checked' },
        { value: 'el-icon-tickets' },
        { value: 'el-icon-document-remove' },
        { value: 'el-icon-document-delete' },
        { value: 'el-icon-document-copy' },
        { value: 'el-icon-document-checked' },
        { value: 'el-icon-document' },
        { value: 'el-icon-document-add' },
        { value: 'el-icon-printer' },
        { value: 'el-icon-paperclip' },
        { value: 'el-icon-takeaway-box' },
        { value: 'el-icon-search' },
        { value: 'el-icon-monitor' },
        { value: 'el-icon-attract' },
        { value: 'el-icon-mobile' },
        { value: 'el-icon-scissors' },
        { value: 'el-icon-umbrella' },
        { value: 'el-icon-headset' },
        { value: 'el-icon-brush' },
        { value: 'el-icon-mouse' },
        { value: 'el-icon-coordinate' },
        { value: 'el-icon-magic-stick' },
        { value: 'el-icon-reading' },
        { value: 'el-icon-data-line' },
        { value: 'el-icon-data-board' },
        { value: 'el-icon-pie-chart' },
        { value: 'el-icon-data-analysis' },
        { value: 'el-icon-collection-tag' },
        { value: 'el-icon-film' },
        { value: 'el-icon-suitcase' },
        { value: 'el-icon-suitcase-1' },
        { value: 'el-icon-receiving' },
        { value: 'el-icon-collection' },
        { value: 'el-icon-files' },
        { value: 'el-icon-notebook-1' },
        { value: 'el-icon-notebook-2' },
        { value: 'el-icon-toilet-paper' },
        { value: 'el-icon-office-building' },
        { value: 'el-icon-school' },
        { value: 'el-icon-table-lamp' },
        { value: 'el-icon-house' },
        { value: 'el-icon-no-smoking' },
        { value: 'el-icon-smoking' },
        { value: 'el-icon-shopping-cart-full' },
        { value: 'el-icon-shopping-cart-1' },
        { value: 'el-icon-shopping-cart-2' },
        { value: 'el-icon-shopping-bag-1' },
        { value: 'el-icon-shopping-bag-2' },
        { value: 'el-icon-sold-out' },
        { value: 'el-icon-sell' },
        { value: 'el-icon-present' },
        { value: 'el-icon-box' },
        { value: 'el-icon-bank-card' },
        { value: 'el-icon-money' },
        { value: 'el-icon-coin' },
        { value: 'el-icon-wallet' },
        { value: 'el-icon-discount' },
        { value: 'el-icon-price-tag' },
        { value: 'el-icon-news' },
        { value: 'el-icon-guide' },
        { value: 'el-icon-male' },
        { value: 'el-icon-female' },
        { value: 'el-icon-thumb' },
        { value: 'el-icon-cpu' },
        { value: 'el-icon-link' },
        { value: 'el-icon-connection' },
        { value: 'el-icon-open' },
        { value: 'el-icon-turn-off' },
        { value: 'el-icon-set-up' },
        { value: 'el-icon-chat-round' },
        { value: 'el-icon-chat-line-round' },
        { value: 'el-icon-chat-square' },
        { value: 'el-icon-chat-dot-round' },
        { value: 'el-icon-chat-dot-square' },
        { value: 'el-icon-chat-line-square' },
        { value: 'el-icon-message' },
        { value: 'el-icon-postcard' },
        { value: 'el-icon-position' },
        { value: 'el-icon-turn-off-microphone' },
        { value: 'el-icon-microphone' },
        { value: 'el-icon-close-notification' },
        { value: 'el-icon-bangzhu' },
        { value: 'el-icon-time' },
        { value: 'el-icon-odometer' },
        { value: 'el-icon-crop' },
        { value: 'el-icon-aim' },
        { value: 'el-icon-switch-button' },
        { value: 'el-icon-full-screen' },
        { value: 'el-icon-copy-document' },
        { value: 'el-icon-mic' },
        { value: 'el-icon-stopwatch' },
        { value: 'el-icon-medal-1' },
        { value: 'el-icon-medal' },
        { value: 'el-icon-trophy' },
        { value: 'el-icon-trophy-1' },
        { value: 'el-icon-first-aid-kit' },
        { value: 'el-icon-discover' },
        { value: 'el-icon-place' },
        { value: 'el-icon-location' },
        { value: 'el-icon-location-outline' },
        { value: 'el-icon-location-information' },
        { value: 'el-icon-add-location' },
        { value: 'el-icon-delete-location' },
        { value: 'el-icon-map-location' },
        { value: 'el-icon-alarm-clock' },
        { value: 'el-icon-timer' },
        { value: 'el-icon-watch-1' },
        { value: 'el-icon-watch' },
        { value: 'el-icon-lock' },
        { value: 'el-icon-unlock' },
        { value: 'el-icon-key' },
        { value: 'el-icon-service' },
        { value: 'el-icon-mobile-phone' },
        { value: 'el-icon-bicycle' },
        { value: 'el-icon-truck' },
        { value: 'el-icon-ship' },
        { value: 'el-icon-basketball' },
        { value: 'el-icon-football' },
        { value: 'el-icon-soccer' },
        { value: 'el-icon-baseball' },
        { value: 'el-icon-wind-power' },
        { value: 'el-icon-light-rain' },
        { value: 'el-icon-lightning' },
        { value: 'el-icon-heavy-rain' },
        { value: 'el-icon-sunrise' },
        { value: 'el-icon-sunrise-1' },
        { value: 'el-icon-sunset' },
        { value: 'el-icon-sunny' },
        { value: 'el-icon-cloudy' },
        { value: 'el-icon-partly-cloudy' },
        { value: 'el-icon-cloudy-and-sunny' },
        { value: 'el-icon-moon' },
        { value: 'el-icon-moon-night' },
        { value: 'el-icon-dish' },
        { value: 'el-icon-dish-1' },
        { value: 'el-icon-food' },
        { value: 'el-icon-chicken' },
        { value: 'el-icon-fork-spoon' },
        { value: 'el-icon-knife-fork' },
        { value: 'el-icon-burger' },
        { value: 'el-icon-tableware' },
        { value: 'el-icon-sugar' },
        { value: 'el-icon-dessert' },
        { value: 'el-icon-ice-cream' },
        { value: 'el-icon-hot-water' },
        { value: 'el-icon-water-cup' },
        { value: 'el-icon-coffee-cup' },
        { value: 'el-icon-cold-drink' },
        { value: 'el-icon-goblet' },
        { value: 'el-icon-goblet-full' },
        { value: 'el-icon-goblet-square' },
        { value: 'el-icon-goblet-square-full' },
        { value: 'el-icon-refrigerator' },
        { value: 'el-icon-grape' },
        { value: 'el-icon-watermelon' },
        { value: 'el-icon-cherry' },
        { value: 'el-icon-apple' },
        { value: 'el-icon-pear' },
        { value: 'el-icon-orange' },
        { value: 'el-icon-coffee' },
        { value: 'el-icon-ice-tea' },
        { value: 'el-icon-ice-drink' },
        { value: 'el-icon-milk-tea' },
        { value: 'el-icon-potato-strips' },
        { value: 'el-icon-lollipop' },
        { value: 'el-icon-ice-cream-square' },
        { value: 'el-icon-ice-cream-round' },
      ],
    };
  },
  props: ['updateMenuVisible', 'dropData', 'updateId'],
  watch: {
    updateId(newVal) {
      if (newVal) {
        this.loadMenuData(newVal);
      }
    },
  },
  methods: {
    loadMenuData(id) {
      this.loading = true;
      getMenuById({ id }).then((res) => {
        this.loading = false;
        if (res.code === 1000) {
          const data = res.data;
          this.form = {
            id: data.id,
            idArrary: data.idArrary || '',
            menuName: data.menuName || '',
            parentId: data.parentId || '',
            orderNum: data.orderNum || 1,
            target: data.target || '1',
            routeUrl: data.routeUrl || '',
            componentUrl: data.componentUrl || '',
            param: data.param || '',
            menuType: data.menuType || '0',
            visible: data.visible || '0',
            status: data.status || '0',
            perms: data.perms || '',
            icon: data.icon || '',
          };
          this.parentId = data.idArrary ? data.idArrary.split(',').map(Number) : [];
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
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          editMenu(this.form).then((res) => {
            this.loading = false;
            if (res.code === 1000) {
              this.$notify.success({
                title: '成功',
                message: '保存成功',
                duration: 2000,
              });
              this.handleClose();
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
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$refs['ruleForm'].resetFields();
      this.form = {
        id: null,
        idArrary: '',
        menuName: '',
        parentId: '',
        orderNum: 1,
        target: '1',
        routeUrl: '',
        componentUrl: '',
        param: '',
        menuType: '0',
        visible: '0',
        status: '0',
        perms: '',
        icon: '',
      };
      this.parentId = [];
      this.$emit('updateMenuFalse');
    },
    querySearch(queryString, cb) {
      const results = queryString
        ? this.restaurants.filter(restaurant => restaurant.value.toLowerCase().includes(queryString.toLowerCase()))
        : this.restaurants;
      cb(results);
    },
    handleChange(value) {
      this.form.idArrary = '';
      if (value && value.length > 0) {
        this.form.idArrary = value.join(',');
        this.form.parentId = value[value.length - 1];
      } else {
        this.form.parentId = '0';
        this.form.idArrary = '0';
      }
    },
  },
}
</script>

<style scoped>
.custom-dialog {
  border-radius: 12px !important;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 6px 20px rgba(74, 43, 144, 0.2);
}

.custom-dialog .el-dialog__header {
  background: linear-gradient(90deg, #ECE9F4, #F3F0FF);
  border-bottom: 1px solid #e9ecef;
  border-radius: 12px 12px 0 0;
  padding: 15px 20px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-weight: bold;
  color: #4A2B90;
}

.custom-dialog .el-dialog__title {
  font-size: 16px;
}

.custom-dialog .el-dialog__body {
  padding: 20px 30px;
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #4A2B90;
  font-weight: 500;
  text-align: right;
}

.el-input,
.el-cascader,
.el-autocomplete,
.el-input-number,
.el-radio-group {
  transition: all 0.3s ease;
}

.el-input:hover,
.el-cascader:hover,
.el-autocomplete:hover,
.el-input-number:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 43, 144, 0.1);
}

.el-input .el-input__inner,
.el-cascader .el-input__inner,
.el-autocomplete .el-input__inner,
.el-input-number .el-input__inner {
  border-radius: 8px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #555;
}

.full-width-radio {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 10px 0;
}

.el-radio {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #555;
}

.dialog-footer {
  text-align: right;
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 0 0 12px 12px;
}

.el-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-button[type="primary"]:hover {
  background: linear-gradient(90deg, #5C3BA6, #7D5AD8) !important;
}
</style>