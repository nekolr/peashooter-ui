import { defAxios as request } from '@/utils/http'

export function getSeriesList() {
  return request({
    url: '/api/sonarr/series',
    method: 'get',
  })
}

export function refreshSeriesList() {
  return request({
    url: '/api/sonarr/refresh-series',
    method: 'get',
  })
}

export function syncSeriesLatest() {
  return request({
    url: '/api/sonarr/sync-series-latest',
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
