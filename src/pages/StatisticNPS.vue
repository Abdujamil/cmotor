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
        <div class="table-cell">Среднее качество работы салона</div>
        <div class="table-cell">Сравнение с прошлым периодом</div>
        <div class="table-cell">Среднее качество работы менеджера</div>
        <div class="table-cell">Сравнение с прошлым периодом</div>
        <div class="table-cell">Среднее значение NPS</div>
        <div class="table-cell">Среднее значение NPS</div>
      </div>
      <!-- Filtered Table Rows -->

      <div
        v-for="(name, index) in filteredData"
        :key="index"
        class="table-row"
        v-if="filteredData.length > 0"
      >
        <div class="table-cell">{{ name.name }}</div>
        <div class="table-cell">{{ name.averageSalonQuality.toFixed(2) }}</div>
        <div class="table-cell">{{ name.managerComparison }}</div>
        <div class="table-cell">
          {{ name.averageManagerQuality.toFixed(2) }}
        </div>
        <div class="table-cell">{{ name.managerComparison }}</div>
        <div class="table-cell">- -</div>
        <div class="table-cell">-</div>
      </div>
      <div class="table-row" v-else>
        <div class="table-cell">Ничего не найдено</div>
      </div>

      <!-- Table Footer -->
      <div class="table-row footer">
        <div class="table-cell">Общие значения:</div>
        <div class="table-cell">
          {{ overallAverageSalonQuality.toFixed(2) }}
        </div>
        <div class="table-cell">
          {{
            overallComparison !== null
              ? overallComparison
              : "Нет данных"
          }}
        </div>
        <div class="table-cell">
          {{ overallAverageManagerQuality.toFixed(2) }}
        </div>
        <div class="table-cell">
          {{
            overallManagerComparison !== null
              ? overallManagerComparison
              : "Нет данных"
          }}
        </div>
        <div class="table-cell">3,5</div>
        <div class="table-cell">–</div>
      </div>
    </div>

    <div class="table-nav">
      <div class="table-nav__header">
        <p>Выберите статистику:</p>
      </div>

      <div class="table-nav__btns">
        <button
          :class="{ active: currentDataSet === 'nps' }"
          @click="switchData('nps')"
        >
          Общий NPS
        </button>
        <button
          :class="{ active: currentDataSet === 'buyers' }"
          @click="switchData('buyers')"
        >
          Покупатели
        </button>
        <button
          :class="{ active: currentDataSet === 'commission' }"
          @click="switchData('commission')"
        >
          Комиссия
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx";
import { ref, computed, onMounted } from "vue";
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import axios from "axios";

// const managers = {
//   managerName: [
//     "Эдуард Мукин",
//     "Турал Мамедли",
//     "Алексей Шевчук",
//     "Армен Мкртчян",
//     "Не представился",
//     "Вадим Гусейнов",
//     "Роман Мкртчян",
//     "Алексей Краюхин",
//     "Павел Дацюк",
//     "Данил Проценко",
//     "Алексей Гостев",
//     "Станислав Питулин",
//     "Антон Терлецкий",
//     "Радик Салахов",
//     "Егор Марчук",
//     "Арсений Камерер",
//     "Владислав Бубнов",
//     "Павел Зрячиков",
//     "Артемий Ефимов",
//     "Константин управляющий",
//     "Сергей Казымов",
//     "Антон Тупицын",
//     "Антон Швалев",
//     "Не представился",
//     "Роман Шералиев",
//     "Артем Чигарьков",
//     "Дамир Шаймерденов",
//     "Никита Гришихин",
//     "Андрей Григорьев",
//     "Ринат Юсупов",
//     "Илья Пятыгин",
//     "Данил Тагиев",
//     "Данил Кучин",
//     "Диннур Фасхутдинов",
//     "Илья Васкевич",
//     "Кирилл Кривцов",
//     "Денис Илюхин",
//     "Кирилл Келлер",
//     "Федор Асадов",
//     "Дмитрий Маник",
//     "Владимир РОП",
//     "Василий Дианов",
//     "Илья Кошман",
//     "Леонид Фотин",
//     "Николай Васильев",
//     "Алексей Ощепков",
//     "Михаил РОП",
//     "Сергей Карпенко",
//     "Не представился",
//     "Оскар Курмакаев",
//     "Никита Аксёнов",
//     "Владислав Петров",
//     "Иван Манцеленко",
//     "Денис Лисин",
//     "Филипп Козырев",
//     "Александр Кузнецов",
//     "Михаил Вахонин",
//     "Данил Королев",
//     "Алексей Бухтияров",
//     "Данил Гриневич",
//     "Алексей Лихачев",
//     "Алексей Ямщиков",
//     "Георгий Сироткин",
//     "Артем Васюков",
//     "Глеб Каменский",
//     "Ярослав Дорошенко",
//     "Турдали Эрназаров",
//     "Кирил Макеев",
//     "Илья Гологузов",
//     "Ян Лалетин",
//     "Захар Русанов",
//     "Павел Мымрин",
//     "Вадим Олексенко",
//     "Дмитрий Гаврилюк",
//     "Вадим Николаев",
//     "Дмитрий Вебер",
//     "Савелий Власов",
//     "Владимир Камагоров",
//     "Юрий Капустинский",
//     "Александр Аносов",
//     "Антон РОП",
//     "Виктор Баханский",
//     "Илья Долженок",
//     "Никита Карепов",
//     "Михаил Гусейнов",
//     "Данил Арнаутов",
//     "Илья Катков",
//     "Владимир Полещук",
//     "Илья Бушмелев",
//     "Леонид Шушарин",
//     "Алексей Фроликов",
//     "Роман Касымов",
//     "Анатолий Саранцев",
//     "Александр Тюрин",
//     "Вячеслав Глазунов"
//   ],
//   percentCall: [
//     "87%",
//     "82%",
//     "83%",
//     "85%",
//     "86%",
//     "87%",
//     "88%",
//     "82%",
//     "80%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "87%",
//     "81%",
//     "82%",
//     "84%",
//     "85%",
//     "80%",
//     "82%",
//     "84%",
//     "83%",
//     "85%",
//     "82%",
//     "84%",
//     "85%",
//     "80%",
//     "82%",
//     "84%",
//     "83%",
//     "82%",
//     "84%",
//     "85%",
//     "80%",
//     "82%",
//     "84%",
//     "83%",
//     "82%",
//     "84%",
//     "85%",
//     "80%",
//     "82%",
//     "84%",
//     "83%"
//   ],
//   numberCall: [
//     "10",
//     "12",
//     "14",
//     "16",
//     "18",
//     "20",
//     "22",
//     "24",
//     "26",
//     "28",
//     "30",
//     "32",
//     "34",
//     "36",
//     "38",
//     "40",
//     "42",
//     "44",
//     "46",
//     "48",
//     "50",
//     "52",
//     "54",
//     "56",
//     "58",
//     "60",
//     "62",
//     "64",
//     "66",
//     "68",
//     "70",
//     "72",
//     "74",
//     "76",
//     "78",
//     "80",
//     "82",
//     "84",
//     "86",
//     "88",
//     "90",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "102",
//     "104",
//     "106",
//     "108",
//     "110",
//     "112",
//     "114",
//     "116",
//     "118",
//     "120",
//     "122",
//     "124",
//     "126",
//     "128",
//     "130",
//     "132",
//     "134",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100",
//     "92",
//     "94",
//     "96",
//     "98",
//     "100"
//   ]
// };

// const regions = Object.keys(managers);
const selectedRegion = ref("");
const selectedCity = ref("");

const downloadTable = () => {
  if (table.value) {
    // Преобразуем HTML таблицу в формат рабочего листа Excel
    const ws = XLSX.utils.table_to_sheet(table.value);

    // Создаем книгу Excel и добавляем рабочий лист
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Генерируем и сохраняем файл Excel
    XLSX.writeFile(wb, "table.xlsx");
  }
};

const filteredData = ref([]);
const managers = ref({
  numberCall: [],
  percentCall: []
});

const overallAverageSalonQuality = ref(0);
const overallComparison = ref(null); // Для общего сравнения

const overallAverageManagerQuality = ref(0);
const overallManagerComparison = ref(0);

// const filteredData = computed(() => {
//   // Проверяем, какой тип данных выбран
//   let dataToFilter = [];
//   if (currentDataSet.value === "nps") {
//     dataToFilter = cities; // NPS данные
//   } else if (currentDataSet.value === "buyers") {
//     dataToFilter = citiesP; // Покупатели данные
//   } else if (currentDataSet.value === "commission") {
//     dataToFilter = citiesK; // Комиссия данные
//   }

//   // Фильтруем данные по выбранному городу
//   if (selectedCity.value) {
//     return dataToFilter.filter(city => city.includes(selectedCity.value));
//   }

//   // Если город не выбран, возвращаем все данные для текущего типа
//   return dataToFilter;
// });

// Общий NPS
const cities = [
  "Барнаул",
  "Кемерово",
  "Красноярск",
  "Не указан",
  "Новокузнецк",
  "Омск",
  "Пермь",
  "Самара",
  "Сургут",
  "Томск",
  "Тюмень",
  "Челябинск"
];

// Покупатели
const citiesP = [
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели",
  "Покупатели"
];

// Комиссия
const citiesK = [
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия",
  "Комиссия"
];

const handleFilterChange = ({
  selectedRegion: newRegion,
  selectedCity: newCity
}) => {
  selectedRegion.value = newRegion;
  selectedCity.value = newCity;
};

// Состояние текущих данных
const currentDataSet = ref("nps"); // По умолчанию отображаем NPS
const displayedData = ref(cities);

// Обработчик переключения данных
const switchData = (type) => {
  currentDataSet.value = type; // Устанавливаем активный тип данных
};

// const fetchData = async () => {
//   try {
//     const response = await axios.get(
//       "https://crystal-motors.ru/method.getSendings?count=all"
//     );
//     const data = response.data.answer.items;

//     const cityMap = {};
//     let totalQuality = 0;
//     let totalCount = 0;
//     let totalQualityPrevious = 0; // Для общего качества за прошлый месяц
//     let totalCountPrevious = 0; // Для общего количества за прошлый месяц

//     // Даты для фильтрации
//     const currentDate = new Date();
//     const oneMonthAgo = new Date(
//       currentDate.setMonth(currentDate.getMonth() - 1)
//     );

//     const previousPeriodMap = {}; // Для хранения данных за предыдущий месяц

//     // Обрабатываем данные
//     data.forEach((item) => {
//       const cityName = item.city;
//       const salonQuality = parseFloat(item.salon_quality); // Преобразуем в число
//       const surveyDate = new Date(
//         item.survey_date.split(".").reverse().join("-")
//       ); // Преобразуем дату

//       // Считаем текущее качество
//       if (!cityMap[cityName]) {
//         cityMap[cityName] = {
//           name: cityName,
//           totalQuality: salonQuality,
//           count: 1
//         };
//       } else {
//         cityMap[cityName].totalQuality += salonQuality;
//         cityMap[cityName].count += 1;
//       }

//       // Суммируем для общего качества
//       totalQuality += salonQuality;
//       totalCount += 1;

//       // Сохраняем данные для прошлого месяца
//       if (surveyDate < oneMonthAgo) {
//         if (!previousPeriodMap[cityName]) {
//           previousPeriodMap[cityName] = {
//             totalQuality: salonQuality,
//             count: 1
//           };
//         } else {
//           previousPeriodMap[cityName].totalQuality += salonQuality;
//           previousPeriodMap[cityName].count += 1;
//         }
//         totalQualityPrevious += salonQuality; // Суммируем для общего качества прошлого месяца
//         totalCountPrevious += 1; // Увеличиваем общее количество для прошлого месяца
//       }
//     });

//     // Формируем массив для отображения
//     filteredData.value = Object.values(cityMap).map((city) => {
//       const averageSalonQuality = city.totalQuality / city.count;

//       // Сравнение с прошлым периодом
//       const previousAverage = previousPeriodMap[city.name]
//         ? previousPeriodMap[city.name].totalQuality /
//           previousPeriodMap[city.name].count
//         : null;

//       const comparison =
//         previousAverage !== null
//           ? (averageSalonQuality - previousAverage).toFixed(2)
//           : "Нет данных";

//       return {
//         name: city.name,
//         averageSalonQuality,
//         comparison
//       };
//     });

//     // Рассчитываем общее среднее качество
//     overallAverageSalonQuality.value = totalQuality / totalCount;
//     overallComparison.value =
//       totalCountPrevious > 0
//         ? totalQuality / totalCount - totalQualityPrevious / totalCountPrevious
//         : null; // Сравнение общего среднего с прошлым периодом, если данных нет, ставим null
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error.message);
//     console.error("Детали ошибки:", error.response?.data || error.message);
//   }
// };

const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://crystal-motors.ru/method.getSendings?count=all"
    );
    const data = response.data.answer.items;

    const cityMap = {};
    let totalQuality = 0; // Для общего качества салонов
    let totalQualityPrevious = 0; // Для общего качества салонов за прошлый месяц
    let totalManagerQuality = 0; // Для общего качества менеджеров
    let totalManagerQualityPrevious = 0; // Для общего качества менеджеров за прошлый месяц
    let totalCount = 0;
    let totalCountPrevious = 0; // Для общего количества за прошлый месяц

    // Даты для фильтрации
    const currentDate = new Date();
    const oneMonthAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );

    const previousPeriodMap = {}; // Для хранения данных за предыдущий месяц

    // Обрабатываем данные
    data.forEach((item) => {
      const cityName = item.city;
      const salonQuality = parseFloat(item.salon_quality); // Преобразуем в число
      const managerQuality = parseFloat(item.manager_quality); // Преобразуем в число
      const surveyDate = new Date(
        item.survey_date.split(".").reverse().join("-")
      ); // Преобразуем дату

      // Считаем текущее качество салона
      if (!cityMap[cityName]) {
        cityMap[cityName] = {
          name: cityName,
          totalQuality: salonQuality,
          count: 1,
          totalManagerQuality: managerQuality, // Добавляем общее качество менеджера
          managerCount: 1 // Счетчик для менеджеров
        };
      } else {
        cityMap[cityName].totalQuality += salonQuality;
        cityMap[cityName].count += 1;
        cityMap[cityName].totalManagerQuality += managerQuality; // Суммируем качество менеджера
        cityMap[cityName].managerCount += 1; // Увеличиваем счетчик
      }

      // Суммируем для общего качества
      totalQuality += salonQuality;
      totalManagerQuality += managerQuality;
      totalCount += 1;

      // Сохраняем данные для прошлого месяца
      if (surveyDate < oneMonthAgo) {
        totalQualityPrevious += salonQuality; // Суммируем общее качество за прошлый месяц
        if (!previousPeriodMap[cityName]) {
          previousPeriodMap[cityName] = {
            totalManagerQuality: managerQuality,
            managerCount: 1
          };
        } else {
          previousPeriodMap[cityName].totalManagerQuality += managerQuality;
          previousPeriodMap[cityName].managerCount += 1;
        }
        totalManagerQualityPrevious += managerQuality; // Суммируем для общего качества менеджеров прошлого месяца
        totalCountPrevious += 1; // Увеличиваем общее количество для прошлого месяца
      }
    });

    // Формируем массив для отображения
    filteredData.value = Object.values(cityMap).map((city) => {
      const averageSalonQuality = city.totalQuality / city.count;
      const averageManagerQuality =
        city.totalManagerQuality / city.managerCount; // Среднее качество менеджера

      // Сравнение с прошлым периодом
      const previousManagerAverage = previousPeriodMap[city.name]
        ? previousPeriodMap[city.name].totalManagerQuality /
          previousPeriodMap[city.name].managerCount
        : null;

      const managerComparison =
        previousManagerAverage !== null
          ? (averageManagerQuality - previousManagerAverage).toFixed(2)
          : "Нет данных";

      return {
        name: city.name,
        averageSalonQuality,
        averageManagerQuality, // Добавляем среднее качество менеджера
        managerComparison // Добавляем сравнение для менеджера
      };
    });

    // Рассчитываем общее среднее качество менеджера
    overallAverageSalonQuality.value = totalQuality / totalCount;
    overallAverageManagerQuality.value = totalManagerQuality / totalCount; // Общее среднее качество менеджера
    overallManagerComparison.value =
      totalCountPrevious > 0
        ? (
            totalManagerQuality / totalCount -
            totalManagerQualityPrevious / totalCountPrevious
          ).toFixed(2)
        : null; // Сравнение общего среднего менеджеров с прошлым периодом
    overallComparison.value =
      totalCount > 0
        ? (
            totalQuality / totalCount -
            totalQualityPrevious / totalCountPrevious
          ).toFixed(2)
        : null; // Сравнение общего качества с прошлым периодом
  } catch (error) {
    console.error("Ошибка при получении данных:", error.message);
    console.error("Детали ошибки:", error.response?.data || error.message);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
.table-container {
  overflow: auto;
  max-height: 570px;
  border-radius: 8px;
  display: flex;
  align-items: center;
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
  max-width: 1000px;
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
