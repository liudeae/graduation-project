import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus, {ElMessage} from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate';


const app = createApp(App);
const pinia = createPinia()
app.config.errorHandler = (err, vm, info) => {

    console.error('全局捕获的错误:', err);
    console.error('组件:', vm);
    console.error('错误信息:', info);
    ElMessage.error(info)
};

app.use(ElementPlus);
app.use(pinia);
pinia.use(piniaPersistedState)
app.mount('#app');
