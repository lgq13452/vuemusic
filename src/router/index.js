import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Hot from "../views/Hot.vue";
import Search from "../views/Search.vue";
import SongSheetPage from "../views/SongSheetPage.vue";



Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/hot",
    name: "Hot",
    component: Hot
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/SongSheetPage",
    name: "SongSheetPage",
    component: SongSheetPage,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  // mode: 'history',
  routes
});

export default router;