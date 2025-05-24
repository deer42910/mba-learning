<template>
  <el-header class="header">
    <div class="icon-div" @click="changeCollapse">
      <i class="icon" :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>
    <div class="header-right">
      <div class="sheep-container">
        <template v-for="i in 12">
          <div
            :key="'sheep1-' + i"
            class="sheep sheep1"
            v-if="i % 2 !== 0"
            :style="{ animationDelay: `${i * 1}s` }"
          ></div>
          <div
            :key="'sheep2-' + i"
            class="sheep sheep2"
            v-else
            :style="{ animationDelay: `${i * 1}s` }"
          ></div>
        </template>
      </div>
      <div class="icon-div" @click="full">
        <i class="icon el-icon-full-screen"></i>
      </div>
      <div class="icon-div">
        <i class="icon el-icon-bell"></i>
      </div>
      <div class="icon-div avatar-container">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <img
              class="avatar-img"
              :src="user.avatar"
              alt="User Avatar"
            />
          </span>
          <el-dropdown-menu slot="dropdown" class="dropdown-menu">
            <el-dropdown-item command="password">
              <i class="el-icon-ship"></i> 修改密码
            </el-dropdown-item>
            <el-dropdown-item command="lock">
              <i class="el-icon-lock"></i> 锁屏
            </el-dropdown-item>
            <el-dropdown-item divided command="logout" class="logout-item">
              <i class="el-icon-umbrella"></i> 退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="icon-div username-container">
        <div class="username">{{ user.userName }}</div>
      </div>
    </div>
  </el-header>
</template>

<script>
import { removeToken } from '@/utils/token';
import { getLock } from '@/utils/lock';
import { mapState, mapGetters } from 'vuex';
import { logout } from '@/api/api';

export default {
  name: 'Header',
  data() {
    return {
      user: {
        avatar: '/img/avatar.jpg',
      },
      search: '',
      collapse: false,
    };
  },
  computed: {
    ...mapGetters('user', ['getUser']),
  },
  methods: {
    changeCollapse() {
      this.collapse = !this.collapse;
      this.$bus.$emit('collapse', this.collapse);
    },
    full() {
      let de = document.documentElement;
      if (de.requestFullscreen) {
        de.requestFullscreen();
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
      }
    },
    handleCommand(command) {
      if (command === 'password') {
        this.$bus.$emit('password', true);
      } else if (command === 'lock') {
        this.$bus.$emit('lock', 1);
      } else if (command === 'logout') {
        logout().then((res) => {
          if (res.code === 1000) {
            this.$store.commit('user/setToken', '');
            this.$store.commit('user/setUser', '');
            this.$store.commit('menu/setMenus', []);
            this.$store.commit('menu/setRoutes', []);
            this.$store.commit('menu/setDisplayMenus', []);
            this.$store.commit('menu/setBtnMenus', []);
            this.$store.commit('menu/setFlag', false);
            this.$store.commit('menu/setActiveMenuArrary', []);
            this.$store.commit('menu/setActiveMenu', '/index');
            removeToken();
            this.$router.push('/login');
            this.$message({
              message: '退出登陆',
              type: 'success',
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
            });
          }
        });
      }
    },
  },
  mounted() {
    this.user = JSON.parse(this.getUser);
  },
};
</script>

<style scoped lang="scss">
.header {
  background-color: #ffffff;
  width: 100%;
  height: 60px !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon-div {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.icon-div:hover {
  background-color: #A8E6CF;
  color: #2D3748;
}

.icon {
  font-size: 20px;
  color: #2D3748;
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex: 1; /* 占满剩余空间 */
  justify-content: flex-end;
}

.sheep-container {
  flex: 1; /* 占满剩余空间 */
  height: 40px;
  position: relative;
  overflow: hidden;
  background: #E0F2F1;
  border-radius: 8px;
  border: 1px solid #A8E6CF;
  box-shadow: inset 0 0 8px rgba(168, 230, 207, 0.3);
}

.sheep {
  width: 40px;
  height: 40px;
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.sheep1 {
  background-image: url('../../assets/image/sheep1.png');
  animation: walkingSheep 12s infinite linear;
}

.sheep2 {
  background-image: url('../../assets/image/sheep2.png');
  animation: walkingSheep 12s infinite linear;
}

@keyframes walkingSheep {
  0% {
    left: -40px;
    transform: scaleX(1);
  }
  49% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(-1);
  }
  99% {
    transform: scaleX(-1);
  }
  100% {
    left: calc(100% + 40px);
    transform: scaleX(1);
  }
}

.avatar-container {
  position: relative;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid #A8E6CF;
}

.avatar-img:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dropdown-menu {
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dropdown-menu >>> .el-dropdown-menu__item {
  color: #2D3748;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-menu >>> .el-dropdown-menu__item:hover {
  background-color: #A8E6CF;
  color: #2D3748;
}

.logout-item {
  color: #EF4444 !important;
}

.logout-item:hover {
  background-color: #FECACA !important;
  color: #B91C1C !important;
}

.username-container {
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.username {
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
  color: #2D3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>