// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Определение маршрутов
const routes = [
  { path: "/", component: () => import("../pages/AllCity.vue") },
  { path: "/dataEntry", component: () => import("../pages/DataEntry.vue") },
  { path: "/statisticCity", component: () => import("../pages/StatisticCity.vue") },
  { path: "/statisticManager", component: () => import("../pages/StatisticManager.vue") },
  { path: "/npsAdd", component: () => import("../pages/DataNPS.vue") },
  { path: "/npsList", component: () => import("../pages/StatisticNPS.vue") },
];

// Создание экземпляра роутера
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
