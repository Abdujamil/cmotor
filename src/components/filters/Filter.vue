<template>
  <div class="dropdowns">
    <p>Показать статистику:</p>
    <div class="my-calendar">
      <!-- <VDatePicker
        v-model="date"
        model="date"
        :popover="{ placement: 'bottom-start' }"
        :columns="2"
        transparent
        borderless
        isDark
        is-range
      >
        <template
          locale="ru"
          #default="{ togglePopover, inputValue, inputEvents }"
        >
          <div
            class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
          >
            <button class="data-btn" @click="togglePopover()">
              За всё время
            </button>
          </div>
        </template>
      </VDatePicker> -->

      <VueDatePicker
        v-model="dateRange"
        :format="format"
        range
        dark
        multi-calendars
        placeholder="За всё время"
        @update:model-value="updateFormData"
      >
      </VueDatePicker>
    </div>

    <!-- Dropdown for selecting region -->
    <div class="dropdown" ref="regionDropdown">
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
    <div class="dropdown" ref="cityDropdown">
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

// Инициализация массива для хранения диапазона дат
const dateRange = ref([new Date(), new Date()]);

// Функция форматирования для диапазона дат
const format = (dates) => {
  if (Array.isArray(dates) && dates.length === 2) {
    const [startDate, endDate] = dates;
    const formattedStartDate = startDate.toLocaleDateString("ru-RU");
    const formattedEndDate = endDate.toLocaleDateString("ru-RU");

    return `${formattedStartDate} - ${formattedEndDate}`;
  } else if (dates instanceof Date) {
    // Если диапазон не выбран, обрабатываем как одиночную дату
    return dates.toLocaleDateString("ru-RU");
  }

  return "";
};

const regions = ref(["Север", "Юг"]);
const cities = ref({
  Север: [
    "Кемерово",
    "Новокузнецк",
    "Барнаул",
    "Красноярск ПЖ",
    "Красноярск Брянка",
    "Омск",
    "Томск",
    "Сургут_ГИ"
  ],
  Юг: ["Тюмень", "Сургут", "Пермь", "Самара", "Челябинск", "Тюмень_Республики"]
});

const filteredCities = computed(() => {
  return selectedRegion.value
    ? cities.value[selectedRegion.value]
    : Object.values(cities.value).flat();
});

const toggleDropdown = (type) => {
  if (type === "region") {
    showRegionDropdown.value = !showRegionDropdown.value;
    showCityDropdown.value = false;
  } else if (type === "city") {
    showCityDropdown.value = !showCityDropdown.value;
    showRegionDropdown.value = false;
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

const handleClickOutside = (event) => {
  const regionDropdown = regionDropdownRef.value;
  const cityDropdown = cityDropdownRef.value;

  if (regionDropdown && !regionDropdown.contains(event.target)) {
    showRegionDropdown.value = false;
  }

  if (cityDropdown && !cityDropdown.contains(event.target)) {
    showCityDropdown.value = false;
  }
};

const regionDropdownRef = ref(null);
const cityDropdownRef = ref(null);

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

@import url("../table/table.scss");
</style>
