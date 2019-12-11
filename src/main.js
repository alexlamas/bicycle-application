import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { auth } from "@/firebase";

import {
  faTrash,
  faTimesCircle,
  faPlus,
  faWrench,
  faBan
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrash, faTimesCircle, faPlus, faWrench, faBan);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.prototype.$dateToDays = function(date) {
  if (date) {
    return Math.ceil(date.getTime() / 1000 / 60 / 60 / 24);
  } else {
    var today = new Date();
    return Math.ceil(today.getTime() / 1000 / 60 / 60 / 24);
  }
};
let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
