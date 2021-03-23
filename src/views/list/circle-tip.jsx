import PropTypes from 'ant-design-vue/es/_util/vue-types'

// import 'ant-design-vue/es/layout/style'
// import Layout from 'ant-design-vue/es/layout'

const WrapContentProps = {
  title: PropTypes.any,
  tip: PropTypes.any
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
      title,
      tip
    } = this.$props
    return (
      <span>
        {title}&nbsp;
        <a-tooltip title={tip}>
          <a-icon type="exclamation-circle" />
        </a-tooltip>
      </span>
    )
  }
}

export default CircleTip
