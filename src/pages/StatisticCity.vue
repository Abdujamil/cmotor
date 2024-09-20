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
          <div class="table-cell">
            {{ city.cityAverageCallQuality }}
          </div>
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import * as XLSX from "xlsx";

const table = ref(null);
const selectedRegion = ref("");
const selectedCity = ref("");
const filteredTableData = ref([]);

const tableData = ref([]);

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

const cityRegionMap = {
  Тюмень: "Юг",
  Сургут: "Юг",
  Пермь: "Юг",
  Челябинск: "Юг",
  Самара: "Юг",
  Кемерово: "Север",
  Барнаул: "Север",
  Новокузнецк: "Север",
  "Красноярск (Брянка)": "Север",
  "Красноярск (ЛПК)": "Север",
  Омск: "Север",
  Томск: "Север"
};

// Функция для преобразования процентов в числа
const parsePercentage = (percentString) => {
  return parseFloat(percentString.replace("%", "")) || 0;
};

// Функция для подсчета общего количества звонков по городу
function calculateTotalCallsByCity(cityName, factsData) {
  const cityEntries = factsData.filter((entry) => entry.city === cityName);
  const totalCalls = cityEntries.reduce(
    (sum, entry) => sum + (parseInt(entry.fact) || 0),
    0
  );

  return totalCalls;
}

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
const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://crystal-motors.ru/method.getClients"
    );

    tableData.value = response.data.answer.items;
    calculateRegionAverages(); // После получения данных вычисляем средние значения по регионам
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
    const response = await axios.get(
      "https://crystal-motors.ru/method.getClients?count=100000"
    );

    // Извлечение данных
    const factsData = response.data.answer.items;

    // Группируем данные по городам
    const citiesGrouped = factsData.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = [];
      }
      acc[item.city].push(item);
      return acc;
    }, {});

    // Вычисляем среднее значение качества звонков, динамику и формируем структуру данных для таблицы
    citiesData.value = Object.keys(citiesGrouped).map((cityName) => {
      const cityEntries = citiesGrouped[cityName];

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
      console.log("dynamicFromLastPeriod", dynamicFromLastPeriod);

      // Рассчитываем динамику от прошлого периода для общего количества звонков
      const callsDynamicFromLastPeriod =
        calculateCallsDynamicFromLastPeriod(cityEntries);

      // Фильтруем и считаем звонки трейд-ин
      const totalTradeInCalls = cityEntries.reduce((sum, entry) => {
        // Проверяем, является ли звонок трейд-ин (например, по какому-то признаку)
        return sum + (entry.trade_in ? Number(entry.fact) : 0);
      }, 0);

      return {
        city: cityName,
        cityAverageCallQuality: averageCallQuality ? averageCallQuality : "N/A",
        cityPreviousPeriodDynamic: dynamicFromLastPeriod
          ? dynamicFromLastPeriod
          : "N/A",
        cityTotalCalls: totalCalls ? totalCalls : "N/A",
        cityCallsDynamic: callsDynamicFromLastPeriod
          ? callsDynamicFromLastPeriod
          : "N/A",
        cityTradeInCalls: totalTradeInCalls ? totalTradeInCalls : "N/A",
        cityTradeInPercentage: "0%",
        cityDynamicFromLastPeriod: "0%"
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

// Функция для расчета среднего значения качества звонка по городу
function calculateAverageQuality(cityName) {
  const cityEntries = citiesData.value.filter(
    (entry) => entry.city === cityName
  );

  if (cityEntries.length === 0) return 0; // Если данных по городу нет, возвращаем 0

  const totalQuality = cityEntries.reduce(
    (sum, entry) => sum + parsePercentage(entry.averageCallQuality),
    0
  );
  const averageQuality = (totalQuality / cityEntries.length).toFixed(2);

  return averageQuality;
}

// Функция для парсинга даты
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split(".");
  return new Date(year, month - 1, day); // Месяц начинается с 0, поэтому вычитаем 1
};

// Функция для фильтрации данных по месяцу и году
const filterDataByMonth = (data, month, year) => {
  return data.filter((entry) => {
    const [day, monthStr, yearStr] = entry.date.split("."); // Разделяем дату на день, месяц и год
    const entryDate = new Date(yearStr, monthStr - 1, day); // Преобразуем строку в объект Date

    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
  });
};

// Функция для расчета динамики за прошлый месяц
const calculatePreviousPeriodDynamic = (currentAverage, previousAverage) => {
  if (!previousAverage || previousAverage === 0) {
    return "N/A"; // Если данных за предыдущий период нет, возвращаем N/A
  }

  const dynamic = ((currentAverage - previousAverage) / previousAverage) * 100;
  return dynamic.toFixed(2) + " %";
};

// Функция для расчета средних значений по регионам
const calculateRegionAverages = async () => {
  if (!Array.isArray(tableData.value)) {
    console.error("tableData.value не является массивом:", tableData.value);
    return;
  }

  const currentMonth = new Date().getMonth(); // Текущий месяц
  const currentYear = new Date().getFullYear(); // Текущий год

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Предыдущий месяц
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthData = filterDataByMonth(
    tableData.value,
    currentMonth,
    currentYear
  );
  const previousMonthData = filterDataByMonth(
    tableData.value,
    previousMonth,
    previousYear
  );

  const regionData = {
    Юг: [],
    Север: []
  };

  // currentMonthData.forEach((client) => {
  //   const region = cityRegionMap[client.city];

  //   if (region) {
  //     const totalCalls = calculateTotalCallsByCity(client.city); // Суммируем звонки
  //     const total = calculateTotal(client); // Рассчитываем общее качество звонков
  //     const averageCallQuality = (total / 14) * 100; // Рассчитываем среднее значение качества
  //     regionData[region].push({
  //       city: client.city,
  //       date: client.date,
  //       type: "current",
  //       quality: parseFloat(averageCallQuality.toFixed(2)),
  //       totalCalls: totalCalls || 0 // Количество звонков
  //     });
  //   }
  // });

  // previousMonthData.forEach((client) => {
  //   const region = cityRegionMap[client.city];
  //   if (region) {
  //     const totalCalls = calculateTotalCallsByCity(client.city);
  //     const averageCallQuality = (total / 14) * 100; // Расчет среднего качества звонка за предыдущий период
  //     regionData[region].push({
  //       city: client.city,
  //       date: client.date,
  //       type: "previous",
  //       quality: parseFloat(averageCallQuality.toFixed(2)),
  //       totalCalls: totalCalls // Количество звонков за прошлый месяц
  //     });
  //   }
  // });

  // Добавление функционала суммирования звонков по регионам

  const factsData = await fetchFactsOnly();
  let totalCallsSouth = 0;
  let totalCallsNorth = 0;

  // Проходим по каждому элементу данных и суммируем звонки по регионам
  factsData.forEach((entry) => {
    const city = entry.city;
    const fact = parseInt(entry.fact) || 0; // Преобразуем fact в число
    const region = cityRegionMap[city];

    if (region === "Юг") {
      totalCallsSouth += fact;
    } else if (region === "Север") {
      totalCallsNorth += fact;
    }
  });

  factsData.forEach((client) => {
    const region = cityRegionMap[client.city];

    if (region && regionData[region] !== undefined) {
      const total = calculateTotal(client);
      const averageCallQuality = (total / 14) * 100; // Подставьте правильное значение для расчета

      regionData[region].push(parseFloat(averageCallQuality.toFixed(2)));
    } else {
      console.warn(`Неизвестный город или регион не найден: ${client.city}`);
    }
  });

  filteredTableData.value = Object.keys(regionData).map((region) => {
    const regionCities = regionData[region];

    console.log("regionCities", regionCities);

    const currentRegionData = regionData[region].filter(
      (item) => item.type === "current"
    );

    const previousRegionData = regionData[region].filter(
      (item) => item.type === "previous"
    );

    console.log("previousRegionData", previousRegionData);

    const totalCurrentQuality = currentRegionData.reduce(
      (sum, item) => sum + item.quality,
      0
    );

    const totalPreviousQuality = previousRegionData.reduce(
      (sum, item) => sum + item.quality,
      0
    );

    const totalCurrentCalls =
      region === "Юг" ? totalCallsSouth : totalCallsNorth;

    const totalPreviousCalls = previousRegionData.reduce(
      (sum, item) => sum + (parseInt(item.totalCalls) || 0),
      0
    );

    console.log("totalPreviousCalls", totalPreviousCalls);

    const averageCurrentQuality =
      currentRegionData.length > 0
        ? (totalCurrentQuality / currentRegionData.length).toFixed(2)
        : 0;
    const averagePreviousQuality =
      previousRegionData.length > 0
        ? (totalPreviousQuality / previousRegionData.length).toFixed(2)
        : 0;

    const previousPeriodDynamic = calculatePreviousPeriodDynamic(
      averageCurrentQuality,
      averagePreviousQuality
    );

    if (regionCities.length === 0) {
      console.warn(`Нет данных для региона: ${region}`);
      return {
        region,
        averageCallQuality: "0 %",
        previousPeriodDynamic: "0 %",
        totalCalls: "0",
        callsDynamic: "...",
        tradeInCalls: "...",
        tradeInPercentage: "...",
        dynamicFromLastPeriod: "..."
      };
    }

    const totalQuality = regionCities.reduce(
      (sum, quality) => sum + quality,
      0
    );

    // const resultAvarageQuality = Math.floor((totalQuality / 14) * 100);

    const averageQuality = (totalQuality / regionCities.length).toFixed(
      2
    );

    console.log("totalQuality", averageQuality);

    const callsDynamic =
      totalPreviousCalls > 0
        ? (
            ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) *
            100
          ).toFixed(2) + " %"
        : "C/A";

    return {
      region,
      averageCallQuality: averageQuality + " %",
      previousPeriodDynamic: previousPeriodDynamic,
      totalCalls: totalCurrentCalls,
      callsDynamic: callsDynamic,
      tradeInCalls: "...",
      tradeInPercentage: "...",
      dynamicFromLastPeriod: "..."
    };
  });

  console.log("Filterrrrrrrrrrrrr", filteredTableData.value);
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

onMounted(() => {
  fetchData();
  fetchFactsOnly();
  calculatePreviousPeriodDynamic();
});
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
