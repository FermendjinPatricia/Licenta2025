import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

//localStorage.removeItem("token");
//localStorage.removeItem("user");

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch((error) => console.error('❌ Service Worker registration failed:', error));
  }
  