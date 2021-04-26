import './index.less'

// import { Icon, Menu, Dropdown } from 'ant-design-vue'
import { Menu, Dropdown } from 'ant-design-vue'
import { i18nRender } from '@/locales'
import i18nMixin from '@/store/i18n-mixin'
import IconLang from './lang-svg'

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
    },
    isMobile: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    IconLang
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
    const trigger = ['hover']
    this.isMobile && trigger.push('click')

    return (
      <Dropdown overlay={langMenu} placement="bottomRight" overlayStyle={{ width: this.isMobile ? '100%' : 'auto' }} trigger={trigger}>
        <span class={prefixCls}>
          <IconLang title={i18nRender('navBar.lang')}></IconLang>
          {/* <Icon type="global" title={i18nRender('navBar.lang')} /> */}
        </span>
      </Dropdown>
    )
  }
}

export default SelectLang
