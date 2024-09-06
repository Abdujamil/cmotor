<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";
import "@vuepic/vue-datepicker/dist/main.css";
import "v-calendar/style.css";


// Table to Excel 
const table = ref(null);
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


const date = ref(null);

function formatDate(date) {
  return date ? date.toLocaleDateString("ru-RU") : "";
}

const showForm = ref(false);
const formData = ref({
  id: "",
  // factCall: "",
  // city: "",
  // manager: "",
  // carMake: "",
  // carModel: "",
  // callComment: "",

  city: "",
  date: "",
  manager: "",
  phone: "",
  fio: "",
  avto: "",
  fact: "",
  obrashenie: "",
  salon: "",
  cred_nal: "",
  prodan: "",
  city: "",
  all_city: "",
  data_visit: "",
  garantiya: "",
  obrash_imeni: "",
  bodr_son: "",
  otpr_viz: "",
  vizit: "",
  prod_company: "",
  zdatok: "",
  itog: "",
  plan: "",
  comment: ""
});

const tableData = ref([]);

const cities = ["Тюмень", "Пермь", "Челябинск"];
const managers = ["Менеджер 1", "Менеджер 2", "Менеджер 3"];
const carMakes = ["BMW", "Audi", "Mercedes"];
const carModels = ["Model 1", "Model 2", "Model 3"];

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const saveForm = () => {
  // Add the form data to the table
  tableData.value.push({ ...formData.value });
  console.log(tableData.value);

  // Clear the form data
  formData.value = {
    // factCall: "",
    // city: "",
    // manager: "",
    // carMake: "",
    // carModel: "",
    // callComment: "",
    id: "",
    city: "",
    date: "",
    manager: "",
    phone: "",
    fio: "",
    avto: "",
    fact: "",
    obrashenie: "",
    salon: "",
    cred_nal: "",
    prodan: "",
    city: "",
    data_visit: "",
    garantiya: "",
    obrash_imeni: "",
    bodr_son: "",
    otpr_viz: "",
    vizit: "",
    prod_company: "",
    zdatok: "",
    itog: "",
    plan: "",
    comment: ""
  };

  showForm.value = false;
};

const cancelForm = () => {
  showForm.value = false;
};

// Example data for table rows
const rows = ref([
  {
    id: 842,
    city: "Красноярск",
    date: "04.09.2024",
    manager: "Иванов И.И.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 843,
    city: "Сургут",
    date: "05.09.2024",
    manager: "Петров П.П.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 842,
    city: "Красноярск",
    date: "04.09.2024",
    manager: "Иванов И.И.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 843,
    city: "Сургут",
    date: "05.09.2024",
    manager: "Петров П.П.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 842,
    city: "Красноярск",
    date: "04.09.2024",
    manager: "Иванов И.И.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 843,
    city: "Сургут",
    date: "05.09.2024",
    manager: "Петров П.П.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 842,
    city: "Красноярск",
    date: "04.09.2024",
    manager: "Иванов И.И.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 843,
    city: "Сургут",
    date: "05.09.2024",
    manager: "Петров П.П.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 842,
    city: "Красноярск",
    date: "04.09.2024",
    manager: "Иванов И.И.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 843,
    city: "Сургут",
    date: "05.09.2024",
    manager: "Петров П.П.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 842,
    city: "Красноярск",
    date: "04.09.2024",
    manager: "Иванов И.И.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  },
  {
    id: 843,
    city: "Сургут",
    date: "05.09.2024",
    manager: "Петров П.П.",
    phone: "Телефон клиента",
    fio: "ФИО клиента",
    avto: "Авто клиента",
    fact: "Факт звонка",
    obrashenie: "Как обращаться",
    salon: "Еду в салон",
    cred_nal: "Наличка/кредит",
    prodan: "Продали свой авто",
    data_visit: "Дата визита",
    garantiya: "Гарантия",
    obrash_imeni: "Обращение по имени",
    bodr_son: "Бодрый/сонный",
    otpr_viz: "Отправил визитку",
    vizit: "Визит",
    prod_company: "Продал компанию?",
    zdatok: "Задаток",
    itog: "Итог",
    plan: "План, %",
    comment: "Комментарии",
    edit: "Ред."
  }
  // Add more rows as needed
]);
</script>

<template>
  <div class="table-container">
    <div class="filters">
      <div class="filters__btns">
        <button @click="toggleForm" class="btn btn-green">
          <img src="/add-iconn.svg" alt="icon" /> Добавить поле
        </button>

        <button @click="downloadTable" class="btn btn-blue">
          <img src="/add-iconn.svg" alt="icon" /> Скачать таблицу
        </button>
      </div>
      <div class="dropdowns">
        <p>Показать статистику:</p>
        <!-- <VueDatePicker v-model="date" dark range multi-calendars color="red" placeholder="За всё время">
        </VueDatePicker> -->

        <VDatePicker
          v-model="date"
          :popover="{ placement: 'bottom-start' }"
          :columns="2"
          is-range
          borderless 
        >
          <template locale="ru" #default="{ togglePopover, inputValue, inputEvents }">
            <div
              class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
            >
              <!-- Кнопка для открытия календаря -->
              <button
                class="flex justify-center items-center px-2 bg-accent-100 hover:bg-accent-200 text-accent-700 border-r border-gray-300 dark:bg-gray-700 dark:text-accent-300 dark:border-gray-600 dark:hover:bg-gray-600"
                @click="togglePopover()"
              >
                <IconCalendar class="w-5 h-5" />
              </button>
              <!-- Инпут для отображения выбранной даты -->
              <input
                :value="inputValue"
                v-on="inputEvents"
                class="flex-grow px-2 py-1 bg-white dark:bg-gray-700"
                placeholder="Выберите диапазон дат"
              />
            </div>
          </template>
        </VDatePicker>

        <!-- <select >
          <option value="0">За все время</option>
        </select> -->

        <select>
          <option>Все регионы</option>
          <option>Все регионы</option>
          <option>Все регионы</option>
          <!-- Add more options as needed -->
        </select>
        <select>
          <option>Все города</option>
          <option>Все города</option>
          <option>Все города</option>
          <!-- Add more options as needed -->
        </select>
      </div>
    </div>

    <div v-if="showForm" class="form-fields">
      <div class="form-fields__title">
        <h2>Добавление нового поля</h2>
        <div class="form-fields__title-btns">
          <button @click="saveForm" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>
      
      <div class="form-fields__selects">
        <div class="w-50">
          <div class="form-fields__selects-row w-25">
            <div class="form-fields__select form-fields__selects-city">
              <label for="city">Город:</label>
              <select v-model="formData.all_city">
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Дата:</label>
              <select v-model="formData.date">
                <option
                  v-for="manager in managers"
                  :key="manager"
                  :value="manager"
                >
                  {{ manager }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-fields__selects-row w-25">
            <div class="form-fields__select form-fields__selects-carMake">
              <label for="car-make">Марка авто клиента:</label>
              <select v-model="formData.carMakes">
                <option v-for="make in carMakes" :key="make" :value="make">
                  {{ make }}
                </option>
              </select>
            </div>

            

            <div class="form-fields__select form-fields__selects-carModel">
              <label for="car-model">Модель автомобиля:</label>
              <select v-model="formData.carModel">
                <option v-for="model in carModels" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-fields__selects-row row-1">
          <div class="row-2">
            <div class="form-fields__select form-fields__selects-city">
              <label for="city">Менеджер:</label>
              <select v-model="formData.manager">
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Телефон клиента:</label>
              <input
                type="phone"
                placeholder="Телефон"
                v-model="formData.phone"
                v-mask="'+7 (___) ___ __ __'"
              />
            </div>

            <div class="form-fields__select form-fields__selects-city">
              <label for="city">ФИО клиента:</label>
              <input
                type="text"
                placeholder="Введите ФИО"
                v-model="formData.fio"
              />
            </div>
          </div>

          <div class="form-fields__select form-fields__selects-callComment">
            <label for="call-comment">Комментарий по звонку:</label>
            <textarea v-model="formData.comment" placeholder="Комментарий" />
          </div>
        </div>
      </div>

      <div class="checkboxes__container">
        <div class="checkboxes__container-row">
          <label for="fact-call">Факт звонка:</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test1"
                v-model="formData.fact"
                name="fact-call"
                checked
                value="0"
              />
              <label for="test1">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test2"
                v-model="formData.fact"
                name="fact-call"
                value="0.5"
              />
              <label for="test2">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test3"
                v-model="formData.fact"
                name="fact-call"
                value="1"
              />
              <label for="test3">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="obrashenie">Как я могу к Вам обращаться?:</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test4"
                v-model="formData.obrashenie"
                name="obrashenie"
                checked
                value="0"
              />
              <label for="test4">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test5"
                v-model="formData.obrashenie"
                name="obrashenie"
                value="0.5"
              />
              <label for="test5">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test6"
                v-model="formData.obrashenie"
                name="obrashenie"
                value="1"
              />
              <label for="test6">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="salon">Еду к вам в салон, буду через полчаса</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test7"
                v-model="formData.salon"
                name="salon"
                checked
                value="0"
              />
              <label for="test7">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test8"
                v-model="formData.salon"
                name="salon"
                value="0.5"
              />
              <label for="test8">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test9"
                v-model="formData.salon"
                name="salon"
                value="1"
              />
              <label for="test9">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="cred_nal"
            >Вы за наличные или в кредит планируете покупку?</label
          >
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test10"
                v-model="formData.cred_nal"
                name="cred_nal"
                checked
                value="0"
              />
              <label for="test10">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test11"
                v-model="formData.cred_nal"
                name="cred_nal"
                value="0.5"
              />
              <label for="test11">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test12"
                v-model="formData.cred_nal"
                name="cred_nal"
                value="1"
              />
              <label for="test12">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="prodan">Вы свой автомобиль уже продали?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test13"
                v-model="formData.prodan"
                name="prodan"
                checked
                value="0"
              />
              <label for="test13">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test14"
                v-model="formData.prodan"
                name="prodan"
                value="0.5"
              />
              <label for="test14">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test15"
                v-model="formData.prodan"
                name="prodan"
                value="1"
              />
              <label for="test15">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="city">Вы из Тюмени, Перми, Челябинска и т.д.?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test16"
                v-model="formData.city"
                name="city"
                checked
                value="0"
              />
              <label for="test16">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test17"
                v-model="formData.city"
                name="city"
                value="0.5"
              />
              <label for="test17">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test18"
                v-model="formData.city"
                name="city"
                value="1"
              />
              <label for="test18">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="otpr_viz"
            >Подтвердил телефон клиента, отправил визитку?</label
          >
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test19"
                v-model="formData.otpr_viz"
                name="otpr_viz"
                checked
                value="0"
              />
              <label for="test19">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test20"
                v-model="formData.otpr_viz"
                name="otpr_viz"
                value="0.5"
              />
              <label for="test20">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test21"
                v-model="formData.otpr_viz"
                name="otpr_viz"
                value="1"
              />
              <label for="test21">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="data_visit">Когда планируете к нам приехать?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test22"
                v-model="formData.data_visit"
                name="data_visit"
                checked
                value="0"
              />
              <label for="test22">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test23"
                v-model="formData.data_visit"
                name="data_visit"
                value="0.5"
              />
              <label for="test23">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test24"
                v-model="formData.data_visit"
                name="data_visit"
                value="1"
              />
              <label for="test24">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="vizit">Закрыл на визит? Точное время встречи?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test25"
                v-model="formData.vizit"
                name="vizit"
                checked
                value="0"
              />
              <label for="test25">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test26"
                v-model="formData.vizit"
                name="vizit"
                value="0.5"
              />
              <label for="test26">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test27"
                v-model="formData.vizit"
                name="vizit"
                value="1"
              />
              <label for="test27">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="garantiya">Сказал про техническую гарантию?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test28"
                v-model="formData.garantiya"
                name="garantiya"
                checked
                value="0"
              />
              <label for="test28">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test29"
                v-model="formData.garantiya"
                name="garantiya"
                value="0.5"
              />
              <label for="test29">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test30"
                v-model="formData.garantiya"
                name="garantiya"
                value="1"
              />
              <label for="test30">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="prod_company">Продал компанию? </label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test31"
                v-model="formData.prod_company"
                name="prod_company"
                checked
                value="0"
              />
              <label for="test31">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test32"
                v-model="formData.prod_company"
                name="prod_company"
                value="0.5"
              />
              <label for="test32">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test33"
                v-model="formData.prod_company"
                name="prod_company"
                value="1"
              />
              <label for="test33">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="obrash_imeni">Обращался по имени в диалоге?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test34"
                v-model="formData.obrash_imeni"
                name="obrash_imeni"
                checked
                value="0"
              />
              <label for="test34">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test35"
                v-model="formData.obrash_imeni"
                name="obrash_imeni"
                value="0.5"
              />
              <label for="test35">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test36"
                v-model="formData.obrash_imeni"
                name="obrash_imeni"
                value="1"
              />
              <label for="test36">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="zdatok">Выводил на задаток?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test37"
                v-model="formData.zdatok"
                name="zdatok"
                checked
                value="0"
              />
              <label for="test37">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test38"
                v-model="formData.zdatok"
                name="zdatok"
                value="0.5"
              />
              <label for="test38">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test39"
                v-model="formData.zdatok"
                name="zdatok"
                value="1"
              />
              <label for="test39">1</label>
            </p>
          </div>
        </div>

        <div class="checkboxes__container-row">
          <label for="bodr_son"
            >Бодрый/сонный, инициативность, улыбка? Продал себя? Обращался
            по имени в диалоге?</label
          >
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test40"
                v-model="formData.bodr_son"
                name="bodr_son"
                checked
                value="0"
              />
              <label for="test40">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test41"
                v-model="formData.bodr_son"
                name="bodr_son"
                value="0.5"
              />
              <label for="test41">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test42"
                v-model="formData.bodr_son"
                name="bodr_son"
                value="1"
              />
              <label for="test42">1</label>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="tablee">
      <table ref="table" class="data-table">
        <!-- Table headers -->
        <thead>
          <tr>
            <th>№</th>
            <th>Город</th>
            <th>Дата</th>
            <th>Менеджер</th>
            <th>Телефон клиента</th>
            <th>ФИО клиента</th>
            <th>Авто клиента</th>
            <th class="vertical-text">Факт звонка</th>
            <th class="vertical-text">Как обращаться</th>
            <th class="vertical-text">Еду в салон</th>
            <th class="vertical-text">Наличка/Кредит</th>
            <th class="vertical-text">Продали свой авто</th>
            <th class="vertical-text">Город</th>
            <th class="vertical-text">Дата визита</th>
            <th class="vertical-text">Гарантия</th>
            <th class="vertical-text">Обращение по имени</th>
            <th class="vertical-text">Бодрый/Сонный</th>
            <th class="vertical-text">Отправил визитку</th>
            <th class="vertical-text">Визит</th>
            <th class="vertical-text">Продал компанию?</th>
            <th class="vertical-text">Задаток</th>
            <th>Итог</th>
            <th>План, %</th>
            <th>Комментарии</th>
            <th>Ред.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.city }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.manager }}</td>
            <td>{{ row.phone }}</td>
            <td>{{ row.fio }}</td>
            <td>{{ row.avto }}</td>
            <td>{{ row.fact }}</td>
            <td>{{ row.obrashenie }}</td>
            <td>{{ row.salon }}</td>
            <td>{{ row.cred_nal }}</td>
            <td>{{ row.prodan }}</td>
            <td>{{ row.city }}</td>
            <td>{{ row.data_visit }}</td>
            <td>{{ row.garantiya }}</td>
            <td>{{ row.obrash_imeni }}</td>
            <td>{{ row.bodr_son }}</td>
            <td>{{ row.otpr_viz }}</td>
            <td>{{ row.vizit }}</td>
            <td>{{ row.prod_company }}</td>
            <td>{{ row.zdatok }}</td>
            <td>{{ row.itog }}</td>
            <td>{{ row.plan }}</td>
            <td>{{ row.comment }}</td>
            <td>{{ row.edit }}</td>
          </tr>

          <tr v-for="(entry, index) in tableData" :key="index">
            <!-- <td>{{ entry.factCall }}</td>
            <td>{{ entry.carMake }}</td>
            <td>{{ entry.carModel }}</td>
            <td>{{ entry.callComment }}</td> -->
            <td>{{ entry.index }}</td>
            <td>{{ entry.city }}</td>
            <td>{{ entry.date }}</td>
            <td>{{ entry.manager }}</td>
            <td>{{ entry.phone }}</td>
            <td>{{ entry.fio }}</td>
            <td>{{ entry.avto }}</td>
            <td>{{ entry.fact }}</td>
            <td>{{ entry.obrashenie }}</td>
            <td>{{ entry.salon }}</td>
            <td>{{ entry.cred_nal }}</td>
            <td>{{ entry.prodan }}</td>
            <td>{{ entry.city }}</td>
            <td>{{ entry.data_visit }}</td>
            <td>{{ entry.garantiya }}</td>
            <td>{{ entry.obrash_imeni }}</td>
            <td>{{ entry.bodr_son }}</td>
            <td>{{ entry.otpr_viz }}</td>
            <td>{{ entry.vizit }}</td>
            <td>{{ entry.prod_company }}</td>
            <td>{{ entry.zdatok }}</td>
            <td>{{ entry.itog }}</td>
            <td>{{ entry.plan }}</td>
            <td>{{ entry.comment }}</td>
            <td>
              <svg
                id="edit"
                width="48"
                height="34"
                viewBox="0 0 48 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.875 16.4375V22.0625C31.875 23.6132 30.6132 24.875 29.0625 24.875H18.9375C17.3868 24.875 16.125 23.6132 16.125 22.0625V11.9375C16.125 10.3869 17.3868 9.12504 18.9375 9.12504H24.5625C24.8731 9.12504 25.125 9.37689 25.125 9.68754C25.125 9.99818 24.8731 10.25 24.5625 10.25H18.9375C18.007 10.25 17.25 11.007 17.25 11.9375V22.0625C17.25 22.9931 18.007 23.75 18.9375 23.75H29.0625C29.993 23.75 30.75 22.9931 30.75 22.0625V16.4375C30.75 16.1269 31.0019 15.875 31.3125 15.875C31.6231 15.875 31.875 16.1269 31.875 16.4375ZM20.2273 17.1648L28.1023 9.28985C28.3221 9.07005 28.678 9.07005 28.8977 9.28985L31.7102 12.1023C31.93 12.3221 31.93 12.6781 31.7102 12.8977L23.8352 20.7727C23.7297 20.8782 23.5867 20.9375 23.4375 20.9375H20.625C20.3144 20.9375 20.0625 20.6857 20.0625 20.375V17.5625C20.0625 17.4133 20.1218 17.2703 20.2273 17.1648ZM27.6079 11.375L29.625 13.3922L30.5171 12.5L28.5 10.4829L27.6079 11.375ZM21.1875 19.8125H23.2046L28.8296 14.1875L26.8125 12.1704L21.1875 17.7954V19.8125Z"
                  fill="white"
                />
              </svg>
            </td>
          </tr>
        </tbody>
        <!-- Table footer -->
        <tfoot>
          <tr>
            <td colspan="10"><p>Итоговые значения: 23</p></td>
            <td colspan="10"><p>Сумма звонков: 1090</p></td>
            <td colspan="25">
              <p>Средний процент по выполнению плана: 95%</p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url("./table.scss");

.calendar-container {
  position: relative; /* Для позиционирования попапа относительно контейнера */
}

.calendar-button {
  margin: 10px; /* Для отступов кнопки */
}

.calendar-popup {
  position: absolute; /* Абсолютное позиционирование для попапа */
  top: 40px; /* Смещение вниз под кнопкой */
  z-index: 100; /* Приоритет отображения */
  background-color: white; /* Фон для календаря */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для попапа */
  border-radius: 4px; /* Закругление углов */
}
</style>
