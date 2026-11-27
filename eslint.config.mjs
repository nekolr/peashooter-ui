import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'public/**', 'stats.html', 'auto-imports.d.ts', 'components.d.ts'],
  },
  ...pluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'vue/valid-template-root': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', '401', '404', 'Tags'],
        },
      ],
    },
  },
]
