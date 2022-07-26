<template>
  <div p-5>
    <n-card>
      <div ml-10>
        <n-form
          ref="searchFormRef"
          inline
          :model="searchModel"
          label-placement="left"
          label-width="auto"
          :show-feedback="false"
          require-mark-placement="right-hanging"
          :size="size">
          <n-form-item label="数据源名称">
            <n-input v-model:value="searchModel.dataSourceName" placeholder="请输入数据源名称" clearable />
          </n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSearchButtonClick"> 查询 </n-button>
            <n-button @click="handleResetSearch"> 重置 </n-button>
          </n-space>
        </n-form>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="handleAddDataSourceClick"> 新增 </n-button>
      </div>
      <n-data-table
        mt-10
        remote
        :size="size"
        :loading="dataTableLoading"
        :scroll-x="1600"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        :row-key="(row) => row.id"
        striped />
    </n-card>
    <n-modal v-model:show="showModal" :mask-closable="false">
      <n-card
        p-20
        style="width: 750px"
        :title="modalTitle"
        :bordered="false"
        segmented
        size="huge"
        role="dialog"
        aria-modal="true">
        <n-form
          ref="saveDataSourceFormRef"
          :model="saveDataSourceModel"
          :rules="saveDataSourceRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          :size="size">
          <n-form-item style="display: none">
            <n-input-number v-model:value="saveDataSourceModel.id" :show-button="false" />
          </n-form-item>
          <n-form-item label="名称" path="name">
            <n-input v-model:value="saveDataSourceModel.name" placeholder="请输入名称" clearable />
          </n-form-item>
          <n-form-item label="来源链接" path="sourceUrl">
            <n-input v-model:value="saveDataSourceModel.sourceUrl" placeholder="请输入来源链接" clearable />
          </n-form-item>
          <n-form-item label="使用代理" path="useProxy">
            <n-switch v-model:value="saveDataSourceModel.useProxy" />
          </n-form-item>
          <n-form-item label="同步间隔" path="refreshSeconds">
            <n-input-number
              v-model:value="saveDataSourceModel.refreshSeconds"
              clearable
              :show-button="false"
              placeholder="请输入同步间隔">
              <template #suffix> 秒 </template>
            </n-input-number>
          </n-form-item>
        </n-form>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button type="default" @click="handleCancelSaveDataSource"> 取消 </n-button>
              <n-button type="primary" :loading="saveDataSourceLoading" @click="handleSaveDataSource"> 保存 </n-button>
            </n-space>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { NButton, NSwitch } from 'naive-ui'
import { getDataSourceList, saveDataSource, deleteDataSource, refreshRss } from '@/api/datasource'

const size = ref('medium')
const showModal = ref(false)
const modalTitle = ref('')
const saveDataSourceLoading = ref(false)
const saveDataSourceFormRef = ref()
const searchFormRef = ref()

const searchModel = ref({
  dataSourceName: '',
  pageNo: 1,
  pageSize: 10,
})

const saveDataSourceModel = ref({
  id: null,
  name: '',
  sourceUrl: '',
  useProxy: true,
  refreshSeconds: 600,
})

const saveDataSourceRules = ref({
  name: {
    required: true,
    message: '请输入名称',
  },
  sourceUrl: {
    required: true,
    message: '请输入来源链接',
  },
  refreshSeconds: {
    required: true,
    type: 'number',
    message: '请输入同步间隔',
  },
})

const pagination = reactive({
  pageSizes: [10, 20, 30, 50],
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
  onChange: (page) => {
    pagination.page = page
    searchModel.value.pageNo = page
    initTableData()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    searchModel.value.pageNo = 1
    searchModel.value.pageSize = pageSize
    initTableData()
  },
})

onBeforeMount(() => {
  initColumns()
  initTableData()
})

const dataTableLoading = ref(false)
const tableData = ref([])
const columns = ref([])

async function initTableData() {
  dataTableLoading.value = true
  try {
    const res = await getDataSourceList(searchModel.value)
    if (res.success) {
      tableData.value = res.data.content
      pagination.pageCount = res.data.totalPages
      pagination.itemCount = res.data.totalElements
    }
  } catch (error) {
    $message.error(error.message)
  }
  dataTableLoading.value = false
}

function handleEdit(row) {
  if (row && row.id) {
    modalTitle.value = '修改数据源'
    saveDataSourceModel.value = {
      id: row.id,
      name: row.name,
      sourceUrl: row.sourceUrl,
      useProxy: row.useProxy,
      refreshSeconds: row.refreshSeconds,
    }
    showModal.value = true
  }
}

async function handleDelete(row) {
  if (row && row.id) {
    $dialog.confirm({
      content: '确定要删除吗？',
      title: '删除数据源',
      confirm() {
        return new Promise((resolve, reject) => {
          deleteDataSource({ id: row.id }).then((res) => {
            if (res.success) {
              $message.success('删除成功')
              resolve(true)
              initTableData()
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

async function handleRefresh(row) {
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

function initColumns() {
  columns.value = [
    { title: 'ID', key: 'id', width: 30 },
    {
      title: '名称',
      key: 'name',
      width: 80,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '来源链接',
      key: 'sourceUrl',
      width: 200,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '是否使用代理',
      key: 'useProxy',
      width: 80,
      fixed: 'right',
      render(row) {
        return h(NSwitch, {
          size: 'small',
          value: row['useProxy'],
          defaultValue: row['useProxy'],
          disabled: true,
        })
      },
    },
    {
      title: '刷新间隔（秒）',
      key: 'refreshSeconds',
      width: 60,
    },
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
              onClick: () => handleEdit(row),
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
              onClick: () => handleDelete(row),
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
              onClick: () => handleRefresh(row),
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

function handleAddDataSourceClick(e) {
  e.preventDefault()
  modalTitle.value = '添加数据源'
  showModal.value = true
}

function handleSaveDataSource(e) {
  e.preventDefault()
  saveDataSourceFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        saveDataSourceLoading.value = true
        const res = await saveDataSource(saveDataSourceModel.value)
        if (res.success) {
          showModal.value = false
          resetSaveDataSourceModel()
          $message.success('保存成功')
          initTableData()
        } else {
          $message.warning(res.msg)
        }
      } catch (error) {
        $message.error(error.message)
      }
      saveDataSourceLoading.value = false
    }
  })
}

async function handleSearchButtonClick(e) {
  e.preventDefault()
  await initTableData()
}

async function handleResetSearch(e) {
  e.preventDefault()
  resetSearchModel()
  await initTableData()
}

function handleCancelSaveDataSource(e) {
  e.preventDefault()
  showModal.value = false
  resetSaveDataSourceModel()
}

function resetSaveDataSourceModel() {
  saveDataSourceModel.value = {
    id: null,
    name: '',
    sourceUrl: '',
    useProxy: true,
    refreshSeconds: 300,
  }
}

function resetSearchModel() {
  searchModel.value = {
    dataSourceName: '',
    pageNo: 1,
    pageSize: 10,
  }
}
</script>
