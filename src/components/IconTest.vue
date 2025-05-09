<template>
  <div class="icon-test-container">
    <h2>Iconify FontAwesome 图标测试</h2>

    <div class="icon-section">
      <h3>使用UnoCSS图标</h3>
      <div class="icons-row">
        <div class="icon-item">
          <div class="i-fa-solid:home text-2xl"></div>
          <span>home</span>
        </div>
        <div class="icon-item">
          <div class="i-fa-solid:user text-2xl"></div>
          <span>user</span>
        </div>
        <div class="icon-item">
          <div class="i-fa-solid:cog text-2xl"></div>
          <span>cog</span>
        </div>
        <div class="icon-item">
          <div class="i-fa-regular:bell text-2xl"></div>
          <span>bell (regular)</span>
        </div>
        <div class="icon-item">
          <div class="i-fa-brands:github text-2xl"></div>
          <span>github</span>
        </div>
      </div>
    </div>

    <div class="icon-section">
      <h3>使用Iconify Vue组件</h3>
      <div class="icons-row">
        <div class="icon-item">
          <IconifyIcon icon="fa-solid:home" :width="24" />
          <span>home</span>
        </div>
        <div class="icon-item">
          <IconifyIcon icon="fa-solid:user" :width="24" />
          <span>user</span>
        </div>
        <div class="icon-item">
          <IconifyIcon icon="fa-solid:cog" :width="24" />
          <span>cog</span>
        </div>
        <div class="icon-item">
          <IconifyIcon icon="fa-regular:bell" :width="24" />
          <span>bell (regular)</span>
        </div>
        <div class="icon-item">
          <IconifyIcon icon="fa-brands:github" :width="24" />
          <span>github</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 不需要额外导入，因为已在main.ts中全局注册了IconifyIcon组件
</script>

<style scoped>
.icon-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.icon-section {
  margin-bottom: 30px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  margin-bottom: 15px;
}

.icons-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
