import vm from '@/main'
var websock = null
var globalCallback = null

// 初始化weosocket
function initWebSocket() {
	// ws地址 -->这里是你的请求路径
	var ws = 'ws://192.168.0.188:8500'
	websock = new WebSocket(ws)
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
	const msg = JSON.parse(e.data)
	console.log(msg)
	if (globalCallback === null) {
		return
	}
	globalCallback(msg)
	/*var sender/!*, userName, nameList, changeType*!/
	console.log(msg)
	const _this = this
	switch (msg.type) {
	case 'system':
		sender = '系统消息: '
		break
	case 'push_msg':
		_this.selectTalk(msg.msg_content)
		break
	case 'handshake':
		/!*const userInfo = {'type': 'login', 'content': {'phone': this.uName, 'pass': this.uPass}}
		_this.websocketsend(userInfo)*!/
		return
	case 'login':
		_this.FriendList = msg.user_list.friends
		_this.GroupList = msg.user_list.groups
		return
	case 'send_msg':
		if (msg.msg_info.state === 1) {
			_this.selectTalk({
				squareUrl: '',
				uName: '',
				lastTime: '',
				lastText: '',
				uid: msg.msg_info.push_uid,
				newCount: 0,
				list: [{msg: msg.msg_info.push_msg, squareUrl: _this.meUrl,	msgType: 2}],
				type: 'friends'
			})
		}
		return
	case 'logout':
		/!*userName = msg.content
		nameList = msg.user_list
		changeType = msg.type
		dealUser(userName, changeType, nameList)*!/
		return
	}
	console.log(sender + msg.content)*/
}

// 数据发送
function websocketsend(agentData) {
	websock.send(JSON.stringify(agentData))
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
