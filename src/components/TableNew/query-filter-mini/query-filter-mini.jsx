import PropTypes from 'ant-design-vue/es/_util/vue-types'
import './query-filter-mini.css'
import { labelTip } from '../query-filter/query-filter'
import { EventBus } from '../../event-bus'
// import moment from 'moment'

export const QueryFilterMiniProps = {
  columns: PropTypes.array
  // submitText: PropTypes.string,
  // layout: PropTypes.oneOf(['vertical', 'horizontal']).def('horizontal'),
  // collapseRender: PropTypes.bool.def(true)
}

const QueryFilterMini = {
  name: 'QueryFilterMini',
  props: QueryFilterMiniProps,
  components: {
  },
  data () {
    return {
      visibleDropdown: false,
      endOpen: false,
      queryParam: {},
      queryParamState: {}
    }
  },
  mounted () {

  },
  beforeDestroy () {

  },
  watch: {

  },
  computed: {

  },
  methods: {
    search () {
      console.log('点击了搜索')
      EventBus.$emit('searchData', this.queryParam)
      EventBus.$emit('search')
    },
    // 处理 input text 查询
    handleMenuClick (dataIndex) {
      const value = this.$refs.getValue.stateValue
      console.log('🚀 ~ file: query-filter-mini.jsx ~ line 41 ~ handleMenuClick ~ value', value)
      this.queryParam[dataIndex] = value
      this.queryParamState[dataIndex] = false
      this.search()
    },
    changeMenuItem (dataIndex, item) {
      console.log('选择了内容', item)
      this.queryParam[dataIndex] = item.status
      console.log('添加的内容', this.queryParam)
      this.queryParamState[dataIndex] = false
    },
    pickerChange () {
      this.search()
    }
  },
  created () {
    this.columns.map(item => {
      const value = item.valueType === 'option' ? undefined : ''
      this.$set(this.queryParam, item.dataIndex, value)
      this.$set(this.queryParamState, item.dataIndex, false)
    })
  },
  render (h) {
    // const proFormText = (item) => {
    //   return <a-input v-model={this.queryParam[item.dataIndex]} placeholder={this.$t('tableForm.inputPlaceholder')} />
    // }
    const proFormNumber = (item) => {
      return <a-input-number v-model={this.queryParam[item.dataIndex]} class="search-input" placeholder={this.$t('tableForm.inputPlaceholder')} />
    }

    const change = (data, item, oldData) => {
    //   this.queryParamState[item.dataIndex] = false
    //   this.$nextTick(() => {
    //     this.queryParamState[item.dataIndex] = true
    // })
      // this.queryParamState[item.dataIndex] = true
    console.log('🚀 ~ file: query-filter-mini.jsx ~ line 58 ~ change ~ data', data, oldData)
    }

    const proFormDatePicker = (item) => {
      return <div style="max-width:280px" class="data-picker">
        <a-date-picker
        onChange={(data) => { change(data, item, this.queryParam[item.dataIndex]) }} dropdownClassName={'table-picker-wrap'} type="data" style="width: 280px" onOk={() => { this.queryParamState[item.dataIndex] = false; this.pickerChange() }} open={this.queryParamState[item.dataIndex]} show-time v-model={this.queryParam[item.dataIndex]} placeholder={this.$t('tableForm.selectPlaceholder')} class="search-input" />
        </div>
    }

    // const proFormSelect = (item) => {
    //   const options = Object.keys(item.valueEnum).map(child => {
    //     return <Select.Option value={child} >{item.valueEnum[child].text}</Select.Option>
    //   })

    //   const value = this.queryParam[item.dataIndex]
    //   return <Select placeholder={this.$t('tableForm.selectPlaceholder')} value={value} onSelect={(value) => { this.handleChange(value, item) }}>
    //     {options}
    //   </Select>
    // }

    const proFormSelectNew = (item) => {
      console.log('🚀 ~ file: query-filter-mini.jsx ~ line 71 ~ proFormSelectNew ~ item', item)
      const menuItem = Object.keys(item.valueEnum).map(child => {
        return <a-menu-item key={item.valueEnum[child].status} onClick={() => { this.changeMenuItem(item.dataIndex, item.valueEnum[child]); this.pickerChange() }} style="width:153px">
        {item.valueEnum[child].text}
      </a-menu-item>
      })
      return <a-menu slot="overlay" selectable selectedKeys={[this.queryParam[item.dataIndex]]}>
      {menuItem}
    </a-menu>
    }

    const proFormTextNew = (item) => {
      return <div class="ant-pro-core-field-dropdown-overlay">
      <div class="ant-pro-core-field-dropdown-content">
        <div class="ant-pro-field-light-wrapper-container">
          <a-input ref="getValue" placeholder={this.$t('tableForm.inputPlaceholder')} allowClear />
        </div>
      </div>
      <div class="ant-pro-core-dropdown-footer">
        <a-button type="link" size="small" style="visibility: visible;" onClick={() => { this.queryParam[item.dataIndex] = '' }}>
          {this.$t('form.lightFilter.clear')}
        </a-button>
        <a-button type="primary" size="small" onClick={() => { this.handleMenuClick(item.dataIndex) }}>
          {this.$t('form.lightFilter.confirm')}
        </a-button>
      </div>
    </div>
    }

    const formTypeMap = {
      'text': proFormTextNew,
      'number': proFormNumber,
      'data': proFormDatePicker,
      'dateTime': proFormDatePicker,
      'option': proFormSelectNew
    }
    console.log('🚀 ~ file: query-filter-mini.jsx ~ line 78 ~ render ~ formTypeMap', formTypeMap)

    const filterItem = this.columns.map((item) => {
      console.log('🚀 ~ file: query-filter-mini.jsx ~ line 108 ~ filterItem ~ item', item)
      if (item?.dataIndex) {
      let label = item.title || item.titleOld
      if (item.tip) {
        label = labelTip(h, item)
      }

      const itemValue = this.queryParam[item.dataIndex]
      const itemState = itemValue

      const activeClass = [
        'ant-pro-core-field-label',
        'ant-pro-core-field-label-middle',
        'ant-pro-core-field-label-allow-clear',
        itemState ? 'ant-pro-core-field-label-active' : ''
      ]

      const iconClose = <a-icon type="close" class="ant-pro-core-field-label-icon ant-pro-core-field-label-close" onClick={(e) => { e.stopPropagation(); this.queryParam[item.dataIndex] = '' }}/>
      const iconDown = <a-icon type="down" class="ant-pro-core-field-label-icon ant-pro-core-field-label-arrow" />
      const content = formTypeMap[item.valueType]
      console.log('🚀 ~ file: query-filter-mini.jsx ~ line 125 ~ filterItem ~ item.valueType', item.valueType)
      console.log('🚀 ~ file: query-filter-mini.jsx ~ line 125 ~ filterItem ~ content', content)

      let titleTemp
      if (itemState) {
        if (item.valueType === 'option') {
          Object.keys(item.valueEnum).some(key => {
            if (item.valueEnum[key].status === this.queryParam[item.dataIndex]) {
              titleTemp = item.valueEnum[key].text
              return true
            } else {
              return false
            }
          })
        } else {
          titleTemp = this.queryParam[item.dataIndex]
        }
      }

      const title = itemState && titleTemp
      const titleContent = itemState && `: ${titleTemp}`

      return <div class="ant-pro-form-light-filter-item">
          <div class="ant-row ant-form-item" class={{ 'ant-form-item-has-success': itemState }}>
            <div class="ant-col ant-form-item-control">
              <div class="ant-form-item-control-input">
                <div class="ant-form-item-control-input-content">
                  <a-dropdown v-model={this.queryParamState[item.dataIndex]} trigger={['click']} >
                    <span
                      class={activeClass}
                      onClick={e => { e.preventDefault() }}
                    >
                      <span title={title}>{label} {titleContent}</span>
                      {iconDown}
                      {itemState && iconClose}
                    </span>
                    <template slot="overlay">
                      {content(item)}
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    })

    return (
      <div class="ant-pro-table-list-toolbar-setting-item ant-pro-table-list-toolbar-mini-search">
        <div class="ant-pro-form-light-filter-container">
          {filterItem}
        </div>
      </div>
    )
  }
}

export default QueryFilterMini
