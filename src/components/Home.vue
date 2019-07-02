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
								<el-menu-item v-for="(item, index) in TalkList" :index="index" class="session-options" :class="{ selected: selectIndex!==index}" @click="talkClick(index)" :key = "index">
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
								<el-menu-item v-for="(item,listindex) in FriendList" :key = "listindex" class="contact-group">
										<template slot="title" class="contact-slice">{{item.slice}}</template>
										<el-menu-item  class="session-options selected" v-for="(info, index) in item.info" :index="index" :class="{ selected: selectIndex!==index}" @click="talkClick(index)" :key = "index">
											<div class="option-l">
												<el-avatar shape="square" :size="42" :src="info.squareUrl"></el-avatar>
											</div>
											<div class="option-r">
												<div class="option-line">
													<div class="dialog-title">{{info.uName}}</div>
												</div>
											</div>
										</el-menu-item>
								</el-menu-item>
							</el-menu>
						</div>
					</div>
				</el-aside>
				<el-main>
					<transition name="move" mode="out-in">
						<router-view></router-view>
					</transition>
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
					newCount: 0
				}
			],
			selectIndex: '',
			FriendList: [
				{
					slice: 'B',
					info: [
						{
							squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
							uName: '白犀牛'
						}
					]
				}
			]
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
		}
	},
	watch: { // 监测store.state
		'$store.state.adminleftnavnum': 'getNavType'
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
		/deep/ .el-main {
			width: 71.2%!important;;
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
</style>
