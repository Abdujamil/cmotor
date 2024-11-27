<template>

  <!-- Edit field -->
  <div v-if="showFormEdit" class="form-fields">
    <form @submit.prevent="updateClient">
      <div class="form-fields__title">
        <h2>Редактирование полей</h2>
        <div class="form-fields__title-btns">
          <button type="submit" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

      <div class="dataNps-selects form-fields__selects">
        <div class="dataNps-selects-head">
          <div
            class="form-fields__select form-fields__selects-city"
            ref="cityDropdown"
          >
            <label for="city">Город</ label>
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
              mask="7##########"
              placeholder="Телефон"
              v-model="formData.phone_number"
            />
          </div>
          <div class="form-fields__select form-fields__selects-manager">
            <label for="manager">Дата опроса</label>
            <div class="my-calendar">
              <VueDatePicker
                v-model="selectedDate"
                :format="format2"
                dark
                placeholder="За всё время"
                locale="ru-RU"
                select-text="Выбрать"
                cancel-text="Отменить"
                :enable-time-picker="false"
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
  <!-- END Edit field -->

  <!-- Add new field -->
  <div v-else-if="showForm" class="form-fields">
    <form @submit.prevent="addCity">
      <div class="form-fields__title">
        <h2>Добавление нового поля</h2>
        <div class="form-fields__title-btns">
          <button type="submit" class="btn btn-green">Сохранить</button>
          <button @click="cancelForm" class="btn btn-red">Отменить</button>
        </div>
      </div>

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
              mask="7##########"
              placeholder="Телефон"
              v-model="formData.phone_number"
            />
          </div>
          <div class="form-fields__select form-fields__selects-manager">
            <label for="manager">Дата опроса</label>
            <div class="my-calendar">
              <VueDatePicker
                v-model="selectedDate"
                :format="format2"
                dark
                placeholder="За всё время"
                locale="ru-RU"
                select-text="Выбрать"
                cancel-text="Отменить"
                :enable-time-picker="false"
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
        <button v-if="isAdd"  @click="toggleForm" class="btn btn-green">
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
          <div v-if="isEdit" class="table-cell">Редактировать</div>
          <div v-if="isDelete" class="table-cell">Удалить</div>
        </div>
        <!-- Filtered Table Rows -->
        <div
          class="table-row body"
          v-for="(city, index) in filteredCities"
          :key="index"
          v-if="filteredCities.length > 0"
          :class="[
            'table-row',
            {
              'not-processed': city.editedStatus === 'Не отработан',
              'processed': city.editedStatus === 'Отработан'
            }
          ]"
        >
          <div class="table-cell">{{ city.id }}</div>
          <div class="table-cell">{{ city.city }}</div>
          <div class="table-cell">{{ city.salon_quality }}</div>
          <div class="table-cell">{{ city.manager_quality }}</div>
          <div class="table-cell">{{ city.phone_number }}</div>
          <div class="table-cell">{{ city.survey_date }}</div>
          <div class="table-cell">{{ city.transaction_type }}</div>
          <div class="table-cell table-cell-comment">
            <p class="comment-text" :title="city.comment || ''">
              {{ city.comment }}
            </p>
            <div @click="showComment(city)" style="cursor: pointer">👆</div>
          </div>
          <div
            @click.stop="startEditing(index)"
            class="table-cell table-cell-comment comment-rop"
          >
            <svg
              title="Редактирование"
              v-if="editingIndex !== index && isComment"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                data-v-85d29e85=""
                d="M16.875 8.43754V14.0625C16.875 15.6132 15.6132 16.875 14.0625 16.875H3.9375C2.38683 16.875 1.125 15.6132 1.125 14.0625V3.93754C1.125 2.38686 2.38683 1.12504 3.9375 1.12504H9.5625C9.87314 1.12504 10.125 1.37689 10.125 1.68754C10.125 1.99818 9.87314 2.25004 9.5625 2.25004H3.9375C3.00698 2.25004 2.25 3.00702 2.25 3.93754V14.0625C2.25 14.9931 3.00698 15.75 3.9375 15.75H14.0625C14.993 15.75 15.75 14.9931 15.75 14.0625V8.43754C15.75 8.12689 16.0019 7.87504 16.3125 7.87504C16.6231 7.87504 16.875 8.12689 16.875 8.43754ZM5.22731 9.16485L13.1023 1.28985C13.3221 1.07005 13.678 1.07005 13.8977 1.28985L16.7102 4.10235C16.93 4.32214 16.93 4.67807 16.7102 4.89772L8.83519 12.7727C8.72972 12.8782 8.5867 12.9375 8.4375 12.9375H5.625C5.31436 12.9375 5.0625 12.6857 5.0625 12.375V9.56254C5.0625 9.41333 5.12184 9.27032 5.22731 9.16485ZM12.6079 3.37504L14.625 5.39216L15.5171 4.50004L13.5 2.48291L12.6079 3.37504ZM6.1875 11.8125H8.20463L13.8296 6.18754L11.8125 4.17041L6.1875 9.79541V11.8125Z"
                fill="currentColor"
              ></path>
            </svg>
            <div v-if="editingIndex === index && isComment">
              <textarea
                id="edit-input-{{ index }}"
                class="comment-input"
                v-model="editedComments[index]"
                @blur="saveComment(index)"
                @keyup.enter="saveComment(index)"
              />
            </div>
            <div v-else>
              <p
                class="comment-text"
                :title="city.editedRopComment || 'Нет комментария'"
              >
                {{ city.editedRopComment || "Нет комментария" }}
              </p>
            </div>
          </div>
          <div class="table-cell" style="min-width: 95px">
            <div @click.stop="toggleDropdown('status', index)" class="dropdown">
              <div class="dropdown-toggle" style="padding-left: 0">
                <span id="dropdown-selected">{{
                  cities[index].editedStatus
                }}</span>

                <span v-if="isStatus" class="dropdown-arrow">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M16.0299 7.42016C16.3234 7.71345 16.3234 8.18897 16.0299 8.48226L10.5283 13.9802C10.3873 14.1211 10.1962 14.2002 9.99685 14.2002C9.79754 14.2002 9.60638 14.1211 9.46545 13.9802L3.97011 8.48856C3.67663 8.19526 3.67663 7.71975 3.97012 7.42645C4.2636 7.13316 4.73944 7.13316 5.03292 7.42645L9.99685 12.3871L14.9671 7.42016C15.2606 7.12687 15.7364 7.12687 16.0299 7.42016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </div>
              <div
                v-if="showStatusDropdowns[index] && isStatus"
                class="dropdown-menu"
                style="width: 110px"
              >
                <div
                  class="dropdown-item"
                  v-for="(option, idx) in statusOptions"
                  :key="idx"
                  @click="selectStatus(option, index)"
                >
                  {{ option }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="isEdit"  class="table-cell" style="max-width: 90px">
            <div @click="editClient(city)" class="edit-icon-block">
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
          </div>
          <div v-if="isDelete"  class="table-cell" style="max-width: 90px">
            <td
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <img
                class="delete-icon-block"
                title="Удалить"
                @click="() => deleteCity(city.id)"
                src="../../src/assets/icons8-delete.svg"
                alt="delete"
                style="margin: 0"
              />
            </td>
          </div>
        </div>
        <div class="table-row" v-else>
          <div class="table-cell">Ничего не найдено</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Filter from "../components/filters/Filter.vue";
import IButton from "../components/installButton/IButton.vue";
import { ref, nextTick, onMounted, onBeforeUnmount, computed, watch } from "vue";
import axios from "axios";
import * as XLSX from "xlsx";


const link = 'https://crystal-motors.ru/cabinet/tables/clients/user';

const isAdminLink = ref(false);

const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);
console.log(urlParams);

// const permissions = Object.fromEntries(new URLSearchParams(location.search))?.permissions?.split(',') || [];

const isAdd = ref(window.permissions.includes("tables_clients_nps_data_add"));
const isEdit = ref(window.permissions.includes("tables_clients_nps_data_edit"));
const isDelete = ref(window.permissions.includes("tables_clients_nps_data_delete"));
const isComment = ref(window.permissions.includes("tables_clients_nps_data_comment"));
const isStatus = ref(window.permissions.includes("tables_clients_nps_data_status"));

// tables_clients_nps_data_add,tables_clients_nps_data_edit,tables_clients_nps_data_delete,tables_clients_nps_data_comment,tables_clients_nps_data_status

onMounted(() => {
  const currentUrl = window.location.href;
  isAdminLink.value = currentUrl === 'https://crystal-motors.ru/cabinet/tables/clients/user';
});

const table = ref();

const selectedStatus = ref("Не отработан"); // По умолчанию "Не отработан"
const statusOptions = ["Не отработан", "В работе", "Отработан"];
const showStatusDropdown = ref(false);

const editingIndex = ref(false); // Хранит индекс редактируемого комментария
const editedComments = ref([]); // Изменяем на массив для каждого комментария
const editInput = ref([]); // Массив для каждого поля ввода

const showForm = ref(false);
const showFormEdit = ref(false);
const showCityDropdown = ref(false);
const showQualSlaonDropdown = ref(false);
const showManagerWorkDropdown = ref(false);
const showDealsTypeDropdown = ref(false);
const selectedCity = ref("");
const selectedSlQuality = ref("");
const selectedManagerWork = ref("");
const selectedDealsType = ref("");
const date = ref();
const filters = ref({
  selectedRegion: "",
  selectedCity: "",
  startDate: null, // Начальная дата
  endDate: null // Конечная дата
}); // Дефолтные значения фильтров

const showComment = (city) => {
  alert(city.comment);
}

new ResizeObserver((event) => {
  const width = document.documentElement.scrollWidth || 0;
  const height = document.documentElement.scrollHeight || 0;
  parent.postMessage({ width, height }, "*");
}).observe(document.documentElement);

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

const regions = {
  Юг: [
    "Тюмень",
    "Сургут",
    "Пермь",
    "Самара",
    "Челябинск",
    "Сургут_ГИ",
    "Тюмень_Республики"
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

const formData = ref({
  city: "",
  salon_quality: "",
  manager_quality: "",
  phone_number: "",
  survey_date: "",
  transaction_type: "",
  comment: "",
  rop_comment: "",
  status: ""
});

const ratingsSalon = ["1", "2", "3", "4", "5"];
const ratingsManagerWork = ["1", "2", "3", "4", "5"];
const typeDeal = ["Комиссия", "Покупка", "Продажа", "Покупка/Обмен"];

const handleDateChange = (newFilters) => {
  const { startDate, endDate } = newFilters;

  // Проверка на корректность дат
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || start > end) {
      console.error("Ошибка: некорректные даты");
      return; // Прерываем выполнение функции при некорректных датах
    }
  }

  filters.value = {
    ...newFilters,
    startDate: startDate ? new Date(startDate).toISOString() : null,
    endDate: endDate ? new Date(endDate).toISOString() : null
  };

  console.log("Новые фильтры:", filters.value);
  fetchCities(0, true); // Сброс данных и запрос с фильтрами
};

const selectedDate = ref(null);

const format2 = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль для дня
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Добавляем ведущий ноль для месяца
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const updatedataRange = (dates) => {
  console.log("Дата пришла:", dates);
  
  if (dates instanceof Date) {
    // Сохраняем отформатированную дату в formData
    formData.value.survey_date = format2(dates);
    console.log("Форматированная дата сохранена:", formData.value.survey_date);
  } else {
    // Если дата не выбрана, сбрасываем значение
    formData.value.survey_date = "";
    console.log("Дата сброшена:", formData.value.survey_date);
  }
};

const toggleForm = () => {
  showForm.value = !showForm.value;
  // showFormEdit.value = !showFormEdit.value;
};

const cancelForm = () => {
  showForm.value = false;
  showFormEdit.value = false;
};

// Функция выбора статуса
const selectStatus = (option, index) => {
  cities.value[index].editedStatus = option; // Обновляем статус в редактируемом состоянии
  saveStatus(index); // Сохраняем статус на сервере
  showStatusDropdowns.value[index] = false; // Закрываем дропдаун
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

const showStatusDropdowns = ref(cities.value.map(() => false));
console.log("showStatusDropdowns:", showStatusDropdowns.value);

// Переключение видимости дропдаунов
function toggleDropdown(type, index) {
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
    showStatusDropdowns.value = showStatusDropdowns.value.map((_, i) =>
      i === index ? !showStatusDropdowns.value[i] : false
    );
  }
}

// Функция для получения данных из БД
const fetchCities = async (offset = 0, resetData = false) => {
  try {
    const filterParams = {
      count: 100000,
      order: "id_desc",
      offset,
      region: filters.value.selectedRegion || "", // Добавляем регион
      city: filters.value.selectedCity || "", // Добавляем город

      startDate:
        filters.value.startDate instanceof Date
          ? filters.value.startDate.toISOString()
          : filters.value.startDate || "",

      endDate:
        filters.value.endDate instanceof Date
          ? filters.value.endDate.toISOString()
          : filters.value.endDate || ""
    };

    const response = await axios.get(
      "https://crystal-motors.ru/method.getSendings?count=all",
      {
        params: filterParams
      }
    );

    const newData = response.data.answer.items;
    if (resetData) {
      cities.value = newData;
    } else {
      cities.value = [...cities.value, ...newData];
    }

    // cities.value = response.data.answer.items;

    cities.value = response.data.answer.items.map((item) => ({
      ...item,
      editedRopComment: item.rop_comment || "", // Сохраняем rop_comment для редактирования
      editedStatus:
        item.salon_quality === "5" && item.manager_quality === "5"
          ? "Отработан"
          : item.status || "Не отработан"
    }));

    console.log("cities.value:", cities.value);
    

    showStatusDropdowns.value = cities.value.map(() => false); // Инициализация после загрузки
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

const filteredCities = computed(() => {
  return cities.value.filter((client) => {
    // Преобразуем строку даты клиента в объект Date
    const [day, month, year] = client.survey_date.split(".").map(Number);
    const clientDate = new Date(year, month - 1, day); // месяц на 1 меньше
    clientDate.setHours(0, 0, 0, 0);

    // Преобразуем начальную и конечную даты фильтра
    const startDate = filters.value.startDate
      ? new Date(filters.value.startDate)
      : null;

    const endDate = filters.value.endDate
      ? new Date(filters.value.endDate)
      : null;

    if (startDate) startDate.setHours(0, 0, 0, 0); // Сброс времени для начальной даты
    if (endDate) endDate.setHours(23, 59, 59, 999); // Сброс времени для конечной даты, чтобы включить последний день

    // Логика фильтрации по городам и регионам
    const cityMatch =
      !filters.value.selectedCity || client.city === filters.value.selectedCity;

    // Фильтрация по выбранному региону
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

// Функция для сохранения rop_comment
const saveComment = async (index) => {
  // Получаем текущий текст комментария для отправки
  const comment = editedComments.value[index];

  // Проверка на пустой комментарий
  if (!comment || comment.trim() === "") {
    console.warn("Комментарий не может быть пустым.", comment);
    return; // Не отправляем пустые комментарии
  }

  try {
    // Отправка данных на сервер
    const response = await axios.get(
      "https://crystal-motors.ru/method.editSending",
      {
        params: {
          // Используем params для передачи параметров
          id: cities.value[index].id,
          rop_comment: comment
        }
      }
    );

    // Обновляем комментарий в локальном состоянии
    cities.value[index].editedRopComment = comment;

    console.log("Комментарий успешно обновлён:", comment);

    // Завершаем редактирование
    editingIndex.value = null;
  } catch (error) {
    console.error("Ошибка при обновлении комментария:", error);
  }
};

// Функция для сохранения статуса
const saveStatus = async (index) => {
  const status = cities.value[index].editedStatus;
  console.log("Статус:", status);

  try {
    await axios.get("https://crystal-motors.ru/method.editSending?count=all", {
      params: {
        id: cities.value[index].id,
        status: status
      }
    });

    // Обновляем статус в локальном состоянии
    cities.value[index].status = status;

    console.log("Статус успешно обновлен:", status);

    // Закрываем редактирование
    editingIndex.value = null;
    await fetchCities(); // Обновляем данные
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
  }
};

// Функция для начала редактирования rop_comment
const startEditing = (index) => {
  editingIndex.value = index;
  editedComments.value[index] = cities.value[index].editedRopComment;
  nextTick(() => {
    const input = document.querySelector(`#edit-input-${index}`);
    if (input) input.focus();
  });
};

// Обработка клика вне поля редактирования
const handleOutsideClick = (event) => {
  if (
    editingIndex.value !== null &&
    !event.target.closest(".table-cell-comment")
  ) {
    saveComment(editingIndex.value);
  }
};


const addCity = async () => {
  try {
    console.log("Добавление нового клиента:", formData.value);

    const params = new URLSearchParams(formData.value).toString();

    console.log("Параметры запроса:", params);

    await axios.get(`https://crystal-motors.ru/method.addSending?${params}`);

    // await axios.post('https://crystal-motors.ru/method.addSending', formData.value, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

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

    selectedCity.value = null;

    selectedSlQuality.value = null;
    selectedManagerWork.value = null;
    selectedDealsType.value = null;

    showForm.value = !showForm.value;

    // Перезагрузка данных
    fetchCities();
  } catch (error) {
    console.error("Ошибка при добавлении данных:", error);
  }
};



const updateClient = async () => {
  try {
    const params = new URLSearchParams(formData.value).toString();

    // Убедитесь, что URL и метод правильно настроены на сервере
    await axios.get(`https://crystal-motors.ru/method.editSending?${params}`);

    alert("Данные успешно обновлены!");

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

    selectedCity.value = null;

    selectedSlQuality.value = null;
    selectedManagerWork.value = null;
    selectedDealsType.value = null;

    showFormEdit.value = false;

    // Вызовите функцию для обновления списка клиентов
    await fetchCities();
  } catch (error) {
    console.error("Ошибка при обновлении данных клиента:", error);
  }
};

const editClient = (city) => {
  if (city) {
    showFormEdit.value = !showFormEdit.value;
    formData.value = { ...city }; // Клонируем данные клиента в formData2

    const getNumber = (string) =>
      (String(string || "").match(/\.?\d+/g) || [0]).join("") || 0;

    // Форматируем номер телефона
    formData.value.phone = getNumber(city.phone);
    console.log("Форматированный номер телефона:", formData.value.phone);

    // Устанавливаем выбранный город из данных клиента
    selectedCity.value = city.city || "";
  } else {
    console.error("Не удалось загрузить данные клиента.");
  }
};

// Функция для удаления клиента
const deleteCity = async (id) => {
  try {
    console.log("Удаление клиента с ID:", id);
    await axios.get(`https://crystal-motors.ru/method.deleteSending?id=${id}`);
    alert("Данные успешно удалены!");

    // Очищение текущие данные таблицы перед обновлением
    cities.value = [];

    // Вызовим функцию для обновления списка клиентов
    await fetchCities();
  } catch (error) {
    console.error("Ошибка при удалении данных:", error);
  }
};

onMounted(() => {
  fetchCities();
});

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const downloadTable = () => {
  if (table.value) {
    // Создаем массив для хранения данных
    const data = [];

    // Собираем заголовки
    const headers = Array.from(
      table.value.querySelectorAll(".header .table-cell")
    ).map((cell) => cell.textContent);
    data.push(headers); // Добавляем заголовки в массив данных

    // Собираем строки из filteredCities
    const rows = Array.from(table.value.querySelectorAll(".table-row.body"));
    rows.forEach((row) => {
      const rowData = Array.from(row.querySelectorAll(".table-cell")).map(
        (cell) => cell.textContent
      );
      data.push(rowData); // Добавляем каждую строку в массив данных
    });

    // Создаем рабочий лист
    const ws = XLSX.utils.aoa_to_sheet(data);
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

.not-processed {
  background: #b30000a3 !important; /* Цвет для статуса "Не отработан" */
}

.processed {
  background: #017a0169 !important; /* Цвет для статуса "Отработан" */
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

.dropdown-toggle {
  gap: 6px;
  cursor: pointer;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
}

#dropdown-selected {
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
  padding-right: 10px;

  .dropdown-toggle {
    border: none;
  }
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

  position: sticky;
  top: 0;
  z-index: 9;
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
  max-width: 100px;
  text-wrap: wrap;
}

.table-cell-comment {
  display: flex;
  align-items: center;
  gap: 6px;
  // overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
  }

  .comment-text {
    max-width: 72px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
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
  width: 100%;
  height: 50px;
  background: transparent;
  border-color: #dddddd30;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  padding: 4px;
  resize: none;

  &:focus {
    outline: none;
    border-color: #fff;
  }
}
</style>
