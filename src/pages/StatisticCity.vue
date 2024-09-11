<template>
  <h1>Сводная по регионам</h1>

  <div class="statis-city">
    <div class="filters filters-statis-city">
      <Filter @filterChange="handleFilterChange" />
      <IButton @click="downloadTable" />
    </div>

    <div class="table-container">
      <div ref="table" class="table">
        <!-- Table Header -->
        <div class="table-row header">
          <div class="table-cell">По регионам</div>
          <div class="table-cell">Среднее значение качества звонка</div>
          <div class="table-cell">Динамика от прошлого периода</div>
          <div class="table-cell">Кол-во звонков</div>
          <div class="table-cell">Динамика от прошлого периода</div>
          <div class="table-cell">Кол-во звонков в трейд-ин</div>
          <div class="table-cell">
            Процент звонков в трейд-ин от общего кол-ва
          </div>
          <div class="table-cell">Динамика от прошлого периода</div>
        </div>
        <!-- Filtered Table Rows -->
        <div
          class="table-row"
          v-for="(row, index) in filteredTableData"
          :key="index"
        >
          <div class="table-cell">{{ row.region }}</div>
          <div class="table-cell">{{ row.averageCallQuality }}</div>
          <div class="table-cell">{{ row.previousPeriodDynamic }}</div>
          <div class="table-cell">{{ row.totalCalls }}</div>
          <div class="table-cell">{{ row.callsDynamic }}</div>
          <div class="table-cell">{{ row.tradeInCalls }}</div>
          <div class="table-cell">{{ row.tradeInPercentage }}</div>
          <div class="table-cell">{{ row.dynamicFromLastPeriod }}</div>
        </div>

        <div class="table-row header header-2">
          <div class="table-cell">По городам</div>
        </div>

        <!-- Filtered City Rows -->
        <div
          class="table-row"
          v-for="(city, index) in filteredCitiesData"
          :key="'city-' + index"
        >
          <div class="table-cell">{{ city.city }}</div>
          <div class="table-cell">{{ city.averageCallQuality }}</div>
          <div class="table-cell">{{ city.previousPeriodDynamic }}</div>
          <div class="table-cell">{{ city.totalCalls }}</div>
          <div class="table-cell">{{ city.callsDynamic }}</div>
          <div class="table-cell">{{ city.tradeInCalls }}</div>
          <div class="table-cell">{{ city.tradeInPercentage }}</div>
          <div class="table-cell">{{ city.dynamicFromLastPeriod }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { ref, computed } from "vue";
import * as XLSX from "xlsx";

const table = ref(null);
const selectedRegion = ref("");
const selectedCity = ref("");

const tableData = ref([
  {
    region: "Север",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    region: "Юг",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  }
]);

const citiesData = ref([
  {
    city: "Тюмень",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    city: "Сургут",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  },
  {
    city: "Пермь",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    city: "Челябинск",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  },
  {
    city: "Самара",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    city: "Кемерово",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  },
  {
    city: "Барнаул",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    city: "Новокузнецк",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  },
  {
    city: "Красноярск (Брянка)",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    city: "Красноярск (ЛПК)",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  },
  {
    city: "Омск",
    averageCallQuality: "60%",
    previousPeriodDynamic: "70%",
    totalCalls: "1429",
    callsDynamic: "80%",
    tradeInCalls: "44",
    tradeInPercentage: "44%",
    dynamicFromLastPeriod: "44%"
  },
  {
    city: "Томск",
    averageCallQuality: "70%",
    previousPeriodDynamic: "74%",
    totalCalls: "807",
    callsDynamic: "90%",
    tradeInCalls: "55",
    tradeInPercentage: "55%",
    dynamicFromLastPeriod: "55%"
  }
]);

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

// Filtered data for the table
const filteredTableData = computed(() => {
  return tableData.value.filter(
    (row) => !selectedRegion.value || row.region === selectedRegion.value
);
});
console.log(selectedRegion.value)

const filteredCitiesData = computed(() => {
  return citiesData.value.filter((city) => {
    if (selectedCity.value) {
      // Если выбран город, показываем только этот город
      return city.city === selectedCity.value;
    } else if (selectedRegion.value) {
      // Если выбран регион, фильтруем по всем городам в этом регионе
      return cities.value[selectedRegion.value].includes(city.city);
    } else {
      // Если не выбран ни регион, ни город, показываем все города
      return true;
    }
  });
});

const handleFilterChange = ({
  selectedRegion: newRegion,
  selectedCity: newCity
}) => {
  selectedRegion.value = newRegion;
  selectedCity.value = newCity;
};

// Table to Excel
const downloadTable = () => {
  if (table.value) {
    const ws = XLSX.utils.table_to_sheet(table.value);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "static-table-city.xlsx");
  }
};
</script>

<style scoped>
.filters-statis-city {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.table {
  display: flex;
  flex-direction: column;
  border-collapse: collapse;
  width: 100%;
  background: linear-gradient(0deg, #425793 0%, #425793 100%),
    linear-gradient(81deg, #e4b656 0%, #cfa54e 0.01%, #b89345 100%),
    rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  font-size: 12px;
}

.table-row {
  display: flex;
}

.table-row.header {
  background-color: #7181ae;
  font-weight: bold;
  text-align: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.table-row.header-2 {
  background: linear-gradient(0deg, #2c3e72 0%, #2c3e72 100%),
    linear-gradient(81deg, #e4b656 0%, #cfa54e 0.01%, #b89345 100%),
    rgba(255, 255, 255, 0.4) !important;
  border-radius: 0;
}

.table-row.header-2 .table-cell {
  align-items: start;
  justify-content: start;
  padding: 10px 36px;
}

.table-cell {
  flex: 1;
  padding: 10px;
  color: #ffffff;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
}

.table-row:nth-child(odd) {
  background: linear-gradient(0deg, #7181ae 0%, #7181ae 100%),
    linear-gradient(81deg, #e4b656 0%, #cfa54e 0.01%, #b89345 100%),
    rgba(255, 255, 255, 0.4);
}

.data-table tbody tr:nth-child(even) {
  background: none; /* Фон по умолчанию */
}
</style>
