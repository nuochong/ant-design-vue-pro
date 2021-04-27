<template>
  <page-header-wrapper>
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

    <TableListNew v-bind="tableSettings">
      <template slot="toolBarRender">
        <div class="ant-space-item" style="margin-right: 8px;">
          <button class="ant-btn ant-btn-primary" type="button" @click="handleAdd">
            <a-icon type="plus" />
            <span>新建</span>
          </button>
        </div>
      </template>
      <span slot="name" slot-scope="text, record, index">
        <a @click="setRow(record,index)">{{ text }}</a>
      </span>
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">配置</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">订阅报警</a>
        </template>
      </span>
      <template slot="footer">
        Footer
      </template>
    </TableListNew>

    <a-drawer
      placement="right"
      :closable="false"
      :visible="visibleDrawer"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
      :width="600">
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

  </page-header-wrapper>
</template>

<script>
import TableListNew from '@/components/TableNew/TableListNew'
import { getRoleList, getServiceList } from '@/api/manage'
import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
// import moment from 'moment'

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'))
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
    valueType: 'text',
    hideInSearch: false,
    formItemProps: {
      rules: { validator: validatePass, trigger: 'change' }
    }
  },
  // {
  //   title: '描述',
  //   dataIndex: 'description',
  //   ellipsis: true,
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
    // dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
    // valueType: 'option' // 此处添加 valueType const proFormSelect = (item) => 报错
  }
]

export default {
  name: 'TableList',
  components: {
    TableListNew,
    CreateForm,
    StepByStepModal
  },
  data () {
    return {
      columns,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter, queryParam) => {
        console.log('🚀 ~ file: TableList.vue ~ line 220 ~ data ~ queryParam', queryParam)
        console.log('🚀 ~ file: TableList.vue ~ line 220 ~ data ~ parameter', parameter)
        // moment(final).format('YYYY-MM-DD HH:mm')
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters).then((res) => {
          return res.result
        })
      },
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      visibleDrawer: false
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  watch: {},
  computed: {
    tableSettings () {
      return {
        headerTitle: '查询表格',
        tooltip: '查询表格提示',
        columns: this.columns,
        loadData: this.loadData,
        toolBarRender: true,
        layout: 'horizontal',
        collapseRender: true,
        optionRender: (searchConfig, formProps) => {
          console.log('自定搜索栏', searchConfig, formProps)
          return <span>
            <a-button type="primary" onClick={() => { formProps.submit() }}>{searchConfig.submitText }</a-button>
            <a-button style="margin-left: 8px" onClick={() => { formProps.resetFields() }}>{searchConfig.resetText}</a-button>
            <a-button style="margin-left: 8px" >导出</a-button>
          </span>
        },
        tableExtraRender: (props) => {
          return <a-card class="card-margin">
            <a-descriptions size="small" column={3}>
              <a-descriptions-item label="Row">2</a-descriptions-item>
              <a-descriptions-item label="Created">Lili Qu</a-descriptions-item>
              <a-descriptions-item label="Association">
                <a>421421</a>
              </a-descriptions-item>
              <a-descriptions-item label="Creation Time">2017-01-10</a-descriptions-item>
              <a-descriptions-item label="Effective Time">2017-10-10</a-descriptions-item>
            </a-descriptions>
          </a-card>
        },
        options: {
          intervalTexture: true, // 斑马线
          reload: true,
          density: true, // 密度
          fullScreen: true, // 全屏
          setting: true // 列设置
        },
        submitText: '查询1',
        resetText: '重置2',
        filterType: 'light'
      }
    }
  },
  mounted () {},
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      // this.visible = true
      this.$refs.modal.visible = true
      this.mdl = { ...record }
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    setRow (record, index) {
      this.visibleDrawer = true
    },
    onClose () {
      this.visibleDrawer = false
    },
    afterVisibleChange (val) {
      console.log('visible', val)
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
    }
  }
}
</script>

<style lang="less">
</style>
