<template>
  <!-- Add new field -->
  <div v-if="showForm" class="form-fields">
    <form @submit.prevent="addCity">
      <div class="form-fields__title">
        <h2>Добавление нового поля</h2>
        <div class="form-fields__title-btns">
          <button type="submit" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

      <!-- TODO comment and status -->

      <div class="dataNps-selects form-fields__selects">
        <div class="dataNps-selects-head">
          <div
            class="form-fields__select form-fields__selects-city"
            ref="cityDropdown"
          >
            <label for="city">Город</label>
            <div class="dropdown">
              <div class="dropdown-toggle" @click="toggleDropdown('city')">
                <span>{{ selectedCity || "Выберите город" }}</span>
                <span class="dropdown-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
              <div class="dropdown-menu" v-if="showCityDropdown">
                <div
                  class="dropdown-item"
                  v-for="city in citiess"
                  :key="city"
                  @click="selectCity(city)"
                >
                  {{ city }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="form-fields__select form-fields__selects-city"
            ref="salonDropdown"
          >
            <label for="salon">Кач-во обслуж. в салоне</label>
            <div class="dropdown">
              <div class="dropdown-toggle" @click="toggleDropdown('salon')">
                <span>{{ selectedSlQuality || "Выберите оценку" }}</span>
                <span class="dropdown-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
              <div class="dropdown-menu" v-if="showQualSlaonDropdown">
                <div
                  class="dropdown-item"
                  v-for="ratingSl in ratingsSalon"
                  :key="ratingSl"
                  @click="selectsalon_quality(ratingSl)"
                >
                  {{ ratingSl }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="form-fields__select form-fields__selects-city"
            ref="managerDropdown"
          >
            <label for="manager">Кач-во работы менеджера</label>
            <div class="dropdown">
              <div
                class="dropdown-toggle"
                @click="toggleDropdown('managerWork')"
              >
                <span>{{ selectedManagerWork || "Выберите оценку" }}</span>
                <span class="dropdown-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
              <div class="dropdown-menu" v-if="showManagerWorkDropdown">
                <div
                  class="dropdown-item"
                  v-for="rating in ratingsManagerWork"
                  :key="rating"
                  @click="selectManagerWork(rating)"
                >
                  {{ rating }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-fields__select form-fields__selects-manager">
            <label for="manager">Номер телефона</label>

            <MaskInput
              mask="+7 (###) ###-##-##"
              placeholder="Телефон"
              v-model="formData.phone_number"
            />
          </div>
          <div class="form-fields__select form-fields__selects-manager">
            <label for="manager">Дата опроса</label>
            <div class="my-calendar">
              <VueDatePicker
                v-model="survey_date"
                :format="format2"
                dark
                placeholder="За всё время"
                @update:model-value="updatedataRange"
              >
              </VueDatePicker>
            </div>
          </div>
        </div>
        <div class="dataNps-selects-foot">
          <div
            class="form-fields__select form-fields__selects-city"
            ref="dealsDropdown"
          >
            <label for="dealsType">Тип сделки</label>
            <div class="dropdown">
              <div class="dropdown-toggle" @click="toggleDropdown('dealsType')">
                <span>{{ selectedDealsType || "Выберите тип сделки" }}</span>
                <span class="dropdown-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
              <div class="dropdown-menu" v-if="showDealsTypeDropdown">
                <div
                  class="dropdown-item"
                  v-for="deal in typeDeal"
                  :key="deal"
                  @click="selectDealsType(deal)"
                >
                  {{ deal }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-fields__select form-fields__selects-callComment">
            <label for="call-comment">Комментарий по звонку:</label>
            <textarea v-model="formData.comment" placeholder="Комментарий" />
          </div>
        </div>
      </div>
    </form>
  </div>
  <!-- END add new field -->

  <div v-else>
    <div>
      <h2>Данные NPS</h2>
    </div>
    <div class="filters filters-statis-city">
      <div class="filters__btns">
        <button @click="toggleForm" class="btn btn-green">
          <img src="/add-iconn.svg" alt="icon" /> Добавить поле
        </button>
        <IButton @click="downloadTable" />
      </div>
      <Filter @filterChange="handleDateChange" />
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
          v-for="(city, index) in cities"
          :key="index"
        >
          <div class="table-cell">{{ index }}</div>
          <div class="table-cell">{{ city.city }}</div>
          <div class="table-cell">{{ city.salon_quality }}</div>
          <div class="table-cell">{{ city.manager_quality }}</div>
          <div class="table-cell">{{ city.phone_number }}</div>
          <div class="table-cell">{{ city.survey_date }}</div>
          <div class="table-cell">{{ city.transaction_type }}</div>
          <div class="table-cell table-cell-comment">
            {{ city.comment }}
          </div>
          <div class="table-cell table-cell-comment">
            <div
              class="comment-edit"
              v-if="!isEditing"
              @click="isEditing = true"
            >
              <svg
                title="Редактирование"
                @click.stop="startEditingg"
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
              <p>{{ comment }}</p>

              <!-- Добавлена проверка существования cities.commentRPO и индекса -->
              <!-- <span v-if="cities.commentRPO && cities.commentRPO[index]">
                {{ cities.commentRPO[index] }}
              </span> -->
            </div>
            <div v-else>
              <!-- Проверка на существование editedComments -->
              <input
                class="comment-input"
                type="text"
                v-model="updatedComment"
                @blur="saveCommentt"
                @keyup.enter="saveCommentt"
              />
            </div>
          </div>

          <div class="table-cell">
            {{ city.status }}

            <div class="dropdown" @click.stop="toggleDropdown('status')">
              <div class="dropdown-toggle">
                <span id="dropdown-selected">{{ selectedStatus }}</span>
                <span class="dropdown-arrow">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <div
                  class="dropdown-item"
                  v-for="(option, index) in statusOptions"
                  :key="index"
                  @click="selectStatus(option)"
                >
                  {{ option }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import * as XLSX from "xlsx";

const table = ref();

// Ключи для localStorage
const COMMENT_KEY = "savedComment";
const STATUS_KEY = "savedStatus";

// Комментарий и статус
const comment = ref("");
const updatedComment = ref("");
// Режим редактирования
const isEditing = ref(false);

// Загрузка данных из localStorage при монтировании компонента
onMounted(() => {
  const savedComment = localStorage.getItem(COMMENT_KEY);
  const savedStatus = localStorage.getItem(STATUS_KEY);

  if (savedComment) {
    comment.value = savedComment;
    updatedComment.value = savedComment;
  }
  if (savedStatus) {
    selectedStatus.value = savedStatus;
  }
});

// Функция начала редактирования
const startEditingg = () => {
  isEditing.value = true;
};

// Функция сохранения комментария
const saveCommentt = () => {
  comment.value = updatedComment.value;
  localStorage.setItem(COMMENT_KEY, updatedComment.value); // Сохранение в localStorage
  isEditing.value = false;
};

const selectedStatus = ref("Не отработан"); // По умолчанию "Не отработан"
const statusOptions = ["Не отработан", "В работе", "Отработан"];
const showStatusDropdown = ref(false);

const editingIndex = ref(false); // Хранит индекс редактируемого комментария
const editedComments = ref([]); // Изменяем на массив для каждого комментария
const editInput = ref([]); // Массив для каждого поля ввода

const showForm = ref(false);
const showCityDropdown = ref(false);
const showQualSlaonDropdown = ref(false);
const showManagerWorkDropdown = ref(false);
const showDealsTypeDropdown = ref(false);
const selectedCity = ref("");
const selectedSlQuality = ref("");
const selectedManagerWork = ref("");
const selectedDealsType = ref("");
const date = ref();

const format2 = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль для дня
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Добавляем ведущий ноль для месяца
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const updatedataRange = (dates) => {
  if (dates instanceof Date) {
    formData2.value.survey_date = format2(dates); // Форматируем дату перед сохранением
  } else {
    formData2.value.survey_date = ""; // Если это не дата, обнуляем
  }
  console.log("Updated formData2.date:", formData2.value.survey_date);
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const cancelForm = () => {
  showForm.value = false;
};

// Состояние данных
const formData2 = ref({
  city: "",
  ratingSl: "",
  salon_quality: "",
  manager_quality: "",
  phone_number_number: "",
  survey_date: "",
  transaction_type: "",
  comment: "",
  rop_comment: "",
  status: "",

  workManager: "",
  DealsType: "",
  date: "",
  phone_number: "",
  fio: "",
  avto: ""
});

const formData1 = ref({
  city: "",
  salon_quality: "",
  manager_quality: "",
  phone_number: "",
  date: "",
  transaction_type: "",
  comment: ""
});

const formData = ref({
  city: "",
  salon_quality: "",
  manager_quality: "",
  phone_number_number: "",
  survey_date: "",
  transaction_type: "",
  comment: "",
  rop_comment: "",
  status: ""
});

// Функция выбора статуса
const selectStatus = (option) => {
  selectedStatus.value = option;
  localStorage.setItem(STATUS_KEY, option); // Сохранение статуса в localStorage
};

// Обработчик выбора города
const selectCity = (cityy) => {
  selectedCity.value = cityy;
  showCityDropdown.value = false;
  formData.value.city = cityy ? cityy : "";
};

// Обработчик выбора качества обслуживания салона
const selectsalon_quality = (ratingSl) => {
  selectedSlQuality.value = ratingSl;
  showQualSlaonDropdown.value = false;
  formData.value.salon_quality = ratingSl ? ratingSl : "";
};

// Обработчик выбора качества работы менеджера
const selectManagerWork = (workManager) => {
  selectedManagerWork.value = workManager;
  showManagerWorkDropdown.value = false;
  formData.value.manager_quality = workManager ? workManager : "";
};

// Обработчик выбора типа сделки
const selectDealsType = (DealsType) => {
  selectedDealsType.value = DealsType;
  showDealsTypeDropdown.value = false;
  formData.value.transaction_type = DealsType ? DealsType : "";
};

// Переключение видимости дропдаунов
function toggleDropdown(type) {
  if (type === "brand") {
    showDealsTypeDropdown.value = false;
  } else if (type === "model") {
    showModelDropdown.value = !showModelDropdown.value;
    showDealsTypeDropdown.value = false;
  } else if (type === "managerWork") {
    showManagerWorkDropdown.value = !showManagerWorkDropdown.value;
    showDealsTypeDropdown.value = false;
  } else if (type === "city") {
    showCityDropdown.value = !showCityDropdown.value;
    showDealsTypeDropdown.value = false;
  } else if (type === "salon") {
    showQualSlaonDropdown.value = !showQualSlaonDropdown.value;
    showDealsTypeDropdown.value = false;
  } else if (type === "dealsType") {
    showDealsTypeDropdown.value = !showDealsTypeDropdown.value;
    showManagerWorkDropdown.value = false;
  } else if (type === "status") {
    showStatusDropdown.value = !showStatusDropdown.value;
    showManagerWorkDropdown.value = false;
  }
}

const fetchCities = async () => {
  try {
    const filterParams = {
      order: "id_desc"
    };

    const response = await axios.get(
      "https://crystal-motors.ru/method.getSendings",
      {
        params: filterParams
      }
    );

    cities.value = response.data.answer.items;

    console.log("Данные успешно получены:", cities.value);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

const addCity = async () => {
  try {
    console.log("Добавление нового клиента:", formData.value);

    const params = new URLSearchParams(formData.value).toString();

    console.log("Параметры запроса:", params);

    await axios.get(`https://crystal-motors.ru/method.addSending?${params}`);

    alert("Данные успешно добавлены!");

    // Очистка формы после добавления
    formData.value = {
      city: "",
      salon_quality: "",
      manager_quality: "",
      phone_number: "",
      survey_date: "",
      transaction_type: "",
      comment: ""
    };
    showForm.value = !showForm.value;

    // Перезагрузка данных
    fetchCities();
  } catch (error) {
    console.error("Ошибка при добавлении данных:", error);
  }
};

onMounted(() => {
  fetchCities();
});

const cities = ref([]); // Массив для хранения данных

const citiess = [
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

const ratingsSalon = ["1", "2", "3", "4", "5"];
const ratingsManagerWork = ["1", "2", "3", "4", "5"];
const typeDeal = ["Комиссия", "Покупка"];

const ensureCommentIndex = (index) => {
  if (!editedComments.value[index]) {
    editedComments.value[index] = ""; // Инициализируем пустую строку, если комментарий отсутствует
  }
  if (!editInput.value[index]) {
    editInput.value[index] = null; // Инициализируем ссылку для поля ввода
  }
};

// Старт редактирования
const startEditing = (index) => {
  ensureCommentIndex(index); // Проверка инициализации
  editingIndex.value = index;
  editedComments.value[index] = cities.commentRPO[index] || "";
  nextTick(() => {
    if (editInput.value[index]) {
      editInput.value[index].focus(); // Используем индекс для доступа к полю ввода
    }
  });
};

// Сохранение комментария
const saveComment = (index) => {
  ensureCommentIndex(index); // Убедимся, что индекс существует
  if (cities.commentRPO[index] !== undefined) {
    cities.commentRPO[index] = editedComments.value[index] || ""; // Сохраняем комментарий
  }
  editingIndex.value = null; // Завершаем редактирование
};

// Обработка клика вне комментария
const handleOutsideClick = (event) => {
  if (
    editingIndex.value !== null &&
    !event.target.closest(".table-cell-comment")
  ) {
    if (editedComments.value[editingIndex.value] !== undefined) {
      saveComment(editingIndex.value); // Сохраняем текущий комментарий при клике вне
    }
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
</script>

<style lang="scss" scoped>
@import "../components/table/table.scss";

input {
  font-size: 14px;
}

.my-calendar {
  width: 100%;
}

label {
  text-wrap: nowrap;
}

.dataNps-selects {
  flex-direction: column;

  .dataNps-selects-head,
  .dataNps-selects-foot {
    display: flex;
    align-items: start;
    justify-content: space-between;
    width: 100%;
  }

  .dataNps-selects-head {
    gap: 20px;

    .dropdown {
      width: 100%;
      max-width: inherit;
      cursor: pointer;
    }
  }

  .form-fields__select {
    width: 23%;
    align-items: start;
  }

  .dataNps-selects-foot {
    justify-content: start;
    gap: 20px;

    .form-fields__select-dateOpros {
      width: 30% !important;
    }

    .form-fields__selects-callComment {
      width: 100%;
    }

    .form-fields__select {
      textarea {
        width: -webkit-fill-available;
      }
    }
  }
}

.dropdown-toggle{
  border: none;
  gap: 6px;
  cursor: pointer;
}

.dropdown-arrow{
  width: 16px;
  height: 16px;
}

#dropdown-selected{
  font-size: 12px;
  color: #fff;
}

.filters {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 20px;

  &__btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.btn {
  width: 100%;
  max-width: 210px;
  padding: var(--M, 12px);
  border-radius: var(--S, 8px);
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  text-wrap: nowrap;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  gap: 8px;
  -webkit-transition: background-color 0.3s ease;
  -o-transition: background-color 0.3s ease;
  transition: background-color 0.3s ease;
}

.btn-green {
  background: #00a067;
  color: white;

  &:hover {
    background: #019460;
  }
}

.btn-blue {
  background-color: #007bff;
  color: white;

  &:hover {
    background: #0272eb;
  }
}

.table-container {
  overflow: auto;
  max-height: 550px;
}

.filters-statis-city {
  display: flex;
  justify-content: space-between;
  // flex-direction: row;
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
