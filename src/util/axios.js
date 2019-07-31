'use strict'
import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(config => {
	// loading
	return config
}, error => {
	return Promise.reject(error)
})
axios.interceptors.response.use(response => {
	return response
}, error => {
	return Promise.resolve(error.response)
})
// function checkStatus (response) {
//   // loading
//   // 如果http状态码正常，则直接返回数据
//   if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
//     return response
//     // 如果不需要除了data之外的数据，可以直接 return response.data
//   }
//   // 异常状态下，把错误信息返回去
//   return {
//     status: -404,
//     msg: '网络异常'
//   }
// }
function checkCode(res, callback) {
	// 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
	// if (res.status === -404) {
	//   alert(res.msg)
	// }
	// if (res.data && (!res.data.success)) {
	//   // alert(res.data.error_msg)
	// }
	if (res.code === 403) {
	} else {
		if (typeof callback === 'function') {
			callback(res)
		}
	}
}

export default {
	post(url, data, headers = {}, callback) {
		console.log('post')
		return axios({
			method: 'post',
			// baseURL: '/api/',
			url,
			data: qs.stringify(data),
			// timeout: 0,
			headers: headers
		}).then(
			(res) => {
				if (res.data !== undefined) {
					return checkCode(res.data, callback)
				}
			}
		)
	},
	get(url, params, callback, headers = {}) {
		return axios({
			method: 'get',
			// baseURL: 'http://test.cdlhzz.cn/mall',
			url,
			params, // get 请求时带的参数
			// timeout: 0,
			headers: headers
		}).then(
			(res) => {
				if (res.data !== undefined) {
					return checkCode(res.data, callback)
				}
			}
		)
	}
}
