<template>
    <div class="settings-container">
        <h1>设置</h1>
        <div class="settings-form">
            <div class="setting-item">
                <label for="theme">主题</label>
                <select id="theme" v-model="theme">
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                </select>
            </div>

            <div class="setting-item">
                <label for="notifications">启用通知</label>
                <input type="checkbox" id="notifications" v-model="notifications" />
            </div>

            <div class="setting-item">
                <label for="language">语言</label>
                <select id="language" v-model="language">
                    <option value="zh">中文</option>
                    <option value="en">英文</option>
                </select>
            </div>

            <div class="setting-item">
                <label for="fontSize">字体大小</label>
                <input type="range" id="fontSize" v-model="fontSize" min="12" max="24" />
                <span>{{ fontSize }}px</span>
            </div>

            <button class="save-button" @click="saveSettings">保存设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">

    const theme ='light'
    const  notifications = true
    const  language = 'zh'
    const  fontSize = 1

    const saveSettings = ()  =>{
        alert('设置已保存！');
        // 这里可以添加保存设置的逻辑，例如将设置发送到服务器或存储在本地
    }
</script>

<style scoped>
.settings-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
}

.settings-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.setting-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-weight: bold;
    color: #555;
}

select, input[type="checkbox"], input[type="range"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.save-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.save-button:hover {
    background-color: #0056b3;
}
</style>