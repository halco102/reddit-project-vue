import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'vue-toastification'
import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import VueFinalModal from 'vue-final-modal'



import "vue-toastification/dist/index.css";
import './index.css'


const pinia = createPinia();
const options: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT
}



const app = createApp(App);
app.use(pinia)
app.use(router)
app.use(Toast, options)
app.use(VueFinalModal)
app.mount('#app')

