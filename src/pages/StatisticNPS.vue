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
        v-for="(name, index) in displayedData"
        :key="index"
        class="table-row"
      >
        <div class="table-cell">{{ name }}</div>
        <div class="table-cell">-</div>
        <div class="table-cell">{{ managers.numberCall[index] }}</div>
        <div class="table-cell">-</div>
        <div class="table-cell">{{ managers.numberCall[index] }}</div>
        <div class="table-cell">-</div>
        <div class="table-cell">{{ managers.numberCall[index] }}</div>
      </div>

      <!-- Table Footer -->
      <div class="table-row footer">
        <div class="table-cell">Общие значения:</div>
        <div class="table-cell">3,4</div>
        <div class="table-cell">–</div>
        <div class="table-cell">3,5</div>
        <div class="table-cell">–</div>
        <div class="table-cell">3,5</div>
        <div class="table-cell">–</div>
      </div>
    </div>

    <div class="table-nav">
      <div class="table-nav__header">
        <p>Выберите статистику:</p>
      </div>

      <div class="table-nav__btns">
        <button :class="{ active: currentDataSet === 'nps' }" @click="switchData('nps')">
          Общий NPS
        </button>
        <button :class="{ active: currentDataSet === 'buyers' }" @click="switchData('buyers')">
          Покупатели
        </button>
        <button :class="{ active: currentDataSet === 'commission' }" @click="switchData('commission')">
          Комиссия
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx";
import { ref, computed } from "vue";
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";

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

const managers = {
  managerName: [
    "Эдуард Мукин",
    "Турал Мамедли",
    "Алексей Шевчук",
    "Армен Мкртчян",
    "Не представился",
    "Вадим Гусейнов",
    "Роман Мкртчян",
    "Алексей Краюхин",
    "Павел Дацюк",
    "Данил Проценко",
    "Алексей Гостев",
    "Станислав Питулин",
    "Антон Терлецкий",
    "Радик Салахов",
    "Егор Марчук",
    "Арсений Камерер",
    "Владислав Бубнов",
    "Павел Зрячиков",
    "Артемий Ефимов",
    "Константин управляющий",
    "Сергей Казымов",
    "Антон Тупицын",
    "Антон Швалев",
    "Не представился",
    "Роман Шералиев",
    "Артем Чигарьков",
    "Дамир Шаймерденов",
    "Никита Гришихин",
    "Андрей Григорьев",
    "Ринат Юсупов",
    "Илья Пятыгин",
    "Данил Тагиев",
    "Данил Кучин",
    "Диннур Фасхутдинов",
    "Илья Васкевич",
    "Кирилл Кривцов",
    "Денис Илюхин",
    "Кирилл Келлер",
    "Федор Асадов",
    "Дмитрий Маник",
    "Владимир РОП",
    "Василий Дианов",
    "Илья Кошман",
    "Леонид Фотин",
    "Николай Васильев",
    "Алексей Ощепков",
    "Михаил РОП",
    "Сергей Карпенко",
    "Не представился",
    "Оскар Курмакаев",
    "Никита Аксёнов",
    "Владислав Петров",
    "Иван Манцеленко",
    "Денис Лисин",
    "Филипп Козырев",
    "Александр Кузнецов",
    "Михаил Вахонин",
    "Данил Королев",
    "Алексей Бухтияров",
    "Данил Гриневич",
    "Алексей Лихачев",
    "Алексей Ямщиков",
    "Георгий Сироткин",
    "Артем Васюков",
    "Глеб Каменский",
    "Ярослав Дорошенко",
    "Турдали Эрназаров",
    "Кирил Макеев",
    "Илья Гологузов",
    "Ян Лалетин",
    "Захар Русанов",
    "Павел Мымрин",
    "Вадим Олексенко",
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
    "Илья Катков",
    "Владимир Полещук",
    "Илья Бушмелев",
    "Леонид Шушарин",
    "Алексей Фроликов",
    "Роман Касымов",
    "Анатолий Саранцев",
    "Александр Тюрин",
    "Вячеслав Глазунов"
  ],
  percentCall: [
    "87%",
    "82%",
    "83%",
    "85%",
    "86%",
    "87%",
    "88%",
    "82%",
    "80%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "87%",
    "81%",
    "82%",
    "84%",
    "85%",
    "80%",
    "82%",
    "84%",
    "83%",
    "85%",
    "82%",
    "84%",
    "85%",
    "80%",
    "82%",
    "84%",
    "83%",
    "82%",
    "84%",
    "85%",
    "80%",
    "82%",
    "84%",
    "83%",
    "82%",
    "84%",
    "85%",
    "80%",
    "82%",
    "84%",
    "83%"
  ],
  numberCall: [
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
    "48",
    "50",
    "52",
    "54",
    "56",
    "58",
    "60",
    "62",
    "64",
    "66",
    "68",
    "70",
    "72",
    "74",
    "76",
    "78",
    "80",
    "82",
    "84",
    "86",
    "88",
    "90",
    "92",
    "94",
    "96",
    "98",
    "100",
    "102",
    "104",
    "106",
    "108",
    "110",
    "112",
    "114",
    "116",
    "118",
    "120",
    "122",
    "124",
    "126",
    "128",
    "130",
    "132",
    "134",
    "92",
    "94",
    "96",
    "98",
    "100",
    "92",
    "94",
    "96",
    "98",
    "100",
    "92",
    "94",
    "96",
    "98",
    "100",
    "92",
    "94",
    "96",
    "98",
    "100",
    "92",
    "94",
    "96",
    "98",
    "100",
    "92",
    "94",
    "96",
    "98",
    "100",
    "92",
    "94",
    "96",
    "98",
    "100"
  ]
};

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


// Состояние текущих данных
const currentDataSet = ref('nps'); // По умолчанию отображаем NPS
const displayedData = ref(cities);

// Обработчик переключения данных
const switchData = (type) => {
  currentDataSet.value = type; // Устанавливаем активный тип данных
  if (type === 'nps') {
    displayedData.value = cities;
  } else if (type === 'buyers') {
    displayedData.value = citiesP;
  } else if (type === 'commission') {
    displayedData.value = citiesK;
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  overflow: auto;
  max-height: 550px;
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
