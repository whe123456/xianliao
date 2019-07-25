<template>
    <div class="wrapper">
		<div class="app-login" v-if="qr">
			<div class="login-scan">
				<div class="title">密信</div>
				<div class="scan-area" v-loading="loading">
					<div class="qr-content timeout status" v-if="visible">
						<p class="second">二维码失效</p>
						<el-button type="primary" size="small" @click="getQr">刷新</el-button>
					</div>
					<div class="qr-content">
						<div class="qr">
							<div id="qrcode"></div>
						</div>
					</div>
				</div>
				<div class="tips-content"><div class="tips-main" @click="qrchange">请使用手机密信扫码登录</div></div>
			</div>
		</div>
		<div class="login-scan" v-else>
			<div class="ms-title" @click="qrchange">密信登录</div>
			<div class="ms-login" v-loading="loading">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
					<el-form-item prop="username">
						<el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
					</el-form-item>
					<div class="login-btn">
						<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
					</div>
				</el-form>
			</div>
		</div>
    </div>
</template>

<script>
import {Decrypt, Encrypt} from '@/util/aes.js'
import QRCode from 'qrcodejs2' // 引入qrcode
let sha256 = require('js-sha256').sha256
export default {
	data() {
		return {
			ruleForm: {
				username: '',
				password: ''
			},
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
			loading: false,
			qr: true,
			tiemOut: '',
			visible: false,
			qrcode: ''
		}
	},
	sockets: {
		connect() {
			console.log('connect')
		},
		chatevent(data) { //监听message事件，方法是后台定义和提供的
			if (data.cmd === 1407) {
				const info = Decrypt(data.data)
				sessionStorage.setItem('Login', JSON.stringify(info.userinfo))
				this.$router.push('/')
			} else if (data.cmd === 1405) {
				const info = Decrypt(data.data)
				this.$alert(info, '提示', {
					confirmButtonText: '确定'
				})
			}
		},
		disconnect() {
			console.log(212121)
			this.$socket.emit('reconnect')
		},
		reconnect() {
			console.log(212121)
			this.$router.go(0)
		}
	},
	methods: {
		submitForm(formName) {
			const self = this
			this.loading = true
			self.$refs[formName].validate((valid) => {
				if (valid) {
					console.log(valid)
					/*var obj = {
						userid: '10925',
						pass: sha256('111111')
					}*/
					var obj = Encrypt({userid: self.ruleForm.username, pass: sha256(self.ruleForm.password)})
					self.$socket.emit('chatevent', {cmd: 1401, data: obj}, function(e) {
						const info = Decrypt(e)
						self.loading = false
						if (info.state === 1) {
							sessionStorage.setItem('Login', JSON.stringify(info.userinfo))
							self.$router.push('/')
						} else {
							self.$alert(info.msg, '提示', {
								confirmButtonText: '确定'
							})
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		qrchange() {
			this.qr = !this.qr
		},
		getQr() {
			const self = this
			console.log(111)
			self.$socket.emit('chatevent', {cmd: 1406, data: Encrypt('')}, function(e) {
				self.loading = false
				const data = Decrypt(e)
				console.log(data)
				if (data.state === 1) {
					document.getElementById('qrcode').innerHTML = ''
					self.qrcode = new QRCode('qrcode', {
						width: 266,
						height: 266,
						text: data.qr_code, // 二维码地址
						colorDark: '#000',
						colorLight: '#fff'
					})
					self.visible = false
					document.getElementById('qrcode').title = ''
					self.tiemOut = setTimeout(function() {
						self.visible = true
					}, data.timeOut)
				}
			})
		}
	},
	beforeDestroy() {
		clearTimeout(this.tiemOut)
	},
	mounted() {
		const Login = sessionStorage.getItem('Login')
		console.log(Login)
		if (Login !== null) {
			this.$router.push('/')
			return false
		}
		this.getQr()
	}
}
</script>
<style lang="scss" scoped>
	.ms-title{
		text-align: center;
		font-size:30px;
		color: #fff;
		margin-bottom: 40px;
	}
    .ms-login{
        width:300px;
        height:160px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
	.app-login {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -270px;
		margin-left: -190px;
		height: 540px;
		width: 380px;
		border-radius: 5px;
		background-color: #fff;
		text-align: center;
		.login-scan {
			padding: 54px 38px;
			text-align: center;
			.scan-area{
				height: 266px;
				width: 266px;
				margin: auto;
				position: relative;
				.qr-content {
					height: 100%;
					width: 100%;
					position: relative;
					background-color: #e1e1e1;
				}
				.timeout{
					position: absolute;
					z-index: 1;
					background-color: rgba(0,0,0,0.6);
					display: flex;
					justify-content: center;
					align-items: center;
					.second{
						color: #fff;
						margin-right: 10px;
					}
				}
			}
			.title {
				font-size: 26px;
				text-align: left;
				margin-bottom: 48px;
			}
			.tips-content {
				margin-top: 44px;
				.tips-main {
					font-size: 20px;
					color: #888;
				}
			}
		}
	}
</style>
