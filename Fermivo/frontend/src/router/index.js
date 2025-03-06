import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import HomePage from "@/views/HomePage.vue";
import WelcomePage from "@/views/WelcomePage.vue";
import Hello from "@/views/Hello.vue";
import About from "@/views/About.vue";
const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: WelcomePage,
  },
  {
    path: "/about",
    name: "About",
    component : About,  
  },
  {
    path: "/hello",
    name: "Hello",
    component: Hello,
  },
  {
    path: "/",
    redirect: "/hello",
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

export default router;
