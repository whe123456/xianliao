<template>
	<div class="wrapper">
		<el-scrollbar class="app_main">
			<el-container>
				<el-aside class="main-inner-l">
					<div class="inner-l-header">
						<div class="user-info">
							<el-avatar class="user-avatar-pic" shape="square" :size="42" :src="squareUrl"></el-avatar>
							<span class="user-name">{{userName}}</span>
						</div>
						<el-dropdown trigger="click">
				<span class="el-dropdown-link">
					<i class="i_menu"></i>
				</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item><i class="el_icon-bell"></i>关闭桌面通知</el-dropdown-item>
								<el-dropdown-item><i class="el_icon-button"></i>退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div class="inner-l-body">
						<el-input v-model="input" placeholder="搜索" class="m-search"></el-input>
						<ul class="list-type-nav">
							<li class="list-type-option" @click="handleClick('first')">
								<i class="el_icon_select" :class="{ session: activeName!=='first', session2: activeName==='first' }"></i>
							</li>
							<li class="list-type-option" @click="handleClick('second')">
								<i class="el_icon_select" :class="{ contact: activeName!=='second', contact2: activeName==='second' }"></i>
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
										<el-avatar shape="square" :size="42" :src="item.squareUrl"></el-avatar>
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
											<el-avatar class="user-avatar-second" shape="square" :size="42" :src="info.squareUrl"></el-avatar>
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
				</el-aside>
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
											<div data-index="1" class="msg j-msg msg-chat message-out" v-if="item.msgType===2">
												<div class="message-detail-b">
													<div class="message-main j-message-main">
														<div class="message-info blue">
															<div class="message-info-text"><span>{{item.msg}}</span></div>
														</div>
														<div class="message-status"></div>
													</div>
												</div>
												<div class="message-detail-s">
													<el-avatar shape="square" :size="40" :src="item.squareUrl" class="message-speaker-avatar"></el-avatar>
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
										<label class="panel-block app-icon-bag i-file"><input type="file" class="input-file"></label>
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
											<quill-editor
												:options="editorOption"
												v-model="textarea">
											</quill-editor>
											<div contenteditable="false" class="input"></div>
											<div class="m-hide-seat"></div>
										</div>
									</div>
									<div class="button-control">
										<div class="btn-label">按下Shift+Enter换行</div>
										<el-button>发送</el-button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="main-inner-r" v-show="activeName==='second'">
						<div class="contact-info">
							<div class="contact-header">
								<div>查看详情</div>
							</div>
							<div class="contact-body">
								<el-avatar shape="square" :size="100" :src="Friendinfo.squareUrl" class="user-avatar-second"></el-avatar>
								<div class="contact-name">
									<p>{{Friendinfo.uName}}</p>
									<i class="app-icon-bag i-man"></i>
								</div>
								<el-button type="primary" class="btn-success">发送消息</el-button>
							</div>
						</div>
					</div>
				</el-main>
			</el-container>
		</el-scrollbar>
	</div>
</template>

<script>
export default {
	data() {
		return {
			squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
			userName: '白犀牛',
			input: '',
			activeName: 'first',
			TalkList: [
				{
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
						}
					]
				}
			],
			Talkinfo: {},
			selectIndex: '',
			FriendList: [
				{
					slice: 'B',
					info: [
						{
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							uName: '白犀牛'
						},
						{
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							uName: '白犀牛'
						}
					]
				},
				{
					slice: 'c',
					info: [
						{
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							uName: 'c犀牛'
						}
					]
				}
			],
			selectFriend: '',
			Friendinfo: {},
			textarea: '',
			empticon: [],
			show_panel: false,
			editorOption: {
				theme: 'bubble',
				placeholder: '',
				modules: {
					toolbar: {
						container: [],
						handlers: {}
					}
				}
			}
		}
	},
	methods: {
		getNavType() {
			this.navselected = this.$store.state.adminleftnavnum // store.state.adminleftnavnum里值变化的时候，设置navselected
		},
		selectItems(index) {
			this.$store.state.adminleftnavnum = index // 按钮选中之后设置当前的index为store里的值。
		},
		handleClick(e) {
			this.activeName = e
		},
		talkClick(e) {
			this.selectIndex = e
			this.Talkinfo = this.TalkList[e]
		},
		FriendClick(listindex, index) {
			this.selectFriend = listindex + '-' + index
			this.Friendinfo = this.FriendList[listindex].info[index]
		},
		showPanel() {
			this.show_panel = !this.show_panel
		},
		checkEmoji(e) {
			console.log(e)
			let textarea = this.textarea
			textarea = textarea + '<img src="' + e + '" class="input-emo">'
			console.log(textarea)
			this.textarea = textarea
		}
	},
	watch: { // 监测store.state
		'$store.state.adminleftnavnum': 'getNavType'
	},
	mounted() {
		const file = require.context('../assets/empticon/', false, /.png$/).keys()
		var array = Object.values(file.reduce((res, item, index) => {
			const src = require('../assets/empticon/' + item.substring(2))
			res[parseInt(index / 15)] ? res[parseInt(index / 15)].push(src) : res[parseInt(index / 15)] = [src]
			return res
		}, {}))
		console.log(array)
		this.empticon = array
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
		width: 1000px;
		height: 690px;
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
		/deep/ .el-aside {
			width: 28.8%!important;
		}
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
					.chat-body {
						order: 2;
						flex: 1 1 auto;
						min-height: 0;
						position: relative;
						overflow: hidden;
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
								.input-container {
									flex: 1 1 auto;
									width: 0;
									/deep/.input {
										line-height: 20px;
										font-size: 14px;
										user-select: text;
										word-wrap: break-word;
										white-space: pre-wrap;
										cursor: text;
										background-color:#eee;
										/deep/.el-textarea__inner{
											background-color:#eee;
											resize:none;
											border: none;
										}
										::-webkit-scrollbar{
											width:6px;
										}
										::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.6)}
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
</style>
