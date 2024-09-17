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
        <div class="table-cell">№</div>
        <div class="table-cell">Город</div>
        <div class="table-cell">Кач-во обслуж. в салоне</div>
        <div class="table-cell">Кач-во работы менеджера</div>
        <div class="table-cell">Номер телефона</div>
        <div class="table-cell">Дата опроса</div>
        <div class="table-cell">Тип сделки</div>
        <div class="table-cell">Комментарий</div>
        <div class="table-cell">Комментарий РОПа</div>
        <div class="table-cell">Статус</div>
      </div>
      <!-- Filtered Table Rows -->
      <div
        class="table-row body"
        v-for="(city, index) in cities.name"
        :key="index"
      >
        <div class="table-cell">{{ index + 1 }}</div>
        <div class="table-cell">{{ city }}</div>
        <div class="table-cell">{{ cities.colSalon[index] }}</div>
        <div class="table-cell">{{ cities.colManager[index] }}</div>
        <div class="table-cell">{{ cities.phone[index] }}</div>
        <div class="table-cell">{{ cities.date[index] }}</div>
        <div class="table-cell">{{ cities.typeDeals[index] }}</div>
        <div class="table-cell table-cell-comment">{{ cities.comment[index] }}</div>
        <div class="table-cell table-cell-comment">
          <div
            class="comment-edit"
            v-if="editingIndex !== index"
            @click="startEditing(index)"
          >
            <svg
              title="Редактирование"
              id="edit-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M16.875 8.43754V14.0625C16.875 15.6132 15.6132 16.875 14.0625 16.875H3.9375C2.38683 16.875 1.125 15.6132 1.125 14.0625V3.93754C1.125 2.38686 2.38683 1.12504 3.9375 1.12504H9.5625C9.87314 1.12504 10.125 1.37689 10.125 1.68754C10.125 1.99818 9.87314 2.25004 9.5625 2.25004H3.9375C3.00698 2.25004 2.25 3.00702 2.25 3.93754V14.0625C2.25 14.9931 3.00698 15.75 3.9375 15.75H14.0625C14.993 15.75 15.75 14.9931 15.75 14.0625V8.43754C15.75 8.12689 16.0019 7.87504 16.3125 7.87504C16.6231 7.87504 16.875 8.12689 16.875 8.43754ZM5.22731 9.16485L13.1023 1.28985C13.3221 1.07005 13.678 1.07005 13.8977 1.28985L16.7102 4.10235C16.93 4.32214 16.93 4.67807 16.7102 4.89772L8.83519 12.7727C8.72972 12.8782 8.5867 12.9375 8.4375 12.9375H5.625C5.31436 12.9375 5.0625 12.6857 5.0625 12.375V9.56254C5.0625 9.41333 5.12184 9.27032 5.22731 9.16485ZM12.6079 3.37504L14.625 5.39216L15.5171 4.50004L13.5 2.48291L12.6079 3.37504ZM6.1875 11.8125H8.20463L13.8296 6.18754L11.8125 4.17041L6.1875 9.79541V11.8125Z"
                fill="currentColor"
              />
            </svg>
            <span>{{ cities.commentRPO[index] }}</span>
          </div>

          <div v-else>
            <input
              class="comment-input"
              type="text"
              v-model="editedComment"
              @blur="saveComment(index)"
              @keydown.enter="saveComment(index)"
              ref="editInput"
            />
          </div>
        </div>
        <div class="table-cell">{{ cities.status[index] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import * as XLSX from "xlsx";

const table = ref();

const editingIndex = ref(null); // Хранит индекс редактируемого комментария
const editedComment = ref(""); // Хранит текущий текст редактируемого комментария
const editInput = ref(null);

const startEditing = (index) => {
  editingIndex.value = index;
  editedComment.value = cities.commentRPO[index]; // Обновляем текст комментария при начале редактирования
  nextTick(() => {
    // Use ref instead of document.getElementById
    editInput.value.focus();
  });
};

const saveComment = (index) => {
  if (cities.commentRPO[index] !== undefined) {
    cities.commentRPO[index] = editedComment.value; // Save the new comment
  }
  editingIndex.value = null; // Close the edit mode
};

const handleOutsideClick = (event) => {
  if (
    editingIndex.value !== null &&
    !event.target.closest(".table-cell-comment")
  ) {
    saveComment(editingIndex.value); // Save the current comment when clicking outside
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const downloadTable = () => {
  if (table.value) {
    // Преобразуем HTML таблицу в формат рабочего листа Excel
    const ws = XLSX.utils.table_to_sheet(table.value);

    // Создаем книгу Excel и добавляем рабочий лист
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Генерируем и сохраняем файл Excel
    XLSX.writeFile(wb, "data-nps-table.xlsx");
  }
};

const cities = ref({
  name: [
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
  ],
  colSalon: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  colManager: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  phone: [
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34",
    "+7 (923) 756-04-34"
  ],
  date: [
    "01.01.2022",
    "02.01.2022",
    "03.01.2022",
    "04.01.2022",
    "05.01.2022",
    "06.01.2022",
    "07.01.2022",
    "08.01.2022",
    "09.01.2022",
    "10.01.2022",
    "11.01.2022",
    "12.01.2022"
  ],
  typeDeals: [
    "Комиссия",
    "Комиссия",
    "Покупка",
    "Комиссия",
    "Покупка",
    "Комиссия",
    "Комиссия",
    "Комиссия",
    "Покупка",
    "Комиссия",
    "Покупка",
    "Комиссия"
  ],
  comment: [
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики"
  ],
  commentRPO: [
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики",
    "Мёртвые непонятные ничего не знают не делают что обещают ,обманщики"
  ],
  status: [
    "Отработан",
    "В работе",
    "Отработан",
    "Отработан",
    "Отработан",
    "В работе",
    "Отработан",
    "Отработан",
    "Отработан",
    "Отработан",
    "В работе",
    "Отработан"
  ]
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

.table-row.body {
  text-wrap: nowrap;
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

.table-cell-comment {
  width: 340px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: nowrap;
}

.table-row:nth-child(odd) {
  background: linear-gradient(0deg, #7181ae 0%, #7181ae 100%),
    linear-gradient(81deg, #e4b656 0%, #cfa54e 0.01%, #b89345 100%),
    rgba(255, 255, 255, 0.4);
}

.data-table tbody tr:nth-child(even) {
  background: none; /* Фон по умолчанию */
}

.comment-edit {
  display: flex;
  align-items: center;
  gap: 6px;
}

.comment-input {
  background: transparent;
  border: 1px solid #8e9ec9;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  padding: 4px;

  &:focus {
    outline: none;
    border-color: #fff;
  }
}
</style>
