import { createRouter,createWebHashHistory} from "vue-router";
import input from '../components/Input.vue'
import steps from '../components/Steps.vue'
import index from '../components/Index.vue'
import home from '../components/home.vue'
import test from '../components/Analyze.vue'

const routes = [
    {
    path: "/index",
    name: "index",
    component: index
  },{
    path: "/find",
    name: "find",
    component:() => import("../components/Find.vue"),
  },

  {
    path: "/steps",
    name: "steps",
    component:steps
  },{
    path: "/input",
    name: "input",
    component:input
  },{
    path: "/search",
    name: "search",
    component:() => import("../components/Search.vue"),
  },{
    path: "/detail",
    name: "detail",
    component:() => import("../components/Detail.vue"),
  },{
    path: "/example",
    name: "example",
    component:() => import("../components/Example.vue"),
  },
  {
    path: "/triples",
    name: "triples",
    component: () => import("../components/Triples.vue"),
  },
  {
    path: "/schema",
    name: "schema",
    component: () => import("../components/Schema.vue"),
  },
  {
    path: "/graph",
    name: "graph",
    component: () => import("../components/Graph.vue"),
  },
  {
    path: "/lepton",
    name: "lepton",
    component: () => import("../components/lepton.vue"),
  },
  {
    path: "/newgraph",
    name: "newgraph",
    component: () => import("../components/newGraph.vue"),
  },
  {
    path: "/stagegraph",
    name: "stagegraph",
    component: () => import("../components/stageGraph.vue"),
  },
    {
    path: "/actgraph",
    name: "actgraph",
    component: () => import("../components/actGraph.vue"),
  },{
    path: "/events",
    name: "events",
    component: () => import("../components/Events.vue"),
  },

    {
    path: "/TL",
    name: "TL",
    component: () => import("../components/TL.vue"),
  },
    {
    path: "/StoryForest",
    name: "StoryForest",
    component: () => import("../components/StoryForest.vue"),
  },
    {
    path: "/oldgraph",
    name: "oldgraph",
    component: () => import("../components/oldGraph.vue"),
  },
    {
    path: "/neoVis",
    name: "neoVis",
    component: () => import("../components/neoVis.vue"),
  },
    {
    path: "/demo",
    name: "demo",
    component: () => import("../components/demo.vue"),
  },{
    path: "/case",
    name: "case",
    component: () => import("../components/Case.vue"),
  },
  {
    path: "/analyze",
    name: "analyze",
    component: () => import("../components/Analyze.vue"),
  },
  {
    path: "/chart",
    name: "chart",
    component: () => import("../components/Chart.vue"),
  },
  {
    path: "/pattern",
    name: "pattern",
    component: () => import("../components/pattern.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("../components/home.vue"),
  },
]
const router = createRouter({
    //history模式：createWebHistory , hash模式：createWebHashHistory
    history: createWebHashHistory(),
    routes
})
export default router