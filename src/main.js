import Vue from 'vue'
import Element from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import $ from 'jquery'
import md5 from 'js-md5'
import vueHljs from "vue-hljs";
import "vue-hljs/dist/vue-hljs.min.css";

Vue.config.productionTip = false

Vue.use(Element, { size: 'mini', zIndex: 3000 });
Vue.prototype.$ = $;
Vue.prototype.$md5 = md5
Vue.use(vueHljs)

new Vue({
  render: h => h(App),
}).$mount('#app')
