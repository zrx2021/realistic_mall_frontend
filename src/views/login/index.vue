<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.svg" alt="logo" class="logo" />
        <h1>电商管理后台</h1>
      </div>

      <a-tabs v-model:activeKey="activeKey" centered>
        <a-tab-pane key="account" tab="账号密码登录">
          <a-form
            :model="accountForm"
            @finish="handleAccountLogin"
            :rules="accountRules"
            class="login-form"
          >
            <a-form-item name="username">
              <a-input v-model:value="accountForm.username" placeholder="请输入用户名" size="large">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                v-model:value="accountForm.password"
                placeholder="请输入密码"
                size="large"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="phone" tab="手机号登录">
          <a-form
            :model="phoneForm"
            @finish="handlePhoneLogin"
            :rules="phoneRules"
            class="login-form"
          >
            <a-form-item name="phone">
              <a-input v-model:value="phoneForm.phone" placeholder="请输入手机号" size="large">
                <template #prefix>
                  <MobileOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="code">
              <div class="verify-code-input">
                <a-input v-model:value="phoneForm.code" placeholder="请输入验证码" size="large">
                  <template #prefix>
                    <SafetyOutlined />
                  </template>
                </a-input>
                <a-button :disabled="!!countdown" @click="handleSendCode" size="large">
                  {{ countdown ? `${countdown}s后重新获取` : '获取验证码' }}
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>

      <div class="login-options">
        <a-checkbox v-model:checked="rememberMe">3天内自动登录</a-checkbox>
        <a-button type="link" @click="handleForgotPassword">忘记密码？</a-button>
      </div>

      <a-button type="primary" size="large" :loading="loading" block @click="handleSubmit">
        登录
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoginView',
}
</script>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { login, phoneLogin, sendCode } from '@/api/user'
import {
  setToken,
  setUserInfo,
  getAutoLoginStatus,
  setAutoLoginStatus,
  getToken,
} from '@/utils/auth'
import type { LoginParams, PhoneLoginParams, UserInfo } from '@/types/user'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const activeKey = ref('account')
const rememberMe = ref(false)
const countdown = ref(0)

// 账号密码登录表单
const accountForm = reactive<LoginParams>({
  username: '',
  password: '',
})

// 手机号登录表单
const phoneForm = reactive<PhoneLoginParams>({
  phone: '',
  code: '',
})

// 账号密码登录验证规则
const accountRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名至少4个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
}

// 手机号登录验证规则
const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}

// 发送验证码
const handleSendCode = async () => {
  try {
    if (!phoneForm.phone) {
      message.error('请输入手机号')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
      message.error('请输入正确的手机号')
      return
    }

    const res = await sendCode({ phone: phoneForm.phone })
    if (res.code === 200) {
      message.success('验证码发送成功')
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      message.error(res.message || '验证码发送失败')
    }
  } catch (error) {
    message.error('验证码发送失败')
  }
}

// 账号密码登录
const handleAccountLogin = async () => {
  try {
    loading.value = true
    const res = await login(accountForm)
    const { token } = res
    handleLoginSuccess(token)
  } catch (error) {
    console.error('登录失败：', error)
    message.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 手机号登录
const handlePhoneLogin = async () => {
  try {
    loading.value = true
    const res = await phoneLogin(phoneForm)
    handleLoginSuccess(res.data)
  } catch (error) {
    console.error('登录失败：', error)
    message.error('登录失败，请检查手机号和验证码')
  } finally {
    loading.value = false
  }
}

// 处理登录成功
// const handleLoginSuccess = (data: { token: string; userInfo: UserInfo }) => {
const handleLoginSuccess = (token: string) => {
  // const { token, userInfo } = data
  setToken(token)
  // 暂时注释
  // setUserInfo(userInfo)

  if (rememberMe.value) {
    setAutoLoginStatus(3) // 设置3天自动登录
  }

  message.success('登录成功')

  // 获取重定向地址
  const redirect = route.query.redirect as string
  router.push(redirect || '/')
}

// 检查自动登录状态
onMounted(() => {
  const isAutoLogin = getAutoLoginStatus()
  if (isAutoLogin && getToken()) {
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  }
})

// 提交登录
const handleSubmit = () => {
  if (activeKey.value === 'account') {
    handleAccountLogin()
  } else {
    handlePhoneLogin()
  }
}

// 忘记密码
const handleForgotPassword = () => {
  // TODO: 实现忘记密码功能
  message.info('忘记密码功能开发中')
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  background-image: url('@/assets/background.jpg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.login-box {
  width: 368px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;

  .logo {
    width: 44px;
    height: 44px;
    margin-right: 16px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.login-form {
  margin-top: 24px;
}

.verify-code-input {
  display: flex;
  gap: 8px;

  .ant-input-affix-wrapper {
    flex: 1;
  }

  .ant-btn {
    width: 120px;
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
}
</style>
