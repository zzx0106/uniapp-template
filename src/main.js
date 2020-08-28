import Vue from 'vue';
import App from './App';
import store from './store';
import './utils/inject';
import BaseComponent from './mixins/baseComponent'; // 基础组件
// 为何不需要手动引入组件，看这里easycom：https://uniapp.dcloud.io/collocation/pages?id=easycom
// import myHeader from './components/my-header/my-header.vue';
// Vue.component('my-header', myHeader);

import { getSystemInfo } from './utils/tools';
import uviewUi from 'uview-ui';
Vue.use(uviewUi);
Vue.config.productionTip = false;
App.mpType = 'app';
Vue.mixin(BaseComponent);
Vue.prototype.$platform = getSystemInfo();
const app = new Vue({ store, ...App });
app.$mount();