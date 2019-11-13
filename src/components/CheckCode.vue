<template>
    <div class="wrapper">
		<div class="login-scan">
			<div class="ms-title">请输入服务器</div>
			<div class="ms-login" v-loading="loading">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
					<el-form-item prop="fwq">
						<el-input v-model="ruleForm.fwq" placeholder="服务器"></el-input>
					</el-form-item>
					<div class="login-btn">
						<el-button type="primary" @click="back" style="background: #fff;color:#409EFF" v-if="visible">返回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
					</div>
				</el-form>
			</div>
		</div>
    </div>
</template>

<script>
export default {
	data() {
		return {
			ruleForm: {
				fwq: ''
			},
			rules: {
				fwq: [
					{ required: true, message: '请输入服务器', trigger: 'blur' }
				]
			},
			loading: false,
			visible: true
		}
	},
	methods: {
		submitForm(formName) {
			const self = this
			self.$refs[formName].validate((valid) => {
				if (valid) {
					self.loading = true
					/*self.$cookies.set('type', self.ruleForm.fwq)
					self.$cookies.set('reload', 1)*/
					localStorage.setItem('type', self.ruleForm.fwq)
					localStorage.setItem('reload', 1)
					self.$router.go(0)
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		back() {
			this.$router.go(-1)
		}
	},
	mounted() {
		/*const reload = this.$cookies.get('reload')
		if (reload === '1') {
			this.$cookies.remove('reload')
			this.$router.go(-1)
		}
		const getKey = this.$cookies.get('type')
		console.log('getKey', getKey)
		if (getKey === null) {
			this.visible = false
		}*/
		const reload = localStorage.getItem('reload')
		if (reload === '1') {
			localStorage.removeItem('reload')
			this.$router.push('/Login')
		}
		const getKey = localStorage.getItem('type')
		console.log('getKey', getKey)
		if (getKey === null) {
			this.visible = false
		}
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
        height:100px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
		display: flex;
		justify-content: center;
    }
    .login-btn button{
        height:36px;
		flex: 1;
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
