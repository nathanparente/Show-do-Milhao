import Vue from "vue";
import VueRouter from "vue-router";

function load(component) {
  return () => import(`@/views/${component}/${component}.vue`);
}

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: load("Home"),
  },
  {
    path: "/themes",
    name: "Themes",
    component: () => import("@/views/Themes/Themes.vue"),
  },
  {
    path: "/questions/:questionId",
    name: "questions",
    component: load("Questions"),
  },
  {
    path: "/questions",
    redirect: (to) => {
      return "/questions/1";
    },
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  scrollBehavior() {
    window.scrollTo(0, 0);
  },
});

export default router;
