<template>
  <div class="dropdowns" ref="filterContainer">
    <p>Показать статистику:</p>
    <div class="my-calendar">
      <VueDatePicker
        v-model="dateRange"
        :format="format"
        locale="ru-RU"
        range
        dark
        multi-calendars
        placeholder="За всё время"
        @update:model-value="handleDateChange"
        select-text="Выбрать"
        cancel-text="Отменить"
        :enable-time-picker="false"
      >
      </VueDatePicker>
    </div>

    <!-- Dropdown for selecting region -->
    <div class="dropdown" ref="regionDropdown" @click.stop>
      <div class="dropdown-toggle" @click="toggleDropdown('region')">
        <span id="dropdown-selected-region">{{
          selectedRegion || "Выбрать регион"
        }}</span>
        <span class="dropdown-arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
              fill="white"
            />
          </svg>
        </span>
      </div>
      <div class="dropdown-menu" v-if="showRegionDropdown">
        <div
          class="dropdown-item"
          v-for="region in regions"
          :key="region"
          @click="selectRegion(region)"
        >
          {{ region }}
        </div>
      </div>
    </div>

    <!-- Dropdown for selecting city -->
    <div class="dropdown" ref="cityDropdown" @click.stop>
      <div class="dropdown-toggle" @click="toggleDropdown('city')">
        <span id="dropdown-selected-city">{{
          selectedCity || "Выбрать город"
        }}</span>
        <span class="dropdown-arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
              fill="white"
            />
          </svg>
        </span>
      </div>
      <div class="dropdown-menu" v-if="showCityDropdown">
        <div
          class="dropdown-item"
          v-for="city in filteredCities"
          :key="city"
          @click="selectCity(city)"
        >
          {{ city }}
        </div>
      </div>
    </div>

    <div
      title="Очистить фильтры"
      v-if="showClearButton"
      @click="clearFilters"
      class="clear-filters"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="18px"
        height="18px"
      >
        <path
          fill="#FFFFFF"
          d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import "v-calendar/style.css";

const showRegionDropdown = ref(false);
const showCityDropdown = ref(false);
const selectedRegion = ref("");
const selectedCity = ref("");

const dateRange = ref(['', '']); // [startDate, endDate]


const handleDateChange = (dates) => {
  const startDate = dates && dates[0] ? new Date(dates[0]) : null;
  const endDate = dates && dates[1] ? new Date(dates[1]) : null;

  // Проверка на валидность дат
  if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
    console.error("Ошибка: некорректные значения дат");
    return; // Прерываем выполнение функции при некорректных датах
  }

  if (startDate && endDate && startDate > endDate) {
    console.error("Ошибка: endDate не может предшествовать startDate");
    return; // Прерываем выполнение функции при некорректных датах
  }

  console.log('Дата выбор:', startDate, endDate); // Лог для проверки
  emit("filterChange", { startDate, endDate }); // Эмитим событие с объектами дат
};


const format = (dates) => {
  if (Array.isArray(dates)) {
    const [startDate, endDate] = dates;
    if (startDate && endDate) {
      const formattedStartDate = startDate.toLocaleDateString("ru-RU");
      const formattedEndDate = endDate.toLocaleDateString("ru-RU");
      return `${formattedStartDate} - ${formattedEndDate}`;
    } else if (startDate) {
      // Если только одна дата выбрана
      return startDate.toLocaleDateString("ru-RU");
    }
  }

  return "";
};

const regions = ref(["Север", "Юг"]);
const cities = ref({
  Север: [
    "Кемерово",
    "Новокузнецк",
    "Барнаул",
    "Красноярск Брянка",
    "Красноярск ПЖ",
    "Томск",
    "Омск",
  ],
  Юг: ["Тюмень", "Сургут", "Пермь", "Самара", "Челябинск",
  "Сургут_ГИ", "Оренбург"]
});

// Функция для обновления фильтров
const updateFilters = () => {
  // Отправляем событие родителю с текущими фильтрами
  emit("filterChange", {
    region: selectedRegion.value,
    city: selectedCity.value
  });
};

// Функция для очистки фильтров
const clearFilters = () => {
  selectedRegion.value = "";
  selectedCity.value = "";
  dateRange.value = null;
  updateFilters(); // Обновляем фильтры и отправляем событие
};

// Вычисляемое свойство для показа/скрытия кнопки очистки
const showClearButton = computed(() => {
  return selectedRegion.value || selectedCity.value;
});

const filteredCities = computed(() => {
  return selectedRegion.value
    ? cities.value[selectedRegion.value]
    : Object.values(cities.value).flat();
});

const toggleDropdown = (type) => {
  if (type === "region") {
    showRegionDropdown.value = !showRegionDropdown.value;
    if (showCityDropdown.value) showCityDropdown.value = false;
  } else if (type === "city") {
    showCityDropdown.value = !showCityDropdown.value;
    if (showRegionDropdown.value) showRegionDropdown.value = false;
  }
};

const emit = defineEmits(["filterChange"]);
const emitFilterChange = () => {
  emit("filterChange", {
    selectedRegion: selectedRegion.value,
    selectedCity: selectedCity.value
  });
};

const selectRegion = (region) => {
  selectedRegion.value = region;
  selectedCity.value = ""; // Reset selected city when changing region
  showRegionDropdown.value = false;
  emitFilterChange();
};

const selectCity = (city) => {
  selectedCity.value = city;
  showCityDropdown.value = false;
  emitFilterChange();
};

const regionDropdownRef = ref(null);
const cityDropdownRef = ref(null);
const filterContainer = ref(null);

const handleClickOutside = (event) => {
  if (filterContainer.value && !filterContainer.value.contains(event.target)) {
    showRegionDropdown.value = false;
    showCityDropdown.value = false;
  }
};


onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.my-calendar :deep(.vc-header .vc-title),
.my-calendar :deep(.vc-header .vc-arrow) {
  background: transparent !important;
}

.my-calendar :deep(.vc-container) {
  background-color: #092d7d;
  border-radius: 8px;
}

.my-calendar :deep(.vc-popover-content.direction-bottom) {
  background-color: #092d7d;
  border-color: #fff;
}

.my-calendar :deep(.vc-nav-container button) {
  background: transparent;
  color: #fff;
}

.my-calendar :deep(.vc-bordered) {
  border-color: #fff;
}

.calendar-container {
  position: relative;
}

.calendar-button {
  margin: 10px;
}

.calendar-popup {
  position: absolute;
  top: 40px;
  z-index: 100;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.clear-filters {
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover svg path {
    fill: #cccaca;
  }
}

@import url("../table/table.scss");
</style>
