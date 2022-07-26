<template>
  <div class="login-bg" f-c-c h-full>
    <div class="login-wrapper" flex w-full max-w-520>
      <div p-50 w-full f-c-c flex-col>
        <h5 f-c-c w-full text-24 font-normal color="#6a6a6a">
          <!-- <icon-custom-logo mr30 text-50 /> -->
          {{ title }}
        </h5>
        <div mt-30 w-full max-w-360>
          <n-input
            v-model:value="loginInfo.username"
            autofocus
            class="text-16 items-center h-50 pl-10"
            placeholder="请输入用户名">
          </n-input>
        </div>
        <div mt-30 w-full max-w-360>
          <n-input
            v-model:value="loginInfo.password"
            class="text-16 items-center h-50 pl-10"
            type="password"
            show-password-on="mousedown"
            placeholder="请输入密码"
            @keydown.enter="handleLogin" />
        </div>
        <div mt-30 w-full max-w-360>
          <n-button w-full h-50 rounded-5 text-16 type="primary" @click="handleLogin">登录</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { login } from '@/api/auth'
import { setToken } from '@/utils/token'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const title = import.meta.env.VITE_APP_TITLE

const router = useRouter()
const { query } = useRoute()

const loginInfo = ref({
  username: '',
  password: '',
})

async function handleLogin() {
  const { username, password } = loginInfo.value
  if (!username || !password) {
    $message.warning('请输入用户名和密码')
    return
  }
  try {
    $message.loading('正在验证...')
    const res = await login({ username, password: password.toString() })
    if (res.success) {
      $message.success('登录成功')
      setToken(res.data.token)
      userStore.setUserInfo({ username: res.data.user.username })
      if (query.redirect) {
        const path = query.redirect
        Reflect.deleteProperty(query, 'redirect')
        router.push({ path, query })
      } else {
        router.push('/')
      }
    } else {
      $message.warning(res.msg)
    }
  } catch (error) {
    $message.error(error.message)
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  box-shadow: 1.5px 3.99px 27px 0px rgb(0 0 0 / 10%);
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
