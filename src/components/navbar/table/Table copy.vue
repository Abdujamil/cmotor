<template>
  <div class="table-container">
    <div class="filters">
      <button @click="toggleForm" class="btn btn-green">
        <img src="../../../../public/add-iconn.svg" alt="icon" /> Добавить поле
      </button>
      <div class="dropdowns">
        <p>Показать статистику:</p>
        <select>
          <option>За всё время</option>
          <option>За всё время</option>
          <option>За всё время</option>
          <!-- Add more options as needed -->
        </select>
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

      <button @click="downloadTable" class="btn btn-blue">
        <img src="../../../../public/add-iconn.svg" alt="icon" /> Скачать
        таблицу
      </button>
    </div>

    <div v-if="showForm" class="form-fields">
      <div class="form-fields__title">
        <h2>Добавление нового поля</h2>
        <div class="form-fields__title-btns">
          <button @click="saveForm" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

      <!-- Repeat similar structure for other fields with 0, 0.5, 1 options -->
      <div class="form-fields__selects">
        <div class="w-50">
          <div class="form-fields__selects-row w-25">
            <div class="form-fields__select form-fields__selects-city">
              <label for="city">Город:</label>
              <select v-model="formData.city">
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
              <select v-model="formData.carMake">
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
            <textarea
              v-model="formData.comment"
              placeholder="Комментарий"
            />
          </div>
        </div>
      </div>

      <div class="checkboxes__container">
        <label for="fact-call">Факт звонка:</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.factCall" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.factCall" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.factCall" /> 1</label
          >
        </div>

        <label for="fact-call">Как я могу к Вам обращаться?:</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.obrashenie" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.obrashenie" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.obrashenie" /> 1</label
          >
        </div>


        <label for="fact-call">Еду к вам в салон, буду через полчаса</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.salon" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.salon" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.salon" /> 1</label
          >
        </div>

        <label for="fact-call">Вы за наличные или в кредит планируете покупку?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.cred_nal" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.cred_nal" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.cred_nal" /> 1</label
          >
        </div>

        <label for="fact-call">Вы свой автомобиль уже продали?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>


        <!-- TODO Надо доделать название поля вот тут  -->
        <label for="fact-call">Вы из Тюмени, Перми, Челябинска и т.д.?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Подтвердил телефон клиента, отправил визитку?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Когда планируете к нам приехать?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Закрыл на визит? Точное время встречи?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Сказал про техническую гарантию?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Продал компанию? </label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Обращался по имени в диалоге?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Выводил на задаток?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>
        <label for="fact-call">Бодрый/сонный, инициативность, улыбка? Продал себя? Обращался по имени в диалоге?</label>
        <div class="radio-group">
          <label
            ><input type="radio" value="0" v-model="formData.prodan" /> 0</label
          >
          <label
            ><input type="radio" value="0.5" v-model="formData.prodan" />
            0.5</label
          >
          <label
            ><input type="radio" value="1" v-model="formData.prodan" /> 1</label
          >
        </div>


      </div>
    </div>

    <div class="table">
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
          <!-- <tr v-for="row in rows" :key="row.id">
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
          </tr> -->
          <tr v-for="(entry, index) in tableData" :key="index">
            <td>{{ entry.factCall }}</td>
            <td>{{ entry.carMake }}</td>
            <td>{{ entry.carModel }}</td>
            <td>{{ entry.callComment }}</td>
            <!-- New -->
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
            <td>{{ entry.edit }}</td>
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

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";


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

const showForm = ref(false);
const formData = ref({
  id: "",
  factCall: "",
  city: "",
  manager: "",
  carMake: "",
  carModel: "",
  callComment: "",

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
  comment: "",
  edit: ""
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
    factCall: "",
    city: "",
    manager: "",
    carMake: "",
    carModel: "",
    callComment: "",

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
    comment: "",
    edit: ""
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

<style scoped lang="scss">
@import url("./table.scss");
</style>
