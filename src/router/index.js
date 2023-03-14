import { createRouter,createWebHashHistory} from "vue-router";
import index from '../components/Index.vue'
// import search from '../components/Search.vue'

const routes = [
  {
    path: "/",
    name: "index",
    component: index
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../components/Search.vue"),
  }
]
const router = createRouter({
    //history模式：createWebHistory , hash模式：createWebHashHistory
    history: createWebHashHistory(),
    routes
})
export default router