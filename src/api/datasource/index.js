import { defAxios as request } from '@/utils/http'

export function getDataSourceList(data = {}) {
  return request({
    url: '/api/dataSource/getList',
    method: 'post',
    data,
  })
}

export function getAllDataSource() {
  return request({
    url: '/api/dataSource/getAll',
    method: 'get',
  })
}

export function saveDataSource(data = {}) {
  return request({
    url: '/api/dataSource/save',
    method: 'post',
    data,
  })
}

export function testRegexp(data = {}) {
  return request({
    url: '/api/dataSource/testRegexp',
    method: 'post',
    data,
  })
}

export function deleteDataSource(params = {}) {
  return request({
    url: '/api/dataSource/delete',
    method: 'post',
    params,
  })
}

export function refreshRss(params = {}) {
  return request({
    url: '/api/dataSource/refreshRss',
    method: 'post',
    params,
  })
}

export function getItemTitles(params = {}) {
  return request({
    url: '/api/dataSource/getItemTitles',
    method: 'get',
    params,
  })
}
