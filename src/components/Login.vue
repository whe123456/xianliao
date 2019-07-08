<template>
    <div class="login-wrap">
        <div class="ms-title">闲聊登录</div>
        <div class="ms-login">
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
</template>

<script>
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
			}
		}
	},
	methods: {
		getConfigResult(res) {
			// 接收回调函数返回数据的方法
			console.log(res)
		},
		websocketToLogin() {
			// 【agentData：发送的参数；this.getConfigResult：回调方法】
			// this.socketApi.sendSock(getPlaceRevenue, this.getConfigResult)
		},
		submitForm(formName) {
			const self = this
			self.$refs[formName].validate((valid) => {
				if (valid) {
					sessionStorage.setItem('url', 'ws://192.168.0.188:8500')
					sessionStorage.setItem('uName', self.ruleForm.username) //18308465172
					sessionStorage.setItem('uPass', self.ruleForm.password) //w13540010
					self.$router.push('/')
				} else {
					console.log('error submit!!')
					return false
				}
			})
		}
	},
	mounted() {
		const uName = sessionStorage.getItem('uName')
		const uPass = sessionStorage.getItem('uPass')
		if (uName != null && uPass !== null) {
			this.$router.push('/')
			return false
		}
	}
}
</script>
<style scoped>
    .login-wrap{
        width:100%;
        height:100%;
        background: #324157;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
    }
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
</style>
