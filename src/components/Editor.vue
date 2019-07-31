<template>
	<div id="wangeditor">
		<el-upload
			id="uploadEl"
			:action="action"
			:headers="myHeaders"
			:multiple="false"
			:show-file-list="false"
			accept=".jpg,.jpeg,.png,.gif,.zip,.pdf,.rar"
			:limit="1"
			:http-request="fileUpload">
			<div class="w-e-menu"><i class="i-file"></i></div>
		</el-upload>
		<div ref="emoticonPanel" class="panel-control">
		</div>
		<div ref="editor" style="text-align:left"></div>
	</div>
</template>
<script>
import E from 'wangeditor'
import {emojiList} from '@/util/util.js'
import crypto from 'crypto'
export default {
	name: 'editor',
	data() {
		return {
			editor: '',
			myHeaders: {},
			action: 'http://v0.api.upyun.com/mixinimage'
		}
	},
	methods: {
		init() {
			this.editor = new E(this.$refs.emoticonPanel, this.$refs.editor)

			this.setMenus() //设置菜单
			this.editor.create() //创建编辑器
			const panel = document.getElementById('wangeditor').getElementsByClassName('panel-control')[0]
			const uploadEl = document.getElementById('uploadEl')
			panel.appendChild(uploadEl)
		},
		setMenus() {
			this.editor.customConfig.menus = [
				'emoticon'
			]
			this.editor.customConfig.emotions = [
				{
					// tab 的标题
					title: '<i class="app-icon-bag i-emo-face"></i>',
					// type -> 'emoji' / 'image'
					type: 'image',
					// content -> 数组
					content: emojiList()
				}
			]
		},
		getHtml() {
			return this.editor.txt.html()
		},
		setHtml(txt) {
			this.editor.txt.html(txt)
		},
		setFocus() {
			this.editor.$textElem.focus()
		},
		sign(key, secret, method, uri, date, policy = null, md5 = null) {
			const elems = [];
			[method, uri, date, policy, md5].forEach(item => {
				if (item != null) {
					elems.push(item)
				}
			})
			const value = elems.join('&')
			const auth = this.hmacsha1(secret, value)
			return `UPYUN ${key}:${auth}`
		},
		MD5(value) {
			return crypto.createHash('md5').update(value).digest('hex')
		},
		hmacsha1(secret, value) {
			return crypto.createHmac('sha1', secret).update(value, 'utf-8').digest().toString('base64')
		},
		fileUpload(e) {
			const _this = this
			this.$jsonp(_this.action, { file: e.file }).then(e => {
				console.log(e)
			})
			/*_this.axios.post('http://api.oyxin.cn/chaoxchat/upyun-php-sdk-3.3.0/php-sdk/examples/client-upload/policy.php', { save_path: e.file.name }, e.headers, (res) => {
			})
			console.log(e.file.name)
			_this.axios.post(_this.action, { file: e.file }, e.headers, (res) => {
			})*/
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.init()
		})
		const date = new Date().toGMTString()
		const key = 'osobo'
		const secret = 'osobo'
		const method = 'GET'
		const uri = '/v1/apps/'

		/*console.log(this.MD5('secret'))
		console.log(this.sign(key, this.MD5(secret), method, uri, date)) // 上传，处理，内容识别有存储
		console.log(this.sign(key, secret, method, uri, date))// 内容识别无存储，容器云*/
		this.myHeaders = {
			'Authorization': this.sign(key, this.MD5(secret), method, uri, date),
			'Content-Type': 'application/json'
		}
	}
}
</script>
<style lang="scss" scoped>
	/deep/ .w-e-text-container{
		border: none !important;
		height: auto !important;
		min-height: 40px;
		position: unset;
		padding: 0 20px;
	}
	/deep/ .w-e-text{
		padding: 0;
		display: flex;
		position: relative;
		height: 90px!important;
		img{
			width: 22px;
			height: 22px;
		}
	}

	/deep/ .w-e-text::-webkit-scrollbar{
		width:6px;
		height: 0;
	}
	/deep/ .w-e-text::-webkit-scrollbar-thumb{
		background-color:rgba(0,0,0,.6);
	}
	/deep/ .w-e-text p{
		word-break: break-all;
		margin: 0;
	}
	/deep/ .w-e-menu {
		display: flex !important;
		margin: 15px 0px 15px 20px;
		padding: 0 !important;
		.w-e-icon-happy {
			overflow: hidden;
			cursor: pointer;
			height: 24px;
			width: 24px;
			background-image: url("../assets/face.png");
			display: inline-block;
			background-position: 50%;
			background-repeat: no-repeat;
		}
		.w-e-icon-happy:before {
			display: none;
		}
	}

	/deep/ .w-e-panel-container {
		position: absolute!important;
		width: 470px!important;
		border: 1px solid #dedede!important;
		background-color: #fff!important;
		z-index: 999!important;
		left: 165px!important;
		display: flex!important;
		flex-direction: column-reverse!important;
		box-shadow: unset!important;
		top: calc(100% - 428px)!important;
		.w-e-panel-close{
			display: none;
		}
		.w-e-panel-tab-title {
			background-color: #f2f2f2 !important;
			margin: 0 !important;
			overflow: hidden !important;
			.w-e-active {
				display: inline-block !important;
				width: 56px !important;
				height: 38px !important;
				line-height: 38px !important;
				border-radius: 2px !important;
				text-align: center !important;
				margin: 0 !important;
				padding: 0 !important;
				background-color: #fff !important;
				color: unset !important;
				border: unset !important;
				i {
					position: relative;
					top: 6px;
				}
				.i-emo-face {
					height: 22px;
					width: 22px;
					background-image: url("../assets/i_face.png");
				}
			}
		}
		.w-e-panel-tab-content{
			padding: 14px;
			height: auto!important;
			.w-e-item {
				border: 1px solid #f0f0f0;
				cursor: pointer;
				margin-right: -1px;
				margin-top: -1px;
				height: 33px;
				width: 30px;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				img {
					display: inline-block;
					background-repeat: no-repeat;
					background-position: 50%;
					height: 22px;
					width: 22px;
				}
			}
		}
	}

	/deep/ .w-e-panel-container:after {
		position: absolute;
		bottom: -11px;
		left: 13px;
		content: " ";
		height: 14px;
		width: 17px;
		background-image: url("../assets/bottomIcon.png");
	}
	/deep/ .panel-control {
		.panel-block {
			margin-right: 16px;
			overflow: hidden;
			cursor: pointer;
		}
		.i-file {
			height: 24px;
			width: 24px;
			background: url("../assets/file.png") no-repeat 100%;
			.input-file {
				opacity: 0;
				cursor: pointer;
			}
		}
	}

	@media screen and (max-width: 1000px) and (min-width: 900px) {
		/deep/ .w-e-panel-container{
			top: calc(100% - 428px) !important;
		}
	}
	@media screen and (max-width: 900px) {
		/deep/ .w-e-panel-container{
			top: calc(100% - 428px) !important;
		}
	}
</style>
