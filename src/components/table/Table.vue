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
                    v-for="cityy in cities"
                    :key="cityy"
                    @click="selectCity(cityy)"
                  >
                    {{ cityy }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Дата:</label>
              <div class="my-calendar">
                <VueDatePicker
                  v-model="date"
                  :format="format2"
                  locale="ru-RU"
                  dark
                  multi-calendars
                  placeholder="За всё время"
                  @update:model-value="updatedataRange"
                >
                </VueDatePicker>
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
                      v-for="(manager, index) in filteredManagers"
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
                mask="7##########"
                placeholder="Телефон"
                v-model="formData2.phone"
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
            <textarea
              id="call-comment"
              :title="formData2.comment || ''"
              v-model="formData2.comment"
              placeholder="Комментарий"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="checkboxes__container">
        <div class="checkboxes__container-row">
          <label for="fact-call">Факт звонка:</label>
          <div class="radio-group fact">
            <p class="fact-checkbox">
              <input
                type="radio"
                id="test1"
                name="fact-call"
                value="1"
                
              />
              <label for="test3">1</label>
            </p>
            <p class="fact-checkbox">
              <input
                type="checkbox"
                id="test2"
                v-model="formData2.fact"
                name="fact-call"
                value=""
              />
              <label for="test2">Не учитывать в расчетах</label>
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
          <label for="city2">Вы из Тюмени, Перми, Челябинска и т.д.?</label>
          <div class="radio-group">
            <p>
              <input
                type="radio"
                id="test16"
                v-model="formData2.city2"
                name="city2"
                
                value="0"
              />
              <label for="test16">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test17"
                v-model="formData2.city2"
                name="city2"
                value="0.5"
              />
              <label for="test17">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test18"
                v-model="formData2.city2"
                name="city2"
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
        <div class="checkboxes__container-row" style="justify-content: center">
          <button type="submit" class="btn btn-green">Сохранить</button>
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
                    v-for="cityy in cities"
                    :key="cityy"
                    @click="selectCity(cityy)"
                  >
                    {{ cityy }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-fields__select form-fields__selects-manager">
              <label for="manager">Дата:</label>
              <div class="my-calendar">
                <VueDatePicker
                  v-model="date"
                  :format="format2"
                  locale="ru-RU"
                  dark
                  multi-calendars
                  placeholder="За всё время"
                  @update:model-value="updatedataRange"
                >
                </VueDatePicker>
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
                      v-for="(manager, index) in filteredManagers"
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
                mask="7##########"
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
          <div class="radio-group fact">
            <p class="fact-checkbox">
              <input
                type="radio"
                id="test1"
                name="fact-call"
                value="1"
                
              />
              <label for="test3">1</label>
            </p>
            <p class="fact-checkbox">
              <input
                type="checkbox"
                id="test2"
                v-model="formData2.fact"
                name="fact-call"
                value="0"
              />
              <label for="test2">Не учитывать в расчетах</label>
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
                v-model="formData2.city2"
                name="city"
                
                value="0"
              />
              <label for="test16">0</label>
            </p>
            <p>
              <input
                type="radio"
                id="test17"
                v-model="formData2.city2"
                name="city"
                value="0.5"
              />
              <label for="test17">0.5</label>
            </p>
            <p>
              <input
                type="radio"
                id="test18"
                v-model="formData2.city2"
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

        <div class="checkboxes__container-row" style="justify-content: center">
          <button type="submit" class="btn btn-green">Сохранить</button>
        </div>
      </div>
    </form>
  </div>
  <!-- END edit form -->

  <!-- Form new manager -->
  <div v-else-if="showFormManager" class="form-fields">
    <form @submit.prevent="addManager">
      <div class="form-fields__title">
        <h2>Добавление нового менеджера</h2>
        <div class="form-fields__title-btns">
          <button type="submit" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

      <div class="add__manager form-fields__selects">
        <div
          class="form-fields__select form-fields__selects-city"
          ref="cityDropdown"
        >
          <label for="city">Город:</label>
          <div class="dropdown">
            <div class="dropdown-toggle" @click="() => toggleDropdown('city')">
              <span>{{ selectedCity2 || "Выберите город" }}</span>
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
                v-for="cityy in cities2"
                :key="cityy"
                @click="selectCity2(cityy)"
              >
                {{ cityy }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="form-fields__select form-fields__selects-city"
          ref="managerDropdown"
        >
          <label for="manager">ФИО менеджера:</label>
          <input
            type="text"
            placeholder="Введите ФИО"
            v-model="newManager"
          />
        </div>
      </div>
    </form>
  </div>
  <!-- END form new manager -->

  <div v-else class="table-container">
    <h2>Все города</h2>
    <div class="filters">
      <div class="filters__btns">
        <div class="filters__btns-btns">
          <button v-if="isAdd" @click="toggleForm" class="btn btn-green">
            <img src="/add-iconn.svg" alt="icon" /> Добавить поле
          </button>

          <!-- <button
            v-if="isAdd"
            @click="toggleFormManager"
            class="btn btn-manager"
          >
            <img src="/add-iconn.svg" alt="icon" /> Добавить менеджера
          </button> -->
        </div>

        <button @click="downloadTable" class="btn btn-blue">
          <img src="/add-iconn.svg" alt="icon" /> Скачать таблицу
        </button>
      </div>
      <Filter @filterChange="handleDateChange" />
    </div>

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
            <th v-if="isEdit">Ред.</th>
          </tr>
        </thead>
        <!-- Table body -->
        <tbody>
          <tr v-for="client in filteredData" :key="client.id">
            <td>{{ client.id }}</td>
            <td>{{ client.city }}</td>
            <td>{{ client.date }}</td>
            <td>{{ client.manager }}</td>
            <td>{{ client.phone }}</td>
            <td>{{ client.fio }}</td>
            <td>{{ client.avto }}</td>
            <td>{{ client.fact.one ? 1 : 1 }}</td>
            <!-- <td>{{ client.fact }}</td> -->
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
            <td>{{ client.plan }}%</td>
            <td :title="client.comment || 'нет коммента'">
              {{ client.comment }}
            </td>
            <td v-if="isEdit" style="display: flex; align-items: center">
              <div @click="editClient(client)" class="edit-icon-block">
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
              </div>

              <img
                class="delete-icon-block"
                title="Удалить"
                @click="() => deleteClient(client.id)"
                src="../../assets/icons8-delete.svg"
                alt="delete"
              />
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="100" style="text-align: center; padding: 10px">
              Ничего не найдено :(
            </td>
          </tr>
        </tbody>
        <!-- Table footer -->
        <tfoot>
          <tr>
            <td colspan="7">
              <p style="text-transform: uppercase">Итоговые значения</p>
            </td>
            <td colspan="8">
              <p>Сумма звонков: {{ totalItems2 }}</p>
            </td>
            <td colspan="15">
              <p>Средний процент по выполнению плана: {{ totalItems3 }} %</p>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

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

const isAdd = ref(window.permissions.includes("tables_clients_auditions_add"));
const isEdit = ref(window.permissions.includes("tables_clients_auditions_edit"));
const isDelete = ref(window.permissions.includes("tables_clients_auditions_delete"));
// console.warn(window.permissions);

const showForm = ref(false);
const showFormEdit = ref(false);
const showFormManager = ref(false);

const selectedCity2 = ref(""); // Выбранный город
const newManager = ref(""); // ФИО нового менеджера

// Обработчик выбора города
const selectCity2 = (cityy) => {
  console.log("Выбран город:", cityy);
  
  selectedCity2.value = cityy;
  showCityDropdown.value = false;
};

const toggleForm = () => {
  showForm.value = !showForm.value;
  showFormEdit.value = !showFormEdit.value;
  showFormManager.value = !showFormManager.value;

  formData2.value = {
    name: "",
    phone: "",
    email: "",
    city: "",
    avto: ""
  };
};

const toggleFormManager = () => {
  showFormManager.value = !showFormManager.value;

  formData2.value = {
    name: "",
    phone: "",
    email: "",
    city: "",
    avto: ""
  };
};

const cancelForm = () => {
  showForm.value = false;
  showFormEdit.value = false;
  showFormManager.value = false;

  formData2.value = {
    name: "",
    phone: "",
    email: "",
    city: "",
    avto: ""
  };
};

const cities = [
  "Тюмень",
  "Сургут",
  "Пермь",
  "Самара",
  "Челябинск",
  "Кемерово",
  "Новокузнецк",
  "Барнаул",
  "Красноярск ПЖ",
  "Красноярск Брянка",
  "Омск",
  "Томск",
  "Сургут_ГИ",
  "Тюмень_Республики",
  "Оренбург"
];

const cities2 = [
  "Тюмень",
  "Сургут",
  "Пермь",
  "Самара",
  "Челябинск",
  "Кемерово",
  "Новокузнецк",
  "Барнаул",
  "Красноярск ПЖ",
  "Красноярск Брянка",
  "Омск",
  "Томск",
  "Сургут_ГИ",
  "Тюмень_Республики"
];

const regions = {
  Юг: [
    "Тюмень",
    "Сургут",
    "Пермь",
    "Самара",
    "Челябинск",
    "Сургут_ГИ",
    "Тюмень_Республики", 
    "Оренбург"
  ],
  Север: [
    "Кемерово",
    "Новокузнецк",
    "Барнаул",
    "Красноярск ПЖ",
    "Красноярск Брянка",
    "Омск",
    "Томск"
  ]
};

const managersByCity = JSON.parse(localStorage.getItem("managersByCity")) || {
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
  "Красноярск Брянка": [
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


const managersByCity2 = JSON.parse(localStorage.getItem("managersByCity2")) || ref( {
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
  "Красноярск Брянка": [
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
});


// Функция для сохранения данных в localStorage
function saveToLocalStorage() {
  localStorage.setItem("managersByCity", JSON.stringify(managersByCity2));
}

// Функция для добавления менеджера
function addManager() {
  if (selectedCity2.value && newManager.value) {
    if (!managersByCity2.value[selectedCity2.value]) {
      managersByCity2.value[selectedCity2.value] = [];
    }
    managersByCity2.value[selectedCity2.value].push(newManager.value);
    console.log("Менеджер добавлен:", managersByCity2.value[selectedCity2.value]);
    
    saveToLocalStorage();

    newManager.value = "";
    selectedCity.value = "";
    showFormManager.value = false;

  } else {
    alert("Пожалуйста, выберите город и введите ФИО менеджера.");
  }
}

onMounted(() => {
  // Проверка загрузки данных из localStorage при монтировании
  if (localStorage.getItem("managersByCity2")) {
    managersByCity = JSON.parse(localStorage.getItem("managersByCity2"));
  }
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

// Вычисляемый список менеджеров на основе выбранного города
const filteredManagers = computed(() => {
  return selectedCity.value ? managersByCity[selectedCity.value] || [] : [];
});

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
const selectCity = (cityy) => {
  selectedCity.value = cityy;
  selectedManager.value = null;
  showCityDropdown.value = false;
  formData2.value.city = cityy ? cityy : "";
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
const tableData3 = ref([]);
const loadedData = ref([]); // Отображаемые данные (загружаются постепенно)
const itemsPerPage = 100; // Количество записей для загрузки за раз
const currentPage = ref(0); // Текущая страница данных
const totalItems = ref(0); // Общее количество записей
const totalItems2 = ref(0);
const totalItems3 = ref(0);
const isLoading = ref(false); // Состояние загрузки

const filters = ref({
  selectedRegion: "",
  selectedCity: "",
  startDate: null, // Начальная дата
  endDate: null // Конечная дата
}); // Дефолтные значения фильтров

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

const formatToDDMMYYYY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

const handleDateChange = (newFilters) => {
  const { startDate, endDate } = newFilters;

  filters.value = {
    ...newFilters,
    startDate: startDate ? formatToDDMMYYYY(startDate) : null,
    endDate: endDate ? formatToDDMMYYYY(endDate) : null
  };

  // console.log("Новые фильтры (отформатированные):", filters.value);
  fetchClients(0, true);
};

// Функция для получения общего количества записей
const fetchTotalItems = async () => {
  try {
    const response = await axios.get(
      `https://crystal-motors.ru/method.getClients?count=all`
    );
    totalItems2.value = response.data.answer.count;
    tableData3.value = response.data.answer.items;

    // console.log("Общее количество записей:", response.data.answer.items);

    calculateAveragePlan();
  } catch (error) {
    console.error(
      "Ошибка при получении общего количества записей:",
      error.message
    );
    // Выводим дополнительную информацию об ошибке
    console.error("Детали ошибки:", error.response?.data || error.message);
  }
};

// Функция для получения данных с фильтрами
const fetchClients = async (offset = 0, resetData = false) => {
  try {
    const filterParams = {
      count: "all",
      offset,
      order: "id_desc",
      region: filters.value.selectedRegion || "", // Добавляем регион
      city: filters.value.selectedCity || "", // Добавляем город

      startDate: filters.value.startDate || "",
      endDate: filters.value.endDate || ""
    };

    const response = await axios.get(
      "https://crystal-motors.ru/method.getClients?count=all",
      {
        params: filterParams
      }
    );
    console.log("Запрос с фильтрами:", filterParams);

    const newData = response.data.answer.items;
    // console.log("Новые данные:", newData)

    if (resetData) {
      tableData2.value = newData;
      loadedData.value = newData; // Загружаем все данные без пагинации
      currentPage.value = 1; // Сбрасываем счетчик страницы
    } else {
      tableData2.value = [...tableData2.value, ...newData];
      const start = currentPage.value * itemsPerPage;
      const end = start + itemsPerPage;
      const nextPageData = tableData2.value.slice(start, end);

      if (nextPageData.length > 0) {
        loadedData.value = [...loadedData.value, ...nextPageData];
        currentPage.value++;
      }
    }

    totalItems.value = response.data.answer.total;
  } catch (error) {
    console.error("Ошибка при получении данных клиентов:", error);
  }
};

const filteredData = computed(() => {
  return loadedData.value.filter((client) => {
    // Преобразуем дату клиента в объект Date
    const [day, month, year] = client.date.split(".").map(Number);
    const clientDate = new Date(year, month - 1, day); // месяц - 1, т.к. Date в JS начинается с 0

    // Преобразуем начальную и конечную даты фильтра из строки в объект Date
    const [startDay, startMonth, startYear] = filters.value.startDate
      ? filters.value.startDate.split(".").map(Number)
      : [null, null, null];
    const startDate = startDay
      ? new Date(startYear, startMonth - 1, startDay)
      : null;

    const [endDay, endMonth, endYear] = filters.value.endDate
      ? filters.value.endDate.split(".").map(Number)
      : [null, null, null];
    const endDate = endDay ? new Date(endYear, endMonth - 1, endDay) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0); // Сброс времени начальной даты
    if (endDate) endDate.setHours(23, 59, 59, 999); // Сброс времени конечной даты

    // Логика фильтрации по городам и регионам
    const cityMatch =
      !filters.value.selectedCity || client.city === filters.value.selectedCity;
    const regionMatch =
      !filters.value.selectedRegion ||
      regions[filters.value.selectedRegion]?.includes(client.city);

    // Фильтрация по диапазону дат
    const dateMatch =
      (!startDate || clientDate >= startDate) &&
      (!endDate || clientDate <= endDate);

    return cityMatch && regionMatch && dateMatch;
  });
});

// const filteredData = computed(() => {
//   return loadedData.value.filter((client) => {
//     // Преобразуем строку даты клиента в объект Date
//     const [day, month, year] = client.date.split(".").map(Number);
//     const clientDate = new Date(year, month - 1, day); // месяц на 1 меньше
//     clientDate.setHours(0, 0, 0, 0);

//     // Преобразуем начальную и конечную даты фильтра
//     const startDate = filters.value.startDate
//       ? new Date(filters.value.startDate)
//       : null;
//     const endDate = filters.value.endDate
//       ? new Date(filters.value.endDate)
//       : null;

//     if (startDate) startDate.setHours(0, 0, 0, 0); // Сброс времени для начальной даты
//     if (endDate) endDate.setHours(23, 59, 59, 999); // Сброс времени для конечной даты, чтобы включить последний день

//     // Логика фильтрации по городам и регионам
//     const cityMatch =
//       !filters.value.selectedCity || client.city === filters.value.selectedCity;

//     // Фильтрация по выбранному региону
//     const regionMatch =
//       !filters.value.selectedRegion ||
//       regions[filters.value.selectedRegion]?.includes(client.city);

//     // Фильтрация по диапазону дат
//     const dateMatch =
//       (!startDate || clientDate >= startDate) &&
//       (!endDate || clientDate <= endDate);

//     return cityMatch && regionMatch && dateMatch;
//   });
// });

// Функция для загрузки данных при скролле
const loadMoreData = () => {
  if (isLoading.value || loadedData.value.length >= totalItems.value) return; // Проверяем, не загружены ли все данные

  isLoading.value = true; // Устанавливаем состояние загрузки в true
  const offset = currentPage.value * itemsPerPage;

  // Получаем данные для следующей порции
  fetchClients(offset).finally(() => {
    isLoading.value = false; // Сбрасываем состояние загрузки после завершения
  });
};

// Состояние данных
const formData2 = ref({
  city: "",
  region: "",
  date: "",
  manager: "",
  phone: "",
  fio: "",
  avto: "",
  fact: "1",
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
const date = ref(new Date());

const format2 = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль для дня
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Добавляем ведущий ноль для месяца
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const updatedataRange = (dates) => {
  if (dates instanceof Date) {
    formData2.value.date = format2(dates); // Форматируем дату перед сохранением
  } else {
    formData2.value.date = ""; // Если это не дата, обнуляем
  }
  console.log("Updated formData2.date:", formData2.value.date);
};

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

// Функция добавления клиента
const addClient = async () => {
  try {
    console.log("Добавление нового клиента:", formData2.value);

    // Инициализируем переменную для суммы
    let itogg = 0;

    // Если чекбокс "Не учитывать в расчетах" не отмечен, добавляем 1 к сумме
    if (formData2.value.fact === false) {
      itogg += 1;
    }

    // Преобразуем значения в числа и вычисляем сумму
    itogg +=
      Number(formData2.value.obrashenie) +
      Number(formData2.value.salon) +
      Number(formData2.value.cred_nal) +
      Number(formData2.value.prodan) +
      Number(formData2.value.city2) +
      Number(formData2.value.data_visit) +
      Number(formData2.value.garantiya) +
      Number(formData2.value.obrash_imeni) +
      Number(formData2.value.bodr_son) +
      Number(formData2.value.otpr_viz) +
      Number(formData2.value.vizit) * 3 +
      Number(formData2.value.prod_company) +
      Number(formData2.value.zdatok);

    // Обновляем значение "itog" в formData2
    formData2.value.itog = itogg;
    formData2.value.plan = Math.floor((itogg / 14) * 100);

    // Создаем строку параметров из данных формы
    const params = new URLSearchParams(formData2.value).toString();

    console.log("Параметры запроса:", params);

    // Отправляем запрос на сервер
    await axios.get(`https://crystal-motors.ru/method.addClient?${params}`);

    alert("Данные успешно добавлены!");

    // Очищаем форму
    formData2.value = {
      city: "",
      region: "",
      date: "",
      manager: "",
      phone: "",
      fio: "",
      avto: "",
      fact: "1",
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
    };

    // Сбрасываем выбранный город и другие дропдауны
    selectedCity.value = ""; // Сбрасываем город
    showCityDropdown.value = false; // Закрываем dropdown

    // Если есть другие дропдауны, их тоже нужно сбрасывать, например:
    selectedBrand.value = null; // Для марки авто, если она есть
    showBrandDropdown.value = false; // Закрываем dropdown для бренда
    selectedManager.value = null; // Сбрасываем менеджера
    showManagerDropdown.value = false; // Закрываем dropdown для менеджера

    selectedModel.value = null; // Сбрасываем модель
    showModelDropdown.value = false; // Закрываем dropdown для модели

    // Сбрасываем дату
    date.value = null; // или null, в зависимости от того, как ты используешь этот параметр

    // Очищаем номер телефона
    formData2.value.phone = "";

    // Очищение текущие данные таблицы перед обновлением
    tableData2.value = [];
    loadedData.value = [];
    currentPage.value = 0; // Сброс страницы на первую

    // Вызовите функцию для обновления списка клиентов
    await fetchTotalItems();
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
    console.log("Клиент для редактирования:", client);
    console.log("Клиент для редактирования:", formData2);

    showFormEdit.value = !showFormEdit.value;
    formData2.value = { ...client }; // Клонируем данные клиента в formData2

    const getNumber = (string) =>
      (String(string || "").match(/\.?\d+/g) || [0]).join("") || 0;

    // Форматируем номер телефона
    formData2.value.phone = getNumber(client.phone);
    console.log("Форматированный номер телефона:", formData2.value.phone);

    // Устанавливаем выбранный город из данных клиента
    selectedCity.value = client.city || "";

    selectedManager.value = client.manager || "";

    // Устанавливаем выбранную марку автомобиля
    const brand = carsData.value.find((b) => b.name === client.avto);
    selectedBrand.value = brand || null;
    console.log("Selected brand:", selectedBrand.value);

    // Устанавливаем выбранную модель автомобиля (если есть модель)
    const model = brand?.models.find((m) => m.name === client.model);
    selectedModel.value = model || null;

    selectManager.value = client.manager || "";

    isEditing.value = true; // Открываем форму редактирования
    currentClientId.value = client.id; // Устанавливаем текущий ID клиента
  } else {
    console.error("Не удалось загрузить данные клиента.");
  }
};

const updateClient = async () => {
  try {
    console.log("Обновление клиента с ID:", currentClientId.value);
    console.log("Обновление клиента с данными:", formData2.value);

    // Инициализируем переменную для суммы
    let itogg = 0;

    // Если чекбокс "Не учитывать в расчетах" не отмечен, добавляем 1 к сумме
    if (formData2.value.fact === false) {
      itogg += 1;
    }

    // Преобразуем значения в числа и вычисляем сумму
    itogg +=
      Number(formData2.value.obrashenie) +
      Number(formData2.value.salon) +
      Number(formData2.value.cred_nal) +
      Number(formData2.value.prodan) +
      Number(formData2.value.city2) +
      Number(formData2.value.data_visit) +
      Number(formData2.value.garantiya) +
      Number(formData2.value.obrash_imeni) +
      Number(formData2.value.bodr_son) +
      Number(formData2.value.otpr_viz) +
      Number(formData2.value.vizit) * 3 +
      Number(formData2.value.prod_company) +
      Number(formData2.value.zdatok);

    // Обновляем значение "itog" в formData2
    formData2.value.itog = itogg;
    formData2.value.plan = Math.floor((itogg / 14) * 100);

    // Убедитесь, что URL и метод правильно настроены на сервере
    await axios.get(
      `https://crystal-motors.ru/method.editClient?id=${
        currentClientId.value
      }&${new URLSearchParams(formData2.value).toString()}`
    );

    alert("Данные успешно обновлены!");

    // Очищение текущие данные таблицы перед обновлением
    formData2.value = [];
    tableData2.value = [];
    loadedData.value = [];
    currentPage.value = 0;

    // Вызовите функцию для обновления списка клиентов
    await fetchTotalItems();
    await fetchClients();

    showFormEdit.value = false;
    isEditing.value = false; // Закрыть форму редактирования
  } catch (error) {
    console.error("Ошибка при обновлении данных клиента:", error);
  }
};

const updateManager = async () => {
  try {
    console.log("Обновление менеджера с ID:", selectedManager.value);
  } catch (error) {
    console.error("Ошибка при обновлении менеджера:", error);
  }
};

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
    await fetchTotalItems();
    await fetchClients();
  } catch (error) {
    console.error("Ошибка при удалении данных:", error);
  }
};

// Отслеживание изменений фильтров и автоматическая перезагрузка данных
watch(
  filters,
  () => {
    currentPage.value = 0; // Сбрасываем страницу
    loadedData.value = []; // Очищаем загруженные данные
    fetchClients(0, true); // Загружаем данные с фильтрами с нуля
  },
  { deep: true }
); // Глубокое отслеживание для вложенных объектов

// Запрос данных при монтировании компонента
onMounted(async () => {
  await fetchTotalItems(); // Получаем общее количество записей при монтировании
  calculateAveragePlan(); // Рассчитываем средний процент после обновления данных
  loadMoreData(); // Загружаем первую порцию данных при монтировании
  fetchClients();
});
</script>

<style scoped lang="scss">
body {
  font-family: Arial, sans-serif;
  background-color: #425793;
}
.dropdown-srch .dropdown-menu {
  overflow: hidden;
}

.my-calendar {
  max-width: 270px;
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

.filters__btns-btns,
.fact-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-manager {
  background: #425793;
  color: #fff;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #34467a;
  }
}

.add__manager {
  width: 100%;
  max-width: 768px;

  .form-fields__select {
    width: 100%;
  }
}

@import url("./table.scss");
</style>
