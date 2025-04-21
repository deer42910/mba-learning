<template>
  <el-header class="header">
    <div class="icon-div" @click="changeCollapse">
      <i class="icon" :class="collapse ? 'el-icon-s-unfold':'el-icon-s-fold'"></i>
    </div>
    <div class="header-right">
      <div class="sheep-container">
        <template v-for="i in 6">
          <div :key="'sheep1-'+i" class="sheep sheep1" v-if="i % 2 !== 0" :style="{ animationDelay: `${i * 2}s` }"></div>
          <div :key="'sheep2-'+i" class="sheep sheep2" v-else :style="{ animationDelay: `${i * 2}s` }"></div>
        </template>
      </div>
      <div class="icon-div" @click="full">
        <i class="icon el-icon-full-screen"></i>
      </div>
      <div class="icon-div">
        <i class="icon el-icon-bell"></i>
      </div>
      <div class="icon-div">
        <div>
          <el-dropdown  trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <img style="width:40px;height:40px;border-radius:50%;object-fit: cover;" :src="user.avatar"></img>
            </span>
            <el-dropdown-menu slot="dropdown" style="font-weight:bold">
              <el-dropdown-item command="password"><i class="el-icon-ship" ></i>修改密码</el-dropdown-item>
              <!-- <el-dropdown-item command="setting"><i class="el-icon-setting" ></i>设置</el-dropdown-item> -->
              <el-dropdown-item command="lock"><i class="el-icon-lock" ></i>锁屏</el-dropdown-item>
              <el-dropdown-item divided style="color:red" command="logout"><i class="el-icon-umbrella"></i>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="icon-div" style="width:80px;">
        <div style="font-size:13px;font-family:'黑体'">{{user.userName}}</div>
      </div>
    </div>
  </el-header>
</template>

<style scoped>
    .header {
      background-color: #ffffff;
      width: 100%;
      height: 50px !important;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 0;
      justify-content: space-between;
    }
    .icon-div {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .icon {
      font-size: 20px;
    }
    .header-right {
      width: 43%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-input {
      background-color: #E0E0EA !important;
    }

.sheep-container {
  width: 80%;  /* 增加宽度 */
  height: 40px;
  position: relative;
  overflow: hidden;
  background: #E0E0EA;
  border-radius: 4px;
  margin-right: 20px;  /* 添加右边距 */
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
  100% {
    left: calc(100% + 40px);
    transform: scaleX(1);
  }
}
</style>

<script>
  import { removeToken } from '@/utils/token'
  import { getLock } from '@/utils/lock'
  import { mapState,mapGetters } from 'vuex'
  import { logout } from '@/api/api'
  export default {
    name: "header",
    data() {
      return{
        user: {
          avatar: "/img/avatar.jpg"
        },
        search: "",
        collapse: false,
      }
    },
    computed: {
      ...mapGetters('user',['getUser'])
    },
    methods: {
      changeCollapse() {
        this.collapse = !this.collapse
        this.$bus.$emit('collapse', this.collapse)
      },
      full() {
        let de = document.documentElement
        if (de.requestFullscreen) {
          de.requestFullscreen()
        } else if (de.mozRequestFullScreen) {
          de.mozRequestFullScreen()
        } else if (de.webkitRequestFullScreen) {
          de.webkitRequestFullScreen()
        }
      },
      handleCommand(command) {
        if(command == "center") {

        } else if(command == "password") {
          //修改密码
          this.$bus.$emit('password', true)
        } else if(command == "setting") {

        } else if(command == "lock") {
          this.$bus.$emit('lock', 1)
        } else if(command == "logout") {
          //退出登陆
          logout().then(res => { 
            if(res.code == 1000) {
              this.$store.commit('user/setToken', "")
              this.$store.commit('user/setUser', "")
              this.$store.commit('menu/setMenus', [])
              this.$store.commit('menu/setRoutes', [])
              this.$store.commit('menu/setDisplayMenus', [])
              this.$store.commit('menu/setBtnMenus', [])
              this.$store.commit("menu/setFlag",false)
              this.$store.commit('menu/setActiveMenuArrary', [])
              this.$store.commit('menu/setActiveMenu', "/index")
              removeToken()
              this.$router.push("/login")
              this.$message({
                  message: "退出登陆",
                  type: 'success'
              });
              setTimeout(function(){
                window.location.reload()
              },1000)
            } else {
              this.$message({
                  message: res.message,
                  type: 'warning'
              });
            }
          })
        }
      },
      
    },
    created() {
     
    },
    mounted() {
      this.user = JSON.parse(this.getUser)
    }
 }
</script>
