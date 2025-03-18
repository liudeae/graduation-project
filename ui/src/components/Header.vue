<script setup>

</script>

<template>
    <header>
        <span>文件传输管理</span>
    </header>
</template>

<style scoped>
header {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    margin: 0;
    padding: 20px;
    width: 100%;
    height: 15%;
    box-sizing: border-box;
    border: 1px solid gray;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

header span {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transition: color 0.3s ease;
}

header span:hover {
    color: #ffdd57;
}

@media (max-width: 768px) {
    header {
        height: 10%;
        padding: 10px;
    }

    header span {
        font-size: 18px;
    }
}
</style>