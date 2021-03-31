import PropTypes from 'ant-design-vue/es/_util/vue-types'
import './query-filter.css'
import { EventBus } from '../../event-bus'
// import 'ant-design-vue/es/layout/style'
// import Layout from 'ant-design-vue/es/layout'
import 'ant-design-vue/es/select/style'
import Select from 'ant-design-vue/es/select'
import ResponsiveObserve from 'ant-design-vue/es/_util/responsiveObserve'

export const QueryFilterProps = {
  columns: PropTypes.array,
  submitText: PropTypes.string,
  resetText: PropTypes.string,
  layout: PropTypes.oneOf(['vertical', 'horizontal']).def('horizontal'), // "vertical":垂直 "horizontal"：水平
  collapseRender: PropTypes.bool.def(true),
  optionRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(undefined)
}

const QueryFilter = {
  name: 'QueryFilter',
  props: QueryFilterProps,
  components: {
  },
  data () {
    return {
      screens: {},
      targetIndex: '',
      formLayout: 'inline',
      layoutBase: [
        { title: 'xs',
          value: null
        },
        { title: 'sm',
          value: null
        },
        { title: 'md',
          value: null
        },
        { title: 'lg',
          value: null
        },
        { title: 'xl',
          value: null
        },
        { title: 'xxl',
          value: null
        }
      ],
      baseWdith: 0,
      rowInputNumber: 0,
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
      },
      baseLayout: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 12,
        xl: 8,
        xxl: 6
      },
      btnOffset: 0
    }
  },
  mounted () {
    console.log('submitText', this.submitText)
    console.log('resetText', this.resetText)
    this.$nextTick(() => {
      this.token = ResponsiveObserve.subscribe(screens => {
        this.screens = screens
        for (const item in this.layoutBase) {
          this.layoutBase[item].value = null
          const title = this.layoutBase[item].title
          if (this.screens[title]) {
            this.layoutBase[item].value = this.screens[title]
          }
        }

        const temp = this.layoutBase.slice().reverse()
        temp.some(item => {
          if (item.value) {
            this.targetIndex = item
          }
          return item.value
        })

        if (!this.layout) {
          if (this.baseLayout[this.targetIndex.title] === 24) {
            this.formLayout = 'vertical'
          } else {
            this.formLayout = 'inline'
          }
        } else {
          this.formLayout = this.layout === 'horizontal' ? 'inline' : 'vertical'
        }

        this.handleCollsped()
      })
    })
  },
  beforeDestroy () {
    ResponsiveObserve.unsubscribe(this.token)
  },
  watch: {
    advanced (newVal) {
      this.handleCollsped()
    }
  },
  computed: {
    topArr () {
      const endNum = this.rowInputNumber > 1 ? this.rowInputNumber - 1 : 1
      return this.columns.slice(0, endNum)
    },
    bottomArr () {
      const endNum = this.rowInputNumber > 1 ? this.rowInputNumber - 1 : 1
      return this.columns.slice(endNum)
    }
  },
  methods: {
    handleCollsped () {
      this.baseWdith = this.baseLayout[this.targetIndex.title]
      this.rowInputNumber = 24 / this.baseWdith
      const topArrLen = this.topArr.length
      const columnsType = !this.advanced ? topArrLen : topArrLen + this.bottomArr.length
      const otherInputNumber = columnsType % this.rowInputNumber
      this.btnOffset = (this.rowInputNumber - otherInputNumber - 1) * this.baseWdith
    },
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
    // const { columns } = this.$props
    const proFormText = (item) => {
      // const asyncProps = {
      //   on: {
      //     onInput: e => { this.queryParam[item.dataIndex] = e.target.value }
      //   },
      //   value: this.queryParam[item.dataIndex]
      // }
      return <a-input v-model={this.queryParam[item.dataIndex]} placeholder={this.$t('tableForm.inputPlaceholder')} />
      // return <a-input {...asyncProps} placeholder="请输入" />
    }
    const proFormNumber = (item) => {
      return <a-input-number v-model={this.queryParam[item.dataIndex]} class="search-input" placeholder={this.$t('tableForm.inputPlaceholder')} />
    }

    const proFormDatePicker = (item) => {
      return <a-date-picker type="data" show-time v-model={this.queryParam[item.dataIndex]} placeholder={this.$t('tableForm.selectPlaceholder')} class="search-input" />
    }

    const proFormSelect = (item) => {
      const options = Object.keys(item.valueEnum).map(child => {
        return <Select.Option value={child} >{item.valueEnum[child].text}</Select.Option>
      })

      const value = this.queryParam[item.dataIndex]
      return <Select placeholder={this.$t('tableForm.selectPlaceholder')} value={value} onSelect={(value) => { this.handleChange(value, item) }}>
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
      topArr: this.topArr,
      bottomArr: this.bottomArr
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
        return !item.hideInSearch && <a-col {...{ props: { ...this.baseLayout } } }>
          <a-form-model-item prop={item.dataIndex} rules={item?.formItemProps?.rules || {}} labelCol={{ flex: '0 0 120px' }}>
            <span slot="label">
              {label}
            </span>
            {content(item)}
          </a-form-model-item>
        </a-col>
      })
    }

    const btnHidden = this.advanced && { overflow: 'hidden' } || {}
    const submitText = this.submitText || this.$t('tableForm.search')
    const resetText = this.resetText || this.$t('tableForm.reset')

    const defaultBtnGroup = () => {
      return <span><a-button type="primary" onClick={() => { this.search() }}>{submitText}</a-button>
      <a-button style="margin-left: 8px" onClick={() => { this.reset() }}>{resetText}</a-button></span>
    }
    const form = {
      submit: this.search,
      resetFields: this.reset
    }
    return (
      <a-card bordered={false} class="card-margin card-search">
        <div class="table-page-search-wrapper">
          <a-form-model {...{ props: { model: this.queryParam } }} layout={this.formLayout} ref="ruleForm" >
            <a-row gutter={48}>
              {changeContent('topArr')}
              { (this.advanced || !this.collapseRender) && changeContent('bottomArr')}
              {/* <a-col md={!this.advanced && 8 || 24} sm={24} offset={this.btnOffset}> */}
              {this.collapseRender && <a-col {...{ props: { ...this.baseLayout } } } offset={this.btnOffset}>
                {/* <span class="table-page-search-submitButtons" style={this.advanced && { float: 'right', overflow: 'hidden' } || {}}> */}
                <span class="table-page-search-submitButtons" style={{ ...btnHidden, float: 'right' }}>
                  {this.optionRender ? this.optionRender({ submitText, resetText }, form) : defaultBtnGroup()}
                  <a onClick={() => { this.toggleAdvanced() }} style="margin-left: 8px">
                    {this.advanced ? `${this.$t('tableForm.expand')}` : `${this.$t('tableForm.collapsed')}`}
                    <a-icon type={this.advanced ? 'up' : 'down'} style="margin-left: 0.5em;" />
                  </a>
                </span>
              </a-col>}
            </a-row>
          </a-form-model>
        </div>
      </a-card>
    )
  }
}

export default QueryFilter
