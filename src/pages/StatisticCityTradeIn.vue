<template>
  <h1>Сводная по городам трейд-ин</h1>

  <div class="statis-city">
    <div class="filters filters-statis-city">
      <Filter @filterChange="handleFilterChange" />
      <IButton @click="downloadTable" />
    </div>

    <div class="table-container">
      <div ref="table" class="table">
       <!-- Table Header -->
        <div class="table-row header">
          <div class="table-cell" @click="sortData('city')">По регионам
             <span>
            <span
              v-if="sortKey === 'city' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'city' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
          </div>
          <div class="table-cell" @click="sortData('cityTradeInCalls')">Кол-во звонков в трейд-ин
             <span>
            <span
              v-if="sortKey === 'cityTradeInCalls' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'cityTradeInCalls' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
          </div>
          <div class="table-cell" @click="sortData('cityTradeInPercentage')">Процент звонков в трейд-ин от общего кол-ва
             <span>
            <span
              v-if="sortKey === 'cityTradeInPercentage' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'cityTradeInPercentage' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
          </div>
          <div class="table-cell" @click="sortData('cityDynamicFromLastPeriod')">Динамика от прошлого периода
             <span>
            <span
              v-if="sortKey === 'cityDynamicFromLastPeriod' && sortOrder === 'asc'"
              >↑</span
            >
            <span
              v-if="sortKey === 'cityDynamicFromLastPeriod' && sortOrder === 'desc'"
              >↓</span
            >
          </span>
          </div>
        </div>

        <!-- Filtered Table Rows -->
        <div
          class="table-row"
          v-for="(row, index) in filteredTableData"
          :key="index"
        >
          <div class="table-cell">{{ row.region }}</div>
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
          v-for="(city, index) in sortedData"
          :key="'city-' + index"
        >
          <div class="table-cell">{{ city.city }}</div>
          <div class="table-cell">{{ city.cityTradeInCalls }}</div>
          <div class="table-cell">{{ city.cityTradeInPercentage }}</div>
          <div class="table-cell">{{ city.cityDynamicFromLastPeriod }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { fetchTotalItems } from "../api-service/apiService";
import { ref, computed, onMounted } from "vue";
import * as XLSX from "xlsx";

const table = ref(null);
const selectedRegion = ref("");
const selectedCity = ref("");
const filteredTableData = ref([]);
const sortKey = ref('');
const sortOrder = ref('asc');

const tableData = ref([]);

const citiesData = ref([]);

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

new ResizeObserver((event) => {
  const width = document.documentElement.scrollWidth || 0;
  const height = document.documentElement.scrollHeight || 0;
  parent.postMessage({ width, height }, "*");
}).observe(document.documentElement);

const filters = ref({
  selectedRegion: "",
  selectedCity: "",
  startDate: null,
  endDate: null
});

const cityRegionMap = {
  Тюмень: "Юг",
  Сургут: "Юг",
  Пермь: "Юг",
  Челябинск: "Юг",
  Самара: "Юг",
  Кемерово: "Север",
  Барнаул: "Север",
  Новокузнецк: "Север",
  "Красноярск Брянка": "Север",
  "Красноярск ПЖ": "Север",
  Омск: "Север",
  Томск: "Север"
};

// Функция для расчета общего значения
const calculateTotal = (formData) => {
  return (
    Number(formData.obrashenie) +
    Number(formData.salon) +
    Number(formData.cred_nal) +
    Number(formData.prodan) +
    Number(formData.city2) +
    Number(formData.data_visit) +
    Number(formData.garantiya) +
    Number(formData.obrash_imeni) +
    Number(formData.bodr_son) +
    Number(formData.otpr_viz) +
    Number(formData.vizit) * 3 +
    Number(formData.prod_company) +
    Number(formData.zdatok)
  );
};

// Асинхронная функция для получения данных
const fetchData = async (offset = 0, resetData = false) => {
  try {
    const filterParams = {
      offset,
      startDate:
        filters.value.startDate instanceof Date
          ? filters.value.startDate.toISOString()
          : filters.value.startDate || "",

      endDate:
        filters.value.endDate instanceof Date
          ? filters.value.endDate.toISOString()
          : filters.value.endDate || ""
    };

    const response = await fetchTotalItems({ params: filterParams });

    const newData = response.items;

    tableData.value = newData;

    if (resetData) {
      tableData.value = newData;
    } else {
      tableData.value = [...tableData.value, ...newData];
    }

    filteredTableData.value = [...tableData.value];
    filteredCitiesData.value = [...newData];

    console.log(
      "Starting calculateRegionAverages with dates:",
      filters.value.startDate,
      filters.value.endDate
    );
    // Передаем выбранные даты в calculateRegionAverages
    calculateRegionAverages(filters.value.startDate, filters.value.endDate);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

// Вычисляемое свойство для сортировки данных
const sortedData = computed(() => {
  const data = [...filteredCitiesData.value];
  console.log("data:", data);
  
  return data.sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];

    // if (aValue === undefined || bValue === undefined) {
    //   console.error(`Ключ "${sortKey.value}" не найден в одном из объектов:`, a, b);
    //   return 0; // Не сортировать, если ключ не найден
    // }
    
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
});
// Метод для сортировки данных при нажатии на заголовок колонки
const sortData = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  console.log(`sortKey: ${sortKey.value}, sortOrder: ${sortOrder.value}`);
};

const fetchFactsOnly = async () => {
  try {
    const response = await fetchTotalItems();
    const factsData = response.items;

    // Группируем данные по городам
    const citiesGrouped = factsData.reduce((acc, item) => {
      const cityName = window.stores.find((store) => store.id === item.city)?.title || "Неизвестный город";
      if (!acc[cityName]) {
        acc[cityName] = [];
      }
      acc[cityName].push(item);
      return acc;
    }, {});

    // Фильтрация данных по выбранным датам
    const filteredFacts = filterDataByDate(
      factsData,
      filters.value.startDate,
      filters.value.endDate
    );

    // Определяем текущую дату
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 - январь, 11 - декабрь

    // Устанавливаем даты для текущего и предыдущего месяцев
    const currentPeriodStartDate = new Date(currentYear, currentMonth, 1);
    const currentPeriodEndDate = new Date(currentYear, currentMonth + 1, 0); // Последний день текущего месяца

    const previousPeriodStartDate = new Date(currentYear, currentMonth - 1, 1);
    const previousPeriodEndDate = new Date(currentYear, currentMonth, 0); // Последний день предыдущего месяца

    // Вычисляем среднее значение качества звонков, динамику и формируем структуру данных для таблицы
    citiesData.value = Object.keys(citiesGrouped).map((cityName) => {
      const cityEntries = citiesGrouped[cityName];

      // Фильтруем данные по датам
      const currentCityEntries = filterDataByDate(
        cityEntries,
        filters.value.startDate,
        filters.value.endDate
      );

      const totalTradeInCallsCurrent = currentCityEntries.reduce(
        (sum, entry) => sum + (Number(entry.prodan) || 0),
        0
      );

      console.log("totalTradeInCallsCurrent:", totalTradeInCallsCurrent);
      

      // Логика для расчета предыдущего месяца
      const previousPeriodStartDate = new Date(filters.value.startDate);
      previousPeriodStartDate.setMonth(previousPeriodStartDate.getMonth() - 1);

      const previousPeriodEndDate = new Date(filters.value.endDate);
      previousPeriodEndDate.setMonth(previousPeriodEndDate.getMonth() - 1);

      // Используем пользовательские даты, если они заданы
      const startDate =
        filters.value.startDate instanceof Date
          ? filters.value.startDate
          : currentPeriodStartDate;

      const endDate =
        filters.value.endDate instanceof Date
          ? filters.value.endDate
          : currentPeriodEndDate;

      const previousCityEntries = filterDataByDate(
        cityEntries,
        previousPeriodStartDate.toISOString().split("T")[0],
        previousPeriodEndDate.toISOString().split("T")[0]
      );

      const totalTradeInCallsPrevious = previousCityEntries.reduce(
        (sum, entry) => sum + (Number(entry.prodan) || 0),
        0
      );

      const totalCallsCurrent = currentCityEntries.reduce(
        (sum, entry) => sum + (Number(entry.fact) || 0),
        0
      );

      // Рассчитываем процент звонков трейд-ин от общего количества звонков
      const tradeInPercentage =
        totalCallsCurrent > 0
          ? ((totalTradeInCallsCurrent / totalCallsCurrent) * 100).toFixed(2) +
            " %"
          : "0 %";

      // Рассчитываем динамику
      let tradeInDynamic;
      if (totalTradeInCallsPrevious === 0) {
        tradeInDynamic = totalTradeInCallsCurrent > 0 ? " " : " "; // если в предыдущем месяце не было звонков
      } else {
        tradeInDynamic =
          (
            ((totalTradeInCallsCurrent - totalTradeInCallsPrevious) /
              totalTradeInCallsPrevious) *
            100
          ).toFixed(2) + " %";
      }

      console.log("tradeInDynamic", tradeInDynamic);

      return {
        city: cityName,
        cityTradeInCalls: totalTradeInCallsCurrent || "",
        cityTradeInPercentage: tradeInPercentage || "",
        cityDynamicFromLastPeriod: tradeInDynamic || ""
      };
    });

    return filteredFacts;
  } catch (error) {
    console.error("Ошибка при получении данных (fact):", error);
    return [];
  }
};

// Функция для группировки и суммирования звонков по регионам
const sumCallsByRegion = async () => {
  try {
    // Получаем данные только с полем fact
    const factsData = await fetchFactsOnly();

    // Инициализация переменных для подсчета звонков по регионам
    let totalCallsSouth = 0;
    let totalCallsNorth = 0;

    // Проходим по каждому элементу данных и суммируем звонки по регионам
    factsData.forEach((entry) => {
      let city = entry.city;
      city = window.stores.find((store) => store.id === entry.city)?.title || "Неизвестный город";
      const fact = parseInt(entry.fact) || 0; // Преобразуем fact в число

      // Проверяем, к какому региону относится город
      const region = cityRegionMap[city];
      console.log("city:", city, "region:", region);
      

      if (region === "Юг") {
        totalCallsSouth += fact;
      } else if (region === "Север") {
        totalCallsNorth += fact;
      }
    });
  } catch (error) {
    console.error("Ошибка при суммировании звонков по регионам:", error);
  }
};

sumCallsByRegion();

// Рассчитываем динамику для среднего значения качества звонков
const calculatePreviousPeriodDynamic = (currentAverage, previousAverage) => {
  // Проверка на существование и валидность данных
  if (
    !currentAverage ||
    isNaN(currentAverage) ||
    !previousAverage ||
    isNaN(previousAverage)
  ) {
    return "N/A"; // Если данные отсутствуют или неверны
  }

  const dynamic = ((currentAverage - previousAverage) / previousAverage) * 100;
  return dynamic.toFixed(2) + " %";
};

const filterDataByDate = (data, startDate, endDate) => {
  if (!startDate || !endDate) {
    console.log("No dates provided, returning all data");
    return data; // Если даты не выбраны, возвращаем все данные
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Конец дня

  return data.filter((item) => {
    if (!item.date) return false; // Пропускаем записи без даты
    const itemDate = new Date(item.date.split(".").reverse().join("-"));

    // console.log("itemDate:", itemDate, "start:", start, "end:", end);

    return itemDate >= start && itemDate <= end;
  });
};

// Функция для расчета средних значений по регионам
const calculateRegionAverages = async (startDate, endDate) => {
  console.log(
    "Starting calculateRegionAverages with dates:",
    startDate,
    endDate
  );

  if (!Array.isArray(tableData.value)) {
    console.error("tableData.value не является массивом:", tableData.value);
    return;
  }

  const filteredData = filterDataByDate(tableData.value, startDate, endDate);

  console.log("tableData.value:", tableData.value);

  if (filteredData.length === 0) {
    alert("Нет данных для выбранного диапазона дат.");
    return;
  }

  const currentMonth = new Date().getMonth(); // Текущий месяц
  const currentYear = new Date().getFullYear(); // Текущий год

  console.log("Текущий месяц:", currentMonth, "Текущий год:", currentYear);

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Предыдущий месяц
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const getDataForMonth = (data, targetMonth, targetYear) => {
    let foundData = data.filter((item) => {
      const itemDate = new Date(item.date.split(".").reverse().join("-"));
      return (
        itemDate.getMonth() === targetMonth &&
        itemDate.getFullYear() === targetYear
      );
    });

    // Если данных нет, проверяем предыдущий месяц
    if (foundData.length === 0 && targetMonth > 0) {
      foundData = getDataForMonth(data, targetMonth - 1, targetYear);
    } else if (foundData.length === 0 && targetMonth === 0) {
      // Если январь, проверяем декабрь предыдущего года
      foundData = getDataForMonth(data, 11, targetYear - 1);
    }
    return foundData;
  };

  // Получаем данные для текущего месяца
  const currentMonthData = getDataForMonth(
    filteredData,
    currentMonth,
    currentYear
  );
  console.log("currentMonthData:", currentMonthData)
  

  // Получаем данные для предыдущего месяца
  const previousMonthData = getDataForMonth(
    filteredData,
    previousMonth,
    previousYear
  );

  const regionData = {
    Юг: [],
    Север: []
  };

  const factsData = await fetchFactsOnly();
  let totalCallsSouth = 0;
  let totalCallsNorth = 0;
  let tradeInCallsSouth = 0; // Трейд-ин звонки для Юга
  let tradeInCallsNorth = 0; // Трейд-ин звонки для Севера

  let totalTradeInCallsCurrentMonth = 0; // Общее количество трейд-ин звонков за текущий месяц
  let totalTradeInCallsPreviousMonth = 0; // Общее количество трейд-ин звонков за предыдущий месяц

  // Проходим по каждому элементу данных и суммируем звонки по регионам
  filteredData.forEach((entry) => {
    let city = entry.city;
    city = window.stores.find((store) => store.id === entry.city)?.title || "Неизвестный город";
    const fact = parseInt(entry.fact) || 0; // Преобразуем fact в число
    const tradeIn = parseInt(entry.prodan) || 0; // Используем поле prodan для трейд-ин
    const region = cityRegionMap[city];

    if (region === "Юг") {
      totalCallsSouth += fact;
      tradeInCallsSouth += tradeIn; // Суммируем звонки трейд-ин для Юга

      if (currentMonthData.length > 0) {
        totalTradeInCallsCurrentMonth += tradeIn; // Предыдущий месяц
      }
    } else if (region === "Север") {
      totalCallsNorth += fact;
      tradeInCallsNorth += tradeIn; // Суммируем звонки трейд-ин для Севера
      if (previousMonthData.length > 0) {
        totalTradeInCallsPreviousMonth += tradeIn; // Предыдущий месяц
      }
    }
  });
  
  // Заполняем regionData с данными, включая дату
  factsData.forEach((client) => {
    client.city = window.stores.find((store) => store.id === client.city)?.title || "Неизвестный город";
    const region = cityRegionMap[client.city];

    if (region && regionData[region] !== undefined) {
      const total = calculateTotal(client);
      const averageCallQuality = (total / 14) * 100;

      regionData[region].push({
        date: client.date, // добавляем дату
        value: parseFloat(averageCallQuality.toFixed(2)) // сохраняем качество звонка
      });
    } else {
      console.warn(`Неизвестный город или регион не найден: ${client.city}`);
    }
  });

  filteredTableData.value = Object.keys(regionData).map((region) => {
    const regionCities = regionData[region];

    const totalCurrentCalls =
      region === "Юг" ? totalCallsSouth : totalCallsNorth;

    const tradeInCalls =
      region === "Юг" ? tradeInCallsSouth : tradeInCallsNorth;
    const tradeInPercentage =
      totalCurrentCalls > 0
        ? ((tradeInCalls / totalCurrentCalls) * 100).toFixed(2) + " %"
        : "0 %";

    // Динамика количества звонков в трейд-ин
    const tradeInCallsDynamic = 
    startDate && endDate ? (
            ((totalTradeInCallsCurrentMonth - totalTradeInCallsPreviousMonth) /
              totalTradeInCallsPreviousMonth) *
            100
          ).toFixed(2) + " %"
        : totalTradeInCallsCurrentMonth > 0
        ? " "
        : "0 %";

    return {
      region,
      tradeInCalls: tradeInCalls || "0",
      tradeInPercentage: tradeInPercentage || "0 %",
      dynamicFromLastPeriod: tradeInCallsDynamic || "0 %"
    };
  });
};

const filteredCitiesData = computed(() => {
  return citiesData.value.filter((city) => {
    city.city = window.stores.find((store) => store.id === city.city)?.title || "Неизвестный город";
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

const handleFilterChange = async ({
  selectedRegion: newRegion,
  selectedCity: newCity,
  startDate,
  endDate
}) => {
  selectedRegion.value = newRegion;
  selectedCity.value = newCity;
  filters.value.startDate = startDate
    ? new Date(startDate).toISOString()
    : null;
  filters.value.endDate = endDate ? new Date(endDate).toISOString() : null;

  console.log(
    "Selected dates:",
    filters.value.startDate,
    filters.value.endDate
  );

  await calculateRegionAverages(filters.value.startDate, filters.value.endDate);
  await fetchFactsOnly(); // Обновление фактов с новыми фильтрами
};

const downloadTable = () => {
  if (table.value) {
    // Создаем временную таблицу
    const tempTable = document.createElement("table");

    // Копируем заголовок
    const headerRow = tempTable.insertRow();
    const headers = [
      "По регионам",
      "Среднее значение качества звонка",
      "Динамика от прошлого периода",
      "Кол-во звонков",
      "Динамика от прошлого периода",
      "Кол-во звонков в трейд-ин",
      "Процент звонков в трейд-ин от общего кол-ва",
      "Динамика от прошлого периода"
    ];
    headers.forEach((header) => {
      const cell = headerRow.insertCell();
      cell.textContent = header;
    });

    // Копируем строки из filteredTableData
    filteredTableData.value.forEach((row) => {
      const rowElement = tempTable.insertRow();
      rowElement.insertCell().textContent = row.region;
      rowElement.insertCell().textContent = row.averageCallQuality;
      rowElement.insertCell().textContent = row.previousPeriodDynamic;
      rowElement.insertCell().textContent = row.totalCalls;
      rowElement.insertCell().textContent = row.callsDynamic;
      rowElement.insertCell().textContent = row.tradeInCalls;
      rowElement.insertCell().textContent = row.tradeInPercentage;
      rowElement.insertCell().textContent = row.dynamicFromLastPeriod;
    });

    // Копируем заголовок для городов
    const cityHeaderRow = tempTable.insertRow();
    const cityHeaderCell = cityHeaderRow.insertCell();
    cityHeaderCell.colSpan = headers.length; // Для заголовка "По городам"
    cityHeaderCell.textContent = "По городам";

    // Копируем строки из filteredCitiesData
    filteredCitiesData.value.forEach((city) => {
      const cityRow = tempTable.insertRow();
      cityRow.insertCell().textContent = city.city;
      cityRow.insertCell().textContent = city.cityAverageCallQuality;
      cityRow.insertCell().textContent = city.cityPreviousPeriodDynamic;
      cityRow.insertCell().textContent = city.cityTotalCalls;
      cityRow.insertCell().textContent = city.cityCallsDynamic;
      cityRow.insertCell().textContent = city.cityTradeInCalls;
      cityRow.insertCell().textContent = city.cityTradeInPercentage;
      cityRow.insertCell().textContent = city.cityDynamicFromLastPeriod;
    });

    // Генерируем Excel файл
    const ws = XLSX.utils.table_to_sheet(tempTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "static-table-city.xlsx");
  }
};

onMounted(() => {
  fetchData();
  fetchFactsOnly();
  calculatePreviousPeriodDynamic();
});
</script>
<style scoped lang="scss">
.filters-statis-city {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.table {
  max-width: 750px;
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

  .table-cell {
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
