import Vue from 'vue';
import App from './App';
import store from './store';
import BaseComponent from './mixins/baseComponent'; // 基础组件
import myHeader from './components/my-header/my-header.vue';
import { getSystemInfo } from './utils/tools';
Vue.config.productionTip = false;
App.mpType = 'app';
Vue.component('my-header', myHeader);
Vue.mixin(BaseComponent);
Vue.prototype.$platform = getSystemInfo();
const app = new Vue({ store, ...App });
app.$mount();
