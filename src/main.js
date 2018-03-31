// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap3/dist/css/bootstrap.css'
import Vue from 'vue'
import App from './App'
import _ from 'lodash'

import * as configJson from './config.json';
const server = _.findKey(configJson, function(o) { return o.hosts.indexOf(window.location.host) !== -1 });
Vue.prototype.$access = {
  token: '',
  url: configJson[server].api.url,
};

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
