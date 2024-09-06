<script setup>
import { ref } from "vue";

const showCallsSubmenu = ref(false);
const showStatsSubmenu = ref(false);
const activeItem = ref(""); // Track active menu item

const toggleSubmenu = (submenu) => {
  if (submenu === "calls") {
    showCallsSubmenu.value = !showCallsSubmenu.value;
  } else if (submenu === "stats") {
    showStatsSubmenu.value = !showStatsSubmenu.value;
  }
};

const setActiveItem = (item) => {
  activeItem.value = item;
};
</script>

<template>
  <div class="nav">
    <div class="nav__title">Меню</div>

    <div class="nav__items">
      <div
        class="nav__item nav__item-btn"
        :class="{ 'nav__item--active': activeItem === 'calls' }"
        @click="
          toggleSubmenu('calls');
          setActiveItem('calls');
        "
      >
        Прослушка звонков
        <span
          class="nav__arrow"
          :class="{ 'nav__arrow--open': showCallsSubmenu }"
        >
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
        <div class="nav__item">
          <RouterLink class="nav__link" to="/">Все города</RouterLink>
        </div>
        <div
          class="nav__item"
          :class="{ 'nav__submenu--active': activeItem === 'dataEntry' }"
          @click="setActiveItem('dataEntry')"
        >
          <RouterLink class="nav__link" to="/dataEntry">Ввод данных</RouterLink>
        </div>
      </div>

      <div
        class="nav__item nav__item-btn"
        :class="{ 'nav__item--active': activeItem === 'stats' }"
        @click="
          toggleSubmenu('stats');
          setActiveItem('stats');
        "
      >
        Статистика
        <span
          class="nav__arrow"
          :class="{ 'nav__arrow--open': showStatsSubmenu }"
        >
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
        <div class="nav__item">
          <RouterLink class="nav__link" to="/">Сводная по городам</RouterLink>
        </div>
        <div class="nav__item">
          <RouterLink class="nav__link" to="/"
            >Сводная по менеджерам</RouterLink
          >
        </div>
      </div>
    </div>
  </div>

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

<style lang="scss">
@import "./navbar.scss";

.nav__submenu {
  padding-left: 34px;
}

.nav__arrow {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.nav__arrow--open {
  transform: rotate(180deg);
}
</style>

<style lang="scss">
@import "./navbar.scss";
</style>
