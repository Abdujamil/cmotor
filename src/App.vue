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

<script setup>
import Navbar from "./components/navbar/Navbar.vue";

window.permissions = Object.fromEntries(new URLSearchParams(location.search))?.permissions?.split(',') || [];

  (async() => {
    try {

      let response = await fetch(
        "https://crystal-motors.ru/method.getStores"
      );

      response = await response.json();
      console.warn("response", response);
      

      window.stores = response.answer;
      console.log("Запрос с фильтрами менеджеров:", window.stores)
    } catch (error) {
      console.error("Ошибка при получении данных клиентов:", error);
    }
  })();


// console.log("permissions", window.permissions);


</script>

<style lang="scss" scoped>
header {
  // height: 64px;
}

.main {
  width: 100%;
  height: 100%;

  
  background-image: url(./assets/rating.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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

  padding: 64px 0 64px 0;
}

footer {
  // height: 100px;
}
</style>
