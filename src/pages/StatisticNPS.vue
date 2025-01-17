<template>
  <div>
    <h1>Статистика NPS</h1>
  </div>
  <div class="filters filters-statis-city">
    <Filter @filterChange="handleFilterChange" />
    <IButton @click="downloadTable" />
  </div>

  <div class="table-container">
    <div ref="table" class="table">
      <!-- Table Header -->
      <div class="table-row header">
        <div class="table-cell">Город</div>
        <div class="table-cell" @click="sortData('averageSalonQuality')">
          Среднее качество работы салона
          <span>
            <span
              v-if="sortKey === 'averageSalonQuality' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'averageSalonQuality' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
        </div>
        <div class="table-cell" @click="sortData('salonComparison')">
          Сравнение с прошлым периодом
          <span>
            <span v-if="sortKey === 'salonComparison' && sortOrder === 'asc'"
              >↑</span
            >
            <span v-if="sortKey === 'salonComparison' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
        </div>
        <div class="table-cell" @click="sortData('averageManagerQuality')">
          Среднее качество работы менеджера
          <span>
            <span
              v-if="sortKey === 'averageManagerQuality' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'averageManagerQuality' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
        </div>
        <div class="table-cell" @click="sortData('managerComparison')">
          Сравнение с прошлым периодом
          <span>
            <span v-if="sortKey === 'managerComparison' && sortOrder === 'asc'"
              >↑</span
            >
            <span v-if="sortKey === 'managerComparison' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
        </div>
        <div class="table-cell" @click="sortData('nps')">
          Среднее значение NPS
          <span>
            <span v-if="sortKey === 'nps' && sortOrder === 'asc'">↑</span>
            <span v-if="sortKey === 'nps' && sortOrder === 'desc'">↓</span>
          </span>
        </div>
        <div class="table-cell" @click="sortData('averageNPSPrevious')">
          Сравнение с прошлым периодом
          <span>
            <span v-if="sortKey === 'averageNPSPrevious' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'averageNPSPrevious' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
        </div>
      </div>
      <!-- Filtered Table Rows -->
      <div v-for="(name, index) in sortedData" :key="index" class="table-row" v-if="filteredData.length > 0">
        <div class="table-cell">{{ name.name }}</div>
        <div class="table-cell">{{ name.averageSalonQuality.toFixed(2) }}</div>
        <div class="table-cell">{{ name.salonComparison }}</div>
        <div class="table-cell">{{ name.averageManagerQuality.toFixed(2) }}</div>
        <div class="table-cell">{{ name.managerComparison }}</div>
        <div class="table-cell">{{ name.nps.toFixed(2) }}</div>
        <div class="table-cell">{{ name.averageNPSPrevious ? name.averageNPSPrevious.toFixed(2) + " %" : "" }}
        </div>
      </div>
      <div class="table-row" v-else>
        <div class="table-cell">Ничего не найдено</div>
      </div>
      <!-- Table Footer -->
      <div class="table-row footer">
        <div class="table-cell">Общие значения:</div>
        <div class="table-cell"> {{ overallAverageSalonQuality ? overallAverageSalonQuality.toFixed(2) : " " }} </div>
        <div class="table-cell"> {{ overallComparison ? overallComparison : " " }} </div>
        <div class="table-cell"> {{ overallAverageManagerQuality ? overallAverageManagerQuality.toFixed(2) : " " }} </div>
        <div class="table-cell"> {{ overallManagerComparison ? overallManagerComparison : " " }} </div>
        <div class="table-cell"> {{ overallNPS ? overallNPS.toFixed(2) : " " }} </div>
        <div class="table-cell"></div>
        <!-- <div class="table-cell"> {{ overallNPSComparison ? overallNPSComparison : " " }} </div> -->
      </div>
    </div>
    <!-- Навигация -->
    <div class="table-nav">
      <div class="table-nav__header">
        <p>Выберите статистику:</p>
      </div>
      <div class="table-nav__btns">
        <button :class="{ active: currentDataSet === '' }" @click="switchData('')" class="table-nav__btn table-nav__btn" >
          Общий NPS
        </button>
        <button :class="{ active: currentDataSet === 'покупка' }" @click="switchData('покупка')" class="table-nav__btn" >
          Покупатели
        </button>
        <button :class="{ active: currentDataSet === 'комиссия' }" @click="switchData('комиссия')" class="table-nav__btn" >
          Комиссия
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx";
import { ref, computed, onMounted, warn } from "vue";
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import axios from "axios";

const selectedRegion = ref("");
const selectedCity = ref("");

const sortKey = ref("");
const sortOrder = ref("asc");

// Вычисляемое свойство для сортировки данных
const sortedData = computed(() => {
  const data = [...filteredData.value];
  return data.sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
});

// Метод для сортировки данных при нажатии на заголовок колонки
const sortData = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const citiesData = ref([]);
const table = ref(null);

const downloadTable = () => {
  if (table.value) {
    // Создаем временную таблицу
    const tempTable = document.createElement("table");

    // Копируем заголовок
    const headerRow = tempTable.insertRow();
    const headers = [
      "Город",
      "Среднее качество работы салона",
      "Сравнение с прошлым периодом",
      "Среднее качество работы менеджера",
      "Сравнение с прошлым периодом",
      "Среднее значение NPS",
      "Сравнение с прошлым периодом"
    ];

    headers.forEach((header) => {
      const cell = headerRow.insertCell();
      cell.textContent = header;
    });

    // Копируем строки из filteredData
    filteredData.value.forEach((name) => {
      const rowElement = tempTable.insertRow();
      rowElement.insertCell().textContent = name.name;
      rowElement.insertCell().textContent = name.averageSalonQuality.toFixed(2);
      rowElement.insertCell().textContent = name.salonComparison;
      rowElement.insertCell().textContent =
        name.averageManagerQuality.toFixed(2);
      rowElement.insertCell().textContent = name.managerComparison;
      rowElement.insertCell().textContent = name.nps.toFixed(2);
      rowElement.insertCell().textContent = name.averageNPSPrevious
        ? name.averageNPSPrevious.toFixed(2) + " %"
        : "";
    });

    // Добавляем футер
    const footerRow = tempTable.insertRow();
    footerRow.insertCell().textContent = "Общие значения:";
    footerRow.insertCell().textContent = overallAverageSalonQuality.value
      ? overallAverageSalonQuality.value.toFixed(2)
      : "";
    footerRow.insertCell().textContent =
      overallComparison.value !== null ? overallComparison.value : "";
    footerRow.insertCell().textContent = overallAverageManagerQuality.value
      ? overallAverageManagerQuality.value.toFixed(2)
      : "";
    footerRow.insertCell().textContent =
      overallManagerComparison.value !== null
        ? overallManagerComparison.value
        : "";
    footerRow.insertCell().textContent =
      overallNPS.value !== null ? overallNPS.value.toFixed(2) : "";
    footerRow.insertCell().textContent = overallNPSComparison.value;

    // Генерируем Excel файл
    const ws = XLSX.utils.table_to_sheet(tempTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "static-table-nps.xlsx");
  }
};

const filteredData = ref([]);
const overallAverageSalonQuality = ref(0);
const overallComparison = ref(null); // Для общего сравнения

const overallAverageManagerQuality = ref(0);
const overallManagerComparison = ref(0);
const overallNPS = ref(0);
const overallNPSComparison = ref(null);
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);

let cities = ref({
  Север: [
    "Кемерово",
    "Новокузнецк",
    "Барнаул",
    "Красноярск ПЖ",
    "Красноярск, Партизана Железняка, 35А",
    "Красноярск, 2-я Брянская улица, 4",
    "Красноярск Брянка",
    "Омск",
    "Томск"
  ],
  Юг: ["Тюмень", "Сургут", "Сургут_ГИ", "Пермь", "Самара", "Челябинск"]
});

const cityMapping = {
  "Красноярск ПЖ": "Красноярск, Партизана Железняка",
  "Красноярск Брянка": "Красноярск, Брянская"
};

const handleFilterChange = ({
  selectedRegion: newRegion,
  selectedCity: newCity,
  startDate,
  endDate
}) => {
  selectedRegion.value = newRegion;
  selectedCity.value = newCity;

  // Если endDate не задан, используем startDate как конечную дату
  selectedStartDate.value = startDate;
  selectedEndDate.value = endDate || startDate;
  
  fetchData(); // Обновляем данные при смене фильтра
};

// Состояние текущих данных
const currentDataSet = ref(""); // По умолчанию отображаем NPS

// const fetchData = async () => {
//   try {
//     const response = await axios.get(
//       "https://crystal-motors.ru/method.getSendings?count=all"
//     );
//     const data = response.data.answer.items;

//     const cityMap = {};
//     let totalQuality = 0;
//     let totalQualityPrevious = 0;
//     let totalManagerQuality = 0;
//     let totalManagerQualityPrevious = 0;
//     let totalCount = 0;
//     let totalCountPrevious = 0;
//     let totalNPSPrevious = 0;

//     // Даты для фильтрации
//     let currentStartDate = new Date(selectedStartDate.value);
//     let currentEndDate = new Date(selectedEndDate.value);

//      // Если выбран один день, проверим, что currentEndDate равен currentStartDate
//      if (currentStartDate && currentStartDate.getTime() === currentEndDate.getTime()) {
//         console.log("Фильтрация по одному дню:", currentStartDate);
//       }

      
//     // Проверка на выбор одного дня
//     const isSingleDay = currentStartDate.getTime() === currentEndDate.getTime();
    
//     // Установка времени на начало дня, если выбран один день
//     function setToStartOfDay(date) {
//       date.setHours(0, 0, 0, 0);
//       return date;
//     }
    
//     if (isSingleDay) {
//       currentStartDate = setToStartOfDay(currentStartDate);
//       currentEndDate = setToStartOfDay(currentEndDate);
//       console.log("Фильтрация по одному дню:", currentStartDate);
//     }
//     // Количество дней для предыдущего периода
//     const timeDiff = currentEndDate - currentStartDate; // Разница в миллисекундах
//     const selectedDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Количество дней

//     // Даты для предыдущего периода
//     // Установка дат для предыдущего периода с учётом выбора одного дня
//     const previousStartDate = new Date(currentStartDate);
//     const previousEndDate = new Date(currentStartDate);

//     if (isSingleDay) {
//       previousStartDate.setDate(currentStartDate.getDate() - 1); // Один день назад
//       previousEndDate.setDate(currentStartDate.getDate() - 1);
//       setToStartOfDay(previousStartDate);
//       setToStartOfDay(previousEndDate);
//     } else {
//       previousStartDate.setDate(currentStartDate.getDate() - selectedDays);
//       previousEndDate.setDate(currentStartDate.getDate() - 1);
//     }

//     const previousPeriodMap = {};
    

//     data.forEach((item) => {
//       const cityName = item.city;
      
//       if (currentDataSet !== " " && item.transaction_type.toLowerCase() !== currentDataSet.value) {
//         return;
//       }

//       const surveyDate = new Date(item.survey_date.split(".").reverse().join("-"));

//       // Фильтрация по дате
//       const isCurrentPeriod = !selectedStartDate.value || (surveyDate >= currentStartDate && surveyDate <= currentEndDate);

//       // const isCurrentPeriod = surveyDate >= currentStartDate && surveyDate < currentEndDate; // Изменили условие для одного дня
//       const isPreviousPeriod = surveyDate >= previousStartDate && surveyDate <= previousEndDate;

      
//       if (!isCurrentPeriod && !isPreviousPeriod) {
//         return; // Пропускаем, если дата не попадает ни в один из периодов
//       }

//       // Фильтрация по региону
//       if (selectedRegion.value && !cities.value[selectedRegion.value].includes(cityName)) {
//         return;
//       }

//       // Фильтрация по городу с проверкой по ключевым словам
//       if (selectedCity.value) {
//         const fullCityName = cityMapping[selectedCity.value] || selectedCity.value;
//         const cityKeywords = fullCityName.split(", ").map(part => part.trim());        

//         // Проверяем, что все ключевые части присутствуют в `cityName`
//         if (!cityKeywords.every(keyword => cityName.includes(keyword))) {
//           return false;
//         }
//       }

//       const salonQuality = parseFloat(item.salon_quality);
//       const managerQuality = parseFloat(item.manager_quality);

//       // Обработка данных по городу
//       if (!cityMap[cityName]) {
//         cityMap[cityName] = {
//           name: cityName,
//           totalQuality: salonQuality,
//           count: 1,
//           totalManagerQuality: managerQuality,
//           managerCount: 1
//         };

//         // console.log("cityMap[cityName] за текущий период", cityName, cityMap[cityName]);

//       } else {
//         cityMap[cityName].totalQuality += salonQuality;
//         cityMap[cityName].count += 1;
//         cityMap[cityName].totalManagerQuality += managerQuality;
//         cityMap[cityName].managerCount += 1;
//       }

//       totalQuality += salonQuality;
//       totalManagerQuality += managerQuality;
//       totalCount += 1;

//       // Обработка данных для предыдущего периода
//       if (isPreviousPeriod) {
//         totalQualityPrevious += salonQuality;

        
//         if (!previousPeriodMap[cityName]) {
//           previousPeriodMap[cityName] = {
//             totalSalonQuality: salonQuality,
//             count: 1,
//             totalManagerQuality: managerQuality,
//             managerCount: 1,
//           };
          
//         // console.log("previousPeriodMap[cityName] за прошлый период", cityName, previousPeriodMap[cityName]);
          
//         } else {
//           previousPeriodMap[cityName].totalManagerQuality += managerQuality;
//           previousPeriodMap[cityName].managerCount += 1;
//           previousPeriodMap[cityName].totalSalonQuality += salonQuality;
//           previousPeriodMap[cityName].count += 1;
//         }
//         totalManagerQualityPrevious += managerQuality;
//         totalCountPrevious += 1;
//       }
//     });


//     // Формируем массив для отображения
//     filteredData.value = Object.values(cityMap).map((city) => {
//       // console.log("city", city);
      
//       let averageSalonQuality = city.totalQuality ? (city.totalQuality / city.count) : 0;

//       console.log("averageSalonQuality", city.name, averageSalonQuality);
      

//       const previousData = previousPeriodMap[city.name];
//       console.log("previousData",city.name, previousData);
      
      
//       let averageSalonQualityPrevious = 0;

//       if (previousData) {
//         averageSalonQualityPrevious = (
//           previousData.totalSalonQuality / previousData.count
//         ).toFixed(2);
//       }

//       const salonComparison =
//         averageSalonQualityPrevious !== 0
//           ? (
//               ((averageSalonQuality - averageSalonQualityPrevious) /
//                 averageSalonQualityPrevious) *
//               100
//             ).toFixed(2) + " %"
//           : " ";

//       console.log(`salonComparison`, salonComparison);

//       const averageManagerQuality = city.totalManagerQuality ?
//         city.totalManagerQuality / city.managerCount : 0;

//       const nps = (averageSalonQuality + averageManagerQuality) / 2;

//       const previousManagerAverage = previousPeriodMap[city.name]
//         ? previousPeriodMap[city.name].totalManagerQuality /
//           previousPeriodMap[city.name].managerCount
//         : null;

//       const managerComparison =
//         previousManagerAverage !== null
//           ? (averageManagerQuality - previousManagerAverage).toFixed(2) + " %"
//           : "";

//       return {
//         name: city.name,
//         averageSalonQuality,
//         salonComparison,
//         averageManagerQuality,
//         nps,
//         managerComparison,
//         averageNPSPrevious: previousData
//           ? (previousData.totalSalonQuality +
//               previousData.totalManagerQuality) /
//             (previousData.managerCount * 2)
//           : null
//       };
//     });

//     // Рассчитываем общее среднее качества
//     overallAverageSalonQuality.value = totalQuality / totalCount;
//     overallAverageManagerQuality.value = totalManagerQuality / totalCount;

//     // Рассчитываем общее NPS
//     const totalNPS = filteredData.value.reduce(
//       (sum, city) => sum + city.nps,
//       0
//     );
//     overallNPS.value = totalNPS / filteredData.value.length;

//     // Рассчитываем сравнение NPS с прошлым периодом
//     const averageNPSPrevious =
//       totalCountPrevious > 0 ? totalNPSPrevious / totalCountPrevious : null;
//     overallNPSComparison.value =
//       averageNPSPrevious !== null
//         ? (overallNPS.value - averageNPSPrevious).toFixed(2) + " %"
//         : "";
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error.message);
//   }
// };


const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://crystal-motors.ru/method.getSendings?count=all"
    );
    const data = response.data.answer.items;

    const cityMap = {};
    let totalQuality = 0;
    let totalQualityPrevious = 0;
    let totalManagerQuality = 0;
    let totalManagerQualityPrevious = 0;
    let totalCount = 0;
    let totalCountPrevious = 0;
    let totalNPSPrevious = 0;

    // Даты для фильтрации
    let currentStartDate = selectedStartDate.value ? new Date(selectedStartDate.value) : null;
    let currentEndDate = selectedEndDate.value ? new Date(selectedEndDate.value) : null;

    // Определение, активен ли фильтр по дате
    const isDateFilterActive = currentStartDate && currentEndDate;

    // Проверка на выбор одного дня
    const isSingleDay = isDateFilterActive && currentStartDate.getTime() === currentEndDate.getTime();

    // Установка времени на начало дня, если выбран один день
    function setToStartOfDay(date) {
      date.setHours(0, 0, 0, 0);
      date.setMonth(date.getMonth() + 1);
      return date;
    }

    if (isSingleDay) {
      currentStartDate = setToStartOfDay(currentStartDate);
      currentEndDate = setToStartOfDay(currentEndDate);
    }

    // Количество дней для предыдущего периода
    const timeDiff = isDateFilterActive ? (currentEndDate - currentStartDate) : 0;
    const selectedDays = isDateFilterActive ? Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 : 0;

    // Даты для предыдущего периода
    const previousStartDate = isDateFilterActive ? new Date(currentStartDate) : null;
    const previousEndDate = isDateFilterActive ? new Date(currentStartDate) : null;

    if (isDateFilterActive) {
      if (isSingleDay) {
        previousStartDate.setDate(currentStartDate.getDate() - 1);
        previousEndDate.setDate(currentStartDate.getDate() - 1);
        setToStartOfDay(previousStartDate);
        setToStartOfDay(previousEndDate);
      } else {
        previousStartDate.setDate(currentStartDate.getDate() - selectedDays);
        previousEndDate.setDate(currentStartDate.getDate() - 1);
      }
    }

    const previousPeriodMap = {};

    data.forEach((item) => {
      const cityName = item.city;

      if (currentDataSet !== " " && item.transaction_type.toLowerCase() !== currentDataSet.value) {
        return;
      }

      let surveyDate = new Date(item.survey_date.split(".").reverse().join("-"));
      if (isSingleDay) {
        surveyDate = setToStartOfDay(surveyDate);
      }

      // Пропускаем фильтрацию по дате, если фильтр по дате не активен
      const isCurrentPeriod = !isDateFilterActive || (surveyDate >= currentStartDate && surveyDate <= currentEndDate);
      const isPreviousPeriod = isDateFilterActive && surveyDate >= previousStartDate && surveyDate <= previousEndDate;

      if (!isCurrentPeriod && !isPreviousPeriod) {
        return;
      }

      // Фильтрация по региону
      if (selectedRegion.value && !cities.value[selectedRegion.value].includes(cityName)) {
        return;
      }

      // Фильтрация по городу с проверкой по ключевым словам
      if (selectedCity.value) {
        const fullCityName = cityMapping[selectedCity.value] || selectedCity.value;
        const cityKeywords = fullCityName.split(", ").map(part => part.trim());

        if (!cityKeywords.every(keyword => cityName.includes(keyword))) {
          return;
        }
      }

      const salonQuality = parseFloat(item.salon_quality);
      const managerQuality = parseFloat(item.manager_quality);

      if (isCurrentPeriod) {

        if (!cityMap[cityName]) {
          cityMap[cityName] = {
            name: cityName,
            totalQuality: salonQuality,
            count: 1,
            totalManagerQuality: managerQuality,
            managerCount: 1
          };

          console.log("cityMap[cityName] за текущий период", cityName, cityMap[cityName]);

          
        } else {
          cityMap[cityName].totalQuality += salonQuality;
          cityMap[cityName].count += 1;
          cityMap[cityName].totalManagerQuality += managerQuality;
          cityMap[cityName].managerCount += 1;
        }
        
        totalQuality += salonQuality;
        totalManagerQuality += managerQuality;
        totalCount += 1;
      }

      if (isPreviousPeriod) {
        totalQualityPrevious += salonQuality;

        if (!previousPeriodMap[cityName]) {
          previousPeriodMap[cityName] = {
            totalSalonQuality: salonQuality,
            count: 1,
            totalManagerQuality: managerQuality,
            managerCount: 1,
          };

          console.log("previousPeriodMap[cityName] за прошлый период", cityName, previousPeriodMap[cityName]);
        } else {
          previousPeriodMap[cityName].totalManagerQuality += managerQuality;
          previousPeriodMap[cityName].managerCount += 1;
          previousPeriodMap[cityName].totalSalonQuality += salonQuality;
          previousPeriodMap[cityName].count += 1;
        }

        totalManagerQualityPrevious += managerQuality;
        totalCountPrevious += 1;
      }
    });

    // Формирование массива для отображения и расчет данных
    filteredData.value = Object.values(cityMap).map((city) => {

      let averageSalonQuality = city.totalQuality ? ((city.totalQuality / city.count)) : 0;
      

      const previousData = previousPeriodMap[city.name];

      let averageSalonQualityPrevious = 0;
      if (previousData) {
        averageSalonQualityPrevious = (
          previousData.totalSalonQuality / previousData.count
        ).toFixed(2);
      }
      const salonComparison =
        averageSalonQualityPrevious !== 0
          ? (
              ((averageSalonQuality - averageSalonQualityPrevious) /
                averageSalonQualityPrevious) *
              100
            ).toFixed(2) + " %"
          : " ";

      const averageManagerQuality = city.totalManagerQuality ?
        city.totalManagerQuality / city.managerCount : 0;

      const nps = (averageSalonQuality + averageManagerQuality) / 2;

      const previousManagerAverage = previousPeriodMap[city.name]
        ? previousPeriodMap[city.name].totalManagerQuality /
          previousPeriodMap[city.name].managerCount
        : null;

      const managerComparison =
        previousManagerAverage !== null
          ? (averageManagerQuality - previousManagerAverage).toFixed(2) + " %"
          : "";

      return {
        name: city.name,
        averageSalonQuality,
        salonComparison,
        averageManagerQuality,
        nps,
        managerComparison,
        averageNPSPrevious: previousData
          ? (previousData.totalSalonQuality +
              previousData.totalManagerQuality) /
            (previousData.managerCount * 2)
          : null
      };
    });

    // Общий расчет показателей
    overallAverageSalonQuality.value = totalQuality ? totalQuality / totalCount : '';
        
    
    overallAverageManagerQuality.value = totalManagerQuality  && totalManagerQuality > 0 ? totalManagerQuality / totalCount : '';
    
    const totalNPS = filteredData.value.reduce(
      (sum, city) => sum + city.nps,
      0
    );

    overallNPS.value = totalNPS / filteredData.value.length;
    console.log("overallNPS", overallNPS.value);
    

    const averageNPSPrevious =
      totalCountPrevious > 0 ? totalNPSPrevious / totalCountPrevious : null;
      console.log("averageNPSPrevious", averageNPSPrevious);      


    overallNPSComparison.value =
      averageNPSPrevious !== null
        ? (overallNPS.value - averageNPSPrevious).toFixed(2) + " %"
        : "";

        console.log("overallNPSComparison", overallNPSComparison.value);
        

  } catch (error) {
    console.error("Ошибка при получении данных:", error.message);
  }
};


const switchData = (type) => {
  console.log("Сменить тип данных на:", type);
  currentDataSet.value = type;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
.table-container {
  overflow: auto;
  height: 570px;
  max-height: 570px;
  border-radius: 8px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 30px;
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
  max-width: 1200px;
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

  .table-cell {
    gap: 6px;
  }
}

.table-row.footer {
  background: #111111 !important;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  position: sticky;
  bottom: 0;
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

.table-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-height: 485px;
  padding: 0 20px 0 0;

  position: sticky;
  top: 0;
}

.table-nav__btns {
  display: flex;
  flex-direction: column;
  gap: 16px;

  button {
    width: 100%;
    max-width: 207px;
    border-radius: var(--S, 8px);
    padding: var(--M, 12px) 32px;
    background: #7181ae;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  .active {
    background: #425793;
  }
}
</style>
