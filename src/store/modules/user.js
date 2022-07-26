import { defineStore } from 'pinia'
import { getUser } from '@/api/auth'
import { removeToken } from '@/utils/token'
import { toLogin } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
    }
  },
  getters: {
    username() {
      return this.userInfo?.username
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await getUser()
        if (res.success) {
          this.userInfo = { username: res.data.username }
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      removeToken()
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
