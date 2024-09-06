// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Определение маршрутов
const routes = [
  { path: "/", component: () => import("../pages/AllCity.vue") },
  { path: "/dataEntry", component: () => import("../pages/DataEntry.vue") }
];

// Создание экземпляра роутера
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
