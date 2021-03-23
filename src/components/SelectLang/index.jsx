import './index.less'

import { Icon, Menu, Dropdown } from 'ant-design-vue'
import { i18nRender } from '@/locales'
import i18nMixin from '@/store/i18n-mixin'
// import iconLang from './lang.svg'

// const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR']
const locales = ['zh-CN', 'en-US']
const languageLabels = {
  'zh-CN': '简体中文',
  // 'zh-TW': '繁体中文',
  'en-US': 'English'
  // 'pt-BR': 'Português'
}
// eslint-disable-next-line
const languageIcons = {
  'zh-CN': '🇨🇳',
  // 'zh-TW': '🇭🇰',
  'en-US': '🇺🇸'
  // 'pt-BR': '🇧🇷'
}

const SelectLang = {
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    }
  },
  components: {
    // iconLang
  },
  name: 'SelectLang',
  mixins: [i18nMixin],
  render () {
    const { prefixCls } = this
    const changeLang = ({ key }) => {
      this.setLang(key)
    }
    const langMenu = (
      <Menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[this.currentLang]} onClick={changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span class={prefixCls}>
        {/* <iconLang></iconLang> */}
        {/* <svg viewBox="0 0 24 24" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M0 0h24v24H0z" fill="none"></path><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z " class="css-c4d79v"></path>
        </svg> */}
          <Icon type="global" title={i18nRender('navBar.lang')} />
        </span>
      </Dropdown>
    )
  }
}

export default SelectLang
