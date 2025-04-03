import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import HomePage from "@/views/CheckPricesEuronext.vue";
import Hello from "@/views/Hello.vue";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import CheckPrices from "@/views/CheckPrices.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }, // ✅ protejat
  },
  {
    path: "/check-prices",
    name: "CheckPrices",
    component: CheckPrices,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/",
    name: "Hello",
    component: Hello,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 🔒 Guard global pentru rute protejate
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    alert("You must be logged in to access this page.");
    next("/");
  } else {
    next();
  }
});

export default router;
