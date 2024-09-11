import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes/route";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import { MaskInput } from 'vue-3-mask';

const app = createApp(App);

app.use(router);
app.use(VCalendar, {});
app.component('MaskInput', MaskInput);
app.mount("#app");
