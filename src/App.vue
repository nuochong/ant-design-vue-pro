<template>
  <a-config-provider :locale="locale">
    <div id="app" class="app">
      <div class="inner-spin"><a-spin size="large"></a-spin></div>
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>

<style lang="less">
  .inner-spin {
    position: absolute;
    margin-top: 100px;
    width: 100%;
    text-align: center;
    z-index:-1;
  }
  #app.app {
    background-image: none;
  }
</style>
