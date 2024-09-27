// apiService.js
import axios from "axios";

// Функция для получения клиентов с фильтрами
export const fetchClients = async (filters, itemsPerPage, offset = 0) => {
  try {
    const filterParams = {
      count: itemsPerPage,
      offset,
      order: "id_desc",
      region: filters.selectedRegion || "",
      city: filters.selectedCity || "",
      startDate: filters.startDate instanceof Date ? filters.startDate.toISOString() : filters.startDate || "",
      endDate: filters.endDate instanceof Date ? filters.endDate.toISOString() : filters.endDate || ""
    };

    const response = await axios.get("https://crystal-motors.ru/method.getClients", {
      params: filterParams
    });
    return response.data.answer;
  } catch (error) {
    console.error("Ошибка при получении данных клиентов:", error);
    throw error; // Пробрасываем ошибку для обработки в компоненте
  }
};

// Функция для получения общего количества записей
export const fetchTotalItems = async () => {
  try {
    const response = await axios.get("https://crystal-motors.ru/method.getClients?count=all");
    return response.data.answer;
  } catch (error) {
    console.error("Ошибка при получении общего количества записей:", error.message);
    throw error; // Пробрасываем ошибку для обработки в компоненте
  }
};
