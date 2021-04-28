import PropTypes from 'ant-design-vue/es/_util/vue-types'

// import 'ant-design-vue/es/layout/style'
// import Layout from 'ant-design-vue/es/layout'

const WrapContentProps = {
  title: PropTypes.string,
  menus: PropTypes.array,
  className: PropTypes.string,
  btnStyle: PropTypes.string,
  select: PropTypes.any
}

const CircleTip = {
  name: 'CircleTip',
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
      select
    } = this.$props

    const menuItem = menus.map((item) => {
      return <a-menu-item key={item.key} >
        {/* <a href="javascript:;" onClick={() => { item.onSelect() }}>{item.name}</a> */}
        <a href="javascript:;">{item.name}</a>
      </a-menu-item>
    })
    return (
      <a-dropdown trigger={['hover']} slot="tabBarExtraContent" class={className}>
        <a class="ant-dropdown-link ant-pro-multi-tab-dropdown-menu-btn" href="javascript:;" style={btnStyle}>
          <a-icon type="ellipsis" />
        </a>
        <a-menu slot="overlay" {...{ on: { click: (data) => { select(data) } } }}>
          {menuItem}
        </a-menu>
      </a-dropdown>
    )
  }
}

export default CircleTip
