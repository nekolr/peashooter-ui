import vue from '@vitejs/plugin-vue'

/**
 * * unocss 插件，原子 css
 * https://github.com/antfu/unocss
 */
import Unocss from 'unocss/vite'

// rollup 打包分析插件
import visualizer from 'rollup-plugin-visualizer'

import { configHtmlPlugin } from './html'
import unplugin from './unplugin'

export function createVitePlugins(viteEnv, isBuild) {
  const plugins = [vue(), ...unplugin, configHtmlPlugin(viteEnv, isBuild), Unocss()]

  if (isBuild) {
    plugins.push(
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    )
  }

  return plugins
}
