<template>
  <div>
    <h2>Сводная по менеджерам</h2>
  </div>
  <div class="filters filters-statis-city">
    <Filter @filterChange="handleFilterChange" />
    <IButton @click="downloadTable" />
  </div>

  <div class="table-container">
    <div ref="table" class="table">
      <!-- Table Header -->
      <div class="table-row header">
        <div class="table-cell">ФИО менеджера</div>
        <div class="table-cell">Процент обработки звонка</div>
        <div class="table-cell">Количество звонков</div>
      </div>
      <!-- Filtered Table Rows -->
      <div
        class="table-row"
        v-for="(manager, index) in filteredManagers"
        :key="index"
      >
        <div class="table-cell">{{ manager.name }}</div>
        <div class="table-cell">
          {{ manager.totalProcessingPercentage }}%
        </div>
        <div class="table-cell">{{ manager.totalCalls }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { onMounted, ref } from "vue";
import axios from "axios";

const managers = ref([]);
const tableData3 = ref([]); // Табличные данные и общее количество записей
const filteredManagers = ref([]); // Данные для отображения в таблице

const managersData = {
  Сургут: [
    "Эдуард Мукин",
    "Турал Мамедли",
    "Алексей Шевчук",
    "Армен Мкртчян",
    "Не представился",
    "Вадим Гусейнов",
    "Роман Мкртчян"
  ],
  Тюмень: [
    "Алексей Краюхин",
    "Павел Дацюк",
    "Данил Проценко",
    "Алексей Гостев",
    "Станислав Питулин"
  ],
  Пермь: [
    "Антон Терлецкий",
    "Радик Салахов",
    "Егор Марчук",
    "Арсений Камерер",
    "Владислав Бубнов",
    "Павел Зрячиков",
    "Артемий Ефимов",
    "Константин управляющий",
    "Сергей Казымов",
    "Антон Тупицын"
  ],
  Самара: [
    "Антон Швалев",
    "Не представился",
    "Роман Шералиев",
    "Артем Чигарьков",
    "Дамир Шаймерденов",
    "Никита Гришихин",
    "Андрей Григорьев"
  ],
  Челябинск: [
    "Ринат Юсупов",
    "Илья Пятыгин",
    "Данил Тагиев",
    "Данил Кучин",
    "Диннур Фасхутдинов",
    "Илья Васкевич",
    "Кирилл Кривцов"
  ],
  Кемерово: [
    "Денис Илюхин",
    "Кирилл Келлер",
    "Федор Асадов",
    "Дмитрий Маник",
    "Владимир РОП"
  ],
  Барнаул: [
    "Василий Дианов",
    "Илья Кошман",
    "Леонид Фотин",
    "Николай Васильев",
    "Алексей Ощепков",
    "Михаил РОП",
    "Сергей Карпенко",
    "Не представился",
    "Оскар Курмакаев"
  ],
  Новокузнецк: [
    "Никита Аксёнов",
    "Владислав Петров",
    "Иван Манцеленко",
    "Денис Лисин",
    "Филипп Козырев",
    "Александр Кузнецов",
    "Михаил Вахонин",
    "Данил Королев",
    "Алексей Бухтияров"
  ],
  "Красноярск ПЖ": [
    "Данил Гриневич",
    "Алексей Лихачев",
    "Алексей Ямщиков",
    "Георгий Сироткин",
    "Артем Васюков",
    "Глеб Каменский",
    "Ярослав Дорошенко",
    "Турдали Эрназаров"
  ],
  "Красноярск брянка": [
    "Кирил Макеев",
    "Илья Гологузов",
    "Ян Лалетин",
    "Захар Русанов",
    "Павел Мымрин",
    "Вадим Олексенко"
  ],
  Омск: [
    "Дмитрий Гаврилюк",
    "Вадим Николаев",
    "Дмитрий Вебер",
    "Савелий Власов",
    "Владимир Камагоров",
    "Юрий Капустинский",
    "Александр Аносов",
    "Антон РОП",
    "Виктор Баханский",
    "Илья Долженок",
    "Никита Карепов",
    "Михаил Гусейнов",
    "Данил Арнаутов",
    "Илья Катков"
  ],
  Томск: [
    "Владимир Полещук",
    "Илья Бушмелев",
    "Леонид Шушарин",
    "Алексей Фроликов",
    "Роман Касымов",
    "Анатолий Саранцев",
    "Александр Тюрин",
    "Вячеслав Глазунов"
  ]
};

// Список регионов и городов
const regions = Object.keys(managersData);
const selectedRegion = ref("");
const selectedCity = ref("");

// Функция для получения данных с API
const fetchTotalItems = async () => {
  try {
    const response = await axios.get(
      "https://crystal-motors.ru/method.getClients?count=100000"
    );
    tableData3.value = response.data.answer.items;
    processData(); // Вызываем обработку данных после получения
  } catch (error) {
    console.error("Ошибка при получении данных:", error.message);
  }
};

const processData = () => {
  const managerData = {}; // Хранит уникальных менеджеров

  tableData3.value.forEach((item) => {
    const managerName = item.manager;

    if (!managerData[managerName]) {
      // Если менеджер еще не добавлен, создаем запись
      managerData[managerName] = {
        name: managerName,
        totalCalls: 0,
        totalPlan: 0,
        totalProcessingPercentage: 0,
        count: 0
      };
    }

    // Суммируем количество звонков и план для каждого менеджера
    managerData[managerName].totalCalls += parseInt(item.fact, 10);
    managerData[managerName].totalPlan += parseInt(item.plan, 10);

    // Суммируем процент обработки звонков
    const processingPercentage =
      Number(item.obrashenie) +
      Number(item.salon) +
      Number(item.cred_nal) +
      Number(item.prodan) +
      Number(item.city2) +
      Number(item.data_visit) +
      Number(item.garantiya) +
      Number(item.obrash_imeni) +
      Number(item.bodr_son) * 1.5 +
      Number(item.otpr_viz) +
      Number(item.vizit) * 3 +
      Number(item.prod_company) +
      Number(item.zdatok) * 0.5;

    managerData[managerName].totalProcessingPercentage += processingPercentage;
    managerData[managerName].count += 1;
  });

  // Преобразуем объект в массив для рендера и вычисляем средний процент
  filteredManagers.value = Object.values(managerData).map(manager => {
    return {
      ...manager,
      totalProcessingPercentage: (manager.totalProcessingPercentage / manager.count).toFixed(2)
    };
  });

  console.log("Таблица с данными:", filteredManagers.value);
};

// Вызов функции при монтировании компонента
onMounted(() => {
  fetchTotalItems();
});

// Реактивная функция для фильтрации менеджеров по выбранному городу или региону
// const filteredManagers = computed(() => {
//   if (selectedCity.value) {
//     return managersData[selectedCity.value];
//   } else if (selectedRegion.value) {
//     return Object.values(managersData).flat();
//   } else {
//     return Object.values(managersData).flat();
//   }
// });

// Функция обработки изменения региона
const onRegionChange = () => {
  selectedCity.value = ""; // Сбрасываем выбранный город при смене региона
};

const handleFilterChange = ({
  selectedRegion: newRegion,
  selectedCity: newCity
}) => {
  selectedRegion.value = newRegion;
  selectedCity.value = newCity;
};
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
