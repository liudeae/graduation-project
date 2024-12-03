<script setup lang="ts">

import { ref, onMounted } from 'vue';

const result = ref<number | null>(null);

onMounted(async () => {
    // 加载并实例化 .wasm 文件
    const wasmModule = await fetch('/src/wasm/add.wasm')
        .then((response) => response.arrayBuffer())
        .then((bytes) => WebAssembly.instantiate(bytes));

    // 获取 WASM 导出的函数
    const { add } = wasmModule.instance.exports as { add: (a: number) => number };

    // 调用 WASM 导出的函数
    add(2);
    result.value = add(2);
    console.log(result.value);  // 输出：WASM 函数执行的结果
});

</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
