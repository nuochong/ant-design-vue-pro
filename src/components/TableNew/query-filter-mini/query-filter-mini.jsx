import PropTypes from 'ant-design-vue/es/_util/vue-types'
import './query-filter-mini.css'

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
      endOpen: false
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

  },
  created () {

  },
  render (h) {
    const isActive = true
    const activeClass = [
      'ant-pro-core-field-label',
      'ant-pro-core-field-label-middle',
      'ant-pro-core-field-label-allow-clear',
      isActive ? 'ant-pro-core-field-label-active' : ''
    ]
    return (
      <div class="ant-pro-table-list-toolbar-setting-item ant-pro-table-list-toolbar-mini-search">
        <div class="ant-pro-form-light-filter-container">
          <div class="ant-pro-form-light-filter-item">
            <div class="ant-row ant-form-item" class={{ 'ant-form-item-has-success': true }}>
              <div class="ant-col ant-form-item-control">
                <div class="ant-form-item-control-input">
                  <div class="ant-form-item-control-input-content">
                    <a-dropdown v-model={this.visibleDropdown} trigger={['click']}>
                      <span
                        class={ activeClass }
                        onClick={e => { e.preventDefault(); this.endOpen = true }}
                      >
                        <span title="2229999999">Name: 2229999999</span>
                        <a-icon type="close" class="ant-pro-core-field-label-icon ant-pro-core-field-label-close" />
                        <a-icon type="down" class="ant-pro-core-field-label-icon ant-pro-core-field-label-arrow" />
                      </span>
                      {/* <a-menu slot="overlay">
                        <a-menu-item key="0">
                          <a href="http://www.alipay.com/">1st menu item</a>
                        </a-menu-item>
                      </a-menu> */}
                      <template slot="overlay">
                        {/* <a-date-picker type="data" show-time placeholder="请选择" class="search-input" open={this.endOpen}/> */}
                        <div class="ant-pro-core-field-dropdown-overlay">
                          <div class="ant-pro-core-field-dropdown-content">
                            <div class="ant-pro-field-light-wrapper-container">
                              <a-input placeholder={this.$t('tableForm.inputPlaceholder')} allowClear />
                            </div>
                          </div>
                          <div class="ant-pro-core-dropdown-footer">
                            <a-button type="link" size="small" style="visibility: visible;">
                              {this.$t('form.lightFilter.clear')}
                            </a-button>
                            <a-button type="primary" size="small" onClick={() => { this.handleMenuClick() }}>
                              {this.$t('form.lightFilter.confirm')}
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
    )
  }
}

export default QueryFilterMini
