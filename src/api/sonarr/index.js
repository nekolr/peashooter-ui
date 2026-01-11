import { defAxios as request } from '@/utils/http'

export function getSeriesNameList() {
  return request({
    url: '/api/sonarr/seriesNameList',
    method: 'get',
  })
}

export function refreshSeriesNameList() {
  return request({
    url: '/api/sonarr/refreshSeriesNameList',
    method: 'get',
  })
}

export function syncSeriesNameList() {
  return request({
    url: '/api/sonarr/syncSeriesNameList',
    method: 'get',
    timeout: 360000
  })
}

export function setupAllGroupIndexer() {
  return request({
    url: '/api/sonarr/setupAllGroupIndexer',
    method: 'post',
  })
}
