import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate';
import {IndexedDBStore} from "@/others/IndexedDBStore.ts";

const app = createApp(App);
const pinia = createPinia()
IndexedDBStore.setItem('test', 1);
let item = IndexedDBStore.getItem('test');
if (item === 1 ) {
    console.log('ok');
}
IndexedDBStore.clear();
console.log(item);
app.use(ElementPlus);
app.use(pinia);
pinia.use(
    piniaPersistedState({
    storage: {
        getItem: IndexedDBStore.getItem,
        setItem: IndexedDBStore.getItem,
        removeItem: IndexedDBStore.getItem,
        clear: IndexedDBStore.clear,
    }
}));
// pinia.use(piniaPersistedState)
app.mount('#app');