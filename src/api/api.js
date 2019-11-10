import axios from 'axios'
export function getCode() {
	localStorage.removeItem('type')
	const getKey = localStorage.getItem('type') ? localStorage.getItem('type') : 'mixin'
	// const getKey = 'banban'
	return new Promise(function(resolve, reject) {
		axios.get('http://api.oyxin.cn/chaoxchat/api/server_config.php?server_id=' + getKey).then(function(response) {
			if (response.data.state === '1') {
				resolve(response.data.config)
			} else {
			}
		}).catch(function(error) {
			reject(error)
		})
	})
}
