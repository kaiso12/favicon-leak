// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

let pathid = parseInt(window.location.pathname.split('/').pop());
if (isNaN(pathid) || pathid > Date.now() || pathid < Date.now() - 10000) {
  // Guarantees new path every 10 sec
  window.location.pathname = Date.now()
} else {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  })
}
