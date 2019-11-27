// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import {getCode} from '@/api/api'
import VueSocketio from 'vue-socket.io'
import Vue from 'vue'
import conf from '../static/conf.js'
console.log(conf())
Vue.use(new VueSocketio({
	debug: true,
	connection: conf()
}))
/* eslint-disable */
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import './styles/global.scss'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(Viewer)
// Vue.use(VueCookies)

Viewer.setDefaults({
	'inline': false,
	'button': true, //右上角按钮
	'navbar': false, //底部缩略图
	'title': true, //当前图片标题
	'toolbar': true, //底部工具栏
	'tooltip': true, //显示缩放百分比
	'movable': true, //是否可以移动
	'zoomable': true, //是否可以缩放
	'rotatable': true, //是否可旋转
	'scalable': true, //是否可翻转
	'transition': true, //使用 CSS3 过度
	'fullscreen': true, //播放时是否全屏
	'keyboard': true, //是否支持键盘
	'url': 'data-source',
	ready: function(e) {
		console.log(e.type, '组件以初始化')
	},
	show: function(e) {
		console.log(e.type, '图片显示开始')
	},
	shown: function(e) {
		console.log(e.type, '图片显示结束')
	},
	hide: function(e) {
		console.log(e.type, '图片隐藏完成')
	},
	hidden: function(e) {
		console.log(e.type, '图片隐藏结束')
	},
	view: function(e) {
		console.log(e.type, '视图开始')
	},
	viewed: function(e) {
		console.log(e.type, '视图结束')
		// 索引为 1 的图片旋转20度
		if (e.detail.index === 1) {
			this.viewer.rotate(20)
		}
	},
	zoom: function(e) {
		console.log(e.type, '图片缩放开始')
	},
	zoomed: function(e) {
		console.log(e.type, '图片缩放结束')
	}
})
/* eslint-disable no-new */
const vm = new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
export default vm
