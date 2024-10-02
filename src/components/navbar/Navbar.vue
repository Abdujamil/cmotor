<template>
  <div class="nav">
    <div class="nav__title">Меню</div>

    <div class="nav__items">
      <!-- Главное меню: Прослушка звонков -->
      <div class="nav__item nav__item-btn" @click="toggleSubmenu('calls')">
        Прослушка звонков
        <span
          class="nav__arrow"
          :class="{ 'nav__arrow--open': showCallsSubmenu }"
        >
          <!-- SVG стрелки -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.720116 7.28003C0.426629 6.98674 0.426629 6.51122 0.720116 6.21793L6.22174 0.719969C6.36268 0.579125 6.55383 0.5 6.75315 0.5C6.95246 0.5 7.14362 0.579125 7.28455 0.719969L12.7799 6.21164C13.0734 6.50493 13.0734 6.98045 12.7799 7.27374C12.4864 7.56703 12.0106 7.56703 11.7171 7.27374L6.75315 2.31312L1.78292 7.28003C1.48944 7.57332 1.0136 7.57332 0.720116 7.28003Z"
              fill="white"
              fill-opacity="0.6"
            />
          </svg>
        </span>
      </div>
      <div v-if="showCallsSubmenu" class="nav__submenu">
        <div
          class="nav__item"
          :class="{ 'nav__item--active': activeSubmenu === 'allCities' }"
          @click="setActiveSubmenu('allCities')"
        >
          <RouterLink class="nav__link" to="/">Все города</RouterLink>
        </div>
        <!-- <div
          class="nav__item"
          :class="{ 'nav__item--active': activeSubmenu === 'dataEntry' }"
          @click="setActiveSubmenu('dataEntry')"
        >
          <RouterLink class="nav__link" to="/dataEntry">Ввод данных</RouterLink>
        </div> -->
      </div>

      <!-- Главное меню: Статистика -->
      <div class="nav__item nav__item-btn" @click="toggleSubmenu('stats')">
        Статистика
        <span
          class="nav__arrow"
          :class="{ 'nav__arrow--open': showStatsSubmenu }"
        >
          <!-- SVG стрелки -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.720116 7.28003C0.426629 6.98674 0.426629 6.51122 0.720116 6.21793L6.22174 0.719969C6.36268 0.579125 6.55383 0.5 6.75315 0.5C6.95246 0.5 7.14362 0.579125 7.28455 0.719969L12.7799 6.21164C13.0734 6.50493 13.0734 6.98045 12.7799 7.27374C12.4864 7.56703 12.0106 7.56703 11.7171 7.27374L6.75315 2.31312L1.78292 7.28003C1.48944 7.57332 1.0136 7.57332 0.720116 7.28003Z"
              fill="white"
              fill-opacity="0.6"
            />
          </svg>
        </span>
      </div>

      <div v-if="showStatsSubmenu" class="nav__submenu">
        <div
          class="nav__item"
          :class="{ 'nav__item--active': activeSubmenu === 'statisticCity' }"
          @click="setActiveSubmenu('statisticCity')"
        >
          <RouterLink class="nav__link" to="/statisticCity"
            >Сводная по городам</RouterLink
          >
        </div>

        <div
          class="nav__item"
          :class="{
            'nav__item--active': activeSubmenu === 'statisticCityTradeIn'
          }"
          @click="setActiveSubmenu('statisticCityTradeIn')"
        >
          <RouterLink class="nav__link" to="/statisticCityTradeIn"
            >Сводная по городам трейд-ин</RouterLink
          >
        </div>
        <div
          class="nav__item"
          :class="{ 'nav__item--active': activeSubmenu === 'statisticManager' }"
          @click="setActiveSubmenu('statisticManager')"
        >
          <RouterLink class="nav__link" to="/statisticManager"
            >Сводная по менеджерам</RouterLink
          >
        </div>
      </div>

      <!-- Главное меню: NPS рассылка -->
      <div class="nav__item nav__item-btn" @click="toggleSubmenu('nps')">
        NPS рассылка
        <span
          class="nav__arrow"
          :class="{ 'nav__arrow--open': showNPSSubmenu }"
        >
          <!-- SVG стрелки -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.720116 7.28003C0.426629 6.98674 0.426629 6.51122 0.720116 6.21793L6.22174 0.719969C6.36268 0.579125 6.55383 0.5 6.75315 0.5C6.95246 0.5 7.14362 0.579125 7.28455 0.719969L12.7799 6.21164C13.0734 6.50493 13.0734 6.98045 12.7799 7.27374C12.4864 7.56703 12.0106 7.56703 11.7171 7.27374L6.75315 2.31312L1.78292 7.28003C1.48944 7.57332 1.0136 7.57332 0.720116 7.28003Z"
              fill="white"
              fill-opacity="0.6"
            />
          </svg>
        </span>
      </div>

      <div v-if="showNPSSubmenu" class="nav__submenu">
        <div
          class="nav__item"
          :class="{ 'nav__item--active': activeSubmenu === 'npsList' }"
          @click="setActiveSubmenu('npsList')"
        >
          <RouterLink class="nav__link" to="/npsList"
            >Статистика NPS</RouterLink
          >
        </div>
        <div
          class="nav__item"
          :class="{ 'nav__item--active': activeSubmenu === 'npsAdd' }"
          @click="setActiveSubmenu('npsAdd')"
        >
          <RouterLink class="nav__link" to="/npsAdd">Данные NPS</RouterLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Блок Рекомендации -->
  <div class="nav-recommend nav">
    <div class="nav__title">Рекомендации менеджерам:</div>
    <div class="nav__items">
      <div class="nav__item">1. Не продают компанию.</div>
      <div class="nav__item">2. Не обращаются по имени к клиенту.</div>
      <div class="nav__item">3. Почти не закрывают на встречи.</div>
      <div class="nav__item">4. У некоторых нет инициативности.</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Переменные для управления видимостью подменю и отслеживания активных пунктов меню
const showCallsSubmenu = ref(false);
const showStatsSubmenu = ref(false);
const showNPSSubmenu = ref(false);
const activeMenu = ref("allCities"); // Активное главное меню
const activeSubmenu = ref("allCities"); // Активное подменю

// Функция переключения видимости подменю
const toggleSubmenu = (submenu) => {
  if (submenu === "calls") {
    showCallsSubmenu.value = !showCallsSubmenu.value;
    // showStatsSubmenu.value = false;
    // showNPSSubmenu.value = false;
    activeMenu.value = "calls"; // Устанавливаем активное главное меню
  } else if (submenu === "stats") {
    showStatsSubmenu.value = !showStatsSubmenu.value;
    // showCallsSubmenu.value = false;
    // showNPSSubmenu.value = false;
    activeMenu.value = "stats";
  } else if (submenu === "nps") {
    showNPSSubmenu.value = !showNPSSubmenu.value;
    // showCallsSubmenu.value = false;
    // showStatsSubmenu.value = false;
    // activeMenu.value = "nps";
  }
};

// Установка активного подменю
const setActiveSubmenu = (item) => {
  activeSubmenu.value = item;
};
</script>

<style lang="scss">
@import "./navbar.scss";

.nav__arrow {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s ease;
  transform: rotate(180deg);
}

.nav__arrow--open {
  transform: rotate(0deg);
}
</style>
