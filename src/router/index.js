import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Check from '@/components/CheckCode'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			component: Home
		},
		{
			path: '/Login',
			component: Login
		},
		{
			path: '/Check',
			component: Check
		}
	]
})
