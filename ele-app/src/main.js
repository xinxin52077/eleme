import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入重置样式
import './assets/reset.css'
// 移动端1px边框的解决
import './assets/stylus/index.styl'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
