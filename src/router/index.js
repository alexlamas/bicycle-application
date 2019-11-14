import Vue from "vue";
import VueRouter from "vue-router";
import Users from "../components/Users.vue";
import Bicycles from "../components/Bicycles.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "users",
    component: Users
  },
  {
    path: "/bicycles",
    name: "bicycles",
    component: Bicycles
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
