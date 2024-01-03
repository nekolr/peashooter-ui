<template>
  <div p-5>
    <n-card>
      <div ml-10>
        <n-form ref="searchFormRef" inline :model="searchModel" label-placement="left" label-width="auto"
          :show-feedback="false" require-mark-placement="right-hanging" :size="size">
          <n-form-item label="分组名称">
            <n-input v-model:value="searchModel.groupName" placeholder="请输入分组名称" clearable />
          </n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSearchButtonClick"> 查询 </n-button>
            <n-button @click="handleResetSearch"> 重置 </n-button>
          </n-space>
        </n-form>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-space>
          <n-button type="warning" :loading="setupAllGroupIndexerLoading" @click="handleSetupAllGroupIndexer">
            发布所有分组的 RSS 索引
          </n-button>
          <n-button type="primary" @click="handleAddGroupClick"> 新增 </n-button>
        </n-space>
      </div>
      <n-data-table mt-10 remote :size="size" :loading="groupDataTableLoading" :scroll-x="1600" :data="groupTableData"
        :columns="groupColumns" :pagination="groupPagination" :row-key="(row) => row.id" striped />
    </n-card>
    <n-modal v-model:show="showModal" :auto-focus="false" style="width: 1920px" :mask-closable="false">
      <n-card p-20 :title="modalTitle" :bordered="false" size="medium" segmented role="dialog" aria-modal="true">
        <n-grid x-gap="60" :cols="5">
          <n-gi span="2">
            <n-form ref="saveGroupFormRef" :model="saveGroupModel" :rules="saveGroupRules" label-placement="left"
              label-width="auto" require-mark-placement="right-hanging" :size="size">
              <n-form-item style="display: none">
                <n-input-number v-model:value="saveGroupModel.id" :show-button="false" />
              </n-form-item>
              <n-form-item label="选择剧集" path="referenceId">
                <n-select v-model:value="saveGroupModel.referenceId" label-field="titleZhCN" filterable clearable
                  value-field="seriesId" :options="seriesOptions" @update:value="handleSeriesOptionChange" />
                &nbsp;
                <n-button :loading="refreshSeriesLoading" @click="handleRefreshSeries"> 刷新 </n-button>&nbsp;
                <n-button :loading="syncSeriesLatestLoading" @click="handleSyncSeriesLatest"> 重同步 </n-button>
              </n-form-item>
              <n-form-item label="选择数据源" path="dataSourceIds">
                <n-select v-model:value="saveGroupModel.dataSourceIds" label-field="name" multiple filterable clearable
                  value-field="id" :options="dataSourceOptions" />
              </n-form-item>
              <n-form-item label="分组名称" path="name">
                <n-input v-model:value="saveGroupModel.name" clearable placeholder="请输入名称" />
              </n-form-item>
              <n-form-item label="语言" path="language">
                <n-input v-model:value="saveGroupModel.language" clearable placeholder="请输入语言" />
              </n-form-item>
              <n-form-item label="质量" path="quality">
                <n-input v-model:value="saveGroupModel.quality" clearable placeholder="请输入质量" />
              </n-form-item>
              <n-card v-for="(item, index) in saveGroupModel.matchers" :key="index" :title="`匹配器${index + 1}`" closable
                @close="handleDeleteMatcher(index)">
                <n-form-item label="正则表达式" path="regexp" :show-feedback="false">
                  <n-input ref="regexpInput" v-model:value="item.regexp" type="textarea" :autosize="{
                    minRows: 1,
                    maxRows: 2,
                  }" clearable placeholder="请输入正则表达式" />
                </n-form-item>
                <div style="display: flex; justify-content: flex-end">
                  <n-button-group size="small">
                    <n-button secondary type="info" :data-index="`${index}`" @click="handleReplaceSelectedText">
                      替换选择文本为集数
                    </n-button>
                    <n-button secondary type="default" :data-index="`${index}`" @click="handleTestMatchResult">
                      测试匹配效果
                    </n-button>
                  </n-button-group>
                </div>

                <n-form-item label="偏移量" path="offset">
                  <n-input-number v-model:value="item.offset" placeholder="请输入偏移量" />
                </n-form-item>
                <n-form-item label="剧集偏移量" path="episodeOffset">
                  <n-input-number v-model:value="item.episodeOffset" placeholder="请输入剧集偏移量" />
                </n-form-item>
                <n-form-item label="季度" path="season">
                  <n-input-number v-model:value="item.season" placeholder="请输入季度" />
                </n-form-item>
              </n-card>
            </n-form>
            <div mt-10 style="display: flex; justify-content: flex-end">
              <n-space>
                <n-button type="success" @click="handleAddEmptyMatcher"> 添加匹配器 </n-button>
              </n-space>
            </div>
          </n-gi>
          <n-gi span="3">
            <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" :size="size">
              <n-form-item label="查看数据源">
                <n-select label-field="name" filterable clearable value-field="id" :options="dataSourceOptions"
                  @update:value="handleDataSourceOptionChange" />
              </n-form-item>
            </n-form>
            <n-data-table mt-10 :size="size" :loading="dataSourceTableLoading" :scroll-x="800" :data="dataSourceTableData"
              :columns="dataSourceTableColumns" :row-props="rowProps" :pagination="dataSourcePagination"
              :row-key="(row) => row.id" />
            <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="dropdownOptions"
              :show="showDropdown" :on-clickoutside="onClickOutside" @select="handleSelectDropdownOption" />
          </n-gi>
        </n-grid>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button type="default" @click="handleCancelSaveGroup"> 取消 </n-button>
              <n-button type="primary" :loading="saveGroupLoading" @click="handleSaveGroup"> 保存 </n-button>
            </n-space>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showMatchResultModal" preset="card" style="width: 1200px">
      <n-card :bordered="false" size="medium" aria-modal="true">
        <n-data-table :size="size" :scroll-x="800" :data="matchResultTableData" :columns="matchResultColumns"
          :row-key="(row) => row.id" />
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { h, ref } from 'vue'
import { NButton } from 'naive-ui'
import { getGroupList, saveGroup, getGroup, deleteGroup, refreshRss } from '@/api/group'
import { escape } from '@/utils/regex'
import { isWhitespace } from '@/utils/is'
import { getAllDataSource, getItemTitles, testRegexp } from '@/api/datasource'
import { getSeriesList, refreshSeriesList, syncSeriesLatest, setupAllGroupIndexer } from '@/api/sonarr'

const size = ref('medium')
const showModal = ref(false)
const saveGroupLoading = ref(false)
const refreshSeriesLoading = ref(false)
const syncSeriesLatestLoading = ref(false)
const dataSourceTableLoading = ref(false)
const modalTitle = ref('')
const saveGroupFormRef = ref()
const searchFormRef = ref()

const searchModel = ref({
  groupName: '',
  pageNo: 1,
  pageSize: 10,
})

const saveGroupModel = ref({
  id: null,
  name: '',
  referenceId: '',
  dataSourceIds: [],
  language: 'Chinese',
  quality: 'WEBDL-1080p',
  matchers: [
    {
      regexp: '',
      episodeOffset: 0,
      offset: 0,
      season: 1,
    },
  ],
})

const saveGroupRules = ref({
  referenceId: {
    required: true,
    message: '请选择剧集',
  },
  dataSourceIds: {
    required: true,
    message: '请选择数据源',
  },
  name: {
    required: true,
    message: '请输入名称',
  },
  language: {
    required: true,
    message: '请输入语言',
  },
  quality: {
    required: true,
    message: '请输入质量',
  },
})

const groupPagination = reactive({
  pageSizes: [10, 20, 30, 50],
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
  onChange: (page) => {
    groupPagination.page = page
    searchModel.value.pageNo = page
    initGroupTableData()
  },
  onUpdatePageSize: (pageSize) => {
    groupPagination.pageSize = pageSize
    groupPagination.page = 1
    searchModel.value.pageNo = 1
    searchModel.value.pageSize = pageSize
    initGroupTableData()
  },
})

const dataSourcePagination = reactive({
  pageSizes: [10],
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
})

onBeforeMount(() => {
  initGroupTableColumns()
  initGroupTableData()
  initSeriesOptions()
  initDataSourceOptions()
})

const groupDataTableLoading = ref(false)
const groupTableData = ref([])
const groupColumns = ref([])

async function initGroupTableData() {
  groupDataTableLoading.value = true
  try {
    const res = await getGroupList(searchModel.value)
    if (res.success) {
      groupTableData.value = res.data.content
      groupPagination.pageCount = res.data.totalPages
      groupPagination.itemCount = res.data.totalElements
    }
  } catch (error) {
    $message.error(error.message)
  }
  groupDataTableLoading.value = false
}

const seriesOptions = ref([])
const dataSourceOptions = ref([])

async function initSeriesOptions() {
  try {
    const res = await getSeriesList()
    if (res.success) {
      seriesOptions.value = res.data
    }
  } catch (error) {
    $message.error(error.message)
  }
}

async function initDataSourceOptions() {
  try {
    const res = await getAllDataSource()
    if (res.success) {
      dataSourceOptions.value = res.data
    }
  } catch (error) {
    $message.error(error.message)
  }
}

async function handleEditGroup(row) {
  if (row && row.id) {
    modalTitle.value = '修改分组'
    try {
      const res = await getGroup({ id: row.id })
      showModal.value = true
      if (res.success) {
        saveGroupModel.value = res.data
        for (let item of seriesOptions.value) {
          if (item.seriesId == res.data.referenceId) {
            currentSeries.value = item
          }
        }
      } else {
        $message.warning(res.msg)
      }
    } catch (error) {
      $message.error(error.message)
    }
  }
}

async function handleDeleteGroup(row) {
  if (row && row.id) {
    $dialog.confirm({
      content: '确定要删除吗？',
      title: '删除分组',
      confirm() {
        return new Promise((resolve, reject) => {
          deleteGroup({ id: row.id }).then((res) => {
            if (res.success) {
              $message.success('删除成功')
              resolve(true)
              initGroupTableData()
            } else {
              $message.warning(res.msg)
              reject()
            }
          })
        })
      },
    })
  }
}

async function handleRefreshRss(row) {
  if (row && row.id) {
    try {
      const res = await refreshRss({ id: row.id })
      if (res.success) {
        $message.success('RSS 刷新成功')
      } else {
        $message.warning(res.msg)
      }
    } catch (error) {
      $message.error(error.message)
    }
  }
}

function initGroupTableColumns() {
  groupColumns.value = [
    { title: 'ID', key: 'id', width: 30 },
    { title: '名称', key: 'name', width: 80 },
    { title: 'RSS 订阅地址', key: 'rssLink', width: 200, ellipsis: { tooltip: true } },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      align: 'center',
      fixed: 'right',
      render(row) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              ghost: true,
              style: 'margin-left: 15px;',
              onClick: () => handleEditGroup(row),
            },
            { default: () => '修改' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              ghost: true,
              style: 'margin-left: 15px;',
              onClick: () => handleDeleteGroup(row),
            },
            { default: () => '删除' }
          ),
          h(
            NButton,
            {
              size: 'small',
              ghost: true,
              type: 'success',
              style: 'margin-left: 15px;',
              onClick: () => handleRefreshRss(row),
            },
            {
              default: () => '刷新',
            }
          ),
        ]
      },
    },
  ]
}

const dataSourceTableColumns = ref([
  { title: '序号', key: 'id', width: 60 },
  { title: '标题', key: 'title' },
])

function handleAddGroupClick(e) {
  e.preventDefault()
  modalTitle.value = '添加分组'
  showModal.value = true
}

function handleSaveGroup(e) {
  e.preventDefault()
  saveGroupFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveGroupLoading.value = true
        const res = await saveGroup(saveGroupModel.value)
        if (res.success) {
          showModal.value = false
          resetSaveGroupModel()
          $message.success('保存成功')
          initGroupTableData()
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveGroupLoading.value = false
    }
  })
}

async function handleSearchButtonClick(e) {
  e.preventDefault()
  await initGroupTableData()
}

function handleResetSearch(e) {
  e.preventDefault()
  resetSearchModel()
  initGroupTableData()
}

function handleCancelSaveGroup(e) {
  e.preventDefault()
  showModal.value = false
  resetSaveGroupModel()
  dataSourceTableData.value = []
}

function resetSaveGroupModel() {
  saveGroupModel.value = {
    id: null,
    name: '',
    referenceId: '',
    dataSourceIds: [],
    language: 'Chinese',
    quality: 'WEBDL-1080p',
    matchers: [
      {
        regexp: '',
        episodeOffset: 0,
        offset: 0,
        season: 1,
      },
    ],
  }
}

function resetSearchModel() {
  searchModel.value = {
    groupName: '',
    pageNo: 1,
    pageSize: 10,
  }
}

async function handleRefreshSeries(e) {
  e.preventDefault()
  refreshSeriesLoading.value = true
  try {
    const res = await refreshSeriesList()
    if (res.success) {
      seriesOptions.value = res.data
      $message.success('刷新成功')
    } else {
      $message.warning('刷新失败')
    }
  } catch (error) {
    $message.error(error.message)
  }
  refreshSeriesLoading.value = false
}

async function handleSyncSeriesLatest(e) {
  e.preventDefault()

  $dialog.confirm({
    content: '确定要重同步吗？',
    title: '重同步剧集',
    confirm() {
      return new Promise((resolve, reject) => {
        resolve()
        syncSeriesLatestLoading.value = true
        syncSeriesLatest().then((res) => {
          if (res.success) {
            $message.success('同步成功')
          } else {
            $message.warning(res.msg)
            reject()
          }
          syncSeriesLatestLoading.value = false
        })
      })
    },
  })
}

const dataSourceTableData = ref([])

async function handleDataSourceOptionChange(value, option) {
  if (value && option) {
    dataSourceTableLoading.value = true
    try {
      const res = await getItemTitles({ id: value })
      if (res.success) {
        dataSourceTableData.value = res.data
      }
    } catch (error) {
      $message.error(error.message)
    }
    dataSourceTableLoading.value = false
  }
}

const dropdownOptions = [
  {
    label: () => h('span', { style: { color: 'blue' } }, '生成正则表达式'),
    key: 'genRegex',
  },
]

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)

/**
 * 右键选中的行
 */
const selectedRow = ref()

function handleSelectDropdownOption(key) {
  if (key == 'genRegex') {
    showDropdown.value = false
    let matchers = saveGroupModel.value.matchers
    let escapedTitle = escape(selectedRow.value.title)
    let firstMatcher = matchers[0]
    if (matchers.length == 1 && isWhitespace(firstMatcher.regexp)) {
      firstMatcher.regexp = escapedTitle
    } else {
      let matcher = {
        regexp: escapedTitle,
        episodeOffset: 0,
        offset: 0,
        season: 1,
      }
      matchers.push(matcher)
    }
  }
}

function onClickOutside() {
  showDropdown.value = false
  selectedRow.value = {}
}

const rowProps = (row) => {
  return {
    onContextmenu: (e) => {
      selectedRow.value = row
      e.preventDefault()
      showDropdown.value = false
      nextTick().then(() => {
        showDropdown.value = true
        x.value = e.clientX
        y.value = e.clientY
      })
    },
  }
}

function handleDeleteMatcher(index) {
  let matchers = saveGroupModel.value.matchers
  if (matchers.length == 1) {
    $message.warning('请保留至少一个匹配器')
  } else {
    saveGroupModel.value.matchers.splice(index, 1)
  }
}

function handleAddEmptyMatcher(e) {
  e.preventDefault()
  let matcher = {
    regexp: '',
    episodeOffset: 0,
    offset: 0,
    season: 1,
  }
  saveGroupModel.value.matchers.push(matcher)
}

const regexpInput = ref()

function handleReplaceSelectedText(e) {
  let target = e.target,
    index
  if (target.tagName === 'SPAN') {
    index = target.parentNode.dataset.index
  } else if (target.tagName === 'BUTTON') {
    index = target.dataset.index
  }
  nextTick(() => {
    let textareaEl = regexpInput.value[index].textareaElRef
    let start = textareaEl?.selectionStart
    let end = textareaEl?.selectionEnd
    if (start == end) {
      $message.warning('请选择正则表达式内的集数')
    } else {
      let matcher = saveGroupModel.value.matchers[index]
      matcher.regexp = replaceStr(matcher.regexp, start, end, '(?<episode>\\d+)')
      regexpInput.value[index]?.focus()
    }
  })
}

function replaceStr(str, start, end, newStr) {
  return str.substring(0, start) + newStr + str.substring(end)
}

const matchResultColumns = ref([
  { title: '序号', key: 'id', width: 60 },
  { title: '集数', key: 'episode', width: 60 },
  { title: '原标题', key: 'originTitle' },
  { title: '新标题', key: 'title' },
])

const showMatchResultModal = ref(false)
const matchResultTableData = ref([])

async function handleTestMatchResult(e) {
  let target = e.target
  let index
  if (target.tagName === 'SPAN') {
    index = target.parentNode.dataset.index
  } else if (target.tagName === 'BUTTON') {
    index = target.dataset.index
  }
  if (index) {
    showMatchResultModal.value = true
  }
  try {
    let data = {
      matcher: saveGroupModel.value.matchers[index],
      dataSourceIds: saveGroupModel.value.dataSourceIds,
      series: currentSeries.value.titleEn,
      quality: saveGroupModel.value.quality,
      language: saveGroupModel.value.language,
    }
    const res = await testRegexp(data)
    if (res.success) {
      matchResultTableData.value = res.data
    } else {
      $message.warning('测试失败')
    }
  } catch (error) {
    $message.error(error.message)
  }
}

const currentSeries = ref({})
function handleSeriesOptionChange(value, option) {
  currentSeries.value = option
}

const setupAllGroupIndexerLoading = ref(false)
async function handleSetupAllGroupIndexer(e) {
  e.preventDefault()
  setupAllGroupIndexerLoading.value = true
  try {
    const res = await setupAllGroupIndexer()
    if (res.success && res.data) {
      $message.success('发布成功')
    } else {
      $message.warning('发布失败')
    }
  } catch (error) {
    $message.error(error.message)
  }
  setupAllGroupIndexerLoading.value = false
}
</script>
