<template>
  <span :class="className + ' headerSearch'" @click="enterSearchMode">
    <a-icon type="search" key="Icon" />
    <auto-complete
      key="AutoComplete"
      :class="'input '+ (searchMode ? 'show' : '')"
      @change="(value)=>onSearchChange(value)"
      :dataSource="dataSource"
      @search="onSearch"
      :value="value"
      ref="complete">
      <a-input :placeholder="placeholder" @keydown="(e)=>onKeyDown(e)" @blur="()=>leaveSearchMode()" class="search-input" />
    </auto-complete>
  </span>
</template>

<script>
import { EventBus } from '../event-bus.js'
import { AutoComplete } from 'ant-design-vue'
export default {
  name: 'HeaderSearch',
  components: { AutoComplete },
  props: {
    onPressEnter: {
      type: Function
    },
    placeholder: {
      type: String
    },
    className: {
      type: String
    },
    dataSource: {
      type: Array
    },
    onSearch: {
      type: Function
    },
    onChange: {
      type: Function
    }
  },
  destroyed () {
    clearTimeout(this.timeout)
  },
  data () {
    return {
      value: '',
      searchMode: false,
      state: open
    }
  },
  mounted () {
    // console.log('complete', this.$refs.complete)
  },
  methods: {
    onKeyDown (e) {
      if (e.key === 'Enter') {
        this.timeout = setTimeout(() => {
          this.onPressEnter(this.value) // Fix duplicate onPressEnter
        }, 0)
      }
    },
    onSearchChange (value) {
      this.value = value
      if (this.onChange) {
        this.onChange()
      }
    },
    enterSearchMode () {
      this.searchMode = true
      EventBus.$emit('searchState', true)
      // this.input.focus();
    },
    leaveSearchMode () {
      this.blur()
      this.value = ''
      this.searchMode = false
      EventBus.$emit('searchState', false)
    },
    blur () {
      this.$refs.complete.blur()
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';

.layout.ant-layout .header .user-wrapper .action:hover {
  background: none;
}
.search-input {
}
</style>
