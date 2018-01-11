// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import Vuetify from 'vuetify'
import db from './firebase'
import axios from 'axios'
import store from './vuex/index'
import 'vuetify/dist/vuetify.css'

Vue.config.productionTip = false

// Firebase Setting
Vue.prototype.$fbasedb = db

// Axios Setting (for HTTP Request)
let baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios.create({
  baseURL: baseURL
})

Vue.use(Vuetify)
Vue.use(router)
Vue.use(VueFire)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
