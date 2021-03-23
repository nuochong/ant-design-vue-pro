import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
import { EventBus } from '../event-bus'
import { Ellipsis } from '@/components'
import 'ant-design-vue/es/icon/style'
import Icon from 'ant-design-vue/es/icon'
import './table.css'

export default {
  components: {
    Ellipsis
  },
  data () {
    return {
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],

      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),

      columnsNew: {},
      statusMap: {},
      queryParam: {},
      customTemplate: {}
      // statusMap: {
      //   0: {
      //     status: 'default',
      //     text: '关闭'
      //   },
      //   1: {
      //     status: 'processing',
      //     text: '运行中'
      //   },
      //   2: {
      //     status: 'success',
      //     text: '已上线'
      //   },
      //   3: {
      //     status: 'error',
      //     text: '异常'
      //   }
      // }
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  }),
  watch: {
    'localPagination.current' (val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        })
      })
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize (val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },

  created () {
    const { pageNo } = this.$route.params
    const localPageNum = this.pageURI && (pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    }) || false
    this.needTotalList = this.initTotalList(this.columns)
    this.columns.map((item, index) => {
      // const temp = item
      if (item.tip) {
      //   temp.title = <span>{temp.title} <a-tooltip title={ temp.tip }>
      //   <a-icon type="exclamation-circle" />
      // </a-tooltip></span>
        item.scopedSlots = { ...item.scopedSlots, title: `custom-${index}` }
        // item.slot = { title: 'customTitle' }
        item['titleOld'] = item.title
        delete item.title
      }
      const { valueEnum, ellipsis, copyable } = item
      if (valueEnum) {
        this.statusMap = valueEnum
        item.scopedSlots = { ...item.scopedSlots, customRender: 'custom-cell-status' }
      }

      if (ellipsis && copyable) {
        console.log('混合')
        item.scopedSlots = { ...item.scopedSlots, customRender: 'custom-ellipsis-copyable' }
      } else if (ellipsis) {
        item.scopedSlots = { ...item.scopedSlots, customRender: 'custom-ellipsis' }
      } else if (copyable) {
        item.scopedSlots = { ...item.scopedSlots, customRender: 'custom-copyable' }
      }

      return item
    })
    this.handleSearch()
    this.loadData()
  },
  mounted () {
  },
  methods: {
    /** 处理搜索 */
    handleSearch () {
      console.log('处理搜索')
      EventBus.$on('searchData', (queryParam) => {
        this.queryParam = queryParam
      })
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, pageSize: this.pageSize
      }))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true
      const parameter = Object.assign({
        pageNo: (pagination && pagination.current) ||
          this.showPagination && this.localPagination.current || this.pageNum,
        pageSize: (pagination && pagination.pageSize) ||
          this.showPagination && this.localPagination.pageSize || this.pageSize
      },
      (sorter && sorter.field && {
        sortField: sorter.field
      }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order
      }) || {}, {
        ...filters
      }
      )
      const result = this.data(parameter, this.queryParam)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
            current: r.pageNo, // 返回结果中的当前分页数
            total: r.totalCount, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          }) || false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if ((['auto', true].includes(this.showPagination) && r.totalCount <= (r.pageNo * this.localPagination.pageSize))) {
              this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            this.localPagination = false
          }
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    },
    initTotalList (columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    renderAlert () {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {item.title}总计 <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
        </span>)
      })

      // 绘制 清空 按钮
      const clearItem = (typeof this.alert.clear === 'boolean' && this.alert.clear) ? (
        this.renderClear(this.clearSelected)
      ) : (this.alert !== null && typeof this.alert.clear === 'function') ? (
        this.renderClear(this.alert.clear)
      ) : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{this.selectedRows.length}</a></span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },

    statusFilter (type) {
      return this.statusMap[type].text
    },
    statusTypeFilter (type) {
      return this.statusMap[type].status
    }
  },
  render () {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    // props.columns = this.columnsNew

    // const scopedSlots = {
    //   customTitle: ({ title, tip }) => {
    //     return (
    //       <span>
    //       规则编号{title}
    //       <a-tooltip title={tip}>
    //         <Icon type="exclamation-circle" />
    //       </a-tooltip>
    //       </span>
    //     )
    //   }
    // }

    const scopedSlots = {}

    this.columns.map((item, index) => {
      scopedSlots[`custom-${index}`] = () => {
        return (
          <span>
          {item.titleOld}&nbsp;
          <a-tooltip title={item.tip}>
            <Icon type="exclamation-circle" />
          </a-tooltip>
          </span>
        )
      }
    })

    scopedSlots[`custom-cell-status`] = (text, record) => {
      return (
        <a-badge status={this.statusTypeFilter(text) } text={this.statusFilter(text) } />
      )
    }

    const ellipsis = (text) => {
      return <Ellipsis length={8} tooltip>{ text }</Ellipsis>
    }

    const copyable = (text, record, index, slot) => {
      if (!record.copySuccess) this.$set(record, 'copySuccess', false)
      const copy = (text) => {
        this.$copyText(text).then((e) => {
          record.copySuccess = true
          console.log(e)
        }, (e) => {
          this.$message.error('Can not copy')
          console.log(e)
        })
        setTimeout(() => {
          record.copySuccess = false
        }, 500)
      }
      return (
          <span>{ ellipsis(text) }
          <div role="button" tabindex="0" class="ant-typography-copy" onClick={() => { copy(text) }}
            style="border: 0px; background: transparent; padding: 0px; line-height: inherit; display: inline-block;">
            <Icon type={!record.copySuccess ? 'copy' : 'check'} />
            </div>
          </span>
      )
    }

    scopedSlots[`custom-ellipsis`] = (text, record) => {
      return ellipsis(text)
    }

    scopedSlots[`custom-copyable`] = (text, record, index) => {
      return copyable(text, record, index, text)
    }

    scopedSlots[`custom-ellipsis-copyable`] = (text, record, index) => {
      return copyable(text, record, index, ellipsis(text))
    }

    const table = (
      <a-table {...{ props, scopedSlots: { ...this.$scopedSlots, ...scopedSlots } }} onChange={this.loadData} onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) } }>
        { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-table>
    )

    return (
      <div class="table-wrapper">
        { showAlert ? this.renderAlert() : null }
        { table }
      </div>
    )
  }
}
