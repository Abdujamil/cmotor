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
          <div class="table-cell">{{ city.cityAverageCallQuality }}</div>
          <div class="table-cell">{{ city.cityPreviousPeriodDynamic }}</div>
          <div class="table-cell">{{ city.cityTotalCalls }}</div>
          <div class="table-cell">{{ city.cityCallsDynamic }}</div>
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
      startDate: filters.value.startDate
        ? filters.value.startDate.toISOString()
        : "",
      endDate: filters.value.endDate ? filters.value.endDate.toISOString() : ""
    };

    const response = await fetchTotalItems({ params: filterParams });
    const newData = response.items;

    tableData.value = resetData ? newData : [...tableData.value, ...newData];

    console.log(
      "Starting calculateRegionAverages with dates:",
      filters.value.startDate,
      filters.value.endDate
    );

    // Проверка на корректность даты перед фильтрацией
    if (
      filters.value.startDate instanceof Date &&
      filters.value.endDate instanceof Date
    ) {
      calculateRegionAverages(filters.value.startDate, filters.value.endDate);
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

// Вспомогательная функция для получения предыдущего месяца
function getPreviousMonth() {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return previousMonth;
}

// Вспомогательная функция для фильтрации данных за определенный месяц
function filterByMonth(entries, month) {
  return entries.filter((entry) => {
    const entryDate = new Date(entry.date.split(".").reverse().join("-"));
    return (
      entryDate.getMonth() === month.getMonth() &&
      entryDate.getFullYear() === month.getFullYear()
    );
  });
}

// Функция для расчета динамики от прошлого периода
function calculateDynamicFromLastPeriod(cityEntries) {
  const currentMonth = new Date();
  const previousMonth = getPreviousMonth();

  // Данные за текущий месяц
  const currentMonthEntries = filterByMonth(cityEntries, currentMonth);

  // Данные за прошлый месяц
  const previousMonthEntries = filterByMonth(cityEntries, previousMonth);

  // Если нет данных за прошлый месяц, динамику не рассчитываем
  if (previousMonthEntries.length === 0) return "N/A";

  // Считаем среднее качество звонков за текущий и прошлый месяц
  const currentMonthQuality =
    currentMonthEntries.reduce((sum, entry) => sum + calculateTotal(entry), 0) /
    currentMonthEntries.length;
  const previousMonthQuality =
    previousMonthEntries.reduce(
      (sum, entry) => sum + calculateTotal(entry),
      0
    ) / previousMonthEntries.length;

  // Если нет данных за текущий месяц
  if (currentMonthEntries.length === 0) return "N/A";

  // Рассчитываем динамику ((текущий - прошлый) / прошлый) * 100
  const dynamic =
    ((currentMonthQuality - previousMonthQuality) / previousMonthQuality) * 100;

  return dynamic.toFixed(2) + "%";
}

// Вспомогательная функция для получения текущего месяца
function getCurrentMonthEntries(cityEntries) {
  const now = new Date();
  return filterByMonth(
    cityEntries,
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
}

// Вспомогательная функция для получения предыдущего месяца
function getPreviousMonthEntries(cityEntries) {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return filterByMonth(cityEntries, previousMonth);
}

// Функция для расчета динамики от прошлого периода для общего количества звонков
function calculateCallsDynamicFromLastPeriod(cityEntries) {
  const currentMonthEntries = getCurrentMonthEntries(cityEntries);
  const previousMonthEntries = getPreviousMonthEntries(cityEntries);

  // Если нет данных за прошлый месяц, динамику не рассчитываем
  if (previousMonthEntries.length === 0) return "N/A";
  // Если нет данных за текущий месяц, динамику не рассчитываем
  if (currentMonthEntries.length === 0) return "N/A";

  const totalCurrentCalls = currentMonthEntries.reduce(
    (sum, entry) => sum + Number(entry.fact),
    0
  );
  const totalPreviousCalls = previousMonthEntries.reduce(
    (sum, entry) => sum + Number(entry.fact),
    0
  );

  // Проверяем, чтобы избежать деления на ноль
  if (totalPreviousCalls === 0) return "N/A"; // или можете вернуть 0%

  const dynamic =
    ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) * 100;

  return dynamic.toFixed(2) + "%";
}

const fetchFactsOnly = async () => {
  try {
    const response = await fetchTotalItems();
    // Извлечение данных
    const factsData = response.items;

    // Группируем данные по городам
    const citiesGrouped = factsData.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = [];
      }
      acc[item.city].push(item);
      return acc;
    }, {});

    // Преобразование строки даты в объект Date
    function parseDateString(dateString) {
      const [day, month, year] = dateString.split(".").map(Number);
      return new Date(year, month - 1, day); // month - 1 потому что месяцы считаются с 0
    }

    // Фильтрация данных по месяцу и году
    function filterDataByMonth(entries, month, year) {
      return entries.filter((entry) => {
        const entryDate = parseDateString(entry.date);
        return (
          entryDate.getMonth() === month && entryDate.getFullYear() === year
        );
      });
    }

    // Получаем текущий и предыдущий месяцы
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Вычисляем среднее значение качества звонков, динамику и формируем структуру данных для таблицы
    citiesData.value = Object.keys(citiesGrouped).map((cityName) => {
      const cityEntries = citiesGrouped[cityName];

      // Получаем данные звонков трейд-ин за текущий месяц
      const currentMonthEntries = filterDataByMonth(
        cityEntries,
        currentMonth,
        currentYear
      );

      const totalTradeInCallsCurrent = currentMonthEntries.reduce(
        (sum, entry) => {
          return sum + (Number(entry.prodan) || 0);
        },
        0
      );

      // Получаем данные звонков трейд-ин за предыдущий месяц
      const previousMonthEntries = filterDataByMonth(
        cityEntries,
        previousMonth,
        previousYear
      );

      const totalTradeInCallsPrevious = previousMonthEntries.reduce(
        (sum, entry) => {
          return sum + (Number(entry.prodan) || 0);
        },
        0
      );

      // Суммируем значения для расчета среднего качества звонков
      const totalQuality = cityEntries.reduce(
        (sum, entry) => sum + calculateTotal(entry),
        0
      );

      const resultAvaregeCallQuality = Math.floor((totalQuality / 14) * 100);

      // Вычисляем среднее значение качества звонков
      const averageCallQuality =
        (resultAvaregeCallQuality / cityEntries.length).toFixed(2) + " %";

      // Общее количество звонков
      const totalCalls = cityEntries.reduce(
        (sum, entry) => sum + Number(entry.fact),
        0
      );

      // Рассчитываем динамику от прошлого периода
      const dynamicFromLastPeriod = calculateDynamicFromLastPeriod(cityEntries);

      // Рассчитываем динамику от прошлого периода для общего количества звонков
      const callsDynamicFromLastPeriod =
        calculateCallsDynamicFromLastPeriod(cityEntries);

      // Фильтруем и считаем звонки трейд-ин
      const totalTradeInCalls = cityEntries.reduce((sum, entry) => {
        return sum + (entry.prodan ? Number(entry.fact) : 0);
      }, 0);

      // Считаем общее количество звонков за текущий месяц
      const totalCallsCurrent = currentMonthEntries.reduce((sum, entry) => {
        return sum + (Number(entry.fact) || 0);
      }, 0);

      // Рассчитываем процент звонков трейд-ин от общего количества звонков
      // количество звонков трейд-ин / на общее количество звонков для каждого города * 100;
      const tradeInPercentage =
        totalCalls > 0
          ? ((totalTradeInCallsCurrent / totalCallsCurrent) * 100).toFixed(2) +
            " %"
          : "0%";

      // Рассчитываем динамику
      let tradeInDynamic = "N/A";
      if (totalTradeInCallsPrevious > 0) {
        tradeInDynamic =
          (
            ((totalTradeInCallsCurrent - totalTradeInCallsPrevious) /
              totalTradeInCallsPrevious) *
            100
          ).toFixed(2) + "%";
      } else if (totalTradeInCallsCurrent > 0) {
        tradeInDynamic = "100%";
      } else {
        tradeInDynamic = "0%";
      }

      return {
        city: cityName,
        cityAverageCallQuality: averageCallQuality || "N/A",
        cityPreviousPeriodDynamic: dynamicFromLastPeriod || "N/A",
        cityTotalCalls: totalCalls || "N/A",
        cityCallsDynamic: callsDynamicFromLastPeriod || "N/A",
        cityTradeInCalls: totalTradeInCalls || "N/A",
        cityTradeInPercentage: tradeInPercentage || "N/A",
        cityDynamicFromLastPeriod: tradeInDynamic || "N/A"
      };
    });

    return factsData;
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
      const city = entry.city;
      const fact = parseInt(entry.fact) || 0; // Преобразуем fact в число

      // Проверяем, к какому региону относится город
      const region = cityRegionMap[city];

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
  if (!startDate && !endDate) {
    return data; // Если нет фильтра по дате, возвращаем все данные
  }

  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();
  end.setHours(23, 59, 59, 999);

  console.log("Фильтр по дате:", start, end);

  const filtered = data.filter((item) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date.split(".").reverse().join("-"));
    return itemDate >= start && itemDate <= end;
  });

  console.log("Отфильтрованные данные:", filtered);
  return filtered;
};

// Функция для фильтрации по текущему месяцу
const getCurrentMonthData = (data) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return data.filter((item) => {
    if (!item.date) {
      return false; // Пропускаем записи без даты
    }

    const itemDate = new Date(item.date.split(".").reverse().join("-"));

    return itemDate >= currentMonthStart;
  });
};

// Функция для фильтрации по предыдущему месяцу
const getPreviousMonthData = (data) => {
  const now = new Date();
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return data.filter((item) => {
    if (!item.date) {
      return false; // Пропускаем записи без даты
    }

    const itemDate = new Date(item.date.split(".").reverse().join("-"));
    return itemDate >= previousMonthStart && itemDate < currentMonthStart;
  });
};

// Функция для расчета средних значений по регионам
const calculateRegionAverages = async (startDate = null, endDate = null) => {
  console.log(
    "Starting calculateRegionAverages with dates:",
    startDate,
    endDate
  );

  if (!Array.isArray(tableData.value)) {
    console.error("tableData.value не является массивом:", tableData.value);
    return;
  }

  const filteredData = filterDataByDate(tableData.value, startDate, endDate); // тут данных почему-то нет пусто

  if (filteredData.length === 0) {
    alert("Нет данных для выбранного диапазона дат.");
    return;
  }

  const now = new Date();
  const currentMonth = new Date().getMonth(); // Текущий месяц
  const currentYear = new Date().getFullYear(); // Текущий год

  console.log("Текущий месяц:", currentMonth, "Текущий год:", currentYear);

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Предыдущий месяц
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  console.log(
    "Предыдущий месяц:",
    previousMonth,
    "Предыдущий год:",
    previousYear
  );

  const getDataForMonth = (data, targetMonth, targetYear) => {
    let foundData = data.filter((item) => {
      const itemDate = new Date(item.date.split(".").reverse().join("-"));
      return (
        itemDate.getMonth() === targetMonth &&
        itemDate.getFullYear() === targetYear
      );
    });

    // Если данных нет, проверяем предыдущий месяц
    if (foundData.length === 0) {
      if (targetMonth === 0) {
        // Если это январь, возвращаем пустой массив
        return [];
      }
      return getDataForMonth(data, targetMonth - 1, targetYear);
    }

    return foundData; // Возвращаем найденные данные
  };

  // Получаем данные для текущего месяца
  const currentMonthData = getDataForMonth(
    filteredData,
    currentMonth,
    currentYear
  );
  // console.log("currentMonthData", currentMonthData);

  // Получаем данные для предыдущего месяца
  const previousMonthData = getDataForMonth(
    filteredData,
    previousMonth,
    previousYear
  );
  // console.log("previousMonthData", previousMonthData);

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
    const city = entry.city;
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

  filteredTableData.value = Object.keys(regionData)
    .filter((region) => {
      // Фильтруем только по выбранному региону, если он есть
      return !selectedRegion.value || region === selectedRegion.value;
    })
    .map((region) => {
      const regionCities = regionData[region];
      const currentRegionData = getCurrentMonthData(regionCities);
      const previousRegionData = getPreviousMonthData(regionCities);

      const totalCurrentCalls =
        region === "Юг" ? totalCallsSouth : totalCallsNorth;

      const totalPreviousCalls = previousMonthData.reduce(
        (sum, item) => sum + (parseInt(item.fact) || 0),
        0
      );

      const totalQuality = regionCities.reduce(
        (sum, quality) => sum + quality.value,
        0
      );
      const averageQuality = (totalQuality / regionCities.length).toFixed(2);

      const averageCurrentQuality =
        currentRegionData.length > 0
          ? (
              currentRegionData.reduce((sum, item) => sum + item.value, 0) /
              currentRegionData.length
            ).toFixed(2)
          : 0;

      const averagePreviousQuality =
        previousRegionData.length > 0
          ? (
              previousRegionData.reduce((sum, item) => sum + item.value, 0) /
              previousRegionData.length
            ).toFixed(2)
          : 0;

      const previousPeriodDynamic = calculatePreviousPeriodDynamic(
        averageCurrentQuality,
        averagePreviousQuality
      );

      const callsDynamic =
        totalPreviousCalls > 0
          ? (
              ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) *
              100
            ).toFixed(0) + " %"
          : totalCurrentCalls > 0
          ? "0.0 %"
          : "0 %";

      const tradeInCalls =
        region === "Юг" ? tradeInCallsSouth : tradeInCallsNorth;
      const tradeInPercentage =
        totalCurrentCalls > 0
          ? ((tradeInCalls / totalCurrentCalls) * 100).toFixed(2) + " %"
          : "0 %";

      // Динамика количества звонков в трейд-ин
      const tradeInCallsDynamic =
        totalTradeInCallsPreviousMonth > 0
          ? (
              ((totalTradeInCallsCurrentMonth -
                totalTradeInCallsPreviousMonth) /
                totalTradeInCallsPreviousMonth) *
              100
            ).toFixed(2) + " %"
          : totalTradeInCallsCurrentMonth > 0
          ? "0.0 %"
          : "0 %";

      return {
        region,
        averageCallQuality: averageQuality + " %",
        previousPeriodDynamic: previousPeriodDynamic || "0 %",
        totalCalls: totalCurrentCalls || "0",
        callsDynamic: callsDynamic || "0 %",
        tradeInCalls: tradeInCalls || "0",
        tradeInPercentage: tradeInPercentage || "0 %",
        dynamicFromLastPeriod: tradeInCallsDynamic || "0 %"
      };
    });
};

const filteredCitiesData = computed(() => {
  return citiesData.value.filter((city) => {
    if (selectedCity.value) {
      return city.city === selectedCity.value;
    }

    if (selectedRegion.value) {
      return cities.value[selectedRegion.value].includes(city.city);
    }
    return true;
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

  filters.value.startDate = startDate instanceof Date ? startDate : null;
  filters.value.endDate = endDate instanceof Date ? endDate : null;
  console.log(
    "Selected dates:",
    filters.value.startDate,
    filters.value.endDate
  );

  await calculateRegionAverages(filters.value.startDate, filters.value.endDate);
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
  calculateRegionAverages(null, null);
});
</script>

<!-- TODO -- Фильтр по датам -->

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
