import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes/route";
import VCalendar from "v-calendar";
import "v-calendar/style.css";

createApp(App)
  .use(router)
  .use(VCalendar, {}) // используйте плагин VCalendar после маршрутизатора
  .mount("#app");

