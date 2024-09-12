<template>
  <!-- Add new field -->
  <div v-if="showForm" class="form-fields">
    <form @submit.prevent="addClient">
      <div class="form-fields__title">
        <h2>Добавление нового поля</h2>
        <div class="form-fields__title-btns">
          <button type="submit" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

      <div class="form-fields__selects">
        <div class="w-50">
          <div class="form-fields__selects-row w-25">
            <div
              class="form-fields__select form-fields__selects-city"
              ref="cityDropdown"
            >
              <label for="city">Город:</label>
              <div class="dropdown">
                <div
                  class="dropdown-toggle"
                  @click="() => toggleDropdown('city')"
                >
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
                    v-for="city in cities"
                    :key="city"
                    @click="selectCity(city)"
                  >
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Дата:</label>
              <div class="my-calendar">
                <VDatePicker
                  mode="range"
                  :popover="{ placement: 'bottom-start' }"
                  :columns="2"
                  transparent
                  borderless
                  isDark
                  is-range
                  v-model="selectedDateRange"
                  locale="ru"
                >
                  <template #default="{ togglePopover }">
                    <a
                      style="display: block; width: auto"
                      class="data-btn data-btn-date"
                      @click="togglePopover()"
                    >
                      {{ formattedDateRange || "Выбрать" }}
                    </a>
                  </template>
                </VDatePicker>
              </div>
            </div>
          </div>

          <div class="form-fields__selects-row w-25">
            <div class="form-fields__select form-fields__selects-carMake">
              <label for="car-make">Марка авто клиента:</label>
              <!-- Brand Dropdown -->
              <div class="dropdown" @click.stop="toggleDropdown('brand')">
                <div class="dropdown-toggle">
                  <span>{{
                    selectedBrand ? selectedBrand.name : "Выбрать"
                  }}</span>
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
                <div
                  v-show="showBrandDropdown"
                  class="dropdown-menu"
                  @click.stop
                >
                  <div class="dropdown-search">
                    <input
                      type="search"
                      v-model="brandSearch"
                      @input="filterBrands"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_10598_1141)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.0083 12.815C15.0977 11.464 15.75 9.74568 15.75 7.875C15.75 3.52576 12.2242 0 7.875 0C3.52576 0 0 3.52576 0 7.875C0 12.2242 3.52576 15.75 7.875 15.75C9.74568 15.75 11.464 15.0977 12.815 14.0083L16.7847 17.9778L17.9778 16.7847L14.0083 12.815ZM7.875 14.0625C11.2923 14.0625 14.0625 11.2923 14.0625 7.875C14.0625 4.45773 11.2923 1.6875 7.875 1.6875C4.45773 1.6875 1.6875 4.45773 1.6875 7.875C1.6875 11.2923 4.45773 14.0625 7.875 14.0625Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10598_1141">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div class="dropdown-items">
                    <div
                      v-for="brand in filteredBrands"
                      :key="brand.id"
                      class="dropdown-item"
                      @click.stop="selectBrand(brand)"
                    >
                      {{ brand.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-carModel">
              <label for="car-model">Модель автомобиля:</label>
              <!-- Model Dropdown -->
              <div class="dropdown" @click.stop="toggleDropdown('model')">
                <div class="dropdown-toggle">
                  <span>{{
                    selectedModel ? selectedModel.name : "Выбрать"
                  }}</span>
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
                <div
                  v-show="showModelDropdown"
                  class="dropdown-menu dropdown-menu-model"
                  @click.stop
                >
                  <div class="dropdown-items">
                    <div
                      v-for="model in filteredModels"
                      :key="model.id"
                      class="dropdown-item"
                      @click.stop="selectModel(model)"
                    >
                      {{ model.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-fields__selects-row row-1">
          <div class="row-2">
            <div class="form-fields__select form-fields__selects-city">
              <label for="manager">Менеджер:</label>

              <div class="dropdown" @click.stop="toggleDropdown('manager')">
                <div class="dropdown-toggle">
                  <!-- Отображаем выбранного менеджера или "Выбрать" по умолчанию -->
                  <span>{{ selectedManager || "Выбрать" }}</span>
                  <span class="dropdown-arrow">
                    <!-- SVG стрелка -->
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
                <div
                  v-show="showManagerDropdown"
                  class="dropdown-menu"
                  @click.stop
                >
                  <div class="dropdown-items">
                    <div
                      v-for="(manager, index) in managers"
                      :key="index"
                      class="dropdown-item"
                      @click.stop="selectManager(manager)"
                    >
                      {{ manager }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Телефон клиента:</label>

              <MaskInput
                v-model="formData2.phone"
                mask="+7 (###) ###-##-##"
                placeholder="Телефон"
              />
            </div>

            <div class="form-fields__select form-fields__selects-city">
              <label for="city">ФИО клиента:</label>
              <input
                type="text"
                placeholder="Введите ФИО"
                v-model="formData2.fio"
              />
            </div>
          </div>

          <div class="form-fields__select form-fields__selects-callComment">
            <label for="call-comment">Комментарий по звонку:</label>
            <textarea v-model="formData2.comment" placeholder="Комментарий" />
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
                v-model="formData2.fact"
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
                v-model="formData2.fact"
                name="fact-call"
                value="0.5"
              />
              <label for="test2">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test3"
                v-model="formData2.fact"
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
                v-model="formData2.obrashenie"
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
                v-model="formData2.obrashenie"
                name="obrashenie"
                value="0.5"
              />
              <label for="test5">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test6"
                v-model="formData2.obrashenie"
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
                v-model="formData2.salon"
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
                v-model="formData2.salon"
                name="salon"
                value="0.5"
              />
              <label for="test8">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test9"
                v-model="formData2.salon"
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
                v-model="formData2.cred_nal"
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
                v-model="formData2.cred_nal"
                name="cred_nal"
                value="0.5"
              />
              <label for="test11">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test12"
                v-model="formData2.cred_nal"
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
                v-model="formData2.prodan"
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
                v-model="formData2.prodan"
                name="prodan"
                value="0.5"
              />
              <label for="test14">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test15"
                v-model="formData2.prodan"
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
                v-model="formData2.city"
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
                v-model="formData2.city"
                name="city"
                value="0.5"
              />
              <label for="test17">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test18"
                v-model="formData2.city"
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
                v-model="formData2.otpr_viz"
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
                v-model="formData2.otpr_viz"
                name="otpr_viz"
                value="0.5"
              />
              <label for="test20">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test21"
                v-model="formData2.otpr_viz"
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
                v-model="formData2.data_visit"
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
                v-model="formData2.data_visit"
                name="data_visit"
                value="0.5"
              />
              <label for="test23">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test24"
                v-model="formData2.data_visit"
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
                v-model="formData2.vizit"
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
                v-model="formData2.vizit"
                name="vizit"
                value="0.5"
              />
              <label for="test26">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test27"
                v-model="formData2.vizit"
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
                v-model="formData2.garantiya"
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
                v-model="formData2.garantiya"
                name="garantiya"
                value="0.5"
              />
              <label for="test29">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test30"
                v-model="formData2.garantiya"
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
                v-model="formData2.prod_company"
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
                v-model="formData2.prod_company"
                name="prod_company"
                value="0.5"
              />
              <label for="test32">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test33"
                v-model="formData2.prod_company"
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
                v-model="formData2.obrash_imeni"
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
                v-model="formData2.obrash_imeni"
                name="obrash_imeni"
                value="0.5"
              />
              <label for="test35">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test36"
                v-model="formData2.obrash_imeni"
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
            <div>
              <input
                type="radio"
                id="test37"
                v-model="formData2.zdatok"
                name="zdatok"
                checked
                value="0"
              />
              <label for="test37">0</label>
            </div>
            <div>
              <input
                type="radio"
                id="test38"
                v-model="formData2.zdatok"
                name="zdatok"
                value="0.5"
              />
              <label for="test38">0.5</label>
            </div>
            <div>
              <input
                type="radio"
                id="test39"
                v-model="formData2.zdatok"
                name="zdatok"
                value="1"
              />
              <label for="test39">1</label>
            </div>
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
                v-model="formData2.bodr_son"
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
                v-model="formData2.bodr_son"
                name="bodr_son"
                value="0.5"
              />
              <label for="test41">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test42"
                v-model="formData2.bodr_son"
                name="bodr_son"
                value="1"
              />
              <label for="test42">1</label>
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
  <!-- END add new field -->

  <!-- Edit form -->
  <div v-else-if="showFormEdit" class="form-fields">
    <form @submit.prevent="updateClient">
      <div class="form-fields__title">
        <h2>Редактирование поля</h2>
        <div class="form-fields__title-btns">
          <button type="submit" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

      <div class="form-fields__selects">
        <div class="w-50">
          <div class="form-fields__selects-row w-25">
            <div
              class="form-fields__select form-fields__selects-city"
              ref="cityDropdown"
            >
              <label for="city">Город:</label>
              <div class="dropdown">
                <div
                  class="dropdown-toggle"
                  @click="() => toggleDropdown('city')"
                >
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
                    v-for="city in cities"
                    :key="city"
                    @click="selectCity(city)"
                  >
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Дата:</label>
              <div class="my-calendar">
                <VDatePicker
                  mode="range"
                  :popover="{ placement: 'bottom-start' }"
                  :columns="2"
                  transparent
                  borderless
                  isDark
                  is-range
                  @update:modelValue="updateDateRange" 
                  locale="ru"
                >
                  <template #default="{ togglePopover }">
                    <a
                      style="display: block; width: auto"
                      class="data-btn data-btn-date"
                      @click="togglePopover()"
                    >
                      {{ formattedDateRange || "Выбрать" }}
                    </a>
                  </template>
                </VDatePicker>
              </div>
            </div>
          </div>

          <div class="form-fields__selects-row w-25">
            <div class="form-fields__select form-fields__selects-carMake">
              <label for="car-make">Марка авто клиента:</label>
              <!-- Brand Dropdown -->
              <div class="dropdown" @click.stop="toggleDropdown('brand')">
                <div class="dropdown-toggle">
                  <span>{{
                    selectedBrand ? selectedBrand.name : "Выбрать"
                  }}</span>
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
                <div
                  v-show="showBrandDropdown"
                  class="dropdown-menu"
                  @click.stop
                >
                  <div class="dropdown-search">
                    <input
                      type="search"
                      v-model="brandSearch"
                      @input="filterBrands"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_10598_1141)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.0083 12.815C15.0977 11.464 15.75 9.74568 15.75 7.875C15.75 3.52576 12.2242 0 7.875 0C3.52576 0 0 3.52576 0 7.875C0 12.2242 3.52576 15.75 7.875 15.75C9.74568 15.75 11.464 15.0977 12.815 14.0083L16.7847 17.9778L17.9778 16.7847L14.0083 12.815ZM7.875 14.0625C11.2923 14.0625 14.0625 11.2923 14.0625 7.875C14.0625 4.45773 11.2923 1.6875 7.875 1.6875C4.45773 1.6875 1.6875 4.45773 1.6875 7.875C1.6875 11.2923 4.45773 14.0625 7.875 14.0625Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10598_1141">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div class="dropdown-items">
                    <div
                      v-for="brand in filteredBrands"
                      :key="brand.id"
                      class="dropdown-item"
                      @click.stop="selectBrand(brand)"
                    >
                      {{ brand.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-carModel">
              <label for="car-model">Модель автомобиля:</label>
              <!-- Model Dropdown -->
              <div class="dropdown" @click.stop="toggleDropdown('model')">
                <div class="dropdown-toggle">
                  <span>{{
                    selectedModel ? selectedModel.name : "Выбрать"
                  }}</span>
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
                <div
                  v-show="showModelDropdown"
                  class="dropdown-menu dropdown-menu-model"
                  @click.stop
                >
                  <div class="dropdown-items">
                    <div
                      v-for="model in filteredModels"
                      :key="model.id"
                      class="dropdown-item"
                      @click.stop="selectModel(model)"
                    >
                      {{ model.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-fields__selects-row row-1">
          <div class="row-2">
            <div class="form-fields__select form-fields__selects-city">
              <label for="city">Менеджер:</label>

              <div class="dropdown" @click.stop="toggleDropdown('manager')">
                <div class="dropdown-toggle">
                  <span>{{
                    selectedManager ? selectedManager : "Выбрать"
                  }}</span>
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
                <div
                  v-show="showManagerDropdown"
                  class="dropdown-menu"
                  @click.stop
                >
                  <div class="dropdown-items">
                    <div
                      v-for="(manager, index) in managers"
                      :key="index"
                      class="dropdown-item"
                      @click.stop="selectManager(manager)"
                    >
                      {{ manager }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Телефон клиента:</label>

              <MaskInput
                v-model="formData2.phone"
                mask="+7 (###) ###-##-##"
                placeholder="Телефон"
              />
            </div>

            <div class="form-fields__select form-fields__selects-city">
              <label for="city">ФИО клиента:</label>
              <input
                type="text"
                placeholder="Введите ФИО"
                v-model="formData2.fio"
              />
            </div>
          </div>

          <div class="form-fields__select form-fields__selects-callComment">
            <label for="call-comment">Комментарий по звонку:</label>
            <textarea v-model="formData2.comment" placeholder="Комментарий" />
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
                v-model="formData2.fact"
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
                v-model="formData2.fact"
                name="fact-call"
                value="0.5"
              />
              <label for="test2">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test3"
                v-model="formData2.fact"
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
                v-model="formData2.obrashenie"
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
                v-model="formData2.obrashenie"
                name="obrashenie"
                value="0.5"
              />
              <label for="test5">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test6"
                v-model="formData2.obrashenie"
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
            <div>
              <input
                type="radio"
                id="test7"
                v-model="formData2.salon"
                name="salon"
                checked
                value="0"
              />
              <label for="test7">0</label>
            </div>
            <div>
              <input
                type="radio"
                id="test8"
                v-model="formData2.salon"
                name="salon"
                value="0.5"
              />
              <label for="test8">0.5</label>
            </div>
            <div>
              <input
                type="radio"
                id="test9"
                v-model="formData2.salon"
                name="salon"
                value="1"
              />
              <label for="test9">1</label>
            </div>
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
                v-model="formData2.cred_nal"
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
                v-model="formData2.cred_nal"
                name="cred_nal"
                value="0.5"
              />
              <label for="test11">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test12"
                v-model="formData2.cred_nal"
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
                v-model="formData2.prodan"
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
                v-model="formData2.prodan"
                name="prodan"
                value="0.5"
              />
              <label for="test14">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test15"
                v-model="formData2.prodan"
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
                v-model="formData2.city"
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
                v-model="formData2.city"
                name="city"
                value="0.5"
              />
              <label for="test17">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test18"
                v-model="formData2.city"
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
                v-model="formData2.otpr_viz"
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
                v-model="formData2.otpr_viz"
                name="otpr_viz"
                value="0.5"
              />
              <label for="test20">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test21"
                v-model="formData2.otpr_viz"
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
                v-model="formData2.data_visit"
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
                v-model="formData2.data_visit"
                name="data_visit"
                value="0.5"
              />
              <label for="test23">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test24"
                v-model="formData2.data_visit"
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
                v-model="formData2.vizit"
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
                v-model="formData2.vizit"
                name="vizit"
                value="0.5"
              />
              <label for="test26">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test27"
                v-model="formData2.vizit"
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
                v-model="formData2.garantiya"
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
                v-model="formData2.garantiya"
                name="garantiya"
                value="0.5"
              />
              <label for="test29">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test30"
                v-model="formData2.garantiya"
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
                v-model="formData2.prod_company"
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
                v-model="formData2.prod_company"
                name="prod_company"
                value="0.5"
              />
              <label for="test32">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test33"
                v-model="formData2.prod_company"
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
                v-model="formData2.obrash_imeni"
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
                v-model="formData2.obrash_imeni"
                name="obrash_imeni"
                value="0.5"
              />
              <label for="test35">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test36"
                v-model="formData2.obrash_imeni"
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
                v-model="formData2.zdatok"
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
                v-model="formData2.zdatok"
                name="zdatok"
                value="0.5"
              />
              <label for="test38">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test39"
                v-model="formData2.zdatok"
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
                v-model="formData2.bodr_son"
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
                v-model="formData2.bodr_son"
                name="bodr_son"
                value="0.5"
              />
              <label for="test41">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test42"
                v-model="formData2.bodr_son"
                name="bodr_son"
                value="1"
              />
              <label for="test42">1</label>
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
  <!-- END edit form -->

  <div v-else class="table-container">
    <h2>Все города</h2>
    <div class="filters">
      <div class="filters__btns">
        <button @click="toggleForm" class="btn btn-green">
          <img src="/add-iconn.svg" alt="icon" /> Добавить поле
        </button>

        <button @click="downloadTable" class="btn btn-blue">
          <img src="/add-iconn.svg" alt="icon" /> Скачать таблицу
        </button>
      </div>
      <Filter />
    </div>

    <!-- Edit Form -->
    <!-- <div>
      <form @submit.prevent="updateClient">
        <input v-model="formData2.city" placeholder="City" />
        <input v-model="formData2.date" placeholder="Date" />
        <input v-model="formData2.manager" placeholder="Manager" />
        <input v-model="formData2.phone" placeholder="Phone" />
        <input v-model="formData2.fio" placeholder="FIO" />
        <input v-model="formData2.avto" placeholder="Auto" />
        <input v-model="formData2.fact" placeholder="Fact" />
        <input v-model="formData2.obrashenie" placeholder="Address" />
        <input v-model="formData2.salon" placeholder="Salon" />
        <input v-model="formData2.cred_nal" placeholder="Credit/Cash" />
        <input v-model="formData2.prodan" placeholder="Sold" />
        <input v-model="formData2.data_visit" placeholder="Visit Date" />
        <input v-model="formData2.garantiya" placeholder="Warranty" />
        <input v-model="formData2.obrash_imeni" placeholder="Name Addressed" />
        <input v-model="formData2.bodr_son" placeholder="State" />
        <input v-model="formData2.otpr_viz" placeholder="Sent Invitation" />
        <input v-model="formData2.vizit" placeholder="Visit" />
        <input v-model="formData2.prod_company" placeholder="Company Sold" />
        <input v-model="formData2.zdatok" placeholder="Advance" />
        <input v-model="formData2.itog" placeholder="Total" />
        <input v-model="formData2.plan" placeholder="Plan" />
        <textarea v-model="formData2.comment" placeholder="Comment"></textarea>
        <button type="submit">Сохранить</button>
        <button @click="isEditing.value = false">Отмена</button>
      </form>
    </div> -->

    <div @scroll="handleScroll" class="tablee">
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
          <!-- <tr v-for="row in filteredRows" :key="row.id">
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
            <td>{{ entry.index }}</td>
            <td>{{ entry.carMakes }}</td>
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
            <td id="edit-form">
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
          </tr> -->

          <!-- <tr v-for="(row, index) in tableData2" :key="index">
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
            <td>
              <svg
                @click="deleteClient(row.id)"
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
          </tr> -->

          <tr v-for="client in loadedData" :key="client.id">
            <td>{{ client.id }}</td>
            <td>{{ client.city }}</td>
            <td>{{ client.date }}</td>
            <!-- <td>{{ formattedDateRange || 'Не выбрано' }}</td> -->
            <td>{{ client.manager }}</td>
            <td>{{ client.phone }}</td>
            <td>{{ client.fio }}</td>
            <td>{{ client.avto }}</td>
            <td>{{ client.fact }}</td>
            <td>{{ client.obrashenie }}</td>
            <td>{{ client.salon }}</td>
            <td>{{ client.cred_nal }}</td>
            <td>{{ client.prodan }}</td>
            <td>{{ client.city2 }}</td>
            <td>{{ client.data_visit }}</td>
            <td>{{ client.garantiya }}</td>
            <td>{{ client.obrash_imeni }}</td>
            <td>{{ client.bodr_son }}</td>
            <td>{{ client.otpr_viz }}</td>
            <td>{{ client.vizit }}</td>
            <td>{{ client.prod_company }}</td>
            <td>{{ client.zdatok }}</td>
            <td>{{ client.itog }}</td>
            <td>{{ client.plan }}</td>
            <td>{{ client.comment }}</td>
            <td style="display: flex">
              <!-- <button
                @click="
                  () => {
                    console.log('Редактирование клиента:', client);
                    editClient(client);
                  }
                "
              > -->
              <div @click="editClient(client)" class="edit-icon-block">
                <svg
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
              </div>
              <button
                class="delete-icon-block"
                @click="() => deleteClient(client.id)"
              >
                Удалить
              </button>
            </td>
          </tr>

          <tr v-if="loadedData.length === 0">
            <td colspan="2">Данных нет</td>
          </tr>
        </tbody>
        <!-- Table footer -->
        <tfoot>
          <tr>
            <td colspan="10">
              <p style="text-transform: uppercase">Итоговые значения</p>
            </td>
            <td colspan="10">
              <p>Сумма звонков: {{ totalItems2 }}</p>
            </td>
            <td colspan="25">
              <p>Средний процент по выполнению плана: {{ totalItems3 }}</p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  defineEmits,
  defineProps,
  watchEffect
} from "vue";
import * as XLSX from "xlsx";
import "@vuepic/vue-datepicker/dist/main.css";
import "v-calendar/style.css";
import { MaskInput } from "vue-3-mask";
import axios from "axios";
import Filter from "../filters/Filter.vue";

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
const showFormEdit = ref(false);

const formData = ref({
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
  city2: "",
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

const toggleForm = () => {
  showForm.value = !showForm.value;
  showFormEdit.value = !showFormEdit.value;
};

const cities = ["Тюмень", "Пермь", "Челябинск", "Санкт-Петербург"];
const managers = [
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
];

const saveForm = () => {
  // Add the form data to the table
  tableData.value.push({ ...formData.value });
  console.log(tableData.value);

  // Clear the form data
  formData.value = {
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
    city2: "",
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
  };

  showForm.value = false;
};

const cancelForm = () => {
  showForm.value = false;
  showFormEdit.value = false;
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

// Handler for when the region changes
const onRegionChange = () => {
  selectedCity.value = ""; // Reset city selection when the region changes
};

// Реактивное состояние для выбранного диапазона дат
const selectedDateRange = ref({
  start: null, // Начальная дата
  end: null // Конечная дата
});

// Компьютед для форматирования диапазона дат
const formattedDateRange = computed(() => {
  const { start, end } = selectedDateRange.value;

  console.log("Выбранный диапазон дат:", start, end);

  if (!start || !end) return null; // Если дата не выбрана, возвращаем null

  // Функция для форматирования даты в нужный вид (dd.mm.yyyy)
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Преобразуем строку в объект даты
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Возвращаем диапазон дат в нужном формате
  return `${formatDate(start)} до ${formatDate(end)}`;
});

// Computed property to filter rows based on selected date range
const filteredRows = computed(() => {
  if (!selectedDateRange.value.start || !selectedDateRange.value.end) {
    return rows.value; // Return all rows if no date range is selected
  }

  // Convert selected date range to timestamps for easy comparison
  const start = new Date(selectedDateRange.value.start).getTime();
  const end = new Date(selectedDateRange.value.end).getTime();

  // Filter rows based on the date range
  return rows.value.filter((row) => {
    const rowDate = new Date(row.date.split(".").reverse().join("-")).getTime();
    return rowDate >= start && rowDate <= end;
  });
});

// Состояние дропдаунов
const showBrandDropdown = ref(false);
const showModelDropdown = ref(false);
const showManagerDropdown = ref(false);

const showCityDropdown = ref(false);
const selectedCity = ref("");
const cityDropdown = ref(null);

const selectedBrand = ref(null);
const selectedModel = ref(null);
const selectedManager = ref(null);

const brandSearch = ref("");
const carsData = ref([]);

const filteredBrands = ref([]);
const filteredModels = ref([]);

// Фильтрация брендов
function filterBrands() {
  const searchText = brandSearch.value.toLowerCase();
  filteredBrands.value = carsData.value.filter((brand) =>
    (brand.name || "").toLowerCase().includes(searchText)
  );
}

// Fetch data
fetch("https://raw.githubusercontent.com/blanzh/carsBase/master/cars.json")
  .then((response) => response.json())
  .then((data) => {
    carsData.value = data;
    filteredBrands.value = data;
  })
  .catch((error) => console.error("Ошибка загрузки данных:", error));

// Выбор бренда
function selectBrand(brand) {
  selectedBrand.value = brand;
  showBrandDropdown.value = false;
  showModelDropdown.value = false;
  formData2.value.avto = brand ? brand.name : "";
}

// Выбор модели
function selectModel(model) {
  selectedModel.value = model;
  showModelDropdown.value = false;
}

// Функция для выбора менеджера
const selectManager = (manager) => {
  selectedManager.value = manager; // Устанавливаем выбранного менеджера
  showManagerDropdown.value = false; // Закрываем дропдаун после выбора
  formData2.value.manager = manager ? manager : "";
};

// Переключение видимости дропдаунов
function toggleDropdown(type) {
  if (type === "brand") {
    showBrandDropdown.value = !showBrandDropdown.value;
    showModelDropdown.value = false;
    showManagerDropdown.value = false;
  } else if (type === "model") {
    showModelDropdown.value = !showModelDropdown.value;
    showBrandDropdown.value = false;
    showManagerDropdown.value = false;
  } else if (type === "manager") {
    showManagerDropdown.value = !showManagerDropdown.value;
    showBrandDropdown.value = false;
    showModelDropdown.value = false;
  } else if (type === "city") {
    showCityDropdown.value = !showCityDropdown.value;
    showBrandDropdown.value = false;
    showModelDropdown.value = false;
    showManagerDropdown.value = false;
  }
}

// Обработчик выбора города
const selectCity = (city) => {
  selectedCity.value = city;
  showCityDropdown.value = false;
  formData2.value.city = city ? city : "";
};

// Обработчик кликов вне области дропдауна
const handleClickOutside = (event) => {
  if (cityDropdown.value && !cityDropdown.value.contains(event.target)) {
    showCityDropdown.value = false;
  }
};

// Добавление и удаление обработчика событий
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Данные и состояние
const tableData2 = ref([]); // Все данные с сервера
const tableData3 = ref([]); // Все данные с сервера
const loadedData = ref([]); // Отображаемые данные (загружаются постепенно)
const itemsPerPage = 20; // Количество записей для загрузки за раз
const currentPage = ref(0); // Текущая страница данных
const totalItems = ref(0); // Общее количество записей
const totalItems2 = ref(0);
const totalItems3 = ref(0);
const isLoading = ref(false); // Состояние загрузки

// Функция загрузки данных
const loadMoreData = () => {
  if (isLoading.value || loadedData.value.length >= totalItems.value) return; // Предотвращаем повторные запросы и проверяем, не загружены ли все данные

  isLoading.value = true; // Устанавливаем состояние загрузки в true
  const offset = currentPage.value * itemsPerPage;

  // Получаем данные для следующей порции
  fetchClients(offset).finally(() => {
    isLoading.value = false; // Устанавливаем состояние загрузки в false после завершения
  });
};

// Функция обработки события прокрутки
const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target;

  // Загружаем больше данных при прокрутке вниз
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadMoreData();
  }
};

watch(tableData2, (newData) => {
  loadedData.value = newData.slice(0, (currentPage.value + 1) * itemsPerPage);
});

const calculateAveragePlan = () => {
  if (tableData3.value.length === 0) {
    totalItems3.value = 0;
    return;
  }

  const totalPlan = tableData3.value.reduce(
    (sum, plan) => sum + (parseFloat(plan.plan) || 0),
    0
  );
  totalItems3.value = (totalPlan / tableData3.value.length).toFixed(2); // Средний процент, округленный до двух знаков после запятой
};

// Функция для получения общего количества записей
const fetchTotalItems = async () => {
  try {
    const response = await axios.get(
      `https://crystal-motors.ru/method.getClients?count=100000`
    );
    console.log("Общее количество записей:", response);
    totalItems2.value = response.data.answer.count;
    tableData3.value = response.data.answer.items;
    console.log("Общее количество записей:", totalItems2.value);
  } catch (error) {
    console.error(
      "Ошибка при получении общего количества записей:",
      error.message
    );
    // Выводим дополнительную информацию об ошибке
    console.error("Детали ошибки:", error.response?.data || error.message);
  }
};

// Функция для получения данных клиентов и их обработки
const fetchClients = async (offset = 0) => {
  try {
    const response = await axios.get(
      `https://crystal-motors.ru/method.getClients?count=${itemsPerPage}&offset=${offset}&order=id_desc`
    );
    const newData = response.data.answer.items;
    tableData2.value = [...tableData2.value, ...newData]; // Обновляем все данные
    totalItems.value = response.data.answer.total; // Обновляем общее количество записей

    // Загружаем следующую порцию данных
    const start = currentPage.value * itemsPerPage;
    const end = start + itemsPerPage;
    const nextPageData = tableData2.value.slice(start, end);

    // Проверяем, есть ли данные для загрузки
    if (nextPageData.length > 0) {
      loadedData.value = [...loadedData.value, ...nextPageData];
      currentPage.value++;
    }
  } catch (error) {
    console.error("Ошибка при получении данных клиентов:", error);
  }
};

// Запрос данных при монтировании компонента
onMounted(async () => {
  await fetchTotalItems(); // Получаем общее количество записей при монтировании
  calculateAveragePlan(); // Рассчитываем средний процент после обновления данных
  loadMoreData(); // Загружаем первую порцию данных при монтировании
});

// Состояние данных
const formData2 = ref({
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
  city2: "",
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
const isEditing = ref(false);
const currentClientId = ref(null);

// Объединенное слежение за изменениями selectedBrand и selectedModel
watchEffect(() => {
  if (selectedBrand.value) {
    // Если выбран бренд, добавляем его имя в formData2.avto
    formData2.value.avto = selectedBrand.value.name;

    // Если также выбрана модель, добавляем ее имя
    if (selectedModel.value) {
      formData2.value.avto += " " + selectedModel.value.name;
    }
  } else {
    // Если бренд не выбран, сбрасываем значение
    formData2.value.avto = "";
  }

  // Обновление filteredModels на основе выбранного бренда
  filteredModels.value = selectedBrand.value ? selectedBrand.value.models : [];

  console.log("Updated formData2.avto:", formData2.value.avto);
});

// Функция для отправки данных (добавление или обновление)
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await axios.get(
        `http://localhost:3000/clients/${currentClientId.value}`,
        formData2.value
      );
      alert("Данные успешно обновлены!");
    } else {
      await axios.post("http://localhost:3000/clients", formData2.value);
      alert("Данные успешно добавлены!");
    }

    isEditing.value = false;
    fetchClients();
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
  }
};

const addClient = async () => {
  try {
    console.log("Добавление нового клиента:", formData2.value);

    // Создаем строку параметров из данных формы
    const params = new URLSearchParams(formData2.value).toString();

    // Отправляем запрос на сервер
    await axios.get(`https://crystal-motors.ru/method.addClient?${params}`);

    alert("Данные успешно добавлены!");

    // Очищение текущие данные таблицы перед обновлением
    tableData2.value = [];
    loadedData.value = [];
    currentPage.value = 0; // Сброс страницы на первую

    // Вызовите функцию для обновления списка клиентов
    await fetchClients();

    // Закройте формы после обновления
    showForm.value = !showForm.value;
    showFormEdit.value = !showFormEdit.value;
  } catch (error) {
    console.error("Ошибка при добавлении данных клиента:", error);
  }
};

const editClient = (client) => {
  if (client) {
    showFormEdit.value = !showFormEdit.value;
    formData2.value = { ...client }; // Клонируем данные клиента в formData2
    console.log("Редактирование клиента:", formData2.value);

    // Форматируем номер телефона
    formData2.value.phone = formatPhoneNumber(client.phone);

    isEditing.value = true; // Открываем форму редактирования
    currentClientId.value = client.id; // Устанавливаем текущий ID клиента
  } else {
    console.error("Не удалось загрузить данные клиента.");
  }
};

const formatPhoneNumber = (phone) => {
  // Приводим номер к формату +7 (###) ###-##-##
  if (!phone) return "";

  // Удаляем все символы, кроме цифр
  phone = phone.replace(/[^\d]/g, "");

  // Добавляем "+7" если нет кода страны
  if (!phone.startsWith("7")) {
    phone = "7" + phone;
  }

  // Форматируем номер в виде +7 (###) ###-##-##
  return `+${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(
    4,
    7
  )}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`;
};

const updateClient = async () => {
  try {
    console.log("Обновление клиента с ID:", currentClientId.value);
    console.log("Обновление клиента с ID:", formData2.value);

    // Убедитесь, что URL и метод правильно настроены на сервере
    await axios.get(
      `https://crystal-motors.ru/method.editClient?id=${
        currentClientId.value
      }&${new URLSearchParams(formData2.value).toString()}`
    );
    console.log(new URLSearchParams(formData2.value).toString());
    alert("Данные успешно обновлены!");
    // Очищение текущие данные таблицы перед обновлением
    tableData2.value = [];
    loadedData.value = [];
    currentPage.value = 0; // Сброс страницы на первую

    // Вызовите функцию для обновления списка клиентов
    await fetchClients();

    showFormEdit.value = false;
    isEditing.value = false; // Закрыть форму редактирования
  } catch (error) {
    console.error("Ошибка при обновлении данных клиента:", error);
  }
};

// Функция для удаления клиента
const deleteClient = async (id) => {
  try {
    console.log("Удаление клиента с ID:", id);
    await axios.get(`https://crystal-motors.ru/method.deleteClient?id=${id}`); // Исправленный URL
    alert("Данные успешно удалены!");

    // Очищение текущие данные таблицы перед обновлением
    tableData2.value = [];
    loadedData.value = [];
    currentPage.value = 0; // Сброс страницы на первую

    // Вызовите функцию для обновления списка клиентов
    await fetchClients();
  } catch (error) {
    console.error("Ошибка при удалении данных:", error);
  }
};

// Автоматическая загрузка данных при инициализации компонента
onMounted(fetchClients);
</script>

<style scoped lang="scss">
body {
  font-family: Arial, sans-serif;
  background-color: #425793;
}
.dropdown-srch .dropdown-menu {
  overflow: hidden;
}

.my-calendar :deep(.vc-header .vc-title),
.my-calendar :deep(.vc-header .vc-arrow) {
  background: transparent !important;
}

.my-calendar :deep(.vc-container) {
  background-color: #092d7d;
  border-radius: 8px;
}

.my-calendar :deep(.vc-popover-content.direction-bottom) {
  background-color: #092d7d;
  border-color: #fff;
}

.my-calendar :deep(.vc-nav-container button) {
  background: transparent;
  color: #fff;
}

.my-calendar :deep(.vc-bordered) {
  border-color: #fff;
}

.calendar-container {
  position: relative;
}

.calendar-button {
  margin: 10px;
}

.calendar-popup {
  position: absolute;
  top: 40px;
  z-index: 100;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
@import url("./table.scss");
</style>
