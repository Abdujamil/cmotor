<!-- TODO динамика по регионам и городам -->
<template>
  <h1>Сводная по городам</h1>

  <div class="statis-city">
    <div class="filters filters-statis-city">
      <Filter @filterChange="handleFilterChange" />
      <IButton @click="downloadTable" />
    </div>

    <div class="table-container">
      <div ref="table" class="table">
        <!-- Table Header -->
        <div class="table-row header">
          <div class="table-cell" @click="sortData('city')">
            По регионам
            <span>
              <span v-if="sortKey === 'city' && sortOrder === 'asc'">↑</span>
              <span v-if="sortKey === 'city' && sortOrder === 'desc'">↓</span>
            </span>
          </div>
          <div class="table-cell" @click="sortData('cityTotalCalls')">
            Кол-во звонков
            <span>
              <span v-if="sortKey === 'cityTotalCalls' && sortOrder === 'asc'"
                >↑</span
              >
              <span v-if="sortKey === 'cityTotalCalls' && sortOrder === 'desc'"
                >↓</span
              >
            </span>
          </div>
          <div class="table-cell" @click="sortData('cityCallsDynamic')">
            Динамика от прошлого периода
            <span>
              <span v-if="sortKey === 'cityCallsDynamic' && sortOrder === 'asc'"
                >↑</span
              >
              <span
                v-if="sortKey === 'cityCallsDynamic' && sortOrder === 'desc'"
                >↓</span
              >
            </span>
          </div>
          <div class="table-cell" @click="sortData('cityAverageCallQuality')">
            Среднее значение качества звонка
            <span>
              <span
                v-if="
                  sortKey === 'cityAverageCallQuality' && sortOrder === 'asc'
                "
                >↑</span
              >
              <span
                v-if="
                  sortKey === 'cityAverageCallQuality' && sortOrder === 'desc'
                "
                >↓</span
              >
            </span>
          </div>
          <div
            class="table-cell"
            @click="sortData('cityPreviousPeriodDynamic')"
          >
            Динамика от прошлого периода
            <span>
              <span
                v-if="
                  sortKey === 'cityPreviousPeriodDynamic' && sortOrder === 'asc'
                "
                >↑</span
              >
              <span
                v-if="
                  sortKey === 'cityPreviousPeriodDynamic' &&
                  sortOrder === 'desc'
                "
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
          <div class="table-cell">{{ row.totalCalls }}</div>
          <div class="table-cell">{{ row.callsDynamic }}</div>
          <div class="table-cell">{{ row.averageCallQuality }}</div>
          <div class="table-cell">{{ row.previousPeriodDynamic }}</div>
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
          <div class="table-cell">{{ city.cityTotalCalls }}</div>
          <div class="table-cell">{{ city.cityCallsDynamic }}</div>
          <div class="table-cell">{{ city.cityAverageCallQuality }}</div>
          <div class="table-cell">{{ city.cityPreviousPeriodDynamic }}</div>
        </div>
      </div>

      <div class="chart">
        <LineChart
          :chartData="chartData"
          :options="options"
          ref="lineChartRef"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { fetchTotalItems } from "../api-service/apiService";
import { ref, computed, onMounted, watch } from "vue";
import { method, shuffle } from "lodash";
import { LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import * as XLSX from "xlsx";

const data = ref([]); // Динамические данные для графика
const table = ref(null);
const selectedRegion = ref("");
const selectedCity = ref("");
const filteredTableData = ref([]);

const sortKey = ref("");
const sortOrder = ref("asc");

const tableData = ref([]);

const citiesData = ref([]);

new ResizeObserver((event) => {
  const width = document.documentElement.scrollWidth || 0;
  const height = document.documentElement.scrollHeight || 0;
  parent.postMessage({ width, height }, "*");
}).observe(document.documentElement);

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

// Вычисляемое свойство для сортировки данных
const sortedData = computed(() => {
  const data = [...filteredCitiesData.value];

  return data.sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];

    // if (aValue === undefined || bValue === undefined) {
    //   console.error(`Ключ "${sortKey.value}" не найден в одном из объектов:`, a, b);
    //   return 0; // Не сортировать, если ключ не найден
    // }

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
  console.log(`sortKey: ${sortKey.value}, sortOrder: ${sortOrder.value}`);
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
      startDate: filters.value.startDate
        ? new Date(filters.value.startDate).toISOString().split("T")[0] // Преобразуем в yyyy-mm-dd
        : "",
      endDate: filters.value.endDate
        ? new Date(filters.value.endDate).toISOString().split("T")[0] // Преобразуем в yyyy-mm-dd
        : ""
    };

    const response = await fetchTotalItems({ params: filterParams });

    const newData = response.items;

    if (resetData) {
      tableData.value = newData;
    } else {
      tableData.value = [...tableData.value, ...newData];
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

const filterDataByDate = (data, startDate, endDate) => {
  if (!startDate || !endDate) {
    console.log("No dates provided, returning all data");
    return data; // Если даты не выбраны, возвращаем все данные
  }

  // Преобразуем строки в объекты Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Проверим, что обе даты корректны
  if (isNaN(start) || isNaN(end)) {
    console.error("Invalid date format");
    return data; // Если формат даты некорректен, возвращаем все данные
  }

  // Устанавливаем время для конечной даты, чтобы включить весь день
  end.setHours(23, 59, 59, 999);

  return data.filter((item) => {
    if (!item.date) return false; // Пропускаем записи без даты

    // Преобразуем дату в формат "yyyy-mm-dd", чтобы она корректно сравнивалась
    const itemDate = new Date(item.date.split(".").reverse().join("-"));

    // Если itemDate не является корректной датой, пропускаем его
    if (isNaN(itemDate)) return false;

    // Сравниваем дату
    return itemDate >= start && itemDate <= end;
  });
};

const fetchFactsOnly = async () => {
  try {
    const startDate = new Date(filters.value.startDate);
    const endDate = new Date(filters.value.endDate);

    const response = await fetchTotalItems();
    const factsData = response.items;

    // Фильтрация данных по выбранным датам
    const filteredFacts = filterDataByDate(
      factsData,
      filters.value.startDate,
      filters.value.endDate
    );

    if (!startDate || !endDate) {
      console.log("No dates selected, skipping data fetch");
      data.value = []; // Очищаем данные, если даты не выбраны
      return;
    }

    // Группируем данные по городам
    // const citiesGrouped = factsData.reduce((acc, item) => {
    //   if (!acc[item.city]) {
    //     acc[item.city] = [];
    //   }
    //   acc[item.city].push(item);
    //   return acc;
    // }, {});

    const monthlyCalls = new Array(12).fill(0);
    factsData.forEach((item) => {
      const date = new Date(item.date);
      const monthIndex = date.getMonth();
      monthlyCalls[monthIndex] += Number(item.fact);
    });

    data.value = monthlyCalls;

    // Группируем данные по городам
    const citiesGrouped = factsData.reduce((acc, item) => {
      const cityName =
        window.stores.find((store) => store.id === item.city)?.title ||
        "Неизвестный город";

      if (!acc[cityName]) {
        acc[cityName] = [];
      }
      acc[cityName].push(item);

      return acc;
    }, {});

    // Определяем предыдущий период на основе разницы между startDate и endDate
    const calculatePreviousPeriod = (start, end) => {
      const diffDays = (end - start) / (1000 * 60 * 60 * 24); // Разница в днях

      const previousStartDate = new Date(start);
      previousStartDate.setDate(previousStartDate.getDate() - diffDays);

      const previousEndDate = new Date(end);
      previousEndDate.setDate(previousEndDate.getDate() - diffDays);

      return { previousStartDate, previousEndDate };
    };

    const { previousStartDate, previousEndDate } = calculatePreviousPeriod(
      startDate,
      endDate
    );

    // Определяем текущую дату
    const now = new Date();

    const previousPeriodStartDate = new Date(filters.value.startDate);
    previousPeriodStartDate.setMonth(previousPeriodStartDate.getMonth() - 1);

    const previousPeriodEndDate = new Date(filters.value.endDate);
    previousPeriodEndDate.setMonth(previousPeriodEndDate.getMonth() - 1);

    // Функция для расчета динамики по сравнению с предыдущим периодом
    const calculateCityDynamic = (currentCityEntries, previousCityEntries) => {
      const currentCalls = currentCityEntries.reduce((sum, entry) => {
        const fact = Number(entry.fact);
        return sum + (isNaN(fact) ? 0 : fact);
      }, 0);

      const previousCalls = previousCityEntries.reduce((sum, entry) => {
        const fact = Number(entry.fact);
        return sum + (isNaN(fact) ? 0 : fact);
      }, 0);

      const callsDynamic =
        previousCalls > 0
          ? ((currentCalls - previousCalls) / previousCalls) * 100
          : ""; // Если нет данных или 0 звонков, возвращаем пустую строку

      return callsDynamic ? callsDynamic.toFixed(0) + " %" : ""; // Если есть данные, округляем и добавляем '%', иначе оставляем пусто
    };

    const calculateQualityDynamic = (
      currentCityEntries,
      previousCityEntries,
      startDate,
      endDate
    ) => {
      const currentQuality = currentCityEntries.reduce(
        (sum, entry) => sum + calculateTotal(entry),
        0
      );
      const previousQuality = previousCityEntries.reduce(
        (sum, entry) => sum + calculateTotal(entry),
        0
      );

      // Проверка: если оба периода не имеют данных, возвращаем пустую строку
      if (currentQuality === 0 && previousQuality === 0) {
        return " ";
      }

      // Проверка: если текущий период имеет данные, а предыдущий не имеет
      if (previousQuality === 0 && currentQuality > 0) {
        return "в предыдущем периоде нет данных"; // Если в предыдущем периоде нет данных, но в текущем есть
      }

      // Проверка: если данные за оба периода есть, рассчитываем динамику
      if (previousQuality > 0) {
        const qualityDynamic = (
          ((currentQuality - previousQuality) / previousQuality) *
          100
        ).toFixed(0);

        return qualityDynamic + " %"; // Возвращаем рассчитанную динамику
      }

      // Возвращаем пустую строку по умолчанию, если ни одно из условий не выполнено
      return " ";
    };

    // Вычисляем среднее качество звонков и динамику по каждому городу
    citiesData.value = Object.keys(citiesGrouped).map((cityName) => {
      const cityEntries = citiesGrouped[cityName];

      // console.log("cityEntries: ", cityEntries);

      // Фильтрация данных по выбранным датам для текущего города
      const currentCityEntries = filterDataByDate(
        cityEntries,
        filters.value.startDate,
        filters.value.endDate
      );

      // console.log("currentCityEntries: ", currentCityEntries);

      // Если нет фильтра, берем все данные
      const previousCityEntries =
        filters.value.startDate && filters.value.endDate
          ? filterDataByDate(
              cityEntries,
              previousPeriodStartDate.toISOString().split("T")[0],
              previousPeriodEndDate.toISOString().split("T")[0]
            )
          : cityEntries;

      // console.log("currentCityEntries: ", currentCityEntries, "previousCityEntries: ", previousCityEntries);

      // Суммируем значения для расчета среднего качества звонков
      const totalQuality = currentCityEntries.reduce(
        (sum, entry) => sum + calculateTotal(entry),
        0
      );

      const resultAvaregeCallQuality = Math.floor((totalQuality / 14) * 100);

      const averageCallQuality =
        startDate && endDate
          ? (resultAvaregeCallQuality / currentCityEntries.length).toFixed(2) +
            " %"
          : " ";

      // Общее количество звонков
      const totalCalls = currentCityEntries.reduce(
        (sum, entry) => sum + Number(entry.fact),
        0
      );

      // Рассчитываем динамику от прошлого периода
      const callsDynamicFromLastPeriod =
        startDate && endDate
          ? calculateCityDynamic(currentCityEntries, previousCityEntries)
          : " "; // Если даты не выбраны, возвращаем пустую строку

      const qualityDynamicFromLastPeriod =
        startDate && endDate
          ? calculateQualityDynamic(currentCityEntries, previousCityEntries)
          : " ";

      return {
        city: cityName,
        cityTotalCalls: totalCalls || "",
        cityPreviousPeriodDynamic: qualityDynamicFromLastPeriod || "",
        cityAverageCallQuality: averageCallQuality || "",
        cityCallsDynamic: callsDynamicFromLastPeriod || " "
      };
    });

    return filteredFacts;
  } catch (error) {
    console.error("Ошибка при получении данных (fact):", error);
    return [];
  }
};

// Основная функция для расчета средних значений по регионам
const calculateRegionAverages = async (startDate, endDate) => {
  if (!Array.isArray(tableData.value)) {
    console.error("tableData.value не является массивом:", tableData.value);
    return;
  }

  const filteredData = filterDataByDate(tableData.value, startDate, endDate);

  if (filteredData.length === 0) {
    alert("Нет данных для выбранного диапазона дат.");
    return;
  }

  // Определяем, выбран ли диапазон по месяцу или неделе
  const isWeekly = endDate - startDate <= 7 * 24 * 60 * 60 * 1000;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Функция для получения данных за заданный месяц и год
  const getDataForMonth = (data, targetMonth, targetYear) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === targetMonth &&
        itemDate.getFullYear() === targetYear
      );
    });
  };

  // Определяем предыдущий период
  const previousStartDate = new Date(startDate);
  previousStartDate.setMonth(previousStartDate.getMonth() - (isWeekly ? 0 : 1));
  const previousEndDate = new Date(endDate);
  previousEndDate.setMonth(previousEndDate.getMonth() - (isWeekly ? 0 : 1));

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Предыдущий месяц
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousPeriodData = filterDataByDate(
    tableData.value,
    previousStartDate,
    previousEndDate
  );

  const regionData = {
    Юг: [],
    Север: []
  };

  let totalCallsSouth = 0;
  let totalCallsNorth = 0;

  filteredData.forEach((entry) => {
    let city = entry.city;
    city =
      window.stores.find((store) => store.id === entry.city)?.title ||
      "Неизвестный город";

    const fact = parseInt(entry.fact) || 0;
    const region = cityRegionMap[city];

    if (region === "Юг") {
      totalCallsSouth += fact;
    } else if (region === "Север") {
      totalCallsNorth += fact;
    }
  });

  filteredData.forEach((client) => {
    client.city =
      window.stores.find((store) => store.id === client.city)?.title ||
      "Неизвестный город";

    const region = cityRegionMap[client.city];
    if (region && regionData[region] !== undefined) {
      const total = calculateTotal(client);
      const averageCallQuality = (total / 14) * 100;
      regionData[region].push({
        date: client.date,
        value: parseFloat(averageCallQuality.toFixed(2))
      });
    } else {
      console.warn(`Неизвестный город или регион не найден: ${client.city}`);
    }
  });

  // Подсчитываем звонки для предыдущего периода
  let totalPreviousCallsSouth = 0;
  let totalPreviousCallsNorth = 0;

  previousPeriodData.forEach((entry) => {
    let city = entry.city;
    city =
      window.stores.find((store) => store.id === entry.city)?.title ||
      "Неизвестный город";

    const fact = parseInt(entry.fact) || 0;
    const region = cityRegionMap[city];

    if (region === "Юг") {
      totalPreviousCallsSouth += fact;
    } else if (region === "Север") {
      totalPreviousCallsNorth += fact;
    }
  });

  console.log("totalPreviousCallsSouth:", totalPreviousCallsSouth);
  console.log("totalPreviousCallsNorth:", totalPreviousCallsNorth);

  filteredTableData.value = Object.keys(regionData).map((region) => {
    const regionCities = regionData[region];

    const totalCurrentCalls =
      region === "Юг" ? totalCallsSouth : totalCallsNorth;

    const totalPreviousCalls =
      region === "Юг" ? totalPreviousCallsSouth : totalPreviousCallsNorth;

    const totalQuality = regionCities.reduce(
      (sum, quality) => sum + quality.value,
      0
    );
    const averageQuality =
      regionCities.length > 0
        ? (totalQuality / regionCities.length).toFixed(2)
        : 0;

    const currentRegionData = getDataForMonth(
      regionCities,
      currentMonth,
      currentYear
    );
    const averageCurrentQuality =
      currentRegionData.length > 0
        ? (
            currentRegionData.reduce((sum, item) => sum + item.value, 0) /
            currentRegionData.length
          ).toFixed(2)
        : 0;

    const previousRegionData = getDataForMonth(
      regionCities,
      previousMonth,
      previousYear
    );
    const averagePreviousQuality =
      previousRegionData.length > 0
        ? (
            previousRegionData.reduce((sum, item) => sum + item.value, 0) /
            previousRegionData.length
          ).toFixed(2)
        : 0;

    const previousPeriodDyn =
      startDate && endDate && averagePreviousQuality > 0
        ? (
            ((averageCurrentQuality - averagePreviousQuality) /
              averagePreviousQuality) *
            100
          ).toFixed(0) + " %"
        : " ";

    const callsDynamic =
      totalPreviousCalls > 0
        ? (
            ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) *
            100
          ).toFixed(1) + " %"
        : " ";

    return {
      region,
      totalCalls: totalCurrentCalls || "0",
      callsDynamic: callsDynamic || "0 %",
      averageCallQuality: averageQuality + " %",
      previousPeriodDynamic: previousPeriodDyn || ""
    };
  });
};

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

let previousFilters = { startDate: null, endDate: null };

// ---------------------CHART START--------------------------- //

// Регистрируем компоненты Chart.js
Chart.register(...registerables);

// Создаем данные для графика, включая метки и цвет
const chartData = ref(() => ({
  labels: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек"
  ],
  datasets: [
    {
      label: "Статистика",
      data: data.value.map((item) => item.value),
      borderColor: "#00A067",
      backgroundColor: "transparent",
      borderWidth: 1,
      fill: true
    }
  ]
}));

// Опции для графика
const options = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "График по фильтрам" }
  }
});

// Ссылка на элемент графика для доступа к экземпляру
const lineChartRef = ref();

// Универсальная функция для получения данных
const fetchDataChart = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.answer.items;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    return [];
  }
};

// Функция получения уникальных городов с маппингом названий
const getUniqueCities = (data) => {
  return [...new Set(data.map((item) => {
    item.city = window.stores.find((store) => store.id === item.city)?.title || "Неизвестный город";
    return item.city;
  }))];
};

// Функция подсчета общего количества звонков по городам
const calculateTotalCallsByCity = (data, cities) => {
  const totalCallsByCity = cities.reduce((acc, city) => {
    acc[city] = 0;
    return acc;
  }, {});
  data.forEach((item) => {
    const city = item.city;
    const factCity = Number(item.fact) || 0;
    totalCallsByCity[city] += factCity;
  });
  return totalCallsByCity;
};

// Функция обновления данных графика
const updateChartData = (cities, totalCallsByCity) => {
  chartData.value = {
    labels: cities,
    datasets: [
      {
        label: "Количество звонков",
        data: cities.map(city => totalCallsByCity[city]),
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        fill: false
      }
    ]
  };
};

// Основная функция для загрузки данных и обновления графика по умолчанию
const fetchAllChartData = async () => {
  const rawData = await fetchDataChart("https://crystal-motors.ru/method.getClients?count=all");
  const filteredData = filterDataByDate(rawData, null, null);
  const cities = getUniqueCities(filteredData);
  const totalCallsByCity = calculateTotalCallsByCity(filteredData, cities);
  updateChartData(cities, totalCallsByCity);
};

// Модуль для вычисления данных, которые будут отображаться на графике с учетом региона и города
const filteredCitiesForChart = computed(() => {
  // Фильтруем данные по выбранным регионам и городам
  let filteredCities = citiesData.value;

  if (selectedCity.value) {
    // Если выбран город, фильтруем только этот город
    filteredCities = filteredCities.filter((city) => city.city === selectedCity.value);
  } else if (selectedRegion.value) {
    // Если выбран регион, фильтруем по всем городам в этом регионе
    filteredCities = filteredCities.filter((city) => 
      cities.value[selectedRegion.value].includes(city.city)
    );
  }

  return filteredCities;
});


// Функция для загрузки данных и обновления графика с фильтрацией по диапазону дат
const fetchDataAndUpdateChart = async (startDate, endDate) => {
  const rawData = await fetchDataChart("https://crystal-motors.ru/method.getClients?count=all");
  const filteredData = filterDataByDate(rawData, startDate, endDate);

  const filteredCities = filteredCitiesForChart.value;
  
  const cities = getUniqueCities(filteredData);
  const totalCallsByCity = calculateTotalCallsByCity(filteredData, cities);
  updateChartData(cities, totalCallsByCity);
};

// ---------------------CHART END---------------------- //

const handleFilterChange = async ({
  selectedRegion: newRegion,
  selectedCity: newCity,
  startDate,
  endDate
}) => {
  if (
    previousFilters.startDate === startDate &&
    previousFilters.endDate === endDate &&
    selectedRegion.value === newRegion &&
    selectedCity.value === newCity
  ) {
    return; // Если фильтры не изменились, не выполняем функцию
  }

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

  // Запоминаем текущие фильтры
  previousFilters = {
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  };

  // await fetchData();
  await calculateRegionAverages(filters.value.startDate, filters.value.endDate);
  await fetchFactsOnly(filters.value.startDate, filters.value.endDate);
  await fetchDataAndUpdateChart(filters.value.startDate, filters.value.endDate);

  if (lineChartRef.value) {
    lineChartRef.value.update(); // Принудительно обновляем график
  }
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

onMounted(async () => {
  await fetchData();
  await calculateRegionAverages(filters.value.startDate, filters.value.endDate);
  await fetchFactsOnly();
  await fetchAllChartData();
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
  // max-width: 750px;
  max-width: 650px;
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

.table-container {
  display: flex;
  align-items: start;
  gap: 12px;
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

// Chart

.chart {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}
</style>
