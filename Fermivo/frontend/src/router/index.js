import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import HomePage from "@/views/CheckPricesEuronext.vue";
import HelloPage from "@/views/Hello.vue";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import CheckPrices from "@/views/CheckPrices.vue";
import AddAnunt from "@/views/AddAnunt.vue";
import DetaliiAnunt from "@/views/DetaliiAnunt.vue";
import EditareAnunt from "@/views/EditareAnunt.vue";
import EditareProfil from "@/views/EditareProfil.vue";
import HomeBuyer from "@/views/HomeBuyer.vue";
import OverviewConversatii from "@/views/OverviewConversatii.vue";
import Chat from "@/views/Chat.vue";
import AdminPage from "@/views/AdminPage.vue";
import PremiumInfo from "@/views/PremiumInfo.vue";
import ProfilUtilizator from "@/views/ProfilUtilizator.vue";
import HartaAnunturi from "@/views/HartaAnunturi.vue";
import TrackSofer from "@/views/TrackSofer.vue";
import CamioaneBuyer from "@/views/CamioaneBuyer.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/",
    name: "Hello",
    component: HelloPage,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true, allowedRoles: ["seller"] },
  },
  {
    path: "/check-prices",
    name: "CheckPrices",
    component: CheckPrices,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer", "admin"] },
  },
  // Seller & Buyer  routes
  {
    path: "/profil-utilizator/:id",
    name: "ProfilUtilizator",
    component: ProfilUtilizator,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer", "admin"] }, // doar seller-ul, buyer-ul si admin-ul au voie aici
  },
  {
    path: "/premium",
    name: "PremiumInfo",
    component: PremiumInfo,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer", "admin"] }, // doar seller-ul, buyer-ul si admin-ul au voie aici
  },
  {
    path: "/editare-profil/:id",
    name: "EditareProfil",
    component: EditareProfil,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer"] },
  },
  {
    path: "/chat",
    name: "ChatOverview",
    component: OverviewConversatii,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer"] }, // doar seller-ul si buyer-ul au voie aici
  },
  {
    path: "/chat/:id",
    name: "Chat",
    component: Chat,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer"] }, // doar seller-ul si buyer-ul au voie aici
  },
  {
    path: "/adauga-anunt",
    name: "AddAnunt",
    component: AddAnunt,
    meta: { requiresAuth: true, allowedRoles: ["seller"] }, // doar seller-ul are voie aici
  },
  {
    path: "/editare-anunt/:id",
    name: "EditareAnunt",
    component: EditareAnunt,
    meta: { requiresAuth: true, allowedRoles: ["seller"] }, // doar seller-ul are voie aici
  },
  {
    path: "/anunturi/:id",
    name: "DetaliiAnunt",
    component: DetaliiAnunt,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer", "admin"] },
  },
  // Buyer routes
  {
    path: "/home-buyer",
    name: "HomeBuyer",
    component: HomeBuyer,
    meta: { requiresAuth: true, allowedRoles: ["buyer"] }, // doar buyer-ul are voie aici
  },
  {
    path: "/camioane-cumparator",
    name: "CamioaneCumparator",
    component: CamioaneBuyer,
    meta: { requiresAuth: true, allowedRoles: ["buyer"] }, // doar buyer-ul are voie aici
  },
  {
    path: "/harta-anunturi",
    name: "HartaAnunturi",
    component: HartaAnunturi,
    meta: { requiresAuth: true, allowedRoles: ["seller", "buyer", "admin"] }, // toți au voie aici
  },
  // Admin routes
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminPage,
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    // Sofer tracking routes
    path: "/track/:token",
    name: "TrackSofer",
    component: TrackSofer,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guard global pentru autentificare & roluri
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAuthenticated = !!localStorage.getItem("token");

  // Verifică dacă e necesară autentificarea
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated &&
    !token
  ) {
    alert("Trebuie să fii autentificat pentru a accesa această pagină.");
    return next("/");
  }

  // Verifică dacă rolul utilizatorului este permis
  const allowedRoles = to.meta.allowedRoles || [];
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    alert(`Acces interzis pentru rolul: ${user?.role}`);
    return next("/unauthorized");
  }

  next();
});

export default router;
