import { defAxios as request } from '@/utils/http'

export function getGroupList(data = {}) {
  return request({
    url: '/api/group/getList',
    method: 'post',
    data,
  })
}

export function saveGroup(data = {}) {
  return request({
    url: '/api/group/save',
    method: 'post',
    data,
  })
}

export function getGroup(params = {}) {
  return request({
    url: '/api/group/getGroup',
    method: 'get',
    params,
  })
}

export function deleteGroup(params = {}) {
  return request({
    url: '/api/group/delete',
    method: 'post',
    params,
  })
}

export function refreshRss(params = {}) {
  return request({
    url: '/api/group/refreshRss',
    method: 'post',
    params,
  })
}
