import PropTypes from 'ant-design-vue/es/_util/vue-types'
import './query-filter.css'
import { EventBus } from '../../components/event-bus'
// import 'ant-design-vue/es/layout/style'
// import Layout from 'ant-design-vue/es/layout'
import 'ant-design-vue/es/select/style'
import Select from 'ant-design-vue/es/select'

const WrapContentProps = {
  columns: PropTypes.any
}

const QueryFilter = {
  name: 'QueryFilter',
  props: WrapContentProps,
  components: {
  },
  data () {
    return {
      isRouterAlive: true,
      // 高级搜索 展开/关闭
      advanced: false,
      queryParam: {
        // '#': '',
        // action: '',
        // callNo: '',
        // description: '',
        // no: '',
        // status: '',
        // updatedAt: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    handleChange (value, item) {
      this.queryParam[item.dataIndex] = value.toString()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    search () {
      console.log('查询', this.queryParam)
      // $refs.table.refresh(true)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log('submit!')
          EventBus.$emit('searchData', this.queryParam)
          EventBus.$emit('search')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset () {
      this.queryParam = {}
    }
  },
  created () {
    this.columns.map(item => {
      const value = item.valueType === 'option' ? undefined : ''
      this.$set(this.queryParam, item.dataIndex, value)
    })
    EventBus.$emit('searchData', this.queryParam)
    console.log('this.queryParam', this.queryParam)
  },
  render (h) {
    const { columns } = this.$props
      const proFormText = (item) => {
        // const asyncProps = {
        //   on: {
        //     onInput: e => { this.queryParam[item.dataIndex] = e.target.value }
        //   },
        //   value: this.queryParam[item.dataIndex]
        // }
        return <a-input v-model={this.queryParam[item.dataIndex]} placeholder={ this.$t('tableForm.inputPlaceholder') } />
        // return <a-input {...asyncProps} placeholder="请输入" />
      }
      const proFormNumber = (item) => {
        return <a-input-number v-model={this.queryParam[item.dataIndex]} class="search-input" placeholder={ this.$t('tableForm.inputPlaceholder') } />
      }

      const proFormDatePicker = (item) => {
        return <a-date-picker type="data" show-time v-model={this.queryParam[item.dataIndex]} placeholder={ this.$t('tableForm.selectPlaceholder') } class="search-input" />
      }

      const proFormSelect = (item) => {
        const options = Object.keys(item.valueEnum).map(child => {
          return <Select.Option value={child} >{item.valueEnum[child].text}</Select.Option>
        })

      const value = this.queryParam[item.dataIndex]
      return <Select placeholder={ this.$t('tableForm.selectPlaceholder') } value={value} onSelect={(value) => { this.handleChange(value, item) }}>
        {options}
        </Select>
      }

      // const proFormTimePicker = (item) => {
      //   return <a-time-picker use12-hours placeholder={ this.$t('tableForm.selectPlaceholder') }/>
      // }
      // const advancedRender = bottomArr.map((item) => <fragment></fragment> )
      const formTypeMap = {
        'text': proFormText,
        'number': proFormNumber,
        'data': proFormDatePicker,
        'dateTime': proFormDatePicker,
        'option': proFormSelect
      }
      const changeContentMap = {
        topArr: columns.slice(0, 2),
        bottomArr: columns.slice(2)
      }
      const labelTip = (item) => {
        return <span>
        {item.title || item.titleOld}&nbsp;
        <a-tooltip title={item.tip}>
          <a-icon type="exclamation-circle" />
        </a-tooltip>
        </span>
      }
      const changeContent = (type) => {
        return changeContentMap[type].map((item) => {
          let label = item.title
          if (item.tip) {
            label = labelTip(item)
          }

          const content = formTypeMap[item.valueType]
          return !item.hideInSearch && <a-col md={8} sm={24}>
            <a-form-model-item label={label} prop={item.dataIndex} rules={item?.formItemProps?.rules || {} }>
              {content(item)}
            </a-form-model-item>
          </a-col>
          })
      }

    return (
      <a-card bordered={false} class="card-margin card-search">
      <div class="table-page-search-wrapper">
        <a-form-model {...{ props: { model: this.queryParam } }} layout="inline" ref="ruleForm" >
          <a-row gutter={48}>
            {changeContent('topArr')}
            {this.advanced && changeContent('bottomArr') }
            <a-col md={!this.advanced && 8 || 24} sm={24}>
              <span class="table-page-search-submitButtons" style={this.advanced && { float: 'right', overflow: 'hidden' } || {} }>
                <a-button type="primary" onClick={ () => { this.search() } }>{ this.$t('tableForm.search') }</a-button>
                <a-button style="margin-left: 8px" onClick={() => { this.reset() }}>{ this.$t('tableForm.reset') }</a-button>
                <a onClick={() => { this.toggleAdvanced() }} style="margin-left: 8px">
                  { this.advanced ? `${this.$t('tableForm.collapsed')}` : `${this.$t('tableForm.expand')}` }
                  <a-icon type={this.advanced ? 'up' : 'down'} style="margin-left: 0.5em;"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    )
  }
}

export default QueryFilter
