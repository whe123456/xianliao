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
								<el-dropdown-item disabled v-if="serverName">{{serverName}}</el-dropdown-item>
								<!--<el-dropdown-item><i class="el_icon-bell"></i>关闭桌面通知</el-dropdown-item>-->
								<el-dropdown-item><i class="el_icon-button"></i>退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div class="inner-l-body">
						<el-autocomplete v-model="input" placeholder="搜索" class="m-search" :fetch-suggestions="querySearch" :trigger-on-focus="false" value-key="nick" @select="handleSelect" popper-class="autocompleteSelect">
							<template slot-scope="{ item }">
								<div class="session-options">
									<div class="option-l">
										<el-avatar class="user-avatar-second" shape="square" :size="42" :src="item.head_url">
											<img :src="squareUrl"/>
										</el-avatar>
									</div>
									<div class="option-r">
										<div class="option-line">
											<div class="dialog-title">{{item.nick}}</div>
										</div>
									</div>
								</div>
							</template>
						</el-autocomplete>
						<ul class="list-type-nav">
							<li class="list-type-option" @click="handleClick('first')">
								<i class="el_icon_select" :class="{ session: activeName!=='first', session2: activeName==='first' }"></i>
							</li>
							<li class="list-type-option" @click="handleClick('second')">
								<i class="el_icon_select" :class="{ contact: activeName!=='second', contact2: activeName==='second' }"></i>
							</li>
							<li class="list-type-option" @click="handleClick('three')">
								<i class="el_icon_select" :class="{ contact3: activeName!=='three', contact4: activeName==='three' }"></i>
							</li>
						</ul>
						<div class="friendList">
							<div v-show="activeName==='first'">
								<el-menu
								class="el-menu-vertical-demo"
								background-color="#292c33"
								text-color="#fff"
								default-active="0"
								active-text-color="#FFF" v-show="TalkList.length>0">
									<el-menu-item v-for="(item, index) in TalkList" :index="index.toString()" class="session-options" :class="{ selected: selectIndex===index}" @click="talkClick(index)" :key = "index">
										<div class="option-l">
											<el-avatar shape="square" :size="42" :src="item.head_url">
												<img :src="squareUrl"/>
											</el-avatar>
										</div>
										<div class="option-r">
											<div class="option-line">
												<div class="dialog-title">
													<div class="dialog-name">{{item.nick}}</div>
												</div>
												<div class="last-time">{{item.lastTime}}</div>
											</div>
											<div class="option-line">
												<div class="last-msg">
													<span class="last-msg-quot"></span>
													<span class="last-msg-text" v-if="item.list[0].type==4">[图片]</span>
													<span class="last-msg-text" v-else v-html="item.lastText"></span>
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
										<el-menu-item class="session-options" v-for="(info, index) in item.info" :index="listindex+'-'+index" :class="{ selected: selectFriend===listindex+'-'+index}" @click="FriendClick(listindex,index)" :key = "index">
											<div class="option-l">
												<el-avatar class="user-avatar-second" shape="square" :size="42" :src="info.head_url">
													<img :src="squareUrl"/>
												</el-avatar>
											</div>
											<div class="option-r">
												<div class="option-line">
													<div class="dialog-title">{{info.nick}}</div>
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
									active-text-color="#FFF"
									unique-opened
									@open="GroupClick">
									<el-menu-item-group v-for="(item,listindex) in GroupList" :key = "listindex" class="contact-group">
										<template slot="title" class="contact-slice">{{item.slice}}</template>
										<el-submenu  class="session-options flexCloumn" v-for="(info, index) in item.info" :index="listindex+'-'+index" :class="{ selected: selectGroup===listindex+'-'+index}" :key = "index">
											<template slot="title">
												<div class="option-l">
													<el-avatar class="user-avatar-second" shape="square" :size="42" :src="info.head_url">
														<img :src="squareUrl"/>
													</el-avatar>
												</div>
												<div class="option-r">
													<div class="option-line">
														<div class="dialog-title">{{info.nick}}</div>
														<div class="dialog-title">({{info.userInfoList.length}})</div>
													</div>
												</div>
											</template>
											<el-menu-item v-for="(user,keyIndex) in info.userInfoList" class="session-options optionChild" @click="ChildClick(listindex,index,keyIndex)" :key = "keyIndex">
												<div class="option-l">
													<el-avatar class="user-avatar-second" shape="square" :size="42" :src="user.head_url">
														<img :src="squareUrl"/>
													</el-avatar>
												</div>
												<div class="option-r">
													<div class="option-line">
														<div class="dialog-title">{{user.nick}}</div>
													</div>
												</div>
											</el-menu-item>
										</el-submenu>
									</el-menu-item-group>
								</el-menu>
							</div>
						</div>
					</div>
				</div>
				<el-main>
					<div class="main-inner-r" v-show="showActive ==='first'">
						<div class="inner-r-default" v-if="Object.values(this.Talkinfo).join('') === ''">
							<div class="tips">
								<i class="app-icon-bag i-logo3"></i>
								<div>未选择聊天</div>
							</div>
						</div>
						<div v-else class="chat-box">
							<div class="contact-header">
								<div>{{Talkinfo.nick}}</div>
							</div>
							<!--<div class="contact-header" v-if="Talkinfo.type==='friends'">
								<div>{{Talkinfo.nick}}</div>
							</div>
							<header class="chat-header j-chat-header" v-else-if="Talkinfo.type==='groups'" @click="showmember">
								<div class="dialog-title">{{Talkinfo.nick}}</div>
								<div class="dialog-extend">({{Talkinfo.member.length}})</div>
								<i class="member-status down"></i>
							</header>-->
							<div class="chat-body" id="chat-body">
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
														<div class="message-info blue" v-if="item.type===0">
															<div class="message-info-text"><span v-html="item.msg"></span></div>
														</div>
														<div class="message-info blue" v-else>
															<viewer :images="[{src: item.msg}]">
																<img :src="item.msg" class="messageImg">
															</viewer>
														</div>
														<div class="message-status">
															<!--<i class="app-icon-bag i-waiting" v-show="wait && index === (Talkinfo.list.length-1)"></i>-->
															<i class="app-icon-bag i-waiting" v-show="item.wait"></i>
														</div>
													</div>
												</div>
												<div class="message-detail-s">
													<el-avatar shape="square" :size="40" :src="item.head_url" class="message-speaker-avatar">
														<img :src="squareUrl"/>
													</el-avatar>
												</div>
											</div>
											<div :data-index="item.msgType" class="msg j-msg msg-chat" v-else-if="item.msgType===3">
												<div class="message-detail-s">
													<el-avatar shape="square" :size="40" :src="item.head_url" class="message-speaker-avatar">
														<img :src="squareUrl"/>
													</el-avatar>
												</div>
												<div class="message-detail-b">
													<div class="userNick" v-if="Talkinfo.type==='groups'"><div>{{item.nick}}</div></div>
													<div class="message-main j-message-main">
														<div class="message-info" v-if="item.type===0">
															<div class="message-info-text"><span v-html="item.msg"></span></div>
														</div>
														<div class="message-info" v-else>
															<viewer :images="[{src: item.msg}]">
																<img :src="item.msg" class="messageImg">
															</viewer>
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
								<div class="input-field" v-loading="loading">
									<div class="input-control" @click="focusEditor">
										<div class="input-container">
											<editor ref="editor" class="input" @keyup.enter="sendMsg" :fatherSend="fatherSend"></editor>
											<div class="m-hide-seat"></div>
										</div>
									</div>
									<div class="button-control">
										<div class="btn-label">按下Shift+Enter换行</div>
										<el-button @click="sendMsg(0)">发送</el-button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="main-inner-r" v-show="showActive ==='second'">
						<div class="contact-info">
							<div class="contact-header">
								<div>查看详情</div>
							</div>
							<div class="contact-body">
								<el-avatar shape="square" :size="100" :src="Friendinfo.head_url" class="user-avatar-second">
									<img :src="squareUrl"/>
								</el-avatar>
								<div class="contact-name" v-show="Friendinfo.nick">
									<p>{{Friendinfo.nick}}</p>
									<i class="app-icon-bag i-man" v-if="Friendinfo.sex==1"></i>
									<i class="app-icon-bag i-girl" v-else-if="Friendinfo.sex==2"></i>
								</div>
								<el-button type="primary" class="btn-success" v-show="Friendinfo.nick" @click="createMsg">发送消息</el-button>
							</div>
						</div>
					</div>
					<div class="main-inner-r" v-show="showActive ==='three'">
						<div class="contact-info">
							<div class="contact-header">
								<div>查看详情</div>
							</div>
							<div class="contact-body">
								<el-avatar shape="square" :size="100" :src="Groupinfo.squareUrl" class="user-avatar-second">
									<img :src="squareUrl"/>
								</el-avatar>
								<div class="contact-name" v-show="Groupinfo.nick">
									<p>{{Groupinfo.nick}}</p>
								</div>
								<el-button type="primary" class="btn-success" v-show="Groupinfo.nick" @click="createMsg('three')">发送消息</el-button>
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
import {Decrypt, Encrypt} from '@/util/aes.js'
import {emojiListFind} from '@/util/util.js'
export default {
	components: {
		editor: editor
	},
	data() {
		return {
			squareUrl: require('../assets/defaultUser.png'),
			meUrl: require('../assets/defaultUser.png'),
			userName: '登陆中',
			input: '',
			activeName: 'first',
			TalkList: [],
			Talkinfo: {},
			selectIndex: '',
			FriendList: /*数组字段py 拼音 nick 名称 squareUrl 头像 sex性别 uid发送消息id */
			[],
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
			show_member: false,
			show_Card: false,
			screenX: 0,
			screenY: 0,
			mUid: '',
			TalkClick: 0,
			wait: false,
			FidList: [],
			GroupChild: 1, //1群页面2私聊页面，
			showActive: '',
			loading: false,
			showPic: false,
			showPicSrc: '',
			serverName: ''
		}
	},
	sockets: {
		chatevent(data) { //监听message事件，方法是后台定义和提供的
			const self = this
			if (data.cmd === 1405) {
				const info = Decrypt(data.data)
				const _this = this
				_this.$alert(info, '提示', {
					confirmButtonText: '确定',
					callback: () => {
						_this.closesocket(3)
					}
				})
			} else if (data.cmd === 1403) {
				const tbData = Decrypt(data.data)
				console.log(tbData)
				tbData.forEach((item) => {
					let msgType = 3
					if (self.mUid !== item.to_uid) {
						msgType = 2
					}
					let type = 'friends'
					if (item.is_group === 1) {
						type = 'groups'
					}
					let headUrl = self.meUrl
					if (item.type === 0) {
						const arr = item.body.match(/\[(.+?)\]/g)
						if (arr) {
							arr.map((e) => {
								const str = emojiListFind(e)
								item.body = item.body.replace(e, str)
							})
						}
					} else {
						// item.body = '<img src="' + item.file_url + '" class="sendImg">'
						item.body = item.file_url
					}
					self.selectTalk({
						head_url: '',
						nick: '',
						lastTime: item.create_ts,
						lastText: item.body,
						uid: item.to_uid,
						from_uid: item.from_uid,
						groupId: item.group_id,
						newCount: tbData.length,
						list: [{msg: item.body, head_url: headUrl, msgType: msgType, type: item.type}],
						type: type,
						editor: '',
						msgType: msgType
					})
				})
			}
		},
		disconnect(type = 1) {
			this.$socket.emit('reconnect', type)
		},
		reconnect(type = 1) {
			const self = this
			this.$socket.emit('chatevent', {cmd: 1402, data: ''}, function(e) {
			})
			sessionStorage.removeItem('Login')
			if (type === 2) {
				self.$router.push('/Login')
			} else if (type === 3) {
				sessionStorage.setItem('reload', '1')
				self.$router.push('/Login')
			}
		},
		connect() {
			console.log('socket connected')
		}
	},
	methods: {
		handleClick(e) {
			this.activeName = e
			this.showActive = e
		},
		talkClick(e) {
			let body = this.$refs.editor.getHtml().replace('<p>', '')
			body = body.replace('</p>', '')
			body = body.replace('<br>', '')
			this.TalkList[this.TalkClick].editor = body
			this.selectIndex = e
			this.TalkList[e].newCount = 0
			this.Talkinfo = this.TalkList[e]
			this.TalkClick = e
			this.$refs.editor.setHtml(this.TalkList[e].editor)
			this.focusEditor()
		},
		focusEditor() {
			this.$refs.editor.setFocus()
		},
		FriendClick(listindex, index) {
			this.selectFriend = listindex + '-' + index
			this.Friendinfo = this.FriendList[listindex].info[index]
		},
		GroupClick(index) {
			const path = index.split('-')
			this.selectGroup = path
			this.Groupinfo = this.GroupList[path[0]].info[path[1]]
			this.GroupChild = 1
		},
		ChildClick(listindex, index, keyIndex) {
			this.selectGroup = listindex + '-' + index
			this.Groupinfo = this.GroupList[listindex].info[index].userInfoList[keyIndex]
			this.GroupChild = 2
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
		init() {
			this.$refs.editor.setHtml(this.textarea)
		},
		sendMsg(type = 0, url = '') {
			console.log('type', type)
			let sendBody = ''
			let fileUrl = ''
			let body = ''
			if (type === 0) {
				body = this.$refs.editor.getHtml().replace(new RegExp('<p>', 'g'), '').replace(new RegExp('</p>', 'g'), '').replace(new RegExp('<br>', 'g'), '\n').replace(new RegExp('&nbsp;', 'g'), '')
				if (body === '') {
					return
				}
				sendBody = body.split('<')
				const matchVal = sendBody.map((e) => {
					const bodyStr = e.split('>')
					const match = bodyStr.map((res) => {
						if (~res.indexOf('alt')) {
							const reg = /(.*?)alt=('|")(.*?)\2.*?([^<]*)/gi
							const find = reg.exec(res)
							return find[3]
						} else {
							return res
						}
					})
					return match.join('')
				})
				sendBody = matchVal.join('')
				// console.log(sendBody)
				// return
			} else {
				fileUrl = url
				// body = '<img src="' + url + '" class="sendImg">'
				body = url
			}
			let isGroup = 1
			if (this.Talkinfo.type === 'friends') {
				isGroup = 0
			}
			if (this.showActive !== 'first') {
				return
			}
			const self = this
			var obj = {
				from_uid: this.mUid, //我自己的uid
				is_group: isGroup, //是否是群消息 0：私聊消息（需要设置to_uid） 1：群消息（需要设置group_id）
				to_uid: this.Talkinfo.uid, //好友的uid 主要不是uuid
				group_id: this.Talkinfo.groupId, //群消息 id
				type: type, //消息内容类型 0：文字，1：语音 2：视频 3：文件 4:图片 5:提示消息 6：撤回消息 7：个人名片  暂时只支持 （0 4）
				body: sendBody, //文字信息内容
				file_url: fileUrl //非文字内容的资源地址（如：图片或视频，需要传这个）
			}
			self.wait = true
			self.init()
			self.textarea = ''
			self.TalkList[0].newCount = 0
			const length = self.selectTalk({
				head_url: self.Talkinfo.head_url,
				nick: self.Talkinfo.nick,
				lastTime: '',
				lastText: '',
				uid: self.Talkinfo.uid,
				groupId: self.Talkinfo.groupId,
				newCount: 0,
				list: [{msg: body, head_url: self.meUrl, msgType: 2, wait: true, type: type}],
				type: self.Talkinfo.type,
				editor: '',
				wait: true
			})
			console.log(body)
			self.$socket.emit('chatevent', {cmd: 1403, data: Encrypt(obj)}, function(e) {
				const info = Decrypt(e)
				if (info['state'] === 1) {
					self.wait = false
					self.TalkList[0].list[length].wait = false
				}
			})
		},
		createMsg(e) {
			this.showPic = true
			let info = {}
			let type = ''
			let groupId = ''
			let uid = ''
			if (e === 'three') {
				info = this.Groupinfo
				type = 'groups'
				groupId = info.group_id
				if (this.GroupChild === 2) {
					if (info.uid === this.mUid) {
						return
					}
					console.log(this.FidList)
					if (!this.FidList.includes(info.uid)) {
						this.$message('不是好友关系')
						return
					}
				}
			} else {
				info = this.Friendinfo
				type = 'friends'
				uid = info.friend_uid
			}
			const Talk =
				{
					head_url: info.head_url,
					nick: info.nick,
					lastTime: '',
					lastText: '',
					uid: uid,
					groupId: groupId,
					newCount: 0,
					list: [{
						type: 0
					}],
					type: type,
					editor: ''
				}
			this.selectTalk(Talk)
		},
		selectTalk(data) {
			console.log('data', data)
			let msgType = 2
			if (data.hasOwnProperty('msgType')) {
				msgType = data.msgType
				delete data.msgType
			}
			console.log(msgType)
			if (data.type === 'friends') {
				let info = ''
				if (data.uid === this.mUid) {
					this.FriendList.forEach((value) => {
						const findinfo = value.info.find(n => n.uid === data.from_uid)
						if (typeof findinfo !== 'undefined') {
							info = findinfo
						}
					})
				} else {
					this.FriendList.forEach((value) => {
						const findinfo = value.info.find(n => n.uid === data.uid)
						if (typeof findinfo !== 'undefined') {
							info = findinfo
						}
					})
				}
				if (info !== '') {
					data.head_url = info.head_url
					data.nick = info.nick
					console.log(msgType)
					if (msgType === 3) {
						data.list[0].head_url = info.head_url
					}
				}
			} else {
				let info = ''
				this.GroupList.forEach((value) => {
					const findinfo = value.info.find(n => n.group_id === data.groupId)
					if (typeof findinfo !== 'undefined') {
						info = findinfo
					}
				})
				if (info !== '') {
					console.log('info', info)
					data.head_url = info.head_url
					data.nick = info.nick + '(' + info.userInfoList.length + ')'
					if (msgType === 3) {
						const findUser = info.userInfoList.find(n => n.uid === data.from_uid)
						if (typeof findUser !== 'undefined') {
							data.list[0].head_url = findUser.head_url
							data.list[0].nick = findUser.nick
						}
					}
				}
			}
			const self = this
			let length = 0
			if (this.TalkList.length === 0) {
				if (data.uid === this.mUid) {
					data.uid = data.from_uid
				}
				this.TalkList = [data]
			} else {
				let body = self.$refs.editor.getHtml().replace('<p>', '')
				body = body.replace('</p>', '')
				body = body.replace('<br>', '')
				self.TalkList[self.TalkClick].editor = body
				self.$refs.editor.setHtml('')
				let wait = false
				if (data.hasOwnProperty('wait')) {
					wait = data.wait
					delete data.wait
				}
				if (data.type === 'friends') {
					let findId = ''
					if (data.uid === this.mUid) {
						findId = data.from_uid
					} else {
						findId = data.uid
					}
					console.log('findId', findId)
					console.log('TalkList', this.TalkList)
					const findIndex = this.TalkList.findIndex(n => n.uid === findId)
					if (~findIndex) {
						let TheFind = [this.TalkList.find(n => n.uid === findId)]
						if (msgType === 3) {
							TheFind[0].lastTime = data.lastTime
							TheFind[0].lastText = data.lastText
							TheFind[0].newCount = TheFind[0].newCount + 1
						}
						TheFind[0].list = TheFind[0].list.concat(data.list)
						if (wait) {
							length = TheFind[0].list.length - 1
						}
						this.TalkList.splice(findIndex, 1)
						this.TalkList = TheFind.concat(this.TalkList)
					} else {
						const Talk = [data]
						this.TalkList = Talk.concat(this.TalkList)
					}
				} else {
					const findIndex = this.TalkList.findIndex(n => n.groupId === data.groupId)
					if (~findIndex) {
						let TheFind = [this.TalkList.find(n => n.groupId === data.groupId)]
						if (msgType === 3) {
							TheFind[0].lastTime = data.lastTime
							TheFind[0].lastText = data.lastText
							TheFind[0].newCount = TheFind[0].newCount + 1
						}
						TheFind[0].list = TheFind[0].list.concat(data.list)
						if (wait) {
							length = TheFind[0].list.length - 1
						}
						this.TalkList.splice(findIndex, 1)
						this.TalkList = TheFind.concat(this.TalkList)
					} else {
						const Talk = [data]
						this.TalkList = Talk.concat(this.TalkList)
					}
				}
			}
			this.selectIndex = 0
			console.log('TalkList', this.TalkList)
			this.Talkinfo = this.TalkList[0]
			this.activeName = 'first'
			this.showActive = 'first'
			this.$nextTick(() => {
				var div = document.getElementById('chat-body')
				div.scrollTop = div.scrollHeight
			})

			self.tiemOut = setTimeout(function() {
				self.$refs.editor.setHtml(self.TalkList[0].editor)
				self.$refs.editor.setFocus()
			}, 1)
			return length
		},
		initWebSocket() { /*初始化weosocket*/
			const self = this
			self.$socket.emit('chatevent', {cmd: 1404, data: Encrypt('')}, function(e) {
				const data = Decrypt(e)
				console.log('1404', data)
				if (data.state === 0) {
					self.websocketclose()
					return
				}
				self.FidList = data.friends.map((e) => {
					return e.friend_uid
				})
				const rData = data.friends.reduce((res, item, index) => {
					/* eslint-disable */
					item['py'] = pinyinUtil.getFirstLetter(item.nick.substring(0, 1)).toUpperCase()
					/* eslint-disable */
					item['index'] = index
					if (item['nick_mark'] !== '') {
						item['nick'] = item['nick_mark']
					}
					item['uid'] = item.friend_uid
					res[index] = item
					return res
				}, [])
				const friendsData = rData.reduce((res, item) => {
					const index = res.findIndex(n => n.slice === item['py'])
					if (~index) {
						res[index].info.push(item)
					} else {
						res[res.length] = {
							slice: item['py'],
							info: [item]
						}
					}
					return res
				}, [])
				self.FriendList = friendsData.sort((x, y) => {
					if (x.slice.toLowerCase() > y.slice.toLowerCase()) {
						return 1
					}
					return -1
				})
				const gData = data.groups.reduce((res, item, index) => {
					/* eslint-disable */
					item['py'] = pinyinUtil.getFirstLetter(item.title.substring(0, 1)).toUpperCase()
					/* eslint-disable */
					item['nick'] = item['title']
					item['index'] = index
					const userInfoList = item.userInfoList.reduce((res, item, index) => {
						item['nick'] = item['group_nick']?item['group_nick']:item['nick']
						let arr1 = data.friends.filter( (value, index) => value['uid']==item['uid'])
						if(arr1[0]){
							item['nick'] = arr1[0]['nick_mark']?arr1[0]['nick_mark']:item['nick']
						}
						res[index] = item
						return res
					}, [])
					console.log('userInfoList',userInfoList)
					res[index] = item
					return res
				}, [])
				const groupsData = gData.reduce((res, item) => {
					const index = res.findIndex(n => n.slice === item['py'])
					if (~index) {
						res[index].info.push(item)
					} else {
						res[res.length] = {
							slice: item['py'],
							info: [item]
						}
					}
					return res
				}, [])
				console.log(groupsData)
				self.GroupList = groupsData.sort((x, y) => {
					if (x.slice.toLowerCase() > y.slice.toLowerCase()) {
						return 1
					}
					return -1
				})
			})
		},
		closesocket(type=2) {
			const _this = this
			sessionStorage.clear()
			_this.websocketclose(type)
		},
		querySearch(queryString, cb) {
			// 调用 callback 返回建议列表的数据
			let data = []
			let tdata = []
			let info = this.FriendList.map((value) => {
				return value.info
			})
			data = info.reduce((a, b) => { return a.concat(b) })
			data = data.filter((value) => {
				return value.nick.includes(queryString)
			})
			let tinfo = this.GroupList.map((value) => {
				return value.info
			})
			tdata = tinfo.reduce((a, b) => { return a.concat(b) })
			tdata = tdata.filter((value) => {
				return value.nick.includes(queryString)
			})
			const returnData = tdata.concat(data)
			console.log(returnData)
			cb(returnData)
		},
		handleSelect(item) {
			console.log(item)
			if (item.hasOwnProperty('userInfoList')) {
				this.Groupinfo = item
				this.showActive = 'three'
			} else {
				this.Friendinfo = item
				this.showActive = 'second'
			}
		},
		websocketclose(type = 1) {
			this.$socket.emit('disconnect', type)
		},
		fatherSend(e, type = 1) {
			if (type === 1) {
				this.loading = false
				if (e.result === 1) {
					const url = e.url
					this.sendMsg(4, url)
				}
			} else {
				this.loading = true
			}
		}
	},
	destroyed() {
		//页面销毁时关闭长连接
		this.websocketclose()
	},
	mounted() {
		if (sessionStorage.getItem('serverName')!== null && sessionStorage.getItem('serverName')!== 'null') {
			this.serverName = sessionStorage.getItem('serverName')
		}
		const _this = this
		this.showPicSrc = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png'
		this.showPic = true


		window.onbeforeunload = function(e) {
			if (_this.$route.fullPath === '/') {
				_this.websocketclose()
			} else {
				window.onbeforeunload = null
			}
		}
		const LoginInfo = sessionStorage.getItem('LoginInfo')
		console.log('LoginInfo', JSON.parse(LoginInfo))
		let Login = sessionStorage.getItem('Login')
		let timeOut = 0
		if (LoginInfo !== null && Login === null) {
			console.log({cmd: 1401, data: Encrypt(JSON.parse(LoginInfo))})
			timeOut = 100
			_this.$socket.emit('chatevent', {cmd: 1401, data: Encrypt(JSON.parse(LoginInfo))}, function(e) {
				const info = Decrypt(e)
				console.log(info)
				_this.loading = false
				if (info.state === 1) {
					sessionStorage.setItem('LoginInfo', JSON.stringify({userid: info.userinfo.userid, s_code: info.s_code}), info)
					Login = JSON.stringify(info.userinfo)
					sessionStorage.setItem('Login', Login)
				} else {
					sessionStorage.removeItem('LoginInfo')
				}
			})
		}
		setTimeout(function() {
			console.log(Login)
			if (Login === null) {
				_this.$router.push('/Login')
				return false
			}
			const LoginData = JSON.parse(Login)
			_this.userName = LoginData.nick
			_this.meUrl = LoginData.head_url
			_this.mUid = LoginData.userid
			_this.initWebSocket()

			document.onkeydown = function(e) {
				const key = e.keyCode
				if (key === 13 && !e.shiftKey) {
					_this.sendMsg()
				}
			}
		}, timeOut)
		/*const self = this
		setTimeout(function() {
		const tbData = [{
			body: ".",
			body_id: 985560,
			create_ts: "2019-11-19 14:56:16",
			file_time: 0,
			file_url: "",
			from_create_app: 1,
			from_uid: 10925,
			group_id: 189,
			is_group: 1,
			is_sync: 0,
			is_systemmsg: 0,
			is_web_receive: 0,
			message_type: 0,
			sign: "10925874491574146576808",
			state: 0,
			to_uid: 10926,
			type: 0,
			upload_id: 0,
		}]
		tbData.forEach((item) => {
			let msgType = 3
			if (self.mUid !== item.to_uid) {
				msgType = 2
			}
			let type = 'friends'
			if (item.is_group === 1) {
				type = 'groups'
			}
			let headUrl = self.meUrl
			if (item.type === 0) {
				const arr = item.body.match(/\[(.+?)\]/g)
				if (arr) {
					arr.map((e) => {
						const str = emojiListFind(e)
						item.body = item.body.replace(e, str)
					})
				}
			} else {
				// item.body = '<img src="' + item.file_url + '" class="sendImg">'
				item.body = item.file_url
			}
			self.selectTalk({
				head_url: '',
				nick: '',
				lastTime: item.create_ts,
				lastText: item.body,
				uid: item.to_uid,
				from_uid: item.from_uid,
				groupId: item.group_id,
				newCount: tbData.length,
				list: [{msg: item.body, head_url: headUrl, msgType: msgType, type: item.type}],
				type: type,
				editor: '',
				msgType: msgType
			})
		})
		}, 2000)*/
	}
}
</script>

<style lang="scss">
	.autocompleteSelect{
		width: 260px;
		.el-scrollbar__wrap{
			overflow: scroll;
			.session-options{
				border: none;
				margin: 5px 0;
			}
		}
		.el-scrollbar__wrap::-webkit-scrollbar{
			width:0;
		}
		.el-scrollbar__wrap::-webkit-scrollbar-thumb{
			/*background-color:rgba(0,0,0,.4);*/
			background-color:rgba(220,220,220,1);
		}
	}
</style>
<style lang="scss" scoped>
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
												span{
													display: flex;
													align-items: center;
													img{
														width: 22px;
														height: 22px;
													}
												}
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
							background-color: inherit;
							border-top: 1px solid #d6d6d6;
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
									/*overflow-y: scroll;*/
									/*height: 50px;*/
									height: 150px;
									/deep/.input {
										line-height: 20px;
										font-size: 14px;
										user-select: text;
										word-wrap: break-word;
										cursor: text;
										background-color:#eee;
										.el-textarea__inner{
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
								padding: 0 20px 22px 20px;
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
		.el-dropdown-menu__item{
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
		.popper__arrow{
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
		height: calc(100% - 72px);
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
		.friendList{
			height: calc(100% - 78px);
			overflow-x: hidden;
			overflow-y: scroll;
		}

		.friendList::-webkit-scrollbar{
			width:6px;
			height: 8px;
		}
		.friendList::-webkit-scrollbar-thumb{
			/*background-color:rgba(0,0,0,.4);*/
			background-color:rgba(220,220,220,1);
		}
	}
	.el_icon_select{
		height: 24px;
		cursor: pointer;
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
		/deep/.contact3{
			width: 28px;
			background: url("../assets/contact4.png") 100% no-repeat;
		}
		/deep/.contact4{
			width: 28px;
			background: url("../assets/contact3.png") 100% no-repeat;
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
			/*background-color:rgba(0,0,0,.4);*/
			background-color:rgba(220,220,220,1);
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
	@media screen and (max-height: 690px) and (min-height: 450px) {
		.app_main {
			height: 450px !important;
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
