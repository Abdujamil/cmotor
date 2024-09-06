<script setup>
import Navbar from "./components/navbar/Navbar.vue";
</script>

<template>
  <header></header>
  <div class="main">
    <div class="container">
      <div class="navbar">
        <Navbar />
      </div>
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>

  <footer></footer>
</template>

<style lang="scss" scoped>
header {
  height: 64px;
}

.main {
  width: 100%;
}

.navbar {
  width: 100%;
  max-width: 20%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.content{
  width: 100%;
  max-width: 80%;
}

.container {
  width: 96%;
  display: flex;
  align-items: start;
  margin: 0 auto;
  gap: 32px;
}

footer {
  height: 100px;
}
</style>
