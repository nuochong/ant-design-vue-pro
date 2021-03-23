<template>
  <div :class="wrpCls">
    <header-search
      class="action search"
      :placeholder="i18nRender('component.globalHeader.search')"
      :dataSource="dataSource"
      :onSearch="(value) => onSearch(value)"
      :onPressEnter="(value) => onPressEnter(value)"
      v-if="!isMobile"/>

    <a-tooltip placement="bottom">
      <template slot="title">
        <span>{{ i18nRender('component.globalHeader.help') }}</span>
      </template>
      <a href="https://pro.ant.design/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
    </a-tooltip>

    <notice-icon class="action"/>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <span class="development-state">
      <a-tag color="orange" v-if="isDev ">dev</a-tag>
    </span>
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import HeaderSearch from '../HeaderSearch'
// import { deviceMixin } from '@/store/device-mixin'
import { i18nRender } from '@/locales'

export default {
  name: 'RightContent',
  components: {
    NoticeIcon,
    AvatarDropdown,
    SelectLang,
    HeaderSearch
  },
  // mixins: [deviceMixin],
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      i18nRender,
      showMenu: true,
      currentUser: {},
      env: process.env.NODE_ENV
    }
  },
  computed: {
    dataSource () {
      return [
        'component.globalHeader.search.example1',
        'component.globalHeader.search.example2',
        'component.globalHeader.search.example3'].map(item => {
        return this.i18nRender(item)
      })
    },
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    },
    isDev () {
      return this.env === 'development'
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: 'Serati Ma'
      }
    }, 1500)
  }
}
</script>

<style lang="less">
.ant-pro-top-nav-header.dark .ant-pro-global-header-index-right .development-state .ant-tag-orange {
    color: #e89a3c;
    background: #2b1d11;
    border-color: #593815;
}
</style>
