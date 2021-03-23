<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="card-margin">
      <div class="table-page-search-wrapper">
        <a-form-model ref="ruleFormTemp" layout="inline" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <!-- <a-form-model-item label="规则编号" prop="id" :rules="{ required: true, message: 'Please pick a date', trigger: ['change','blur'] }"> -->
              <a-form-model-item label="规则编号" prop="id" :rules="columns[0].rules">
                <a-input v-model="queryParam['id']" placeholder="" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="调用次数">
                  <a-input-number v-model="queryParam.callNo" style="width: 100%" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="search()">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <QueryFilter :columns="columns" :advanced="true" :queryParam="queryParam"></QueryFilter>

    <a-card :bordered="false" id="table">

      <div class="ant-pro-table-list-toolbar">
        <div class="ant-pro-table-list-toolbar-container">
          <div class="ant-pro-table-list-toolbar-left">
            <div class="ant-pro-table-list-toolbar-title">
              <CircleTip title="查询表格" tip="高级表格提示"></CircleTip>
            </div>
          </div>
          <div class="ant-pro-table-list-toolbar-right">
            <div class="ant-space ant-space-horizontal ant-space-align-center">
              <div class="ant-space-item" style="margin-right: 8px;">
                <button class="ant-btn ant-btn-primary" type="button" @click="handleAdd">
                  <a-icon type="plus" />
                  <span>新建</span>
                </button>
              </div>
              <div class="ant-space-item">
                <div class="ant-pro-table-list-toolbar-setting-item">
                  <!-- <a-tooltip title="斑马纹" :getPopupContainer="e=> e"> -->
                  <a-tooltip :title="$t('tableToolBar.intervalTexture')">
                    <span>
                      <a-switch v-model="rowStriped" @change="onChange" :style="{top:'-2px'}"/>
                    </span>
                  </a-tooltip>
                </div>
              </div>
            </div>
            <div class="ant-pro-table-list-toolbar-divider">
              <div class="ant-divider ant-divider-vertical" role="separator">
              </div>
            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">
              <!-- <a-tooltip title="刷新" :getPopupContainer="e=> e"> -->
              <a-tooltip :title="$t('tableToolBar.reload')">
                <a-icon type="reload" @click="reload" />
              </a-tooltip>
            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">

              <!-- <a-dropdown :trigger="['click']" :placement="'bottomRight'" :overlayClassName="'toolbar-height'" :getPopupContainer="e=> e"> -->
              <a-dropdown :trigger="['click']" :placement="'bottomRight'" :overlayClassName="'toolbar-height'" >
                <!-- <a-tooltip title="密度" :getPopupContainer="e=> e"> -->
                <a-tooltip :title="$t('tableToolBar.density')">
                  <a-icon type="column-height" />
                </a-tooltip>
                <a-menu slot="overlay" @click="height" selectable :selectedKeys="[tableHeight]">
                  <a-menu-item :key="index" v-for="(item,index) in heightObj">
                    {{ item }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>

            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">
              <!-- <a-tooltip title="列设置" :getPopupContainer="e=> e"> -->
              <a-tooltip :title="$t('tableToolBar.columnSetting')" >
                <!-- <a-popover v-model="visibleColumnsSettings" trigger="click" placement="bottomRight" :getPopupContainer="e=> e" overlayClassName="ant-pro-table-column-setting-overlay"> -->
                <a-popover v-model="visibleColumnsSettings" trigger="click" placement="bottomRight" overlayClassName="ant-pro-table-column-setting-overlay" :align="align">
                  <a-icon type="setting" @click="hide" />
                  <div class="ant-pro-table-column-setting-title" slot="title">
                    <label class="ant-checkbox-wrapper ant-checkbox-wrapper-checked">
                      <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                        {{ $t('tableToolBar.columnDisplay') }}
                      </a-checkbox>
                    </label>
                    <a href="javascript:;" @click="tableReset">{{ $t('tableToolBar.reset') }}</a>
                  </div>
                  <div slot="content">
                    <tree :columns.sync="columns" :slotsExchange="slotsExchange" ref="tree" />
                  </div>
                </a-popover>
              </a-tooltip>
            </div>
            <!-- <div class="ant-pro-table-list-toolbar-setting-item">
              <a-tooltip title="全屏"  :getPopupContainer="e=> e">
                <a-icon type="fullscreen" @click="showFull($event)" v-if="!isFull"/>
                <a-icon type="fullscreen" @click="delFull($event)" v-else/>
              </a-tooltip>
            </div> -->
          </div>
        </div>
      </div>

      <!-- <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="delete" />删除
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="lock" />锁定
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div> -->

      <s-table
        ref="table"
        :size="tableHeight"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        :customRow="customRow"
        showPagination="auto">
        <span slot="name" slot-scope="text, record, index">
          <a @click="setRow(record,index)">{{ text }}</a>
        </span>
        <!-- <span slot="customTitle">
          规则编号
          <a-tooltip title="规则名称是唯一的 key">
            <a-icon type="exclamation-circle" />
          </a-tooltip>
        </span> -->
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <!-- <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span> -->
        <!-- <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span> -->

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">订阅报警</a>
          </template>
        </span>
      </s-table>

      <a-drawer
        placement="right"
        :closable="false"
        :visible="visibleDrawer"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
        :width="600"
      >
        <a-descriptions :column="2">
          <template slot="title" slot-scope="text, record">
            <div class="ant-descriptions-title-inner">
              TradeCode 99
            </div>

            <div class="ant-descriptions-extra">
              <div class="ant-space ant-space-horizontal ant-space-align-center ant-pro-field-option">
                <div class="ant-space-item" style="margin-right: 16px;">
                  <a href="javascript:;" @click="handleEdit(record)">配置</a>
                </div>
                <div class="ant-space-item" style="margin-right: 16px;">
                  <div class="ant-divider ant-divider-vertical" role="separator"></div>
                </div>
                <div class="ant-space-item">
                  <a href="javascript:;" @click="handleSub(record)">订阅警报</a>
                </div>
              </div>
            </div>
          </template>
          <a-descriptions-item label="规则名称">
            TradeCode 99
          </a-descriptions-item>
          <a-descriptions-item label="描述">
            这是一段描述
          </a-descriptions-item>
          <a-descriptions-item label="服务调用次数">
            901 万
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            运行中
          </a-descriptions-item>
          <a-descriptions-item label="上次调度时间">
            2021-03-16 15:53:15
          </a-descriptions-item>
        </a-descriptions>
      </a-drawer>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk" />
      <step-by-step-modal ref="modal" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import Tree from './tree'
import { EventBus } from '../../components/event-bus'
import CircleTip from './circle-tip'
import QueryFilter from './query-filter'

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (this.ruleForm.checkPass !== '') {
      this.$refs.ruleForm.validateField('checkPass')
    }
    callback()
  }
}

const columns = [
  {
    title: '#',
    dataIndex: '#',
    scopedSlots: { customRender: 'serial' },
    valueType: 'text'
  },
  {
    title: '规则名称',
    dataIndex: 'description',
    tip: '规则名称是唯一的 key',
    copyable: true, // 是否支持复制
    ellipsis: true, // 是否自动缩略
    formItemProps: {
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
          trigger: 'change'
        }
      ]
    },
    // scopedSlots: { customRender: 'name' },
    valueType: 'text',
    hideInSearch: false
  },
  {
    title: '规则编号',
    dataIndex: 'no',
    scopedSlots: { title: 'customTitle' },
    valueType: 'text',
    hideInSearch: false,
    formItemProps: {
      rules: { validator: validatePass, trigger: 'change' }
    }
  },
  // {
  //   title: '描述',
  //   dataIndex: 'description',
  //   scopedSlots: { customRender: 'description' }
  // },
  {
    title: '服务调用次数',
    tip: '规则名称是唯一的 key',
    dataIndex: 'callNo',
    sorter: true,
    needTotal: true,
    valueType: 'text',
    customRender: (text) => text + ' 次',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '服务调用次数为必填项',
          trigger: 'change'
        }
      ]
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    // scopedSlots: { customRender: 'status' },
    valueType: 'option',
    valueEnum: {
      0: { text: '关闭', status: 'default' },
      1: { text: '运行中', status: 'processing' },
      2: { text: '已上线', status: 'success' },
      3: { text: '异常', status: 'error' }
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    valueType: 'dateTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
    valueType: 'dateTime'
  }
]
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal,
    Tree,
    CircleTip,
    QueryFilter
  },
  data () {
    // this.columns = columns
    return {
      indeterminate: false,
      checkAll: true,
      align: {
        // points: ['tl', 'tr'], // align top left point of sourceNode with top right point of targetNode
        // offset: [10, 20], // the offset sourceNode by 10px in x and 20px in y,
        // targetOffset: ['30%', '40%'], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
        // overflow: { adjustX: true, adjustY: true }
      },
      columns,
      visibleColumnsSettings: false,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter, queryParam) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters).then((res) => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      rowStriped: false,
      tableHeight: 'default',
      heightObj: {
        default: this.$t('tableToolBar.densityLarger'),
        middle: this.$t('tableToolBar.densityMiddle'),
        small: this.$t('tableToolBar.densitySmall')
      },
      isFull: false,
      slotsExchange: {},
      visibleDrawer: false
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  watch: {
    columns (newVal) {
      console.log('改变了父', newVal)
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  mounted () {
    this.slotsExchange = this.$refs.table.$slots
    EventBus.$on('multiSelect', (state) => {
      if (state === 'no') {
        this.checkAll = false
        this.indeterminate = false
      } else if (state === 'all') {
        this.checkAll = true
        this.indeterminate = false
      } else if (state === 'part') {
        this.checkAll = false
        this.indeterminate = true
      }
    })
    EventBus.$on('search', () => {
      console.log('父组件搜索')
      this.search()
    })
  },
  methods: {
    search () {
      this.$refs.table.refresh(true)
    },
    // search () {
    //   // $refs.table.refresh(true)
    //   this.$refs.ruleFormTemp.validate(valid => {
    //     if (valid) {
    //       alert('submit!')
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    setRow (record, index) {
      this.visibleDrawer = true
    },
    onClose () {
      this.visibleDrawer = false
    },
    afterVisibleChange (val) {
      console.log('visible', val)
    },
    onCheckAllChange (e) {
      this.indeterminate = false
      const checked = e.target.checked
      this.checkAll = checked
      EventBus.$emit('multiAll', checked)
      // Object.assign(this, {
      //   checkedList: e.target.checked ? plainOptions : [],
      //   indeterminate: false,
      //   checkAll: e.target.checked
      // })
    },
    tableReset () {
      this.$refs.tree.tableReset()
    },
    showFull (e) {
      var full = document.getElementById('table')
      this.launchIntoFullscreen(full)
      this.isFull = true
    },

    delFull () {
      this.isFull = false
      this.exitFullscreen()
    },
    launchIntoFullscreen (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    hide () {
      this.visibleColumnsSettings = false
    },
    height ({ key }) {
      console.log(key)
      this.tableHeight = key
    },
    onChange (checked) {
      this.rowStriped = checked
    },
    customRow (record, index) {
      const rowClass = index % 2 && this.rowStriped ? 'ant-pro-table-row-striped' : ''
      return {
        props: {},
        attrs: { class: rowClass },
        on: {
          // 事件
          click: (event) => {
          }, // 点击行
          dblclick: (event) => {},
          contextmenu: (event) => {},
          mouseenter: (event) => {}, // 鼠标移入行
          mouseleave: (event) => {}
        }
      }
    },
    reload () {
      this.$refs.table.refresh()
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      // this.visible = true
      this.$refs.modal.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then((res) => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then((res) => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style lang="less">
.card-margin {
  margin-bottom: 16px;
}
.ant-pro-table-list-toolbar {
  overflow-x: auto;
  overflow-y: hidden;
  .ant-pro-table-list-toolbar-container {
    display: flex;
    justify-content: space-between;
    height: 64px;
    padding: 0 24px;
    line-height: 64px;
    .ant-pro-table-list-toolbar-left {
      display: flex;
      justify-content: flex-start;
      .ant-pro-table-list-toolbar-title {
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        font-family: PingFangSC-Medium;
      }
    }
    .ant-pro-table-list-toolbar-right {
      display: flex;
      justify-content: flex-end;
      .ant-space-align-center {
        align-items: center;
      }
      .ant-space {
        display: inline-flex;
      }
      .ant-pro-table-list-toolbar-divider {
        margin-right: -8px;
        margin-left: 8px;
      }
      .ant-pro-table-list-toolbar-setting-item {
        margin-left: 16px;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
}
.ant-pro-table-column-setting-list-item-option {
    display: none;
    float: right;
    cursor: pointer;
}
.ant-table-wrapper {
  .ant-pro-table-row-striped {
    background: #fafafa;
  }
}
.toolbar-height {
  width: 80px;
}

/* 描述列表 */
.ant-descriptions-title-inner {
    flex: auto;
    overflow: hidden;
    color: rgba(0,0,0,.85);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5715;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ant-descriptions-extra {
    margin-left: auto;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    .ant-space-align-center {
    align-items: center;
}

.ant-space {
    display: inline-flex;
}
}
.ant-descriptions-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
</style>
