<template>
  <div p-5>
    <n-card>
      <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="基本设置">
          <n-form
            ref="basicFormRef"
            :model="basicModel"
            :rules="basicRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :size="size">
            <n-form-item label="映射地址" path="mappingUrl">
              <n-input v-model:value="basicModel.mappingUrl" placeholder="请输入映射地址" />
            </n-form-item>
            <n-form-item label="ApiKey" path="apiKey">
              <n-input v-model:value="basicModel.apiKey" placeholder="请输入 ApiKey" />
              <n-button @click="handleCopyApiKey">
                <template #icon>
                  <n-icon>
                    <IconAntDesign:copy-filled />
                  </n-icon>
                </template>
                复制
              </n-button>
              <n-button :loading="refreshApiKeyLoading" @click="handleRefreshApiKey"> 刷新 </n-button>
            </n-form-item>
            <n-divider />
            <div style="display: flex; justify-content: flex-end">
              <n-button type="primary" :loading="saveBasicLoading" @click="handleSaveBasic"> 保存 </n-button>
            </div>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="代理设置">
          <n-form
            ref="httpProxyFormRef"
            :model="httpProxyModel"
            :rules="httpProxyRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :size="size">
            <n-form-item label="IP 地址" path="ip">
              <n-input v-model:value="httpProxyModel.ip" placeholder="请输入 IP 地址" />
            </n-form-item>
            <n-form-item label="端口号" path="port">
              <n-input-number
                v-model:value="httpProxyModel.port"
                :show-button="showNumberInputButton"
                placeholder="请输入端口号" />
            </n-form-item>
            <n-divider />
            <div style="display: flex; justify-content: flex-end">
              <n-space>
                <n-button :loading="saveHttpProxyLoading" type="primary" @click="handleSaveHttpProxy"> 保存 </n-button>
              </n-space>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <n-card>
      <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="sonarr 设置">
          <n-form
            ref="sonarrFormRef"
            :model="sonarrModel"
            :rules="sonarrRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :size="size">
            <n-form-item label="地址" path="url">
              <n-input v-model:value="sonarrModel.url" placeholder="请输入地址" />
            </n-form-item>
            <n-form-item label="ApiKey" path="apiKey">
              <n-input v-model:value="sonarrModel.apiKey" placeholder="请输入 ApiKey" />
            </n-form-item>
            <n-form-item label="同步间隔" path="syncSeconds">
              <n-input-number
                v-model:value="sonarrModel.syncSeconds"
                :show-button="showNumberInputButton"
                placeholder="请输入同步间隔">
                <template #suffix> 秒 </template>
              </n-input-number>
            </n-form-item>
            <n-divider />
            <div style="display: flex; justify-content: flex-end">
              <n-space>
                <n-button :loading="testSonarrLoading" @click="handleTestSonarr"> 测试 </n-button>
                <n-button type="primary" :loading="saveSonarrLoading" @click="handleSaveSonarr"> 保存 </n-button>
              </n-space>
            </div>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="qbittorrent 设置">
          <n-form
            ref="qBittorrentFormRef"
            :model="qBittorrentModel"
            :rules="qBittorrentRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :size="size">
            <n-form-item label="地址" path="url">
              <n-input v-model:value="qBittorrentModel.url" placeholder="请输入地址" />
            </n-form-item>
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="qBittorrentModel.username" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input v-model:value="qBittorrentModel.password" type="password" placeholder="请输入密码" />
            </n-form-item>
            <n-divider />
            <div style="display: flex; justify-content: flex-end">
              <n-space>
                <n-button :loading="testQBittorrentLoading" @click="handleTestQBittorrent"> 测试 </n-button>
                <n-button type="primary" :loading="saveQBittorrentLoading" @click="handleSaveQBittorrent">
                  保存
                </n-button>
              </n-space>
            </div>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="themoviedb 设置">
          <n-form
            ref="theMovieDbFormRef"
            :model="theMovieDbModel"
            :rules="theMovieDbRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :size="size">
            <n-form-item label="ApiKey" path="apiKey">
              <n-input v-model:value="theMovieDbModel.apiKey" placeholder="请输入 ApiKey" />
            </n-form-item>
            <n-form-item label="使用代理" path="useProxy">
              <n-switch v-model:value="theMovieDbModel.useProxy" />
            </n-form-item>
            <n-divider />
            <div style="display: flex; justify-content: flex-end">
              <n-space>
                <n-button :loading="saveTheMovieDbLoading" type="primary" @click="handleSaveTheMovieDb">
                  保存
                </n-button>
              </n-space>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import useClipboard from 'vue-clipboard3'
import {
  setBasic,
  setHttpProxy,
  setSonarr,
  testSonarr,
  setQBittorrent,
  testQBittorrent,
  setTheMovieDb,
  getSettings,
  refreshApiKey,
} from '@/api/settings'

const size = ref('medium')
const showNumberInputButton = ref(false)

const refreshApiKeyLoading = ref(false)
const saveBasicLoading = ref(false)
const saveHttpProxyLoading = ref(false)
const saveSonarrLoading = ref(false)
const testSonarrLoading = ref(false)
const saveQBittorrentLoading = ref(false)
const testQBittorrentLoading = ref(false)
const saveTheMovieDbLoading = ref(false)

const basicFormRef = ref()
const httpProxyFormRef = ref()
const sonarrFormRef = ref()
const qBittorrentFormRef = ref()
const theMovieDbFormRef = ref()

const basicModel = ref({
  mappingUrl: '',
  apiKey: '',
})

const httpProxyModel = ref({
  ip: '',
  port: null,
})

const sonarrModel = ref({
  url: '',
  apiKey: '',
  syncSeconds: null,
})

const qBittorrentModel = ref({
  url: '',
  username: '',
  password: '',
})

const theMovieDbModel = ref({
  apiKey: '',
  useProxy: true,
})

const basicRules = ref({
  mappingUrl: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入映射地址',
  },
  apiKey: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 ApiKey',
  },
})

const httpProxyRules = ref({
  ip: {
    required: false,
    trigger: ['blur', 'input'],
  },
  port: {
    required: false,
    type: 'number',
    trigger: ['blur', 'input'],
  },
})

const sonarrRules = ref({
  url: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入地址',
  },
  apiKey: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 ApiKey',
  },
  syncSeconds: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请输入同步间隔',
  },
})

const qBittorrentRules = ref({
  url: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入地址',
  },
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名',
  },
  password: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入密码',
  },
})

const theMovieDbRules = ref({
  apiKey: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 ApiKey',
  },
})

onBeforeMount(() => {
  initSettings()
})

async function initSettings() {
  const res = await getSettings()
  if (res.success) {
    basicModel.value = res.data.basic
    httpProxyModel.value = res.data.httpProxy
    sonarrModel.value = res.data.sonarr
    qBittorrentModel.value = res.data.qbittorrent
    theMovieDbModel.value = res.data.theMovieDb
  }
}

const { toClipboard } = useClipboard()

async function handleCopyApiKey(e) {
  e.preventDefault()
  try {
    await toClipboard(basicModel.value.apiKey)
    $message.success('复制成功')
  } catch (error) {
    $message.warning('复制失败')
  }
}

async function handleRefreshApiKey(e) {
  e.preventDefault()
  refreshApiKeyLoading.value = true
  try {
    const res = await refreshApiKey()
    if (res.success) {
      basicModel.value.apiKey = res.data
      $message.success('刷新成功')
    } else {
      $message.warning(res.msg)
    }
  } catch (error) {
    $message.error(error.message)
  }
  refreshApiKeyLoading.value = false
}

function handleSaveBasic(e) {
  e.preventDefault()
  basicFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveBasicLoading.value = true
        const res = await setBasic(basicModel.value)
        if (res.success) {
          $message.success('保存成功')
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveBasicLoading.value = false
    }
  })
}

function handleSaveHttpProxy(e) {
  e.preventDefault()
  httpProxyFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveHttpProxyLoading.value = true
        const res = await setHttpProxy(httpProxyModel.value)
        if (res.success) {
          $message.success('保存成功')
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveHttpProxyLoading.value = false
    }
  })
}

async function handleTestSonarr(e) {
  e.preventDefault()
  try {
    testSonarrLoading.value = true
    const res = await testSonarr()
    if (res.success && res.data) {
      $message.success('连接成功')
    } else {
      $message.warning('连接失败')
    }
  } catch (error) {
    $message.error(error.message)
  }
  testSonarrLoading.value = false
}

function handleSaveSonarr(e) {
  e.preventDefault()
  sonarrFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveSonarrLoading.value = true
        const res = await setSonarr(sonarrModel.value)
        if (res.success) {
          $message.success('保存成功')
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveSonarrLoading.value = false
    }
  })
}

async function handleTestQBittorrent(e) {
  e.preventDefault()
  try {
    testQBittorrentLoading.value = true
    const res = await testQBittorrent()
    if (res.success && res.data) {
      $message.success('连接成功')
    } else {
      $message.warning('连接失败')
    }
  } catch (error) {
    $message.error(error.message)
  }
  testQBittorrentLoading.value = false
}

function handleSaveQBittorrent(e) {
  e.preventDefault()
  qBittorrentFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveQBittorrentLoading.value = true
        const res = await setQBittorrent(qBittorrentModel.value)
        if (res.success) {
          $message.success('保存成功')
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveQBittorrentLoading.value = false
    }
  })
}

function handleSaveTheMovieDb(e) {
  e.preventDefault()
  theMovieDbFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveTheMovieDbLoading.value = true
        const res = await setTheMovieDb(theMovieDbModel.value)
        if (res.success) {
          $message.success('保存成功')
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveTheMovieDbLoading.value = false
    }
  })
}
</script>
