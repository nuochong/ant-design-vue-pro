<script>
import 'ant-design-vue/es/tree/style'
import Tree from 'ant-design-vue/es/tree'
import dataDarg from './data-darg'
import { EventBus } from '../../components/event-bus'
// const merge = require('deepmerge')
// var clone = require('clone')
// import CircularJSON from 'circular-json'
// import gunVue from 'gunvue'
const { TreeNode } = Tree
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    slotsExchange: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      gData: [],
      expandedKeys: ['0-0'],
      showLine: false,
      showIcon: true,
      columnsBak: [],
      columnsOld: []
    }
  },
  components: {
    Tree,
    TreeNode,
    dataDarg
  },
  watch: {
    columns (newVal) {
      console.log('改变了子', newVal)
    }
  },
  computed: {
    fixLeft () {
      return this.handleFixFilter('left')
    },
    noFix () {
      return this.handleFixFilter('auto')
    },
    fixRight () {
      return this.handleFixFilter('right')
    },
    headerTitle () {
      return this.slotsExchange
    }
  },
  created () {
    if (this.columnsBak.length === 0) {
      console.log('创建了', this.columns)
      this.columnsOld = JSON.parse(JSON.stringify(this.columns))
      this.columnsBak = JSON.parse(JSON.stringify(this.columns))
      // this.columnsOld = [...this.columns]
      // this.columnsBak = [...this.columns]
      this.init()
    }
  },
  mounted () {
    EventBus.$on('multiAll', (checked) => {
      checked ? this.handleCheckAll(true) : this.handleCheckAll(false)
    })
  },
  render (h) {
    const { fixLeft, noFix, fixRight } = this
    const scopedSlotsTemp = {
      switcherIcon: (prop) => {
        return (
          <span>
            <dataDarg></dataDarg>
            <a-checkbox
              v-model={prop.isShow}
              onChange={(e) => {
                this.onChange(e, prop)
              }}
            ></a-checkbox>
          </span>
        )
      }
    }
    const dynamicProps = {
      on: {
        dragenter: this.onDragEnter,
        drop: this.onDrop,
        select: this.onSelect
      }
    }
    const treeNode = (treeData) => {
      const { showLine, showIcon } = this
      return (
        <tree
          class="ant-tree-icon-hide ant-tree-block-node"
          draggable
          {...dynamicProps}
          // onDragenter={() => { this.onDragEnter() }}
          // onDrop={() => { this.onDrop() }}
          show-line={ showLine }
          show-icon={ showIcon }
          tree-data={ treeData }
          default-expanded-keys={['0-0']}
          // onSelect={() => { this.onSelect() }}
          scopedSlots={ { ...scopedSlotsTemp } }
        ></tree>
      )
    }
    return (
      <div>
        <div class="ant-pro-table-column-setting-list ant-pro-table-column-setting-list-group">
          {this.fixLeft.length > 0 && <span class="ant-pro-table-column-setting-list-title">{ this.$t('tableToolBar.leftFixedTitle') }</span>}
          {this.fixLeft.length > 0 && <div class="ant-tree ant-tree-icon-hide ant-tree-block-node">{treeNode(fixLeft)}</div>}
          {(this.fixLeft.length > 0 || this.fixRight.length > 0) && (
            <span class="ant-pro-table-column-setting-list-title">{ this.$t('tableToolBar.noFixedTitle') }</span>
          )}
          <div class="ant-tree ant-tree-icon-hide ant-tree-block-node">{treeNode(noFix)}</div>
          {this.fixRight.length > 0 && <span class="ant-pro-table-column-setting-list-title">{ this.$t('tableToolBar.rightFixedTitle') }</span>}
          {this.fixRight.length > 0 && <div class="ant-tree ant-tree-icon-hide ant-tree-block-node">{treeNode(fixRight)}</div>}
        </div>
      </div>
    )
  },
  methods: {
    handleCheckAll (state) {
      this.gData.map((item, index) => {
        if (item.isShow !== state) {
          this.gData[index].isShow = state
        }
      })
      const columnsBak = JSON.parse(JSON.stringify(this.columnsBak))
      // const columnsBak = [...this.columnsBak]

      for (const item in columnsBak) {
        columnsBak[item].isShow = state
      }

      if (!state) {
        this.$emit('update:columns', [])
      } else {
        this.$emit('update:columns', columnsBak)
      }
    },
    init () {
      this.gData = []
      const columnsOld = [...this.columnsOld]
      for (const item in columnsOld) {
        const { title, dataIndex, fixed = 'auto', scopedSlots = {}, tip, titleOld } = columnsOld[item]
        // const newTitle = scopedSlots?.title
        let titleRes = title
        const scopedSlotsRes = { switcherIcon: 'switcherIcon' }

        const titleTmp = (props, dom) => {
          const { fixed, key } = props
          const titleNew = dom ? dom() : title
          return (
            <span
              style="color: #000"
              class="ant-pro-table-column-setting-list-item"
            >
              <div class="ant-pro-table-column-setting-list-item-title">{titleNew}</div>
              <span class="ant-pro-table-column-setting-list-item-option">
                <a-tooltip title={ this.$t('tableToolBar.leftPin') }>
                  {(fixed === 'auto' || fixed === 'right') && (
                    <a-icon
                      type="vertical-align-top"
                      class="fix-icon"
                      onClick={() => {
                        this.handleFixTop(key)
                      }}
                    />
                  )}
                </a-tooltip>
                <a-tooltip title={ this.$t('tableToolBar.noPin') }>
                  {(fixed === 'left' || fixed === 'right') && (
                    <a-icon
                      type="vertical-align-middle"
                      class="fix-icon"
                      onClick={() => {
                        this.handleNoFix(key)
                      }}
                    />
                  )}
                </a-tooltip>
                <a-tooltip title={ this.$t('tableToolBar.rightPin') }>
                  {(fixed === 'auto' || fixed === 'left') && (
                    <a-icon
                      type="vertical-align-bottom"
                      class="fix-icon"
                      onClick={() => {
                        this.handleFixBottom(key)
                      }}
                    />
                  )}
                </a-tooltip>
              </span>
            </span>
          )
        }
        const slotTemp = (props) => {
          return (
            <span slot={`custom-${item}`}>
              {titleOld}&nbsp;
              <a-tooltip title={tip}>
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </span>
          )
        }
        if (tip) {
          titleRes = (props) => { return titleTmp(props, slotTemp) }
        } else {
          titleRes = (props) => { return titleTmp(props) }
        }
        this.gData.push({
          title: titleRes,
          key: dataIndex,
          scopedSlots: { ...scopedSlots, ...scopedSlotsRes },
          isShow: true,
          fixed
        })
      }
      console.log('this.gData', this.gData)
    },
    tableReset () {
      const columnsOld = [...this.columnsOld]
      console.log('重置操作', columnsOld)
      this.$emit('update:columns', [...columnsOld])
      this.init()
      this.handleMultiSelect()
    },
    handleFixFilter (type) {
      const temp = this.gData.filter((item) => {
        return item.fixed === type
      })
      return temp || []
    },
    handleFixState (key, type) {
      const columnsBak = [...this.columnsBak]
      for (const child in columnsBak) {
        if (columnsBak[child].dataIndex === key) {
          if (type === 'auto') {
            delete columnsBak[child]['fixed']
          } else {
            columnsBak[child]['fixed'] = type
          }
        }
      }
      const gData = this.gData
      for (const child in gData) {
        if (gData[child].key === key) {
          gData[child].fixed = type
        }
      }
      this.$emit('update:columns', [...columnsBak])
    },
    handleFixTop (key) {
      console.log('handleFixTop', key)
      this.handleFixState(key, 'left')
    },
    handleNoFix (key) {
      console.log('handleNoFix', key)
      this.handleFixState(key, 'auto')
    },
    handleFixBottom (key) {
      console.log('handleFixBottom', key)
      this.handleFixState(key, 'right')
    },
    handleMultiSelect () {
      const len = this.gData.length
      let state = 'all'
      let newLen = 0
      for (const item in this.gData) {
        if (this.gData[item].isShow === false) {
          newLen++
        }
      }
      if (len === newLen) {
        state = 'no'
      } else if (newLen === 0) {
        state = 'all'
      } else {
        state = 'part'
      }
      EventBus.$emit('multiSelect', state)
    },
    onChange (e, selected) {
      console.log('e,selected', e, selected)
      const key = selected.key
      const columns = JSON.parse(JSON.stringify(this.columns))
      const columnsBak = JSON.parse(JSON.stringify(this.columnsBak))
      //       const columns = [...this.columns]
      // const columnsBak = [...this.columnsBak]

      if (!e.target.checked) {
        for (const item in columns) {
          const { dataIndex } = columns[item]
          if (dataIndex === key) {
            columns.splice(item, 1)
            this.handleCheck(key, this.gData, false)
            this.$emit('update:columns', columns)
            console.log('this.columns', columns, this.gData)
          }
        }
      } else {
        for (const item in columnsBak) {
          const { dataIndex } = columnsBak[item]
          if (dataIndex === key) {
            this.gData.some((child, index) => {
              if (child.key === key) {
                columns.splice(index, 0, columnsBak[item])
              }
            })
            // columns.push(columnsBak[item])
            this.handleCheck(key, this.gData, true)
            this.$emit('update:columns', columns)
            console.log('this.columns', columns)
          }
        }
      }

      this.handleMultiSelect()
    },
    handleCheck (key, gData, value) {
      for (const child in gData) {
        if (gData[child].key === key) {
          gData[child].isShow = value
        }
      }
    },
    onSelect (selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    onDragEnter (info) {
      console.log(info)
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    handleDrag () {
      const temp = []
      this.gData.map((item, index) => {
        for (const child in this.columns) {
          if (this.columns[child].dataIndex === item.key) {
            temp.push(this.columns[child])
          }
        }
      })
      this.$emit('update:columns', temp)
    },
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.gData]

      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.gData = data
      this.handleDrag()
    }
  }
}
</script>

<style lang="less">
.ant-pro-table-column-setting-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 8px;
  &.ant-pro-table-column-setting-list-group {
    padding-top: 0;
  }
}

.ant-pro-table-column-setting-list-title {
  margin-top: 6px;
  margin-bottom: 6px;
  padding-left: 24px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
.ant-tree {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum', 'tnum';
  background: #fff;
  border-radius: 2px;
  transition: background-color 0.3s;
}
.fix-icon {
  margin-left: 10px;
  color: blue;
}
.ant-pro-table-column-setting-list-item {
  display: flex;
  align-items: center;
  .ant-pro-table-column-setting-list-item-title {
    flex: 1 1;
  }
  .ant-pro-table-column-setting-list-item-option {
    visibility: hidden;
    display: block;
    float: right;
    cursor: pointer;
  }
}
.ant-tree.ant-tree-block-node .ant-tree-list-holder-inner .ant-tree-node-content-wrapper {
  flex: auto;
}
.ant-pro-table-column-setting-overlay .ant-tree-treenode:hover .ant-pro-table-column-setting-list-item-option,
.ant-pro-table-column-setting-overlay
  .ant-tree-treenode-switcher-close:hover
  .ant-pro-table-column-setting-list-item-option {
  visibility: visible;
}
</style>
