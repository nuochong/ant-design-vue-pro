<script>
export default {
  props: {
    jsx: {
      type: Function
    }
  },
  render (createElement, context) {
    return this.jsx(createElement, context)
  },
  name: 'Jsx'
}
</script>
