import PropTypes from 'ant-design-vue/es/_util/vue-types'

// import 'ant-design-vue/es/layout/style'
// import Layout from 'ant-design-vue/es/layout'

const WrapContentProps = {
  title: PropTypes.string,
  menus: PropTypes.array,
  className: PropTypes.string,
  btnStyle: PropTypes.string,
  btnSelect: PropTypes.any
}

const TableDropdown = {
  name: 'TableDropdown',
  props: WrapContentProps,
  data () {
    return {
      isRouterAlive: true
    }
  },
  mounted () {

  },
  render (h) {
    const {
      menus,
      className,
      btnStyle,
      btnSelect
    } = this.$props

    const menuItem = menus.map((item) => {
      return <a-menu-item key={item.key}>
        {/* <a href="javascript:;" onClick={() => { item.onSelect() }}>{item.name}</a> */}
        <a href="javascript:;">{item.name}</a>
      </a-menu-item>
    })
    return (
      <a-dropdown trigger={['hover']} slot="tabBarExtraContent" class={className}>
        <a class="ant-dropdown-link ant-pro-multi-tab-dropdown-menu-btn" href="javascript:;" style={btnStyle}>
          <a-icon type="ellipsis" />
        </a>
        <template class="table-drop-down-wrap" slot="overlay">
          <a-menu {...{ on: { click: (data) => { btnSelect(data) } } }}>
            {menuItem}
          </a-menu>
        </template>
      </a-dropdown>
    )
  }
}

export default TableDropdown
