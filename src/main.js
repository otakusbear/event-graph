import { createApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from "./App.vue";
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'vis/dist/vis.css'
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.css'

library.add(faChevronCircleLeft);


const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(Antd).use(ElementPlus).use(router).use(store)
app.mount("#app");
