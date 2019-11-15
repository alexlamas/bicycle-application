import Vue from "vue";
import VueRouter from "vue-router";
import Users from "../components/Users.vue";
import Bicycles from "../components/Bicycles.vue";
import Login from "../components/Login.vue";
import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/users"
  },
  {
    path: "/",
    redirect: "/users"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bicycles",
    name: "bicycles",
    component: Bicycles,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) next("login");
  else if (!requiresAuth && currentUser) next("home");
  else next();
});

export default router;
