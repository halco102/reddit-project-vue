import { createApp } from 'vue'
import App from './App.vue'
import BootStrapVue3 from 'bootstrap-vue-3'
import { createPinia } from 'pinia'
import router from './router'
import 'vue-toastification'
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import VueFinalModal from 'vue-final-modal'



// Import Bootstrap an BootstrapVue CSS files (order is important)
//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'


import "vue-toastification/dist/index.css";
import './index.css'


const pinia = createPinia();
const options: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT
}


const app = createApp(App);
app.use(pinia)
app.use(router)
//app.use(BootStrapVue3)
app.use(Toast, options)
app.use(VueFinalModal)
app.mount('#app')

