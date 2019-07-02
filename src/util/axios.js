'use strict'
import axios from 'axios'
import qs from 'qs'
axios.interceptors.request.use(config => {
	//loading
	return config
}, error => {
	return Promise.reject(error)
})
axios.interceptors.response.use(response => {
	return response
}, error => {
	// 当响应异常时做一些处理
	console.log(error)
	if (error && error.response) {
		switch (error.response.status) {
		case 400: error.message = '请求错误(400)'; break
		case 401: error.message = '未授权，请重新登录(401)'; break
		case 403: error.message = '拒绝访问(403)'; break
		case 404: error.message = '请求出错(404)'; break
		case 408: error.message = '请求超时(408)'; break
		case 500: error.message = '服务器错误(500)'; break
		case 501: error.message = '服务未实现(501)'; break
		case 502: error.message = '网络错误(502)'; break
		case 503: error.message = '服务不可用(503)'; break
		case 504: error.message = '网络超时(504)'; break
		case 505: error.message = 'HTTP版本不受支持(505)'; break
		default: error.message = `连接出错(${error.response.status})!`
		}
	} else {
		error.message = '连接服务器失败!'
	}
	//  判断请求超时
	if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
		error.message = '网络异常，请检查网络后重试'
		console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
		// return service.request(originalRequest);//例如再重复请求一次
	}
	return Promise.resolve(error.response)
})
//function checkStatus (response) {
//// loading
//// 如果http状态码正常，则直接返回数据
//if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
//return response
//// 如果不需要除了data之外的数据，可以直接 return response.data
//}
//// 异常状态下，把错误信息返回去
//return {
//status: -404,
//msg: '网络异常'
//}
//}
function checkCode(res, callback) {
	//如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
	//if (res.status === -404) {
	//alert(res.msg)
	//}
	//if (res.data && (!res.data.success)) {
	//// alert(res.data.error_msg)
	//}
	if (res.code === 403) {
	} else {
		if (typeof callback === 'function') {
			callback(res)
		}
	}
}
export default {
	post(url, data, callback) {
		return axios({
			method: 'post',
			//baseURL: '/api/',
			url,
			data: qs.stringify(data),
			//timeout: 0,
			headers: {
				// 'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(
			(res) => {
				if (res.data !== undefined) {
					return checkCode(res.data, callback)
				}
			}
		)
	},
	get(url, params, callback) {
		return axios({
			method: 'get',
			//baseURL: 'http://test.cdlhzz.cn/mall',
			url,
			params //get 请求时带的参数
			//timeout: 0,
			// headers: {
			// 	'X-Requested-With': 'XMLHttpRequest'
			// }
		}).then(
			(res) => {
				if (res.data !== undefined) {
					return checkCode(res.data, callback)
				}
			}
		)
	}
}
