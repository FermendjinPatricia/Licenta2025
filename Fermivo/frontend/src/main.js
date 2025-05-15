import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

localStorage.removeItem("token");
localStorage.removeItem("user");

createApp(App).use(router).mount('#app')
