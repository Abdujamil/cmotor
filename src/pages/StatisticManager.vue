<template v-if="!isShowTable">
  <div>
    <h2>Сводная по менеджерам</h2>
    <div class="filters filters-statis-city">
      <!-- <Filter
        @filterChange="handleFilterChange"
        :regions="Object.keys(regions)"
        :cities="selectedRegion ? getCitiesForRegion(selectedRegion) : []"
        :selectedRegion="selectedRegion"
        :selectedCity="selectedCity"
        @regionChange="onRegionChange"
      /> -->

      <Filter
        @filterChange="handleFilterChange"
      />
      <IButton @click="downloadTable" />
    </div>

    <div class="table-container">
      <div ref="table" class="table">
        <!-- Table Header -->
        <div class="table-row header">
          <div class="table-cell" @click="sortTable('name')">
            ФИО менеджера 
            <span>
              <span v-if="sortOrder.key === 'name' && sortOrder.order === 'asc'">↑</span>
              <span v-if="sortOrder.key === 'name' && sortOrder.order === 'desc'">↓</span>
            </span>
          </div>
          <div class="table-cell" @click="sortTable('averagePercentage')">
            Процент обработки звонка 
            <span>
              <span v-if="sortOrder.key === 'averagePercentage' && sortOrder.order === 'asc'">↑</span>
              <span v-if="sortOrder.key === 'averagePercentage' && sortOrder.order === 'desc'">↓</span>
            </span>
          </div>
          <div class="table-cell" @click="sortTable('totalCalls')">
            Количество звонков 
            <span>
              <span v-if="sortOrder.key === 'totalCalls' && sortOrder.order === 'asc'">↑</span>
              <span v-if="sortOrder.key === 'totalCalls' && sortOrder.order === 'desc'">↓</span>
            </span>
          </div>
        </div>
        <!-- Filtered Table Rows -->
        <div
          class="table-row"
          v-for="(manager, index) in filteredManagers"
          :key="index"
        >
          <div class="table-cell">{{ manager.name }}</div>
          <div class="table-cell">
            {{
              manager.averagePercentage
                ? manager.averagePercentage.toFixed(2)
                : "0.00"
            }}%
          </div>
          <div class="table-cell">{{ manager.totalCalls }}</div>
        </div>

        <div
          class="table-row"
          v-if="!filteredManagers.length"
        >
          <div class="table-cell">Нет данных</div>
        </div>

        <div class="table-row footer">
          <div class="table-cell">Сумма:</div>
          <div class="table-cell">{{ footerValues.averagePercentage ? footerValues.averagePercentage : " " }}%</div>
          <div class="table-cell">
            {{ footerValues.totalCallsSum ? footerValues.totalCallsSum : " " }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import * as XLSX from "xlsx";

const managers = ref([]);
const tableData3 = ref([]);
const filteredManagers = ref([]);
const dateFilter = ref({ startDate: null, endDate: null });
const table = ref(null);
const cities = {
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
};

new ResizeObserver((event) => {
  const width = document.documentElement.scrollWidth || 0;
  const height = document.documentElement.scrollHeight || 0;
  parent.postMessage({ width, height }, "*");
}).observe(document.documentElement);

const regions = Object.keys(cities);
const selectedRegion = ref("");
const selectedCity = ref("");
const footerValues = ref({ totalCallsSum: 0, averagePercentage: 0 });
const sortOrder = ref({ key: '', order: 'asc' });

const getCitiesForRegion = (region) => {
  return regions[region] || [];
};

const fetchTotalItems = async () => {
  try {
    const response = await axios.get(
      "https://crystal-motors.ru/method.getClients?count=all"
    );
    tableData3.value = response.data.answer.items;
    processData();
  } catch (error) {
    console.error("Ошибка при получении данных:", error.message);
  }
};

const filterByDate = (items) => {
  if (!dateFilter.value.startDate || !dateFilter.value.endDate) {
    return items;
  }

  const start = new Date(dateFilter.value.startDate);
  const end = new Date(dateFilter.value.endDate);

  return items.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });
};

const calculateFooterValues = () => {
  const totalCallsSum = filteredManagers.value.reduce(
    (sum, manager) => sum + manager.totalCalls,
    0
  );

  const totalPercentageSum = filteredManagers.value.reduce(
    (sum, manager) => sum + manager.averagePercentage * manager.totalCalls,
    0
  );

  const averagePercentage =
    totalCallsSum === 0 ? 0 : (totalPercentageSum / totalCallsSum).toFixed(2);

  return { totalCallsSum, averagePercentage };
};

const processData = () => {
  const managerData = {};
  const filteredItems = filterByDate(tableData3.value);

  filteredItems.forEach((item) => {
    const managerName = item.manager;
    const city = item.city;

    // Правильная логика для фильтрации по региону и городу
    const cityMatch = !selectedCity.value || city === selectedCity.value;
    const regionMatch =
      !selectedRegion.value ||
      (cities[selectedRegion.value] && cities[selectedRegion.value].includes(city));

    if (cityMatch && regionMatch) { // Учитываем оба условия
      if (!managerData[managerName]) {
        managerData[managerName] = {
          name: managerName,
          totalCalls: 0,
          totalPlan: 0,
          totalPercentage: 0,
          count: 0
        };
      }

      const total = [
        item.obrashenie,
        item.salon,
        item.cred_nal,
        item.prodan,
        item.city2,
        item.data_visit,
        item.garantiya,
        item.obrash_imeni,
        item.bodr_son * 1.5,
        item.otpr_viz,
        item.vizit * 3,
        item.prod_company,
        item.zdatok * 0.5
      ]
        .map(value => Number(value))
        .reduce((sum, value) => sum + (isNaN(value) ? 0 : value), 0);

      managerData[managerName].totalCalls += parseInt(item.fact, 10) || 0;
      managerData[managerName].totalPlan += parseInt(item.plan, 10) || 0;
      managerData[managerName].totalPercentage += total;
      managerData[managerName].count += 1;
    }
  });

  // Формируем итоговый список с расчётом среднего значения
  filteredManagers.value = Object.values(managerData).map((manager) => {
    const averagePercentage =
      manager.totalCalls === 0 ? 0 : manager.totalPlan / manager.totalCalls;
    return {
      ...manager,
      averagePercentage: isNaN(averagePercentage) ? 0 : parseFloat(averagePercentage.toFixed(2))
    };
  });

  // Обновляем значения в футере
  footerValues.value = calculateFooterValues();
};

const handleFilterChange = ({
  selectedRegion: newRegion,
  selectedCity: newCity,
  startDate,
  endDate
}) => {
  selectedRegion.value = newRegion;
  selectedCity.value = newCity;
  dateFilter.value = { startDate, endDate };

  processData(); // Вызываем для обновления данных сразу после изменения фильтра
};


const onRegionChange = () => {
  selectedCity.value = ""; // Сбрасываем выбранный город
};

const downloadTable = () => {
  if (table.value) {
    const data = [];
    const headers = Array.from(
      table.value.querySelectorAll(".header .table-cell")
    ).map((cell) => cell.textContent);
    data.push(headers);

    const rows = Array.from(
      table.value.querySelectorAll(".table-row:not(.header)")
    );
    rows.forEach((row) => {
      const rowData = Array.from(row.querySelectorAll(".table-cell")).map(
        (cell) => cell.textContent
      );
      data.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "managers-table.xlsx");
  }
};

const sortTable = (key) => {
  if (sortOrder.value.key === key) {
    sortOrder.value.order = sortOrder.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrder.value.key = key;
    sortOrder.value.order = 'asc';
  }

  const orderMultiplier = sortOrder.value.order === 'asc' ? 1 : -1;
  
  filteredManagers.value.sort((a, b) => {
    if (a[key] < b[key]) return -1 * orderMultiplier;
    if (a[key] > b[key]) return 1 * orderMultiplier;
    return 0;
  });
};

// watch(dateFilter, processData, { immediate: true });

onMounted(() => {
  fetchTotalItems();
});
</script>


<style lang="scss" scoped>
.table-container {
  overflow: auto;
  max-height: 550px;
}

.filters-statis-city {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

::-webkit-scrollbar {
  background-color: rgba(255, 255, 255, 0.5);
  width: 10px;
  height: 10px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  border: 1px solid transparent;
  background-clip: padding-box;
}

.table {
  max-width: 580px;
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
  position: sticky;
  top: 0;

  .table-cell{
    gap: 6px;
  }
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

.table-row.footer {
  background: #111111 !important;
  position: sticky;
  bottom: 0;
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
