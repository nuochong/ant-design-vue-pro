<template>
  <!-- <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  > -->
  <a-dropdown
    v-model="visible"
    :trigger="['click']"
    overlayClassName="antd-pro-components-header-dropdown-index-container"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    placement="bottomLeft"
    :overlayStyle="{ width: isMobile ? '100%' : '336px', top: '68px' }">
    <!-- <template slot="content"> -->
    <template slot="overlay" class="ant-dropdown-menu-nested-loading">
      <div>
        <a-tabs class="antd-pro-components-notice-icon-index-tabs" :animated="false">
          <a-tab-pane :tab="`${i18nRender('component.globalHeader.notification')}(3)`" key="1">
            <a-spin :spinning="loading">
              <a-list>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="左侧图标用于区分不同的类型" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png"/>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="内容不要超过两行字，超出时自动截断" description="一年前">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-spin>

            <div class="antd-pro-components-notice-icon-notice-list-bottomBar">
              <div>{{ i18nRender('component.noticeIcon.clear') }} {{ i18nRender('component.globalHeader.notification') }}</div>
              <div>{{ i18nRender('component.noticeIcon.view-more') }}</div>
            </div>
          </a-tab-pane>
          <a-tab-pane :tab="`${i18nRender('component.globalHeader.message')}(2)`" key="2">
            <a-spin :spinning="loading">
              <a-list>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="曲丽丽 评论了你">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg"/>
                    <div slot="description">
                      <div class="antd-pro-components-notice-icon-notice-list-description">描述信息描述信息描述信息</div>
                      <div class="antd-pro-components-notice-icon-notice-list-datetime">4 年前</div>
                    </div>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="朱偏右 回复了你">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg"/>
                    <div slot="description">
                      <div class="antd-pro-components-notice-icon-notice-list-description">这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像</div>
                      <div class="antd-pro-components-notice-icon-notice-list-datetime">4 年前</div>
                    </div>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta title="标题">
                    <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg"/>
                    <div slot="description">
                      <div class="antd-pro-components-notice-icon-notice-list-description">这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像</div>
                      <div class="antd-pro-components-notice-icon-notice-list-datetime">4 年前</div>
                    </div>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-spin>
            <div class="antd-pro-components-notice-icon-notice-list-bottomBar">
              <div>{{ i18nRender('component.noticeIcon.clear') }} {{ i18nRender('component.globalHeader.message') }}</div>
              <div>{{ i18nRender('component.noticeIcon.view-more') }}</div>
            </div>
          </a-tab-pane>
          <a-tab-pane :tab="`${i18nRender('component.globalHeader.event')}(1)`" key="3">
            <a-spin :spinning="loading">
              <a-list>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta description="任务需要在 2017-01-12 20:00 前启动">
                    <template slot="title">
                      任务名称
                      <div class="antd-pro-components-notice-icon-notice-list-extra">
                        <a-tag>未开始</a-tag>
                      </div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta description="冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务">
                    <template slot="title">
                      第三方紧急代码变更
                      <div class="antd-pro-components-notice-icon-notice-list-extra">
                        <a-tag color="red">马上到期</a-tag>
                      </div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta description="指派竹尔于 2017-01-09 前完成更新并发布">
                    <template slot="title">
                      信息安全考试
                      <div class="antd-pro-components-notice-icon-notice-list-extra">
                        <a-tag color="orange">已耗时 8 天</a-tag>
                      </div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
                <a-list-item class="antd-pro-components-notice-icon-notice-list-item">
                  <a-list-item-meta description="冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务">
                    <template slot="title">
                      ABCD 版本发布
                      <div class="antd-pro-components-notice-icon-notice-list-extra">
                        <a-tag color="blue">进行中</a-tag>
                      </div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-spin>
            <div class="antd-pro-components-notice-icon-notice-list-bottomBar">
              <div>{{ i18nRender('component.noticeIcon.clear') }} {{ i18nRender('component.globalHeader.event') }}</div>
              <div>{{ i18nRender('component.noticeIcon.view-more') }}</div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge count="12">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-dropdown>
  <!-- </a-popover> -->
</template>

<script>
import { i18nRender } from '@/locales'

export default {
  name: 'HeaderNotice',
  props: {
    isMobile: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      i18nRender,
      loading: false,
      visible: false
    }
  },
  methods: {
    fetchNotice () {
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 2000)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
    .antd-pro-components-header-dropdown-index-container>* {
    background-color: #fff;
    border-radius: 4px;
        box-shadow: 0 6px 16px -8px rgb(0 0 0 / 8%), 0 9px 28px 0 rgb(0 0 0 / 5%), 0 12px 48px 16px rgb(0 0 0 / 3%);
  }
  .ant-pro-global-header-index-light .action {
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    height: 100%;
    color: rgba(0, 0, 0, 0.65);
}

</style>
<style lang="less">
.ant-pro-top-nav-header {
    .ant-pro-global-header-index-right {
      float: right;
      height: 100%;

      .action {
        cursor: pointer;
        padding: 0 12px;
        display: inline-block;
        transition: all 0.3s;
        height: 100%;
        color: rgba(0, 0, 0, 0.65);

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }

        .avatar {
          margin: 20px 8px 20px 0;
          color: #1890ff;
          background: hsla(0, 0%, 100%, 0.85);
          vertical-align: middle;
        }

        .icon {
          font-size: 16px;
          padding: 4px;
        }
      }
    }
    &.dark {
      .ant-pro-global-header-index-right {
        .action {
          color: rgba(255, 255, 255, 0.85);
          a {
            color: rgba(255, 255, 255, 0.85);
          }

          &:hover {
            background: rgba(255, 255, 255, 0.16);
          }
        }
        .ant-pro-account-avatar {
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }
}

</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
  .antd-pro-components-notice-icon-notice-list-bottomBar {
    height: 46px;
    color: rgba(0,0,0,.85);
    line-height: 46px;
    text-align: center;
    border-top: 1px solid #f0f0f0;
    border-radius: 0 0 2px 2px;
    transition: all .3s;
    div {
      display: inline-block;
      width: 50%;
      cursor: pointer;
      transition: all .3s;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  .antd-pro-components-notice-icon-notice-list-description {
    font-size: 12px;
    line-height: 1.5715;
  }
  .antd-pro-components-notice-icon-notice-list-extra {
    float: right;
    margin-top: -1.5px;
    margin-right: 0;
    color: rgba(0,0,0,.45);
    font-weight: 400;
  }

  .antd-pro-components-notice-icon-notice-list-item {
    padding-right: 24px;
    padding-left: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: all .3s;
  }
  .antd-pro-components-notice-icon-index-tabs {
    .ant-tag {
      margin-right: 0px;
    }
  }
  .antd-pro-components-notice-icon-notice-list-bottomBar div:not(:only-child):last-child {
    border-left: 1px solid #f0f0f0;
}
/deep/.antd-pro-components-notice-icon-index-tabs .ant-tabs-nav-wrap {
    text-align: center;
}

</style>
