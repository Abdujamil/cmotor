<template>
  <div>
    <h1>Админка для менеджеров</h1>

    <div class="admin__container">
      <MaskInput
        mask="7(###)-###-##-##"
        placeholder="Поиск по номеру телефона"
        @input="onInput"
        v-model="phone"
        @keypress.enter="fetchUserData"
      />

      <multiselect
        v-model="selectedPermissions"
        :options="options"
        :multiple="true"
        :close-on-select="false"
        placeholder="Choice permissions for manager"
      ></multiselect>

      <button :disabled="isButtonDisabled" @click="updatePermissions" class="btn btn-green">Обновить</button>
    </div>

    <div class="search__table">
      <table>
        <thead>
          <tr>
            <th>Данные клиента</th>
            <th>
              <!-- <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M18 8.35716V14.7857C18 16.5579 16.5579 18 14.7857 18H3.21428C1.44209 18 0 16.5579 0 14.7857V3.21432C0 1.44213 1.44209 4.01852e-05 3.21428 4.01852e-05H9.64284C9.99785 4.01852e-05 10.2857 0.287879 10.2857 0.642896C10.2857 0.997913 9.99785 1.28575 9.64284 1.28575H3.21428C2.15083 1.28575 1.28571 2.15087 1.28571 3.21432V14.7857C1.28571 15.8492 2.15083 16.7143 3.21428 16.7143H14.7857C15.8491 16.7143 16.7142 15.8492 16.7142 14.7857V8.35716C16.7142 8.00215 17.0021 7.71431 17.3571 7.71431C17.7121 7.71431 18 8.00215 18 8.35716ZM4.68835 9.18838L13.6883 0.188397C13.9395 -0.062799 14.3463 -0.062799 14.5973 0.188397L17.8116 3.40268C18.0628 3.65387 18.0628 4.06064 17.8116 4.31167L8.81162 13.3117C8.69109 13.4322 8.52764 13.5 8.35712 13.5H5.14285C4.78783 13.5 4.49999 13.2122 4.49999 12.8572V9.64288C4.49999 9.47236 4.56781 9.30891 4.68835 9.18838ZM13.1233 2.57146L15.4285 4.87674L16.4481 3.85717L14.1428 1.55189L13.1233 2.57146ZM5.7857 12.2143H8.09098L14.5195 5.78574L12.2143 3.48046L5.7857 9.90902V12.2143Z"
                  fill="white"
                  fill-opacity="0.4"
                />
              </svg> -->
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colspan=".5">Фамилия</th>
            <th>
              {{ formDataManager.last_name ? formDataManager.last_name : "-" }}
            </th>
          </tr>
          <tr>
            <th>Имя</th>
            <th>{{ formDataManager.name ? formDataManager.name : "-" }}</th>
          </tr>
          <tr>
            <th>Отчество</th>
            <th>
              {{
                formDataManager.middle_name ? formDataManager.middle_name : "-"
              }}
            </th>
          </tr>
          <tr>
            <th>E-mail</th>
            <th>{{ formDataManager.email ? formDataManager.email : "-" }}</th>
          </tr>
          <tr>
            <th>Телефон</th>
            <th>{{ formDataManager.phone ? formDataManager.phone : "-" }}</th>
          </tr>
          <tr>
            <th>Бонусы</th>
            <th>{{ formDataManager.points ? formDataManager.points : "-" }}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import { ref, onMounted, computed, warn, watch } from "vue";
import axios from "axios";
import { MaskInput } from "vue-3-mask";
import { id } from "date-fns/locale";

// Регистрация компонента Multiselect
const Permissions = ref([]);
const options = ref([]);
const value = ref([]);
const searchPhone = ref("");
const selectedPermissions = ref([]);
const initialPermissions = ref([]);
const isButtonDisabled = ref(true); // Статус кнопки

const formDataManager = ref({
  id: "",
  name: "",
  last_name: "",
  middle_name: "",
  phone: "",
  email: "",
  points: "",
  permissions: {}
});

// Следим за вводом номера телефона и обновляем статус кнопки
watch(searchPhone, (newVal) => {
  isButtonDisabled.value = newVal.trim() === "";
});

function onInput(e) {
  searchPhone.value = e.target.value;
}

const getPermissions = async () => {
  try {
    const response = await axios.get(
      "https://crystal-motors.ru/method.getPermissions?count=all"
    );
    const permissions = response.data.answer.items;

    options.value = permissions.map((item) => item.title);
    Permissions.value = permissions;
  } catch (error) {
    console.error("Ошибка при получении разрешений:", error);
  }
};

// Функция для получения данных пользователя
const fetchUserData = async () => {
  if (!searchPhone.value) return;

  try {
    const response = await axios.get(
      `https://crystal-motors.ru/method.getUserData?phone=${encodeURIComponent(
        searchPhone.value
      )}`
    );
    if (response.data.answer) {
      const data = response.data.answer;
      formDataManager.value = {
        id: data.id,
        name: data.name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        phone: data.phone,
        email: data.email,
        points: data.points,
        permissions: data.permissions
      };

      let userPermissions = data.permissions.map((item) => item.title);
      initialPermissions.value = [...userPermissions];
      selectedPermissions.value = [...new Set(userPermissions)];
      console.log("userPermissions", selectedPermissions.value);
    } else {
      console.warn("Пользователь не найден");
    }
  } catch (error) {
    console.error("Ошибка при получении данных клиента:", error);
  }
};

// Обновление прав
const updatePermissions = async () => {
  try {
    // Определяем добавленные и удаленные права
    const addedPermissions = selectedPermissions.value.filter(
      (permission) => !initialPermissions.value.includes(permission)
    );
    const removedPermissions = initialPermissions.value.filter(
      (permission) => !selectedPermissions.value.includes(permission)
    );

    // Добавляем новые права
    for (const permissionTitle of addedPermissions) {
      const permission = Permissions.value.find(
        (perm) => perm.title === permissionTitle
      );
      if (permission) {
        const params = new URLSearchParams({
          id: formDataManager.value.id,
          type: permission.id
        }).toString();
        await axios.get(
          `https://crystal-motors.ru/method.addUserPermissions?${params}`
        );
      }
    }

    // Удаляем права
    for (const permissionTitle of removedPermissions) {
      const permission = Permissions.value.find(
        (perm) => perm.title === permissionTitle
      );
      if (permission) {
        const params = new URLSearchParams({
          id: formDataManager.value.id,
          type: permission.id
        }).toString();
        await axios.get(
          `https://crystal-motors.ru/method.deleteUserPermissions?${params}`
        );
      }
    }

    alert("Права успешно обновлены!");

    resetFields();

    fetchUserData(); // Перезагружаем данные пользователя
  } catch (error) {
    console.error("Ошибка при обновлении прав:", error);
  }
};

// Функция для очистки полей после обновления
const resetFields = () => {
  searchPhone.value = ""; // Очистка поля номера
  selectedPermissions.value = []; // Очистка выбранных прав
  initialPermissions.value = []; // Очистка начальных прав
  formDataManager.value = { id: "", name: "", last_name: "", middle_name: "", phone: "", email: "", points: "", permissions: [] };
};

onMounted(() => {
  getPermissions();
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
h1 {
  margin-top: 0;
}
.admin__container {
  width: 100%;
  //   max-width: 600px;
  display: flex;
  align-items: start;
  gap: 16px;

  input {
    width: 100%;
    max-width: 280px;
    padding: 11px 14px 11px 18px;
    border-radius: 4px;
    border: 1px solid #ffffff57;
    background-color: transparent;
    outline: none;
    color: #fff;
    transition: all 0.3s ease-in-out;
    cursor: text;

    &:focus {
      border: 1px solid #ffffff;
      background-color: transparent;

      &::placeholder {
        color: #ffffff;
      }
    }

    &::placeholder {
      color: #ffffff9c;
    }
  }

  .multiselect__tags {
    background-color: transparent !important;
    border: 1px solid #ffffff57;

    &::placeholder {
      color: #ffffff9c !important;
      border: 1px solid #fff;
    }
  }

  .multiselect__placeholder {
    color: #ffffff9c;
  }

  .multiselect__content-wrapper {
    background: #425793;
    color: #fff;
    border: 1px solid #ffffff57;
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
    background: #00a067;
    color: #fff;

    &:hover {
      background: #038a5b;
    }

    &:disabled {
      background: #7d7d7d;
      cursor: not-allowed;
    }
  }
}

.search__table {
  table {
    width: 100%;
    max-width: 600px;
    border-collapse: collapse;
    text-align: left;
    margin-top: 40px;

    thead {
      background: #7181ae;
      padding: 16px;
    }

    tbody {
      background: #425793;
    }

    tr th {
      padding: 12px;
    }

    svg {
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover path {
        fill-opacity: 1;
      }
    }
  }
}
</style>
