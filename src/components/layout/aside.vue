<template>
    <el-aside :width="isCollapse ? '64px' : '240px'" class="aside-container">
      <div class="logo-container" :style="{ width: isCollapse ? '64px' : '240px' }">
        <img
          :src="require('@/assets/image/logo.png')"
          alt="MBA智学平台"
          class="logo-img"
          :class="{ 'logo-img-collapsed': isCollapse }"
        />
        <span class="logo-text" :class="{ xiaoshi: isCollapse }">
          MBA智学平台
        </span>
      </div>
      <el-menu
        @select="handleSelect"
        :collapse="isCollapse"
        :collapse-transition="false"
        class="el-menu-vertical"
        :unique-opened="true"
        background-color="#2D3748"
        text-color="#A8E6CF"
        :default-active="this.$route.path + '@' + this.$route.name"
        active-text-color="#FFFFFF"
      >
        <span v-for="(item, index) in displayMenus" :key="index">
          <el-menu-item
            v-if="item.menuType == 1"
            :index="item.routeUrl + '@' + item.menuName"
            class="menu-item"
          >
            <i :class="item.icon" class="menu-icon"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
          <el-submenu
            v-if="item.menuType == 0"
            :index="index + ''"
            class="submenu"
          >
            <template slot="title">
              <i :class="item.icon" class="menu-icon"></i>
              <span v-if="!isCollapse">{{ item.menuName }}</span>
            </template>
            <span v-for="(element, subscript) in item.child" :key="subscript">
              <el-submenu
                v-if="element.menuType == 0"
                :index="index + '-' + subscript"
              >
                <template slot="title">
                  <i :class="element.icon" class="menu-icon"></i>
                  <span>{{ element.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="(one, sub) in element.child"
                  v-if="one.menuType == 1"
                  :index="one.routeUrl + '@' + one.menuName"
                  class="menu-item"
                >
                  <i :class="one.icon" class="menu-icon"></i>
                  <span slot="title">{{ one.menuName }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-if="element.menuType == 1"
                :index="element.routeUrl + '@' + element.menuName"
                class="menu-item"
              >
                <i :class="element.icon" class="menu-icon"></i>
                <span slot="title">{{ element.menuName }}</span>
              </el-menu-item>
            </span>
          </el-submenu>
        </span>
      </el-menu>
    </el-aside>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'Aside',
    data() {
      return {
        isCollapse: false,
        textColor: '#A8E6CF',
      };
    },
    computed: {
      ...mapState({
        activeMenuArrary: (state) => state.menu.activeMenuArrary,
        displayMenus: (state) => state.menu.displayMenus,
      }),
    },
    methods: {
      handleSelect(key) {
        const [path, name] = key.split('@');
        this.$router.push({ path }).catch(() => {});
        this.$store.commit('menu/setActiveMenu', path);
        if (!this.activeMenuArrary.some((item) => item.url === path)) {
          this.$store.commit('menu/addActiveMenu', { name, url: path });
        }
      },
    },
    created() {
      this.$store.commit('menu/setActiveMenu', this.$route.path);
      if (!this.activeMenuArrary.some((item) => item.url === this.$route.path)) {
        this.$store.commit('menu/addActiveMenu', {
          name: this.$route.name || '未知页面',
          url: this.$route.path,
        });
      }
    },
    mounted() {
      this.$bus.$on('collapse', (res) => {
        this.isCollapse = res;
      });
      console.log('displayMenus:', this.displayMenus); // 调试菜单数据
    },
  };
  </script>
  
  <style scoped lang="scss">
  .aside-container {
    width: auto !important;
    background-color: #2D3748;
    transition: width 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    display: block !important;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background: linear-gradient(90deg, #A8E6CF, #7CC4A8);
    transition: width 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 增加阴影提升美观 */
  }
  
  .logo-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .logo-img:hover {
    transform: scale(1.2); /* 鼠标悬停放大 20% */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 悬停时添加阴影 */
  }
  
  .logo-img-collapsed {
    width: 28px;
    height: 28px;
    margin-right: 0;
  }
  
  .logo-text {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #2D3748;
    transition: opacity 0.3s ease;
    animation: floatAnimation 2.5s ease-in-out infinite; /* 文字浮动动画 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 文字阴影提升美观 */
  }
  
  @keyframes floatAnimation {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  .el-menu-vertical {
    height: calc(100vh - 60px);
    overflow-x: hidden;
    border-right: none !important;
    background-color: #2D3748;
  }
  
  .el-menu-vertical::-webkit-scrollbar,
  .aside-container::-webkit-scrollbar {
    width: 0;
  }
  
  .menu-item,
  .el-submenu__title {
    height: 48px !important;
    line-height: 48px !important;
    transition: all 0.3s ease;
  }
  
  .menu-item:hover,
  .el-submenu__title:hover {
    background-color: #A8E6CF !important;
    color: #2D3748 !important;
    box-shadow: inset 4px 0 #7CC4A8;
  }
  
  .menu-item.is-active {
    background-color: #7CC4A8 !important;
    color: #FFFFFF !important;
    box-shadow: inset 4px 0 #A8E6CF;
  }
  
  .el-submenu .el-menu-item,
  .el-submenu:deep(.el-submenu__title) {
    background-color: #2D3748 !important;
  }
  
  .menu-icon {
    margin-right: 10px;
    font-size: 18px;
  }
  
  .el-menu-item,
  .el-submenu__title {
    font-size: 15px;
    font-weight: 500;
  }
  </style>