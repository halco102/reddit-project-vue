import { createApp } from 'vue'
import App from './App.vue'
import BootStrapVue3 from 'bootstrap-vue-3'
import { createPinia } from 'pinia'
import router from './router'


// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

const pinia = createPinia();

const app = createApp(App);
app.use(router)
app.use(pinia)
app.use(BootStrapVue3)
app.mount('#app')
