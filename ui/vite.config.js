import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    plugins: [vue(),wasm()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        build: {
            target: 'esnext',
        }
    },
});
