import vm from '@/main'
import util from '@/util/util'
var websock = null
var globalCallback = null

// 初始化weosocket
function initWebSocket() {
	// ws地址 -->这里是你的请求路径
	var ws = 'ws://192.168.0.106:8500'
	websock = new WebSocket(ws)
	websock.binaryType = 'arraybuffer'
	websock.onmessage = function(e) {
		websocketonmessage(e)
	}
	websock.onclose = function(e) {
		websocketclose(e)
	}
	websock.onopen = function() {
		websocketOpen()
	}
	// 连接发生错误的回调方法
	websock.onerror = function() {
		console.log('WebSocket连接发生错误')
	}
}

// 实际调用的方法
function sendSock(agentData, callback) {
	globalCallback = callback
	if (websock.readyState === websock.OPEN) {
		// 若是ws开启状态
		websocketsend(agentData)
	} else if (websock.readyState === websock.CONNECTING) {
		// 若是 正在开启状态，则等待1s后重新调用
		setTimeout(function() {
			sendSock(agentData, callback)
		}, 1000)
	} else {
		// 若未开启 ，则等待1s后重新调用
		setTimeout(function() {
			initWebSocket()
			sendSock(agentData, callback)
		}, 1000)
	}
}

// 数据接收
function websocketonmessage(e) { //数据接收
	const encode = util.binaryToStr(e.data)
	const JsonData = util.decrypt(encode)
	console.log(JsonData)
	const msg = JSON.parse(JsonData)
	console.log(msg)
	if (globalCallback === null) {
		return
	}
	globalCallback(msg)
}

// 数据发送
function websocketsend(agentData) {
	const JsonData = JSON.stringify(agentData)
	console.log(JsonData)
	const encryptData = util.encrypt(JsonData)
	console.log(encryptData)
	websock.send(util.strToBinary(encryptData))
}

// 关闭
function websocketclose(e) {
	sessionStorage.clear()
	vm.$router.push('/Login')
}

// 创建 websocket 连接
function websocketOpen(e) {
	console.log('连接成功')
}

initWebSocket()

// 将方法暴露出去
export {
	sendSock
}
