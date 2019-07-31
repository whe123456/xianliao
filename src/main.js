// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import './styles/global.scss'
// import { pinyin } from 'pinyin'
// import * as socketApi from './util/socket'
import VueSocketio from 'vue-socket.io'
// import VueJsonp from 'vue-jsonp'
import axios from './util/axios'
Vue.use(new VueSocketio({
	debug: true,
	connection: 'http://211.149.162.202:6821'
}))
/*Vue.use(new VueSocketio({
	debug: true,
	connection: 'http://192.168.0.136:6821'
}))*/
// WebSocket封装方法
// Vue.prototype.socketApi = socketApi
Vue.config.productionTip = false
// Vue.use(VueJsonp)
Vue.prototype.axios = axios
// Vue.use(pinyin)
Vue.use(Vuex)
Vue.use(ElementUI)
/* eslint-disable no-new */
const vm = new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
export default vm
