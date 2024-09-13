import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes/route";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import { MaskInput } from 'vue-3-mask';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App);

app.use(router);
app.use(VCalendar, {});
app.component('MaskInput', MaskInput);
app.component('VueDatePicker', VueDatePicker);
app.mount("#app");
