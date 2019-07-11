<template>
	<div class="wrapper">
		<el-scrollbar class="app_main">
			<el-container>
				<div class="main-inner-l">
					<div class="inner-l-header">
						<div class="user-info">
							<el-avatar class="user-avatar-pic" shape="square" :size="42" :src="meUrl"></el-avatar>
							<span class="user-name">{{userName}}</span>
						</div>
						<el-dropdown trigger="click" @command="closesocket">
							<span class="el-dropdown-link">
								<i class="i_menu"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<!--<el-dropdown-item><i class="el_icon-bell"></i>关闭桌面通知</el-dropdown-item>-->
								<el-dropdown-item><i class="el_icon-button"></i>退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div class="inner-l-body">
						<el-autocomplete v-model="input" placeholder="搜索" class="m-search" :fetch-suggestions="querySearch" :trigger-on-focus="false" value-key="uName" @select="handleSelect"></el-autocomplete>
						<ul class="list-type-nav">
							<li class="list-type-option" @click="handleClick('first')">
								<i class="el_icon_select" :class="{ session: activeName!=='first', session2: activeName==='first' }"></i>
							</li>
							<li class="list-type-option" @click="handleClick('second')">
								<i class="el_icon_select" :class="{ contact: activeName!=='second', contact2: activeName==='second' }"></i>
							</li>
							<li class="list-type-option" @click="handleClick('three')">
								<i class="el_icon_select" :class="{ contact: activeName!=='three', contact2: activeName==='three' }"></i>
							</li>
						</ul>
						<div v-show="activeName==='first'">
							<el-menu
							class="el-menu-vertical-demo"
							background-color="#292c33"
							text-color="#fff"
							default-active="0"
							active-text-color="#FFF" v-show="TalkList.length>0">
								<el-menu-item v-for="(item, index) in TalkList" :index="index.toString()" class="session-options" :class="{ selected: selectIndex===index}" @click="talkClick(index)" :key = "index">
									<div class="option-l">
										<el-avatar shape="square" :size="42" :src="item.squareUrl">
											<img :src="squareUrl"/>
										</el-avatar>
									</div>
									<div class="option-r">
										<div class="option-line">
											<div class="dialog-title">
												<div class="dialog-name">{{item.uName}}</div>
											</div>
											<div class="last-time">{{item.lastTime}}</div>
										</div>
										<div class="option-line">
											<div class="last-msg">
												<span class="last-msg-quot"></span>
												<span class="last-msg-text">{{item.lastText}}</span>
											</div>
											<div class="new-count" v-show="item.newCount!==0">{{item.newCount}}</div>
										</div>
									</div>
								</el-menu-item>
							</el-menu>
							<div class="scroll-empty" v-show="TalkList.length===0">暂时没有新的会话</div>
						</div>
						<div v-show="activeName==='second'">
							<el-menu
								background-color="#292c33"
								text-color="#fff"
								default-active="0"
								active-text-color="#FFF">
								<el-menu-item-group v-for="(item,listindex) in FriendList" :key = "listindex" class="contact-group">
									<template slot="title" class="contact-slice">{{item.slice}}</template>
									<el-menu-item  class="session-options" v-for="(info, index) in item.info" :index="listindex+'-'+index" :class="{ selected: selectFriend===listindex+'-'+index}" @click="FriendClick(listindex,index)" :key = "index">
										<div class="option-l">
											<el-avatar class="user-avatar-second" shape="square" :size="42" :src="info.squareUrl">
												<img :src="squareUrl"/>
											</el-avatar>
										</div>
										<div class="option-r">
											<div class="option-line">
												<div class="dialog-title">{{info.uName}}</div>
											</div>
										</div>
									</el-menu-item>
								</el-menu-item-group>
							</el-menu>
						</div>
						<div v-show="activeName==='three'">
							<el-menu
								background-color="#292c33"
								text-color="#fff"
								default-active="0"
								active-text-color="#FFF">
								<el-menu-item-group v-for="(item,listindex) in GroupList" :key = "listindex" class="contact-group">
									<template slot="title" class="contact-slice">{{item.slice}}</template>
									<el-menu-item  class="session-options" v-for="(info, index) in item.info" :index="listindex+'-'+index" :class="{ selected: selectGroup===listindex+'-'+index}" @click="GroupClick(listindex,index)" :key = "index">
										<div class="option-l">
											<el-avatar class="user-avatar-second" shape="square" :size="42" :src="info.squareUrl">
												<img :src="squareUrl"/>
											</el-avatar>
										</div>
										<div class="option-r">
											<div class="option-line">
												<div class="dialog-title">{{info.uName}}</div>
											</div>
										</div>
									</el-menu-item>
								</el-menu-item-group>
							</el-menu>
						</div>
					</div>
				</div>
				<el-main>
					<div class="main-inner-r" v-show="activeName==='first'">
						<div class="inner-r-default" v-if="Object.values(this.Talkinfo).join('') === ''">
							<div class="tips">
								<i class="app-icon-bag i-logo3"></i>
								<div>未选择聊天</div>
							</div>
						</div>
						<div v-else class="chat-box">
							<div class="contact-header">
								<div>{{Talkinfo.uName}}</div>
							</div>
							<!--<div class="contact-header" v-if="Talkinfo.type==='friends'">
								<div>{{Talkinfo.uName}}</div>
							</div>
							<header class="chat-header j-chat-header" v-else-if="Talkinfo.type==='groups'" @click="showmember">
								<div class="dialog-title">{{Talkinfo.uName}}</div>
								<div class="dialog-extend">({{Talkinfo.member.length}})</div>
								<i class="member-status down"></i>
							</header>-->
							<div class="chat-body">
								<div class="message-list-scroll">
									<div class="chat-tips">
										<div class="tips-info">
											<i class="app-icon-bag i-lock"></i>
											<span>此对话中所发送的信息都已进行端到端的加密</span>
										</div>
									</div>
									<div class="message-empty" v-if="Talkinfo.list.length===0">暂时没有新消息</div>
									<div class="message-list" v-else>
										<div v-for="(item,index) in Talkinfo.list" :key = "index">
											<div :data-index="item.msgType" class="msg j-msg msg-system mt24" v-if="item.msgType===1">
												<div class="message-info">{{item.time}}</div>
											</div>
											<div :data-index="item.msgType" class="msg j-msg msg-chat message-out" v-else-if="item.msgType===2">
												<div class="message-detail-b">
													<div class="message-main j-message-main">
														<div class="message-info blue">
															<div class="message-info-text"><span v-html="item.msg"></span></div>
														</div>
														<div class="message-status"></div>
													</div>
												</div>
												<div class="message-detail-s">
													<el-avatar shape="square" :size="40" :src="item.squareUrl" class="message-speaker-avatar">
														<img :src="squareUrl"/>
													</el-avatar>
												</div>
											</div>
											<div :data-index="item.msgType" class="msg j-msg msg-chat" v-else-if="item.msgType===3">
												<div class="message-detail-s">
													<el-avatar shape="square" :size="40" :src="item.squareUrl" class="message-speaker-avatar">
														<img :src="squareUrl"/>
													</el-avatar>
												</div>
												<div class="message-detail-b">
													<div class="message-main j-message-main">
														<div class="message-info">
															<div class="message-info-text"><span v-html="item.msg"></span></div>
														</div>
														<div class="message-status"></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="chat-footer">
								<div class="input-field">
									<div class="panel-control">
										<label class="panel-block app-icon-bag i-face" @click="showPanel"></label>
										<!--<label class="panel-block app-icon-bag i-file">
											<el-upload
												ref="upload"
												action="https://jsonplaceholder.typicode.com/posts/"
												:show-file-list="false"
												:limit="1">
												<el-button slot="trigger" size="small" type="primary" class="input-file"></el-button>
											</el-upload>
										</label>-->
										<div class="mc" v-show="show_panel" @click="showPanel"></div>
										<div class="emoticon-panel" v-show="show_panel">
											<div class="body">
												<div class="emoticon-content">
													<table class="emoticon-tb">
														<tr v-for="(item,index) in empticon" :key = "index">
															<td v-for="(list,key) in item" :key = "key" @click="checkEmoji(list)"><i data-name="weixiao" class="emoticon-bag" :style="{backgroundImage:'url('+list+')'}"></i></td>
														</tr>
													</table>
												</div>
												<div class="collection-content"></div>
											</div>
											<div class="footer">
												<div class="emoticon-options emoticon emoticon-options_selected"><i class="app-icon-bag i-emo-face"></i></div>
											</div>
										</div>
									</div>
									<div class="input-control">
										<div class="input-container">
											<editor ref="editor" class="input"></editor>
											<div class="m-hide-seat"></div>
										</div>
									</div>
									<div class="button-control">
										<div class="btn-label">按下Shift+Enter换行</div>
										<el-button @click="sendMsg">发送</el-button>
									</div>
								</div>
							</div>
							<!--<div class="mc" v-show="show_member" @click="showmember"></div>
							<div class="member-info" v-show="show_member" v-if="Talkinfo.type==='groups' && Talkinfo.member.length>0">
								<div class="scroll-content">
									<div class="member-list">
										<div style="height: 100px;position: absolute;width: 100%;" v-show="show_Card" @click="showCard"></div>
										<div class="member" v-for="(item, index) in Talkinfo.member" :key="index" @click="showCard1">
											<el-avatar shape="square" :size="55" :src="item.squareUrl" class="user-avatar-second"></el-avatar>
											<p>{{item.name}}</p>
										</div>
									</div>
								</div>
							</div>-->
						</div>
					</div>
					<div class="main-inner-r" v-show="activeName==='second'">
						<div class="contact-info">
							<div class="contact-header">
								<div>查看详情</div>
							</div>
							<div class="contact-body">
								<el-avatar shape="square" :size="100" :src="Friendinfo.squareUrl" class="user-avatar-second">
									<img :src="squareUrl"/>
								</el-avatar>
								<div class="contact-name" v-show="Friendinfo.uName">
									<p>{{Friendinfo.uName}}</p>
									<i class="app-icon-bag i-man" v-if="Friendinfo.sex==1"></i>
									<i class="app-icon-bag i-girl" v-else-if="Friendinfo.sex==2"></i>
								</div>
								<el-button type="primary" class="btn-success" v-show="Friendinfo.uName" @click="createMsg">发送消息</el-button>
							</div>
						</div>
					</div>
					<div class="main-inner-r" v-show="activeName==='three'">
						<div class="contact-info">
							<div class="contact-header">
								<div>查看详情</div>
							</div>
							<div class="contact-body">
								<el-avatar shape="square" :size="100" :src="Groupinfo.squareUrl" class="user-avatar-second">
									<img :src="squareUrl"/>
								</el-avatar>
								<div class="contact-name" v-show="Groupinfo.uName">
									<p>{{Groupinfo.uName}}</p>
								</div>
								<el-button type="primary" class="btn-success" v-show="Groupinfo.uName" @click="createMsg('three')">发送消息</el-button>
							</div>
						</div>
					</div>
				</el-main>
				<div class="user-card" v-show="show_Card" v-if="Talkinfo.type==='groups'" :style="{top: screenY+'px',left: screenX+'px'}">
					<div class="card-content">
						<div class="card-h">
							<el-avatar shape="square" :size="220" :src="squareUrl"></el-avatar>
						</div>
						<div class="card-b">
							<div class="name-area">
								<i class="app-icon-bag i-chat action"></i>
								<p class="nickname">bhjb</p>
							</div>
						</div>
					</div>
				</div>
			</el-container>
		</el-scrollbar>
	</div>
</template>

<script>
import editor from '@/components/Editor'
export default {
	components: {
		editor: editor
	},
	data() {
		return {
			squareUrl: require('../assets/defaultUser.png'),
			meUrl: require('../assets/defaultUser.png'),
			userName: '白犀牛',
			input: '',
			activeName: 'first',
			TalkList: [
				/*{
					squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
					uName: '白犀牛',
					lastTime: '16:33',
					lastText: '111',
					newCount: 0,
					list: [
						{
							time: '09:41',
							msgType: 1
						},
						{
							msg: 'emmms',
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							msgType: 2
						},
						{
							msg: 'emmms',
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							msgType: 3
						}
					],
					type: 'friends'
				},
				{
					squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
					uName: '测试',
					lastTime: '16:33',
					lastText: '111',
					newCount: 0,
					list: [
						{
							time: '09:41',
							msgType: 1
						},
						{
							msg: 'emmms',
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							msgType: 2
						},
						{
							msg: 'emmms',
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							msgType: 3
						}
					],
					type: 'groups',
					member: [
						{
							name: 'emmms',
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
						},
						{
							name: 'emmms',
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
						}
					]
				}*/
			],
			Talkinfo: {},
			selectIndex: '',
			FriendList: /*数组字段py 拼音 uName 名称 squareUrl 头像 sex性别 uid发送消息id */
			[
				/*{
					slice: 'c',
					info: [
						{
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							uName: 'c犀牛',
							uid: 11031
						}
					]
				}*/
			],
			GroupList: [],
			selectFriend: '',
			selectGroup: '',
			Friendinfo: {},
			Groupinfo: {},
			textarea: '',
			empticon: [],
			show_panel: false,
			editorOption: {
				theme: 'bubble',
				placeholder: '',
				modules: {
					toolbar: {}
				}
			},
			websock: null,
			uName: '',
			uPass: '',
			SocketUrl: '',
			show_member: false,
			show_Card: false,
			screenX: 0,
			screenY: 0,
			mUid: ''
		}
	},
	methods: {
		handleClick(e) {
			this.activeName = e
		},
		talkClick(e) {
			this.selectIndex = e
			this.TalkList[e].newCount = 0
			this.Talkinfo = this.TalkList[e]
		},
		FriendClick(listindex, index) {
			this.selectFriend = listindex + '-' + index
			this.Friendinfo = this.FriendList[listindex].info[index]
		},
		GroupClick(listindex, index) {
			this.selectGroup = listindex + '-' + index
			this.Groupinfo = this.GroupList[listindex].info[index]
		},
		showPanel() {
			this.show_panel = !this.show_panel
		},
		showmember() {
			this.show_member = !this.show_member
			this.show_Card = false
		},
		showCard() {
			this.show_Card = !this.show_Card
		},
		showCard1(e) {
			this.screenX = e.x
			this.screenY = e.y
			this.show_Card = true
		},
		checkEmoji(e) {
			console.log(e)
			let textarea = this.$refs.editor.getHtml()
			textarea = textarea + "<img src='" + e + "' class='input-emo'>"
			console.log(textarea)
			this.textarea = textarea
			this.init()
		},
		init() {
			this.$refs.editor.setHtml(this.textarea)
		},
		sendMsg() {
			const userInfo = {'type': 'send_msg', 'content': {'phone': this.uName, 'pass': this.uPass, 'userUrl': this.squareUrl, 'userName': this.userName, 'mUid': this.mUid, 'uid': this.Talkinfo.uid, 'msg': this.$refs.editor.getHtml()}}
			console.log(userInfo)
			this.socketApi.sendSock(userInfo, this.websocketonmessage)
			this.textarea = ''
			this.TalkList[0].newCount = 0
			this.init()
		},
		createMsg(e) {
			let info = {}
			let type = ''
			if (e === 'three') {
				info = this.Groupinfo
				type = 'friends'
			} else {
				info = this.Friendinfo
				type = 'groups'
			}
			const Talk =
				{
					squareUrl: info.squareUrl,
					uName: info.uName,
					lastTime: '',
					lastText: '',
					uid: info.uid,
					newCount: 0,
					list: [],
					type: type
				}
			this.selectTalk(Talk)
		},
		selectTalk(data) {
			const findIndex = this.TalkList.findIndex(n => n.uid === data.uid)
			if (~findIndex) {
				let TheFind = [this.TalkList.find(n => n.uid === data.uid)]
				console.log('list', TheFind[0].list)
				TheFind[0].list = TheFind[0].list.concat(data.list)
				console.log('list', TheFind[0].list)
				this.TalkList.splice(findIndex, 1)
				this.TalkList = TheFind.concat(this.TalkList)
			} else {
				const Talk = [data]
				this.TalkList = Talk.concat(this.TalkList)
			}
			console.log(this.TalkList)
			this.selectIndex = 0
			this.Talkinfo = this.TalkList[0]
			this.activeName = 'first'
		},
		initWebSocket() { /*初始化weosocket*/
			this.socketApi.sendSock({'type': 'getList', 'content': {'phone': this.uName, 'pass': this.uPass}}, this.websocketonmessage)
		},
		websocketonmessage(msg) { //数据接收
			const _this = this
			switch (msg.type) {
			case 'push_msg':
				_this.selectTalk(msg.msg_content)
				break
			case 'getList':
				_this.FriendList = msg.user_list.friends
				_this.GroupList = msg.user_list.groups
				_this.mUid = msg.user_list.userid
				break
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
				break
			case 'logout':
				_this.websocketclose()
				break
			}
		},
		websocketclose(e) { //关闭
			console.log('connection closed ', e)
			sessionStorage.clear()
			this.$router.push('/Login')
		},
		closesocket() {
			console.log(11)
			const userInfo = {'type': 'logout', 'content': {}}
			this.socketApi.sendSock(userInfo, this.websocketonmessage)
		},
		querySearch(queryString, cb) {
			// 调用 callback 返回建议列表的数据
			let data = []
			switch (this.activeName) {
			case 'first':
				data = this.TalkList.filter((value) => {
					return value.uName.includes(queryString)
				})
				break
			case 'second':
				let info = this.FriendList.map((value) => {
					return value.info
				})
				data = info.reduce((a, b) => { return a.concat(b) })
				data = data.filter((value) => {
					return value.uName.includes(queryString)
				})
				break
			case 'three':
				let tinfo = this.GroupList.map((value) => {
					return value.info
				})
				data = tinfo.reduce((a, b) => { return a.concat(b) })
				data = data.filter((value) => {
					return value.uName.includes(queryString)
				})
				break
			}
			cb(data)
		},
		handleSelect(item) {
			switch (this.activeName) {
			case 'first':
				this.selectTalk(item)
				break
			case 'second':
				// this.FriendClick(listindex,index)
				this.Friendinfo = item
				break
			case 'three':
				this.Groupinfo = item
				break
			}
		}
	},
	destroyed() {
		//页面销毁时关闭长连接
		this.websocketclose()
	},
	mounted() {
		const _this = this
		window.onbeforeunload = function(e) {
			if (_this.$route.fullPath === '/') {
				e = e || window.event
				// 兼容IE8和Firefox 4之前的版本
				if (e) {
					e.returnValue = '关闭提示'
				}
				// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
				return '关闭提示'
			} else {
				window.onbeforeunload = null
			}
		}
		const uName = sessionStorage.getItem('uName')
		const uPass = sessionStorage.getItem('uPass')
		if (uName === null || uPass === null) {
			this.$router.push('/Login')
			return false
		}
		this.uName = uName
		this.uPass = uPass
		this.SocketUrl = sessionStorage.getItem('url')
		const file = require.context('../assets/empticon/', false, /.png$/).keys()
		var array = Object.values(file.reduce((res, item, index) => {
			const src = require('../assets/empticon/' + item.substring(2))
			res[parseInt(index / 15)] ? res[parseInt(index / 15)].push(src) : res[parseInt(index / 15)] = [src]
			return res
		}, {}))
		console.log(array)
		this.empticon = array
		this.initWebSocket()
	}
}
</script>

<style lang="scss">
</style>
<style lang="scss" scoped>
	.wrapper{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		min-height: 550px;
		min-width: 900px;
		background: url(../assets/app-bg.jpg) 100% no-repeat;
	}
	.app_main{
		display: flex;
		min-width: 900px;
		min-height: 550px;
		background-color: #fff;
	}
	.main-inner-l{
		position: relative;
		flex-direction: column;
		height: 100%;
		border-right: 1px solid #292c33;
		background-color: #292d32;
		color: #fff;
	}
	.el-container {
		.main-inner-r>div{
			position:relative;
			height:100%;
			width:100%;
			display: flex;
		}
		/deep/ .el-main {
			width: 71.2%!important;
			padding: 0;
			.main-inner-r {
				height: 100%;
				overflow: auto;
				background-color: #eee;
				.contact-info {
					flex-direction: column;
					background-color: inherit;
					overflow: hidden;
				}
				.contact-body {
					display: flex;
					align-items: center;
					flex-direction: column;
					.user-avatar-second{
						margin: 80px auto 0 auto;
						border-radius: 8px;
						overflow: hidden;
					}
					.contact-name{
						width: 100%;
						display: flex;
						justify-content: center;
						padding-top: 22px;
						align-items: center;
						p {
							display: inline-block;
							font-size: 18px;
							max-width: 50%;
							word-break: break-all;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.i-man {
							height: 18px;
							width: 18px;
							background-image: url("../assets/i_man.png");
						}
						.i-girl{
							height: 18px;
							width: 18px;
							background-image: url("../assets/i_girl.png");
						}
					}
					.btn-success{
						display: inline-block;
						border-radius: 4px;
						border: none;
						cursor: pointer;
						margin-top: 60px;
						min-width: 220px;
						font-size: 16px;
						line-height: 40px;
						background-color: #00a9e0;
						color: #fff;
						padding: 0;
					}
				}
				.chat-box{
					flex-direction: column;
					overflow: hidden;
					.chat-body::-webkit-scrollbar{
						width:6px;
						height: 8px;
					}
					.chat-body::-webkit-scrollbar-thumb{
						background-color:rgba(0,0,0,.6);
					}
					.chat-body {
						order: 2;
						flex: 1 1 auto;
						min-height: 0;
						position: relative;
						overflow-y: scroll;
						width: 100%;
						.message-list-scroll {
							padding-top: 6px;
							.chat-tips {
								text-align: center;
								margin-bottom: 14px;
								.tips-info {
									display: inline-block;
									line-height: 30px;
									padding: 0 20px;
									font-size: 13px;
									border-radius: 6px;
									color: #2b292a;
									background-color: #faf3c9;
									.i-lock {
										position: relative;
										top: 1px;
										margin-right: 8px;
										height: 13px;
										width: 12px;
										background-image: url("../assets/lock.png");
									}
								}
							}
							.message-empty {
								position: absolute;
								top: 40%;
								left: 50%;
								margin-left: -150px;
								width: 300px;
								font-size: 16px;
								color: #ccc;
								text-align: center;
							}
							.msg-system {
								text-align: center;
								.message-info {
									display: inline-block;
									padding: 0 24px;
									line-height: 22px;
									font-size: 13px;
									border-radius: 4px;
									background-color: #d4d4d4;
									color: #fff;
									user-select: text;
									max-width: 60%;
									word-break: break-all;
								}
							}
							.mt24 {
								margin-top: 24px;
							}
							.msg {
								position: relative;
								margin-bottom: 15px;
							}
							.message-out {
								justify-content: flex-end;
								align-items: center;
								display: flex;
								.message-status {
									left: -30px;
								}
							}

							.msg-chat {
								padding: 0 20px;
								display: flex;
								align-items: flex-start;
								.message-detail-b {
									margin: 0 16px;
									max-width: 65%;
									.message-main {
										position: relative;
										font-size: 0;
										.message-info {
											position: relative;
											min-height: 40px;
											min-width: 50px;
											font-size: 0;
											border-radius: 8px;
											background-color: #fff;
											user-select: text;
											text-align: left;
											white-space: pre-wrap;
											:before {
												right: -8px;
												content: " ";
												position: absolute;
												top: 6px;
												left: -8px;
												height: 8px;
												width: 8px;
												background-size: 100%;
												background-repeat: no-repeat;
												background-position: bottom;
												background-image: url('../assets/rightIcon.png');
												-webkit-transform: rotateY(0);
												transform: rotateY(0);
											}
											.message-info-text {
												padding: 9px 15px;
												font-size: 14px;
												line-height: 20px;
												word-break: break-all;
											}
										}
										.message-info.blue {
											background-color: #00a9e0;
											color: #fff;
										}
										.blue{
											:before {
												left: auto;
												background-image: url('../assets/blueIcon.png');
												-webkit-transform: rotateY(0);
												transform: rotateY(0);
											}
										}
									}
								}
								.message-detail-s {
									display: flex;
									align-items: center;
								}
								.message-status {
									position: absolute;
									top: 50%;
									right: -30px;
									margin-top: -10px;
									height: 20px;
									width: 20px;
								}
							}
						}
					}
					.chat-footer {
						order: 3;
						background-color: #eee;
						.input-field {
							padding: 15px 20px 22px 20px;
							background-color: inherit;
							border-top: 1px solid #d6d6d6;
							.panel-control {
								position: relative;
								margin-bottom: 10px;
								.panel-block {
									margin-right: 16px;
									overflow: hidden;
									cursor: pointer;
								}
								.i-face {
									height: 24px;
									width: 24px;
									background-image: url("../assets/face.png");
								}
								.i-file {
									height: 24px;
									width: 24px;
									background-image: url("../assets/file.png");
									.input-file {
										opacity: 0;
										cursor: pointer;
									}
								}
								.emoticon-panel {
									position: absolute;
									bottom: 50px;
									left: -10px;
									width: 473px;
									border: 1px solid #dedede;
									background-color: #fff;
									z-index: 999;
									.emoticon-content {
										padding: 14px;
										.emoticon-tb {
											width: 100%;
											table-layout: fixed;
											border: 1px solid #f0f0f0;
											td {
												border: 1px solid #f0f0f0;
												cursor: pointer;
											}
										}
									}
									.footer {
										background-color: #f2f2f2;
										.emoticon-options {
											display: inline-block;
											width: 56px;
											height: 38px;
											line-height: 38px;
											border-radius: 2px;
											text-align: center;
											i {
												position: relative;
												top: 6px;
											}
											.app-icon-bag.i-emo-face {
												height: 22px;
												width: 22px;
												background-image: url("../assets/i_face.png");
											}
										}
										.emoticon-options_selected {
											background-color: #fff;
										}
									}
								}
								.emoticon-panel:after {
									position: absolute;
									bottom: -11px;
									left: 13px;
									content: " ";
									height: 14px;
									width: 17px;
									background-image: url("../assets/bottomIcon.png");
								}
							}
							.input-control {
								margin-bottom: 10px;
								display: flex;
								.input-container::-webkit-scrollbar{
									width:6px;
									height: 8px;
								}
								.input-container::-webkit-scrollbar-thumb{
									background-color:rgba(0,0,0,.6);
								}
								.input-container::-webkit-scrollbar-button {
									display: none;
								}
								.input-container {
									flex: 1 1 auto;
									width: 0;
									overflow-y: scroll;
									height: 50px;
									/deep/.input {
										line-height: 20px;
										font-size: 14px;
										user-select: text;
										word-wrap: break-word;
										white-space: pre-wrap;
										cursor: text;
										background-color:#eee;
										::-webkit-scrollbar{
											width:0;
										}
										/deep/.el-textarea__inner{
											background-color:#eee;
											resize:none;
											border: none;
										}
										.input-emo {
											display: inline-block;
											vertical-align: middle;
											margin-right: 2px;
											background-size: 100% auto;
										}
									}
									.m-hide-seat {
										height: 1px;
										visibility: hidden;
									}
								}
							}
							.button-control {
								text-align: right;
								.btn-label {
									display: inline-block;
									margin-right: 6px;
									color: #888;
									font-size: 14px;
									button {
										width: 94px;
										height: 28px;
										line-height: 26px;
										border: 1px solid #9d9d9d;
										font-size: 14px;
										background-color: #fff;
										border-radius: 3px;
									}
								}
							}
						}
					}
				}
				.inner-r-default {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 14px;
					color: #ccc;
					.tips {
						position: relative;
						bottom: 16%;
						.i-logo3 {
							display: inline-block;
							width: 64px;
							height: 56px;
							background-image: url("../assets/icon3.png");
						}
					}
				}
			}
		}
	}

	.contact-header {
		flex: none;
		justify-content: center;
		align-content: center;
		align-items: center;
		height: 50px;
		padding: 0;
		font-size: 16px;
		background-color: #eee;
		border-bottom: 1px solid #d6d6d6;
		cursor: pointer;
		display: flex;
	}
	.chat-header {
		order: 1;
		flex: none;
		box-sizing: border-box;
		justify-content: center;
		align-content: center;
		align-items: center;
		height: 50px;
		padding: 10px 15px;
		font-size: 16px;
		line-height: 1.2;
		border-bottom: 1px solid #d6d6d6;
		cursor: pointer;
		display: flex;
		background-color: #eee;
		.dialog-title {
			max-width: 250px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.down {
			bottom: 1px;
			-webkit-transform: rotate(45deg);
			transform: rotate(45deg);
			position: relative;
			display: inline-block;
			vertical-align: middle;
			height: 5px;
			width: 5px;
			margin-left: 5px;
			border-bottom: 2px solid #888;
			border-right: 2px solid #888;
		}
	}
	.inner-l-header{
		flex: none;
		box-sizing: border-box;
		height: 72px;
		padding: 15px 22px 15px 18px;
		display: flex;
		justify-content: space-between;
		background-color: #2e3238;
		.user-info{
			display: flex;
		}
		.user-avatar-pic{
			border-radius: 4px;
			overflow: hidden;
			margin-right: 14px;
			background-color: #fff;
		}
		.user-name{
			font-size: 16px;
			line-height: 42px;
			max-width: 100px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.i_menu{
		position: relative;
		top: 12px;
		float: right;
		cursor: pointer;
		height: 15px;
		width: 18px;
		background-image: url("../assets/menu.png");
		display: inline-block;
	}
	.el-popper{
		background-color: #fff;
		border: 1px solid #d5d5d5;
		border-radius: 4px;
		font-style: normal;
		padding: 0;
		margin: 0;
		flex-direction: column;
		display: flex;
		/deep/ .el-dropdown-menu__item{
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			padding: 0 26px;
			height: 50px;
			line-height: 50px;
			width: 188px;
			font-size: 14px;
			color: #000;
			border-bottom: 1px solid #f1f1f1;
			display: flex;
			align-items: center;
		}
		/deep/ .popper__arrow{
			display: none;
		}
	}
	.el_icon-bell{
		height: 18px;
		width: 18px;
		margin-right: 20px;
		background: url("../assets/bell.png") 100% no-repeat;
	}
	.el_icon-button{
		height: 18px;
		width: 18px;
		margin-right: 20px;
		background: url("../assets/exit.png") 100% no-repeat;
	}
	.inner-l-body {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		width: 100%;
		overflow: hidden;
		.m-search {
			margin: 0 18px;
			padding: 0;
			height: 32px;
			font-size: 13px;
			width: unset;
			/deep/ .el-input__inner {
				width: 100%;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				padding: 0 0 0 30px;
				border: 0;
				height: 32px;
				line-height: 32px;
				color: #fff;
				background-color: #26292e;
			}
		}
		.list-type-nav{
			display: flex;
			height: 46px;
			width: 100%;
			padding: 0;
			justify-content: space-around;
			margin: 0;
			border-bottom: 1px solid #292c33;
			li{
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
				line-height: 46px;
			}
		}
		.el-menu{
			border: none;
		}
	}
	.el_icon_select{
		height: 24px;
		/deep/.session{
			width: 24px;
			background: url("../assets/session.png") 100% no-repeat;
		}
		/deep/.session2{
			width: 24px;
			background: url("../assets/session2.png") 100% no-repeat;
		}
		/deep/.contact{
			width: 28px;
			background: url("../assets/contact.png") 100% no-repeat;
		}
		/deep/.contact2{
			width: 28px;
			background: url("../assets/contact2.png") 100% no-repeat;
		}
	}
	.session-options{
		display: flex;
		height: 66px;
		border-bottom: 1px solid #292c33;
		padding: 0!important;
		.option-line:last-child{
			margin-bottom: 0;
		}
		.option-l{
			display: flex;
			align-items: center;
			margin: 0 15px 0 18px;
			height: 100%;
		}
		.option-r{
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-top: 5px;
			.option-line{
				display: flex;
				padding-right: 14px;
				margin-bottom: 6px;
				min-height: 13px;
				.dialog-title{
					display: flex;
					flex: 1 1 auto;
					padding-right: 10px;
					font-size: 14px;
					line-height: 1.2;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					.dialog-name{
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
				.last-time{
					font-size: 12px;
					color: #8e8e8f;
					line-height: 12px;
				}
				.last-msg{
					flex: 1 1 auto;
					display: flex;
					font-size: 13px;
					color: #8e8e8f;
					height: 16.9px;
					line-height: 16.9px;
					min-width: 0;
					overflow: hidden;
					.last-msg-text {
						flex: 1;
						min-width: 0;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.new-count{
					height: 16.9px;
					line-height: 16.9px;
					width: 16.9px;
					margin-right: 6px;
					border-radius: 16.9px;
					background-color: #f43530;
					font-size: 11px;
					text-align: center;
					color: #fff;
				}
			}
		}
	}
	.selected{
		background-color: #3a3f45!important;
	}
	/deep/ .el-input__inner {
		&::placeholder {
			color: #757575;
		}

		&::-webkit-input-placeholder {
			/* WebKit browsers 适配谷歌 */
			color: #757575;
		}

		&:-moz-placeholder {
			/* Mozilla Firefox 4 to 18 适配火狐 */
			color: #757575;
		}

		&::-moz-placeholder {
			/* Mozilla Firefox 19+ 适配火狐 */
			color: #757575;
		}

		&:-ms-input-placeholder {
			/* Internet Explorer 10+  适配ie*/
			color: #757575;
		}
	}
	.scroll-empty{
		text-align: center;
		line-height: 100px;
		font-size: 14px;
		color: #545b66;
	}
	.contact-slice{
		height: 31px;
		line-height: 31px;
		background-color: #292d32;
		padding-left: 18px;
		font-size: 14px;
		color: #b2b2b2;
	}
	/deep/.el-menu-item:hover{
		background-color: #3a3f45!important;
	}
	/deep/ .ql-editor {
		padding: 0;
	}
	/deep/ .ql-tooltip{
		display: none;
	}
	.member-info {
		position: absolute!important;
		left: 0;
		right: 0;
		top: 50px;
		background-color: #eee;
		border-bottom: 1px solid #d6d6d6;
		z-index: 1000;
		:before {
			content: " ";
			display: table;
		}
		:after {
			clear: both;
			content: " ";
			display: table;
		}
		.scroll-content::-webkit-scrollbar{
			width:6px;
			height: 8px;
		}
		.scroll-content::-webkit-scrollbar-thumb{
			background-color:rgba(0,0,0,.4);
		}
		.scroll-content {
			max-height: 290px;
			overflow-x: hidden;
			overflow-y: scroll;
			.member, .memberedit {
				position: relative;
				float: left;
				padding-top: 10px;
				height: 85px;
				width: 64px;
				margin-left: 7px;
				margin-right: 6px;
				text-align: center;
				z-index: 1002;
				img {
					height: 55px;
					width: 55px;
					border-radius: 4px;
					overflow: hidden;
					cursor: pointer;
				}
				p {
					font-size: 14px;
					line-height: 30px;
					min-height: 30px;
					width: 72px;
					text-align: center;
					margin-left: -4px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.user-card {
		position: absolute;
		background-color: #fff;
		border-radius: 4px;
		overflow: hidden;
		z-index: 20;
		z-index: 1000;
		.card-b {
			padding: 20px;
			.name-area {
				margin-bottom: 8px;
				.action {
					float: right;
				}
				.i-chat {
					width: 22px;
					height: 20px;
					background-image: url('../assets/chat.png');
				}
				.nickname {
					display: inline-block;
					max-width: 110px;
					font-size: 18px;
					vertical-align: middle;
					user-select: text;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	@media screen and (max-width: 1000px) and (min-width: 900px) {
		.app_main {
			height: 100% !important;
			width: 100%;
		}
		.main-inner-l {
			width: 30%;
		}
		.el-main {
			width: 70%;
		}
	}
	@media screen and (max-width: 900px) {
		.app_main {
			height: 100% !important;
			width: 100%;
		}
		.main-inner-l {
			width: 32%;
		}
		.el-main {
			width: 68%;
		}
	}
	@media screen and (min-width: 1000px) {
		.app_main {
			width: 1000px;
		}
		.main-inner-l {
			width: 28.8%;
		}
		.el-main {
			width: 71.2%;
		}
	}
	@media screen and (max-height: 841px) and (min-height: 690px) {
		.app_main {
			height: 690px;
		}
	}
	@media screen and (min-height: 841px) {
		.app_main {
			height: 82%;
		}
	}
</style>
