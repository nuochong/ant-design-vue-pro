<template>
  <a-modal
    title="新建规则"
    :width="520"
    :visible="visible"
    :confirmLoading="loading"
    :footer="false"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID" :colon="false">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="描述" :colon="false">
          <a-input v-decorator="['description', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
        <a-form-item label="描述" :colon="false">
          <a-input v-model="description" type="textarea" :rows="3"/>
          <!-- <a-input v-decorator="['description', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" /> -->
        </a-form-item>
        <a-form-item :colon="false">
          <div class="ant-space ant-space-horizontal ant-space-align-center">
            <div class="ant-space-item" style="margin-right: 8px;">
              <a-button key="back" @click="handleCancel">
                重置
              </a-button>
            </div>

            <div class="ant-space-item" style="margin-right: 8px;">
              <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
                提交
              </a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
    <!-- <template slot="footer">
      <a-button key="back" @click="handleCancel">
        重置
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        提交
      </a-button>
    </template> -->
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['description', 'id']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 }
        // sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 }
        // sm: { span: 13 }
      },
      labelAlign: 'left'
    }
    return {
      form: this.$form.createForm(this),
      description: 'description'
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    handleCancel () {

    },
    handleOk () {

    }
  }
}
</script>

<style lang="less">
.ant-space-align-center {
    align-items: center;
}

.ant-space {
    display: inline-flex;
}
.ant-form-horizontal .ant-form-item {
  &:last-child{
    margin-bottom: 0;
  }
}
.ant-pro-table-column-setting-title{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}
</style>
