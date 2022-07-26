import { defAxios as request } from '@/utils/http'

export function setBasic(data = {}) {
  return request({
    url: '/api/settings/basic',
    method: 'post',
    data,
  })
}

export function setHttpProxy(data = {}) {
  return request({
    url: '/api/settings/proxy',
    method: 'post',
    data,
  })
}

export function setSonarr(data = {}) {
  return request({
    url: '/api/settings/sonarr',
    method: 'post',
    data,
  })
}

export function testSonarr() {
  return request({
    url: '/api/settings/test-sonarr',
    method: 'get',
  })
}

export function setQBittorrent(data = {}) {
  return request({
    url: '/api/settings/qBittorrent',
    method: 'post',
    data,
  })
}

export function testQBittorrent() {
  return request({
    url: '/api/settings/test-qb',
    method: 'get',
  })
}

export function setTheMovieDb(data = {}) {
  return request({
    url: '/api/settings/themoviedb',
    method: 'post',
    data,
  })
}

export function getSettings() {
  return request({
    url: '/api/settings/get',
    method: 'get',
  })
}

export function refreshApiKey() {
  return request({
    url: '/api/settings/basic/refreshApiKey',
    method: 'post',
  })
}
