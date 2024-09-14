import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/choose",
      name: "choose",
      component: () => import("../views/PickView.vue"),
    },
    {
      path: "/start",
      name: "start",
      component: () => import("../views/StartView.vue"),
    },
    {
      path: "/join",
      name: "join",
      component: () => import("../views/FormView.vue"),
    },
    {
      path: "/compare",
      name: "compare",
      component: () => import("../views/CompareView.vue"),
    },
    {
      path: "/:path(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
