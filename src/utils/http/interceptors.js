import { getToken } from '@/utils/token'
import { toLogin } from '@/utils/auth'
import { isNullOrUndef } from '@/utils/is'
import { isWithoutToken } from './helpers'
import { removeToken } from '@/utils/token'

export function reqResolve(config) {
  // 防止缓存，给 get 请求加上时间戳
  if (config.method === 'get') {
    config.params = { ...config.params, t: new Date().getTime() }
  }

  // 处理不需要 token 的请求
  if (isWithoutToken(config)) {
    return config
  }

  const token = getToken()
  if (!token) {
    toLogin()
    return Promise.reject({ code: 401, message: '未登录' })
  }

  config.headers.Authorization = config.headers.Authorization || 'Bearer ' + token

  return config
}

export function reqReject(error) {
  return Promise.reject(error)
}

export function repResolve(response) {
  return response?.data
}

export function repReject(error) {
  let code = error.response?.status
  let { message } = error.response?.msg || {}
  if (isNullOrUndef(code)) {
    // 未知错误
    code = 500
    message = '接口异常！'
  } else {
    switch (code) {
      case 400:
        message = message || '请求参数错误'
        break
      case 401:
        message = message || '登录已过期'
        removeToken()
        toLogin()
        break
      case 403:
        message = message || '没有权限'
        removeToken()
        toLogin()
        break
      case 404:
        message = message || '资源或接口不存在'
        break
      default:
        message = message || '未知异常'
        break
    }
  }
  return Promise.resolve({ success: code == 200, msg: message, error })
}
