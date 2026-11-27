import path from 'path'

const httpsReg = /^https:\/\//

export function wrapperEnv(envOptions) {
  if (!envOptions) return {}
  const ret = {}

  for (const key in envOptions) {
    let val = envOptions[key]
    if (['true', 'false'].includes(val)) {
      val = val === 'true'
    }
    if (['VITE_PORT'].includes(key)) {
      val = +val
    }
    if (key === 'VITE_PROXY' && val && typeof val === 'string') {
      try {
        val = JSON.parse(val.replace(/'/g, '"'))
      } catch (error) {
        val = ''
      }
    }
    ret[key] = val
    if (typeof val === 'string') {
      process.env[key] = val
    } else if (typeof val === 'object') {
      process.env[key] = JSON.stringify(val)
    }
  }
  return ret
}

export function createProxy(list = []) {
  const ret = {}
  for (const [prefix, target] of list) {
    const isHttps = httpsReg.test(target)

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return ret
}

export function getRootPath(...dir) {
  return path.resolve(process.cwd(), ...dir)
}
