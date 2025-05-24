<template>
  <div class="center">
    <el-card class="box-card">
      <div class="content">
        <!-- 左侧用户信息表单 -->
        <div class="master">
          <el-form
            :model="user"
            :rules="rules"
            ref="ruleForm"
            label-width="140px"
            style="margin-right: 20px"
          >
            <el-form-item label="登陆账号" prop="loginAccount">
              <el-input size="mini" v-model="user.loginAccount" disabled />
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input size="mini" v-model="user.userName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input size="mini" v-model="user.email" />
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input size="mini" v-model="user.tel" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="user.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="登陆IP" prop="loginIp">
              <el-input size="mini" v-model="user.loginIp" disabled />
            </el-form-item>
            <el-form-item label="登陆时间" prop="loginDate">
              <el-input size="mini" v-model="user.loginDate" disabled />
            </el-form-item>
            <el-form-item label="上次修改密码时间" prop="pwdUpdateDate">
              <el-input size="mini" v-model="user.pwdUpdateDate" disabled />
            </el-form-item>
          </el-form>
          <div class="submit">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="confirmSubmit"
            >
              保存
            </el-button>
          </div>
        </div>

        <!-- 右侧头像区域 -->
        <div class="slave">
          <div class="img">
            <el-image
              style="width: 300px; height: 300px; border-radius: 50%; object-fit: cover;"
              :src="user.avatar || defaultAvatar"
              :preview-src-list="avatar"
              alt="用户头像"
            />
          </div>
          <div class="btns">
            <el-upload
              ref="upload"
              :action="uploadAvatarUrl + '/' + user.id"
              :show-file-list="false"
              :multiple="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              accept="image/*"
            >
              <el-button
                size="mini"
                icon="el-icon-picture-outline-round"
                @click="showUploadTip"
              >
                修改头像
              </el-button>
            </el-upload>
            <el-button
              size="mini"
              icon="el-icon-key"
              style="margin-top: 15px;"
              @click="confirmChangePassword"
            >
              修改密码
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mixin } from "../../../minix";
import { getUser, setUserInfo, setUserAvatar } from '../../../api/api';

export default {
  name: 'UserProfile',
  mixins: [mixin],
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系电话'));
      }
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的联系电话'));
      }
      callback();
    };

    return {
      defaultAvatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fb4a87154-18b6-4163-ac80-f4dc4bf58d09%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693364028&t=c518c6c4a6ee2009b961f712a57c211f",
      user: {
        avatar: '',
        loginAccount: '',
        userName: '',
        email: '',
        tel: '',
        sex: '0',
        loginIp: '',
        loginDate: '',
        pwdUpdateDate: '',
        id: null,
      },
      avatar: [],
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        tel: [
          { required: true, validator: checkPhone, trigger: 'blur' },
        ],
      },
      uploadAvatarUrl: () => `${this.$store.state.configure.HOST}/user/avatar`,
    };
  },
  methods: {
    async getUserInfo() {
      try {
        const res = await getUser();
        if (res.code === 1000) {
          this.user = { ...res.data, sex: String(res.data.sex) };
          this.avatar = [this.$store.state.configure.HOST + this.user.avatar];
          this.setUser();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
          });
        }
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: '获取用户信息失败，请稍后重试',
        });
      }
    },
    setUser() {
      this.$store.commit('user/setUser', JSON.stringify(this.user));
    },
    confirmSubmit() {
      this.$confirm('确认保存用户信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        this.$refs.ruleForm.validate(async (valid) => {
          if (!valid) return;
          try {
            const res = await setUserInfo(this.user);
            if (res.code === 1000) {
              this.$message.success('保存成功!');
              await this.getUserInfo();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message,
              });
            }
          } catch (error) {
            this.$notify.error({
              title: '错误',
              message: '保存失败，请稍后重试',
            });
          }
        });
      }).catch(() => {
        this.$message.info('取消保存');
      });
    },
    showUploadTip() {
      this.$message.info('请选择图片文件（小于2MB，图片格式）');
    },
    confirmChangePassword() {
      this.$confirm('确认修改密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        this.$bus.$emit('password', true);
        this.$message.success('请在弹窗中输入新密码');
      }).catch(() => {
        this.$message.info('取消修改密码');
      });
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('上传头像只能是图片格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像大小不能超过 2MB!');
        return false;
      }
      return true;
    },
    async handleAvatarSuccess(res) {
      if (res.code === 1000) {
        this.$message.success('头像上传成功!');
        await this.getUserInfo();
      } else {
        this.$notify.error({
          title: '错误',
          message: res.message,
        });
      }
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7fafc;
}

.box-card {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: row;
  font-family: "Noto Sans SC", "黑体", sans-serif;
}

.master {
  width: 60%;
  padding: 20px;
  border-right: 1px solid #a8e6cf;
}

.submit {
  text-align: center;
  margin-top: 20px;
}

.slave {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.img {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btns {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.el-button {
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #a8e6cf;
  color: #2d3748;
  border-color: #a8e6cf;
}

.el-button:hover {
  background-color: #90d9b7;
  color: #2d3748;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.el-button.is-plain {
  background-color: transparent;
  color: #a8e6cf;
}

.el-button.is-plain:hover {
  background-color: #a8e6cf;
  color: #fff;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input__inner {
  border-radius: 8px;
  border: 1px solid #a8e6cf;
  font-family: "Noto Sans SC", "黑体", sans-serif;
  font-size: 14px;
  color: #2d3748;
}

.el-radio__inner {
  border-color: #a8e6cf;
}

.el-radio__inner::after {
  background-color: #a8e6cf;
}
</style>