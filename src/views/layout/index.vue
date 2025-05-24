<template>
  <div class="common-layout">
    <el-container v-show="lock == 0">
      <elAsside class="aside-wrapper" />
      <el-container>
        <el-header>
          <elHeader />
        </el-header>
        <div class="main-menu">
          <div class="scroll-left" @click="leftScroll()">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="menu" id="menu">
            <div
              class="menu-item"
              v-for="(item, index) in activeMenuArrary"
              :key="index"
              @click="openMenu(item.url)"
            >
              <span
                :class="{ active: item.url == activeMenu }"
                class="menu-name"
              >
                {{ item.name }}
              </span>
              <i
                v-if="item.url != '/index'"
                class="menu-icon el-icon-close"
                @click.stop="closeMenu(item.url)"
              ></i>
            </div>
          </div>
          <div class="scroll-right" @click="rightScroll()">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <el-main>
          <elMain />
        </el-main>
      </el-container>
    </el-container>
    <el-container v-show="lock == 1" class="lock-container">
      <div class="lock">
        <img
          class="lock-back"
          src="@/assets/image/lock-back.jpg"
          alt="Lock Background"
        />
        <div class="form">
          <div class="content">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              v-model="pass"
              size="medium"
              placeholder="请输入密码"
              class="lock-input"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-d-arrow-right"
              @click="unlock"
              class="unlock-btn"
            >
              解锁
            </el-button>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getLock, setLock } from '@/utils/lock';
import { verPassword } from '@/api/api';
import elAsside from '@/components/layout/aside';
import elMain from '@/components/layout/main';
import elHeader from '@/components/layout/header';

export default {
  name: 'Layout',
  data() {
    return {
      lock: 0,
      pass: '',
    };
  },
  components: {
    elAsside,
    elMain,
    elHeader,
  },
  computed: {
    ...mapState({
      activeMenuArrary: (state) => state.menu.activeMenuArrary,
      activeMenu: (state) => state.menu.activeMenu,
    }),
  },
  methods: {
    leftScroll() {
      const container = document.getElementById('menu');
      container.scrollBy({ left: -100, behavior: 'smooth' });
    },
    rightScroll() {
      const container = document.getElementById('menu');
      container.scrollBy({ left: 100, behavior: 'smooth' });
    },
    openMenu(url) {
      if (this.activeMenu !== url) {
        this.$router.push({ path: url }).catch(() => {});
        this.$store.commit('menu/setActiveMenu', url);
      }
    },
    closeMenu(url) {
      let index = this.activeMenuArrary.length - 1;
      for (let i = 0; i < this.activeMenuArrary.length; i++) {
        if (this.activeMenuArrary[i].url === url) {
          index = i;
          break;
        }
      }
      if (this.activeMenu === url && index > 0) {
        this.$router
          .push({ path: this.activeMenuArrary[index - 1].url })
          .catch(() => {});
        this.$store.commit(
          'menu/setActiveMenu',
          this.activeMenuArrary[index - 1].url
        );
      }
      this.$store.commit('menu/reduceActiveMenu', index);
      this.$bus.$emit('clearKeepAlive', url);
    },
    unlock() {
      if (!this.pass) {
        this.$message({
          message: '请输入密码验证',
          type: 'warning',
        });
        return;
      }
      verPassword({ password: this.pass }).then((res) => {
        if (res.code === 1000) {
          this.$message({
            message: '验证通过',
            type: 'success',
          });
          this.pass = '';
          this.$bus.$emit('lock', 0);
        } else {
          this.$message({
            message: res.message,
            type: 'error',
          });
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.lock = getLock();
      this.$bus.$on('lock', (res) => {
        setLock(res);
        this.lock = res;
      });
    });
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

.common-layout {
  height: 100vh;
  font-family: 'Noto Sans SC', sans-serif;
}

.common-layout >>> .el-menu-item {
  min-width: 0;
}

.aside-wrapper {
  /* 移除宽度限制，交给 aside.vue 控制 */
}

.main-menu {
  width: 100%;
  height: 32px;
  border-top: 1px solid #E2E8F0;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.menu {
  display: flex;
  align-items: center;
  height: 100%;
  width: calc(100% - 80px);
  overflow-x: auto;
  scroll-behavior: smooth;
}

.menu::-webkit-scrollbar {
  height: 4px;
}

.menu::-webkit-scrollbar-thumb {
  background-color: #A8E6CF;
  border-radius: 4px;
}

.scroll-left,
.scroll-right {
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #F7FAFC;
  transition: background-color 0.3s ease;
}

.scroll-left:hover,
.scroll-right:hover {
  background-color: #A8E6CF;
  color: #2D3748;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 100%;
  background-color: #F7FAFC;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.menu-item:hover {
  background-color: #A8E6CF;
  border-bottom: 2px solid #7CC4A8;
}

.menu-name {
  font-size: 14px;
  color: #2D3748;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active {
  color: #A8E6CF;
  font-weight: 700;
  border-bottom: 2px solid #A8E6CF;
}

.menu-icon {
  font-size: 14px;
  color: #6B7280;
  margin-left: 8px;
}

.menu-icon:hover {
  color: #2D3748;
}

.lock-container {
  background-color: #2D3748;
}

.lock {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lock-back {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  z-index: 1;
  opacity: 0.7;
}

.form {
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.content:hover {
  transform: translateY(-4px);
}

.lock-input {
  width: 200px;
  margin-right: 12px;
}

.lock-input >>> .el-input__inner {
  border-radius: 8px;
  border: 1px solid #A8E6CF;
}

.unlock-btn {
  background-color: #A8E6CF;
  border-color: #A8E6CF;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.unlock-btn:hover {
  background-color: #7CC4A8;
  border-color: #7CC4A8;
}
</style>