import { defAxios as request } from '@/utils/http'

export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  })
}

export function getUser() {
  return request({
    url: '/api/auth/userinfo',
    method: 'get',
  })
}
