<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

html, body, #app, .common-layout {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Noto Sans SC', sans-serif;
}

.xiaoshi {
  display: none;
}

/* 隐藏默认滚动条 */
body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #e4e4e4;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #A8E6CF; /* 浅绿色滑块 */
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #7CC4A8;
}

/* 分页样式 */
.el-pagination {
  padding: 10px 0 !important;
  display: flex;
  justify-content: flex-end;
  background: #FFFFFF;
  border-radius: 8px;
}

/* 对话框样式 */
.el-dialog__wrapper {
  .el-dialog {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
}

.el-dialog__title {
  font-size: 16px !important;
  font-weight: 700;
  color: #2D3748;
}

.el-dialog__header {
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 10px;
}

/* 全局动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>