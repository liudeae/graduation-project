import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate';


const app = createApp(App);
const pinia = createPinia()


app.use(ElementPlus);
app.use(pinia);
pinia.use(piniaPersistedState)
app.mount('#app');
