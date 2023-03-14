import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)


const app = createApp(App)
app.use(Antd).use(router)
app.mount("#app");
