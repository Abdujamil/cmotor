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
          <div class="table-cell">По регионам</div>
          <div class="table-cell">Кол-во звонков</div>
          <div class="table-cell">Динамика от прошлого периода</div>
          <div class="table-cell">Среднее значение качества звонка</div>
          <div class="table-cell">Динамика от прошлого периода</div>
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
          v-for="(city, index) in filteredCitiesData"
          :key="'city-' + index"
        >
          <div class="table-cell">{{ city.city }}</div>
          <div class="table-cell">{{ city.cityTotalCalls }}</div>
          <div class="table-cell">{{ city.cityCallsDynamic }}</div>
          <div class="table-cell">{{ city.cityAverageCallQuality }}</div>
          <div class="table-cell">{{ city.cityPreviousPeriodDynamic }}</div>
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

    if (resetData) {
      tableData.value = newData;
    } else {
      tableData.value = [...tableData.value, ...newData];
    }

    calculateRegionAverages(filters.value.startDate, filters.value.endDate);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

// Вспомогательная функция для фильтрации данных за определенный месяц
function filterByMonth(entries, month) {
  return entries.filter((entry) => {
    const entryDate = new Date(entry.date.split(".").reverse().join("-"));
    // console.log("entryDate:", entryDate, "month:", month);

    return (
      entryDate.getMonth() === month.getMonth() &&
      entryDate.getFullYear() === month.getFullYear()
    );
  });
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
  // console.log("Previous Month:", previousMonth);

  return filterByMonth(cityEntries, previousMonth);
}

// Вспомогательная функция для получения предыдущего месяца
function getPreviousMonth() {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return previousMonth;
}

// Функция для расчета динамики от прошлого периода
// function calculateDynamicFromLastPeriod(cityEntries) {
//   console.log("calculateDynamicFromLastPeriod вызван", cityEntries);

//   const currentMonth = new Date();
//   const previousMonth = getPreviousMonth();

//   const filteredEntries = filterDataByDate(
//     cityEntries,
//     filters.value.startDate,
//     filters.value.endDate
//   );

//   console.log("filteredEntries вызван", filteredEntries);

//   // Данные за текущий месяц
//   let currentMonthEntries = filterByMonth(filteredEntries, currentMonth);
//   console.log("currentMonthEntries вызван", currentMonthEntries);

//   // Если нет данных за текущий месяц, ищем за предыдущий месяц
//   if (currentMonthEntries.length === 0) {
//     currentMonthEntries = filterByMonth(filteredEntries, previousMonth);
//   }

//   // Данные за прошлый месяц
//   const previousMonthEntries = filterByMonth(filteredEntries, previousMonth);

//   // Если нет данных за прошлый месяц, динамику не рассчитываем
//   if (previousMonthEntries.length === 0) return "";

//   // Считаем среднее качество звонков за текущий и прошлый месяц
//   const currentMonthQuality =
//     currentMonthEntries.reduce((sum, entry) => sum + calculateTotal(entry), 0) /
//     (currentMonthEntries.length || 1); // Избегаем деления на 0

//   const previousMonthQuality =
//     previousMonthEntries.reduce(
//       (sum, entry) => sum + calculateTotal(entry),
//       0
//     ) / (previousMonthEntries.length || 1); // Избегаем деления на 0

//   // Рассчитываем динамику ((текущий - прошлый) / прошлый) * 100
//   const dynamic =
//     ((currentMonthQuality - previousMonthQuality) / previousMonthQuality) * 100;

//   return dynamic.toFixed(2) + "%";
// }

function calculateDynamicFromLastPeriod(cityEntries) {
  const currentMonth = new Date();
  const previousMonth = getPreviousMonth();

  // Фильтруем данные по текущему месяцу
  let currentMonthEntries = filterByMonth(cityEntries, currentMonth);

  // Если нет данных за текущий месяц, ищем данные за предыдущий
  if (currentMonthEntries.length === 0) {
    currentMonthEntries = filterByMonth(cityEntries, previousMonth);
  }

  // Данные за прошлый месяц
  const previousMonthEntries = filterByMonth(cityEntries, previousMonth);

  // Если нет данных за предыдущий месяц, возвращаем пустую строку
  if (previousMonthEntries.length === 0) return "";

  // Считаем среднее качество звонков за текущий и прошлый месяц
  const currentMonthQuality =
    currentMonthEntries.reduce((sum, entry) => sum + calculateTotal(entry), 0) /
    (currentMonthEntries.length || 1); // Избегаем деления на 0

  const previousMonthQuality =
    previousMonthEntries.reduce(
      (sum, entry) => sum + calculateTotal(entry),
      0
    ) / (previousMonthEntries.length || 1); // Избегаем деления на 0

  // Рассчитываем динамику ((текущий - прошлый) / прошлый) * 100
  const dynamic =
    ((currentMonthQuality - previousMonthQuality) / previousMonthQuality) * 100;

  return dynamic.toFixed(2) + " %";
}

// Функция для расчета динамики от прошлого периода для общего количества звонков

// function calculateCallsDynamicFromLastPeriod(cityEntries) {
//   const filteredEntries = filterDataByDate(
//     cityEntries,
//     filters.value.startDate,
//     filters.value.endDate
//   );

//   const currentMonthEntries = getCurrentMonthEntries(filteredEntries);
//   const previousMonthEntries = getPreviousMonthEntries(filteredEntries);

//   if (previousMonthEntries.length === 0 || currentMonthEntries.length === 0) return "";

//   const totalCurrentCalls = currentMonthEntries.reduce(
//     (sum, entry) => sum + Number(entry.fact),
//     0
//   );
//   const totalPreviousCalls = previousMonthEntries.reduce(
//     (sum, entry) => sum + Number(entry.fact),
//     0
//   );

//   // Проверяем, чтобы избежать деления на ноль
//   if (totalPreviousCalls === 0) return ""; // или можете вернуть 0%

//   const dynamic =
//     ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) * 100;

//   return dynamic.toFixed(2) + "%";
// }

function calculateCallsDynamicFromLastPeriod(cityEntries) {
  const currentMonth = new Date();
  const previousMonth = getPreviousMonth();

  // Фильтруем данные по датам для текущего и предыдущего месяца
  const currentMonthEntries = filterByMonth(cityEntries, currentMonth);
  const previousMonthEntries = filterByMonth(cityEntries, previousMonth);

  // Если нет данных за текущий или прошлый месяц, динамику не рассчитываем
  if (previousMonthEntries.length === 0 || currentMonthEntries.length === 0) {
    return "Нет данных за текущий месяц " + currentMonthEntries.length;
  }

  const totalCurrentCalls = currentMonthEntries.reduce(
    (sum, entry) => sum + Number(entry.fact),
    0
  );
  const totalPreviousCalls = previousMonthEntries.reduce(
    (sum, entry) => sum + Number(entry.fact),
    0
  );

  // Проверяем, чтобы избежать деления на ноль
  if (totalPreviousCalls === 0) return "0.00%"; // или можете вернуть "N/A"

  const dynamic =
    ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) * 100;

  return dynamic.toFixed(2) + "%";
}

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

// const fetchFactsOnly = async () => {
//   try {
//     const response = await fetchTotalItems();
//     const factsData = response.items;

//     // Группируем данные по городам
//     const citiesGrouped = factsData.reduce((acc, item) => {
//       if (!acc[item.city]) {
//         acc[item.city] = [];
//       }
//       acc[item.city].push(item);
//       return acc;
//     }, {});

//     // Фильтрация данных по выбранным датам
//     const filteredFacts = filterDataByDate(
//       factsData,
//       filters.value.startDate,
//       filters.value.endDate
//     );

//     // Определяем текущую дату
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth();

//     // Устанавливаем даты для текущего и предыдущего месяцев
//     const currentPeriodStartDate = new Date(currentYear, currentMonth, 1);
//     const currentPeriodEndDate = new Date(currentYear, currentMonth + 1, 0);

//     const previousPeriodStartDate = new Date(filters.value.startDate);
//     previousPeriodStartDate.setMonth(previousPeriodStartDate.getMonth() - 1);

//     const previousPeriodEndDate = new Date(filters.value.endDate);
//     previousPeriodEndDate.setMonth(previousPeriodEndDate.getMonth() - 1);

//     // Вычисляем среднее значение качества звонков, динамику и формируем структуру данных для таблицы
//     citiesData.value = Object.keys(citiesGrouped).map((cityName) => {
//       const cityEntries = citiesGrouped[cityName];

//       // Фильтруем данные по датам
//       const currentCityEntries = filterDataByDate(
//         cityEntries,
//         filters.value.startDate,
//         filters.value.endDate
//       );

//       // Суммируем значения для расчета среднего качества звонков
//       const totalQuality = currentCityEntries.reduce(
//         (sum, entry) => sum + calculateTotal(entry),
//         0
//       );

//       const resultAvaregeCallQuality = Math.floor((totalQuality / 14) * 100);
//       const averageCallQuality =
//         (resultAvaregeCallQuality / currentCityEntries.length).toFixed(2) +
//         " %";

//       const previousCityEntries = filterDataByDate(
//         cityEntries,
//         previousPeriodStartDate.toISOString().split("T")[0],
//         previousPeriodEndDate.toISOString().split("T")[0]
//       );

//       // Общее количество звонков
//       const totalCalls = currentCityEntries.reduce(
//         (sum, entry) => sum + Number(entry.fact),
//         0
//       );

//       // Рассчитываем динамику от прошлого периода
//       const dynamicFromLastPeriod =
//         calculateDynamicFromLastPeriod(currentCityEntries);
//       const callsDynamicFromLastPeriod =
//         calculateCallsDynamicFromLastPeriod(currentCityEntries);

//       // console.log(
//       //   "dynamicFromLastPeriod:",
//       //   dynamicFromLastPeriod,
//       //   "callsDynamicFromLastPeriod:",
//       //   callsDynamicFromLastPeriod
//       // );

//       return {
//         city: cityName,
//         cityAverageCallQuality: averageCallQuality || "",
//         cityPreviousPeriodDynamic: dynamicFromLastPeriod || "",
//         cityTotalCalls: totalCalls || "",
//         cityCallsDynamic: callsDynamicFromLastPeriod || ""
//       };
//     });

//     return filteredFacts;
//   } catch (error) {
//     console.error("Ошибка при получении данных (fact):", error);
//     return [];
//   }
// };

const fetchFactsOnly = async () => {
  try {
    const response = await fetchTotalItems();
    const factsData = response.items;

    // Группируем данные по городам
    const citiesGrouped = factsData.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = [];
      }
      acc[item.city].push(item);
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
    const currentMonth = now.getMonth();

    // Устанавливаем даты для текущего и предыдущего месяцев
    const currentPeriodStartDate = new Date(currentYear, currentMonth, 1);
    const currentPeriodEndDate = new Date(currentYear, currentMonth + 1, 0);

    const previousPeriodStartDate = new Date(filters.value.startDate);
    previousPeriodStartDate.setMonth(previousPeriodStartDate.getMonth() - 1);

    const previousPeriodEndDate = new Date(filters.value.endDate);
    previousPeriodEndDate.setMonth(previousPeriodEndDate.getMonth() - 1);

    // Функция для расчета динамики по сравнению с предыдущим периодом
    const calculateCityDynamic = (currentCityEntries, previousCityEntries) => {
      // Суммируем фактические звонки для текущего периода
      const currentCalls = currentCityEntries.reduce((sum, entry) => {
        const fact = Number(entry.fact); // Преобразуем фактические данные в числа
        return sum + (isNaN(fact) ? 0 : fact); // Если данные не числа, считаем их как 0
      }, 0);

      // Суммируем фактические звонки для предыдущего периода
      const previousCalls = previousCityEntries.reduce((sum, entry) => {
        const fact = Number(entry.fact); // Преобразуем фактические данные в числа
        return sum + (isNaN(fact) ? 0 : fact); // Если данные не числа, считаем их как 0
      }, 0);

      // Рассчитываем динамику звонков
      let callsDynamic = 0;
      if (previousCalls > 0) {
        callsDynamic = ((currentCalls - previousCalls) / previousCalls) * 100; // Вычисляем динамику
      } else if (currentCalls > 0) {
        callsDynamic = 100; // Если в предыдущем периоде не было звонков, а в текущем есть, динамика - 100%
      } else {
        callsDynamic = 0; // Если в обоих периодах нет звонков, динамика - 0%
      }

      // Возвращаем динамику с округлением до целых чисел и добавлением знака процента
      return callsDynamic.toFixed(0) + " %";
    };

    // Вычисляем среднее качество звонков и динамику по каждому городу
    citiesData.value = Object.keys(citiesGrouped).map((cityName) => {
      const cityEntries = citiesGrouped[cityName];

      // Фильтруем данные по выбранным датам
      const currentCityEntries = filterDataByDate(
        cityEntries,
        filters.value.startDate,
        filters.value.endDate
      );

      // Если нет фильтра, берем все данные
      const previousCityEntries =
        filters.value.startDate && filters.value.endDate
          ? filterDataByDate(
              cityEntries,
              previousPeriodStartDate.toISOString().split("T")[0],
              previousPeriodEndDate.toISOString().split("T")[0]
            )
          : cityEntries;

      // Суммируем значения для расчета среднего качества звонков
      const totalQuality = currentCityEntries.reduce(
        (sum, entry) => sum + calculateTotal(entry),
        0
      );
      const resultAvaregeCallQuality = Math.floor((totalQuality / 14) * 100);
      const averageCallQuality =
        (resultAvaregeCallQuality / currentCityEntries.length).toFixed(2) +
        " %";

      // Общее количество звонков
      const totalCalls = currentCityEntries.reduce(
        (sum, entry) => sum + Number(entry.fact),
        0
      );

      // Рассчитываем динамику от прошлого периода
      const callsDynamicFromLastPeriod = calculateCityDynamic(
        currentCityEntries,
        previousCityEntries
      );

      return {
        city: cityName,
        cityAverageCallQuality: averageCallQuality || "",
        cityPreviousPeriodDynamic: callsDynamicFromLastPeriod || "",
        cityTotalCalls: totalCalls || "",
        cityCallsDynamic: callsDynamicFromLastPeriod || ""
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
    return ""; // Если данные отсутствуют или неверны
  }

  const dynamic = ((currentAverage - previousAverage) / previousAverage) * 100;

  return dynamic.toFixed(2) + " %";
};

const getMonthData = (data, targetMonthStart, targetMonthEnd) => {
  return data.filter((item) => {
    if (!item.date) return false;

    const itemDate = new Date(item.date.split(".").reverse().join("-"));
    return itemDate >= targetMonthStart && itemDate < targetMonthEnd;
  });
};

const getCurrentMonthData = (data) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Получаем данные за текущий месяц
  const currentMonthData = getMonthData(
    data,
    currentMonthStart,
    nextMonthStart
  );
  console.log("Current Month Data:", currentMonthData);

  // Если нет данных за текущий месяц, ищем за предыдущие месяцы
  if (currentMonthData.length === 0) {
    let uniquePreviousMonthData = [];
    let monthOffset = 1; // Начинаем с предыдущего месяца

    while (uniquePreviousMonthData.length === 0) {
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - monthOffset,
        1
      );
      const previousMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - monthOffset + 1,
        1
      );

      const previousMonthData = getMonthData(
        data,
        previousMonthStart,
        previousMonthEnd
      );
      console.log(
        `Previous Month Data (Offset ${monthOffset}):`,
        previousMonthData
      );

      // Проверка на дублирование с текущим месяцем
      uniquePreviousMonthData = previousMonthData.filter((prevItem) => {
        return !currentMonthData.some(
          (currItem) => currItem.date === prevItem.date
        );
      });

      // Если уникальные данные найдены, выходим из цикла
      if (uniquePreviousMonthData.length > 0) {
        break;
      }

      // Если уникальные данные не найдены, увеличиваем смещение
      monthOffset++;

      // Прерываем цикл, если мы вышли за пределы возможных месяцев
      if (now.getMonth() - monthOffset < 0 && now.getFullYear() <= 0) {
        console.log("No unique data found after checking previous months.");
        return [];
      }
    }

    return uniquePreviousMonthData;
  }

  return currentMonthData;
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

// Функция для расчета средних значений по регионам №1
// const calculateRegionAverages = async (startDate, endDate) => {
//   if (!Array.isArray(tableData.value)) {
//     console.error("tableData.value не является массивом:", tableData.value);
//     return;
//   }

//   const filteredData = filterDataByDate(tableData.value, startDate, endDate);
//   // console.log("filteredData:", filteredData);

//   if (filteredData.length === 0) {
//     alert("Нет данных для выбранного диапазона дат.");
//     return;
//   }

//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth();
//   const currentDay = currentDate.getDate();
//   // console.log("Current month:", currentMonth, "Current year:", currentYear); // Current month: 9 Current year: 2024

//   const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//   const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
//   // console.log("previousMonth:", previousMonth, "previousYear:", previousYear); // previousMonth: 8 previousYear: 2024

//   // Функция для получения данных за выбранный месяц и год

//   const getDataForMonth = (data, targetMonth, targetYear) => {
//     // Фильтруем данные по месяцу и году
//     let foundData = data.filter((item) => {
//       const itemDate = new Date(item.date); // Предполагается, что item.date уже в формате YYYY-MM-DD

//       // Возвращаем true, если месяц и год совпадают с целевыми
//       return (
//         itemDate.getMonth() === targetMonth &&
//         itemDate.getFullYear() === targetYear
//       );
//     });

//     // Если данных нет для текущего месяца, проверяем предыдущий месяц
//     if (foundData.length === 0) {
//       if (targetMonth > 0) {
//         // Если не январь, проверяем предыдущий месяц того же года
//         foundData = getDataForMonth(data, targetMonth - 1, targetYear);
//       } else {
//         // Если январь (0), то переходим к декабрю предыдущего года
//         foundData = getDataForMonth(data, 11, targetYear - 1);
//       }
//     }

//     return foundData;
//   };

//   const currentMonthData = getDataForMonth(
//     filteredData,
//     currentMonth,
//     currentYear
//   );

//   console.warn("currentMonthData:", currentMonthData);

//   const previousMonthData = getDataForMonth(
//     filteredData,
//     previousMonth,
//     previousYear
//   );
//   // console.log( "currentMonthData:", currentMonthData, "previousMonthData:", previousMonthData ); // Тут одинаковые данные приходят (сейчас оба месяца за сентьбрь приходит)

//   const regionData = {
//     Юг: [],
//     Север: []
//   };

//   const response = await fetchTotalItems();
//   const factsData = response.items;
//   let totalCallsSouth = 0;
//   let totalCallsNorth = 0;

//   filteredData.forEach((entry) => {
//     const city = entry.city;
//     const fact = parseInt(entry.fact) || 0;
//     const region = cityRegionMap[city];

//     if (region === "Юг") {
//       totalCallsSouth += fact;
//     } else if (region === "Север") {
//       totalCallsNorth += fact;
//     }
//   });

//   // console.log("Filtered data22222222:", filteredData);

//   filteredData.forEach((client) => {
//     const region = cityRegionMap[client.city];

//     if (region && regionData[region] !== undefined) {
//       const total = calculateTotal(client);
//       const averageCallQuality = (total / 14) * 100;

//       regionData[region].push({
//         date: client.date,
//         value: parseFloat(averageCallQuality.toFixed(2))
//       });
//     } else {
//       console.warn(`Неизвестный город или регион не найден: ${client.city}`);
//     }
//   });

//   filteredTableData.value = Object.keys(regionData).map((region) => {
//     const regionCities = regionData[region];

//     // console.log("regionCities:", regionCities);

//     const currentRegionData = getDataForMonth(
//       regionCities,
//       currentMonth,
//       currentYear
//     );

//     const previousRegionData = getDataForMonth(
//       regionCities,
//       previousMonth,
//       previousYear
//     );
//     // console.log(
//     //   "currentRegionData:",
//     //   currentRegionData,
//     //   "previousRegionData:",
//     //   previousRegionData
//     // );

//     const totalCurrentCalls =
//       region === "Юг" ? totalCallsSouth : totalCallsNorth;
//       console.log("totalCurrentCalls:", totalCurrentCalls);

//     const totalPreviousCalls = previousMonthData.reduce(
//       (sum, item) => sum + (parseInt(item.fact) || 0),
//       0
//     );

//     console.log(
//       "totalCurrentCalls",
//       totalCurrentCalls,
//       "totalPreviousCalls",
//       totalPreviousCalls
//     );

//     const totalQuality = regionCities.reduce(
//       (sum, quality) => sum + quality.value,
//       0
//     );
//     const averageQuality =
//       regionCities.length > 0
//         ? (totalQuality / regionCities.length).toFixed(2)
//         : 0;

//     const averageCurrentQuality =
//       currentRegionData.length > 0
//         ? (
//             currentRegionData.reduce((sum, item) => sum + item.value, 0) /
//             currentRegionData.length
//           ).toFixed(2)
//         : 0;

//     const averagePreviousQuality =
//       previousRegionData.length > 0
//         ? (
//             previousRegionData.reduce((sum, item) => sum + item.value, 0) /
//             previousRegionData.length
//           ).toFixed(2)
//         : 0;

//     // console.log(
//     //   "averagePreviousQuality:",
//     //   averagePreviousQuality,
//     //   "averageCurrentQuality:",
//     //   averageCurrentQuality
//     // );

//     const previousPeriodDynamic = calculatePreviousPeriodDynamic(
//       averageCurrentQuality,
//       averagePreviousQuality
//     );

//     const callsDynamic =
//       totalPreviousCalls > 0
//         ? (
//             ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) *
//             100
//           ).toFixed(0) + " %"
//         : totalCurrentCalls > 0
//         ? "0.0 %"
//         : "0 %";

//     return {
//       region,
//       callsDynamic: callsDynamic || "0 %",
//       totalCalls: totalCurrentCalls || "0",
//       averageCallQuality: averageQuality + " %",
//       previousPeriodDynamic: previousPeriodDynamic || " "
//     };
//   });
// };
// №2
// const calculateRegionAverages = async (startDate, endDate) => {
//   if (!Array.isArray(tableData.value)) {
//     console.error("tableData.value не является массивом:", tableData.value);
//     return;
//   }

//   const filteredData = filterDataByDate(tableData.value, startDate, endDate);

//   if (filteredData.length === 0) {
//     alert("Нет данных для выбранного диапазона дат.");
//     return;
//   }

//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth();
//   const currentDay = currentDate.getDate();

//   // Функция для получения данных за выбранный месяц и год
//   const getDataForMonth = (data, targetMonth, targetYear) => {
//     let foundData = data.filter((item) => {
//       const itemDate = new Date(item.date);
//       return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
//     });

//     // Если данных нет для месяца, проверим предыдущий месяц
//     if (foundData.length === 0) {
//       if (targetMonth > 0) {
//         foundData = getDataForMonth(data, targetMonth - 1, targetYear);
//       } else {
//         foundData = getDataForMonth(data, 11, targetYear - 1);
//       }
//     }

//     return foundData;
//   };

//   // Функция для получения предыдущей недели
//   const getPreviousWeek = (startDate) => {
//     const start = new Date(startDate);
//     const previousWeekStart = new Date(start);
//     previousWeekStart.setDate(start.getDate() - 7); // Смещаем на 7 дней назад

//     const previousWeekEnd = new Date(previousWeekStart);
//     previousWeekEnd.setDate(previousWeekStart.getDate() + 6); // Конец недели через 6 дней

//     console.warn("getPreviousWeek:","previousWeekStart:", previousWeekStart, "previousWeekEnd:", previousWeekEnd);

//     return { start: previousWeekStart, end: previousWeekEnd };
//   };

//   const { start: previousWeekStart, end: previousWeekEnd } = getPreviousWeek(startDate);

//   // Получаем данные за текущий и предыдущий месяц
//   const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//   const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

//   const currentMonthData = getDataForMonth(filteredData, currentMonth, currentYear);
//   const previousMonthData = getDataForMonth(filteredData, previousMonth, previousYear);

//   const regionData = {
//     Юг: [],
//     Север: []
//   };

//   const response = await fetchTotalItems();
//   const factsData = response.items;
//   let totalCallsSouth = 0;
//   let totalCallsNorth = 0;

//   filteredData.forEach((entry) => {
//     const city = entry.city;
//     const fact = parseInt(entry.fact) || 0;
//     const region = cityRegionMap[city];

//     if (region === "Юг") {
//       totalCallsSouth += fact;
//     } else if (region === "Север") {
//       totalCallsNorth += fact;
//     }
//   });

//   filteredData.forEach((client) => {
//     const region = cityRegionMap[client.city];
//     if (region && regionData[region] !== undefined) {
//       const total = calculateTotal(client);
//       const averageCallQuality = (total / 14) * 100;
//       regionData[region].push({
//         date: client.date,
//         value: parseFloat(averageCallQuality.toFixed(2))
//       });
//     } else {
//       console.warn(`Неизвестный город или регион не найден: ${client.city}`);
//     }
//   });

//   filteredTableData.value = Object.keys(regionData).map((region) => {
//     const regionCities = regionData[region];
//     const currentRegionData = getDataForMonth(regionCities, currentMonth, currentYear);
//     const previousRegionData = getDataForMonth(regionCities, previousMonth, previousYear);

//     const totalCurrentCalls = region === "Юг" ? totalCallsSouth : totalCallsNorth;
//     const totalPreviousCalls = previousMonthData.reduce(
//       (sum, item) => sum + (parseInt(item.fact) || 0),
//       0
//     );

//     const totalQuality = regionCities.reduce(
//       (sum, quality) => sum + quality.value,
//       0
//     );
//     const averageQuality =
//       regionCities.length > 0
//         ? (totalQuality / regionCities.length).toFixed(2)
//         : 0;

//     const averageCurrentQuality =
//       currentRegionData.length > 0
//         ? (
//             currentRegionData.reduce((sum, item) => sum + item.value, 0) /
//             currentRegionData.length
//           ).toFixed(2)
//         : 0;

//     const averagePreviousQuality =
//       previousRegionData.length > 0
//         ? (
//             previousRegionData.reduce((sum, item) => sum + item.value, 0) /
//             previousRegionData.length
//           ).toFixed(2)
//         : 0;

//     const previousPeriodDynamic = calculatePreviousPeriodDynamic(
//       averageCurrentQuality,
//       averagePreviousQuality
//     );

//     const callsDynamic =
//       totalPreviousCalls > 0
//         ? (
//             ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) *
//             100
//           ).toFixed(0) + " %"
//         : totalCurrentCalls > 0
//         ? "0.0 %"
//         : "0 %";

//     return {
//       region,
//       callsDynamic: callsDynamic || "0 %",
//       totalCalls: totalCurrentCalls || "0",
//       averageCallQuality: averageQuality + " %",
//       previousPeriodDynamic: previousPeriodDynamic || " "
//     };
//   });
// };

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

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Функция для получения данных за выбранный месяц и год
  const getDataForMonth = (data, targetMonth, targetYear) => {
    let foundData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === targetMonth &&
        itemDate.getFullYear() === targetYear
      );
    });

    // Если данных нет для месяца, проверим предыдущий месяц
    if (foundData.length === 0) {
      if (targetMonth > 0) {
        foundData = getDataForMonth(data, targetMonth - 1, targetYear);
      } else {
        foundData = getDataForMonth(data, 11, targetYear - 1);
      }
    }

    return foundData;
  };

  // Функция для получения предыдущей недели
  const getPreviousWeek = (startDate) => {
    const start = new Date(startDate);
    const previousWeekStart = new Date(start);
    previousWeekStart.setDate(start.getDate() - 7); // Смещаем на 7 дней назад

    const previousWeekEnd = new Date(previousWeekStart);
    previousWeekEnd.setDate(previousWeekStart.getDate() + 6); // Конец недели через 6 дней

    return { start: previousWeekStart, end: previousWeekEnd };
  };

  const { start: previousWeekStart, end: previousWeekEnd } =
    getPreviousWeek(startDate);

  // Получаем данные за текущий и предыдущий месяц
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthData = getDataForMonth(
    filteredData,
    currentMonth,
    currentYear
  );
  const previousMonthData = getDataForMonth(
    filteredData,
    previousMonth,
    previousYear
  );

  const regionData = {
    Юг: [],
    Север: []
  };

  const response = await fetchTotalItems();
  const factsData = response.items;
  let totalCallsSouth = 0;
  let totalCallsNorth = 0;

  filteredData.forEach((entry) => {
    const city = entry.city;
    const fact = parseInt(entry.fact) || 0;
    const region = cityRegionMap[city];

    if (region === "Юг") {
      totalCallsSouth += fact;
    } else if (region === "Север") {
      totalCallsNorth += fact;
    }
  });

  filteredData.forEach((client) => {
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

  filteredTableData.value = Object.keys(regionData).map((region) => {
    const regionCities = regionData[region];
    const currentRegionData = getDataForMonth(
      regionCities,
      currentMonth,
      currentYear
    );
    const previousRegionData = getDataForMonth(
      regionCities,
      previousMonth,
      previousYear
    );

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
    const averageQuality =
      regionCities.length > 0
        ? (totalQuality / regionCities.length).toFixed(2)
        : 0;

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

    const previousPeriodDyn =
      startDate && endDate
        ? (averagePreviousQuality > 0
            ? ((averageCurrentQuality - averagePreviousQuality) /
                averagePreviousQuality) *
              100
            : 0
          ).toFixed(0) + " %"
        : " ";

    // Динамика по умолчанию не рассчитывается, если не выбран фильтр по датам
    const callsDynamic =
      startDate && endDate
        ? (totalPreviousCalls > 0
            ? ((totalCurrentCalls - totalPreviousCalls) / totalPreviousCalls) *
              100
            : 0
          ).toFixed(0) + " %"
        : " ";

    return {
      region,
      callsDynamic: callsDynamic || "0 %",
      totalCalls: totalCurrentCalls || "0",
      averageCallQuality: averageQuality + " %",
      previousPeriodDynamic: previousPeriodDyn || " "
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

  await Promise.all([
    fetchData(),
    calculateRegionAverages(filters.value.startDate, filters.value.endDate)
  ]);
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
  await Promise.all([
    fetchData(),
    fetchFactsOnly(),
    calculatePreviousPeriodDynamic()
  ]);
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
