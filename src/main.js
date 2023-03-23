import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
Vue.use(Autocomplete)
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
