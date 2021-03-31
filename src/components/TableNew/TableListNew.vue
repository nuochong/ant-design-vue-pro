<template>
  <div>

    <QueryFilter
      :columns="columns"
      :advanced="true"
      :queryParam="queryParam"
      :submitText="submitText"
      :layout="layout"
      :collapseRender="collapseRender"
      :optionRender="optionRender"
      :resetText="resetText"></QueryFilter>

    <jsx :jsx="tableExtraRender" v-if="tableExtraRender($props)"></jsx>

    <a-card :bordered="false" id="table" class="ant-table-container" :class="{'ant-table-container-no-toolbar':!toolBarRender}">

      <div class="ant-pro-table-list-toolbar" v-if="toolBarRender">
        <div class="ant-pro-table-list-toolbar-container">
          <div class="ant-pro-table-list-toolbar-left">
            <div class="ant-pro-table-list-toolbar-title" v-if="headerTitle || tooltip">
              <CircleTip :title="headerTitle" :tip="tooltip"></CircleTip>
            </div>
          </div>
          <div class="ant-pro-table-list-toolbar-right">
            <div class="ant-pro-table-list-toolbar-setting-item ant-pro-table-list-toolbar-mini-search">
              <div class="ant-pro-form-light-filter-container">
                <div class="ant-pro-form-light-filter-item">
                  <div class="ant-row ant-form-item" :class="{'ant-form-item-has-success': true}">
                    <div class="ant-col ant-form-item-control">
                      <div class="ant-form-item-control-input">
                        <div class="ant-form-item-control-input-content">
                          <a-dropdown v-model="visibleDropdown" :trigger="['click']">

                            <span
                              class="ant-pro-core-field-label ant-pro-core-field-label-middle  ant-pro-core-field-label-allow-clear"
                              @click="e => {e.preventDefault(); this.endOpen = true}"
                              :class="{'ant-pro-core-field-label-active': true}">
                              <span title="2229999999">Name: 2229999999</span>
                              <a-icon type="close" class="anticon anticon-close ant-pro-core-field-label-icon ant-pro-core-field-label-close"/>
                              <a-icon type="down" class="anticon anticon-down ant-pro-core-field-label-icon ant-pro-core-field-label-arrow"/>
                            </span>

                            <!-- <a-menu slot="overlay">
                              <a-menu-item key="0">
                                <a href="http://www.alipay.com/">1st menu item</a>
                              </a-menu-item>
                            </a-menu> -->
                            <template slot="overlay">
                              <!-- <a-date-picker type="data" show-time placeholder="请选择" class="search-input" :open="endOpen"/> -->
                              <div class="ant-pro-core-field-dropdown-overlay">
                                <div class="ant-pro-core-field-dropdown-content">
                                  <div class="ant-pro-field-light-wrapper-container">
                                    <a-input placeholder="请输入" allowClear/>
                                  </div>
                                </div>
                                <div class="ant-pro-core-dropdown-footer">
                                  <a-button type="link" size="small" style="visibility: visible;">
                                    清除
                                  </a-button>
                                  <a-button type="primary" size="small" @click="handleMenuClick">
                                    确 认
                                  </a-button>
                                </div>
                              </div>
                            </template>
                          </a-dropdown>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            <div class="ant-space ant-space-horizontal ant-space-align-center">
              <slot name="toolBarRender"></slot>
            </div>
            <template v-if="tabbarState">
              <div class="ant-pro-table-list-toolbar-setting-item" v-if="options.reload">
                <!-- <a-tooltip title="斑马纹" :getPopupContainer="e=> e"> -->
                <a-tooltip :title="$t('tableToolBar.intervalTexture')">
                  <span>
                    <a-switch v-model="rowStriped" @change="onChange" :style="{top:'-2px'}"/>
                  </span>
                </a-tooltip>
              </div>
              <div class="ant-pro-table-list-toolbar-divider">
                <div class="ant-divider ant-divider-vertical" role="separator"></div>
              </div>
              <div class="ant-pro-table-list-toolbar-setting-item" v-if="options.reload">
                <!-- <a-tooltip title="刷新" :getPopupContainer="e=> e"> -->
                <a-tooltip :title="$t('tableToolBar.reload')">
                  <a-icon type="reload" @click="reload" />
                </a-tooltip>
              </div>
              <div class="ant-pro-table-list-toolbar-setting-item" v-if="options.density">

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
              <div class="ant-pro-table-list-toolbar-setting-item" v-if="options.setting">
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
              <div class="ant-pro-table-list-toolbar-setting-item" v-if="options.fullScreen">
                <a-tooltip :title="$t(!isFull ? 'tableToolBar.fullScreen' : 'tableToolBar.exitFullScreen')" :getPopupContainer="e=> e">
                  <a-icon type="fullscreen" @click="showFull($event)" v-if="!isFull"/>
                  <a-icon type="fullscreen" @click="delFull($event)" v-else/>
                </a-tooltip>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- <s-table v-bind="$attrs" v-on="$listeners">
        <template v-for="(key, name) in $scopedSlots" :slot="name" slot-scope="text,record,index">
          <slot :name="name" v-bind="[text,record,index]" />
        </template>
      </s-table> -->

      <jsx :jsx="renderFn"></jsx>

    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import Tree from './tree'
import { EventBus } from '../event-bus'
import CircleTip from './circle-tip'
import QueryFilter from './query-filter/query-filter'
import jsx from './jsx'

export default {
  name: 'TableListNew',
  props: {
    ...QueryFilter.props,
    columns: {
      type: Array,
      required: true
    },
    loadData: {
      type: Function,
      required: true
    },
    headerTitle: {
      type: String,
      required: false,
      default: ''
    },
    tooltip: {
      type: String,
      required: false,
      default: ''
    },
    toolBarRender: {
      type: Boolean,
      required: false,
      default: true
    },
    options: {
      type: [Boolean, Object],
      required: false,
      default: true
    },
    tableExtraRender: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  components: {
    STable,
    Ellipsis,
    Tree,
    CircleTip,
    QueryFilter,
    jsx
  },
  data () {
    return {
      visibleDropdown: false,
      endOpen: false,
      pagination: {
        'total': 85,
        'show-total': (total, range) => `${this.$t('pagination.total.range')}${range[0]}-${range[1]} ${this.$t('pagination.total.total')} ${total} ${this.$t('pagination.total.item')}`,
        'page-size': 20,
        'default-current': 1
      },
      indeterminate: false,
      checkAll: true,
      align: {
        // points: ['tl', 'tr'], // align top left point of sourceNode with top right point of targetNode
        // offset: [10, 20], // the offset sourceNode by 10px in x and 20px in y,
        // targetOffset: ['30%', '40%'], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
        // overflow: { adjustX: true, adjustY: true }
      },
      visibleColumnsSettings: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
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
      slotsExchange: {}
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    tabbarState () {
      let res
      const { options } = this
      if (typeof (options) === 'boolean') {
        res = options
      } else {
        const optionsLen = Object.keys(options).length
        let tempLen = 0
        for (const item in options) {
          if (options[item] === false || options[item] === 'false') {
            tempLen++
          }
        }
        if (optionsLen === tempLen) {
          res = false
        } else {
          res = true
        }
      }
      return res
    }
  },
  mounted () {
    console.log('hhhhhhhhhhhh', this)
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
      this.search()
    })
  },
  methods: {
    handleMenuClick (e) {
      if (e.key === '3') {

      }
      this.visibleDropdown = false
    },
    renderFn (h, context) {
      const scopedSlots = {}

      return <STable
      {...{ scopedSlots: { ...this.$scopedSlots, ...scopedSlots } }}
        ref="table"
        size={this.tableHeight}
        rowKey="key"
        columns={this.columns}
        data={this.loadData}
        alert={true}
        rowSelection={this.rowSelection}
        customRow={this.customRow}
        showPagination="auto"
        pagination={this.pagination}
        bordered={false}>

      </STable>
    },
    search () {
      this.$refs.table.refresh(true)
    },
    // search () {
    //   this.$refs.ruleFormTemp.validate(valid => {
    //     if (valid) {
    //       alert('submit!')
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
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
          click: (event) => {},
          dblclick: (event) => {},
          contextmenu: (event) => {},
          mouseenter: (event) => {},
          mouseleave: (event) => {}
        }
      }
    },
    reload () {
      this.$refs.table.refresh()
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
    // padding: 0 24px;
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
.ant-table-container.ant-table-container-no-toolbar {
  padding-top: 16px;
}
</style>

<style>
.ant-pro-core-field-dropdown-overlay {
    min-width: 200px;
    margin-top: 4px;
    background-color: #fff;
    box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);
}
.ant-pro-core-field-dropdown-content {
    padding: 16px;
}
.ant-pro-core-dropdown-footer {
    display: flex;
    justify-content: space-between;
    padding: 16px 16px 16px 8px;
    border-top: 1px solid #f0f0f0;
}
.ant-pro-table-list-toolbar-mini-search {
  margin-right: 16px;
}
</style>

<style>
.ant-pro-form-light-filter-container {
  display: flex;
  flex-wrap: wrap;
  /* margin-top: -8px;
  margin-right: -4px; */
}
.ant-pro-form-light-filter-item:not(:last-child) {
    margin-right: 8px;
}
.ant-pro-form-light-filter-item {
    margin-top: 12px;
}
.ant-pro-form-light-filter .ant-form-item {
    margin-bottom: 0;
}
.ant-form-item {
    box-sizing: border-box;
    padding: 0;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum","tnum";
    margin: 0 0 24px;
    vertical-align: top;
}
.ant-row {
    display: flex;
    flex-flow: row wrap;
}
.ant-form-item-control:first-child:not([class^=ant-col-]):not([class*=" ant-col-"]) {
    width: 100%;
}
.ant-form-horizontal .ant-form-item-control {
    flex: 1 1;
}
.ant-form-item-control {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.ant-col {
    position: relative;
    max-width: 100%;
    min-height: 1px;
}
.ant-form-item-control-input {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 32px;
}
.ant-form-item-control-input-content {
    flex: auto;
    max-width: 100%;
}
.ant-pro-core-field-dropdown-label {
    cursor: pointer;
}

.ant-pro-core-field-label {
    display: inline-block;
    height: 30px;
    padding: 0 4px;
    font-size: 14px;
    line-height: 30px;
    border-radius: 2px;
    cursor: pointer;
}
.ant-pro-core-field-label-active {
    padding: 0 12px;
    background-color: rgba(0,0,0,.04);
}
.ant-pro-core-field-label-icon.ant-pro-core-field-label-close {
    display: none;
    margin-top: -4px;
    padding: 3px;
    color: #fff;
    font-size: 8px;
    background-color: rgba(0,0,0,.25);
    border-radius: 50%;
}

.ant-pro-core-field-label-icon {
    margin-top: -2px;
    margin-left: 4px;
    padding: 1px;
    color: rgba(0,0,0,.45);
    font-size: 12px;
    vertical-align: middle;
}

.ant-pro-core-field-label-active.ant-pro-core-field-label-allow-clear:hover:not(.ant-pro-core-field-label-disabled) .ant-pro-core-field-label-close {
    display: inline-block;
}
.ant-pro-core-field-label-active.ant-pro-core-field-label-allow-clear:hover:not(.ant-pro-core-field-label-disabled) .ant-pro-core-field-label-arrow {
    display: none;
}
.ant-pro-core-field-label-icon.ant-pro-core-field-label-close:hover {
    background-color: rgba(0,0,0,.45);
}
</style>
