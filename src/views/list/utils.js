const protocol = 'https:'

exports.assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    `${protocol}//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js`,
    `${protocol}//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js`,
    `${protocol}//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js`,
    `${protocol}//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js`
  ]
}

const isProd = process.env.NODE_ENV === 'production'
const isElectron = process.env.VUE_APP_TYPE === 'electron'

exports.isProd = isProd
exports.isElectron = isElectron

function isPlainObject (val) {
  return toString.call(val) === '[object Object]'
}

function deepMerge (...objs) {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return JSON.parse(JSON.stringify(result))
}

exports.deepMerge = deepMerge
