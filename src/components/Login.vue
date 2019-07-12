<template>
    <div class="login-wrap">
        <div class="ms-title">闲聊登录</div>
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
</template>

<script>
export default {
	data() {
		return {
			ruleForm: {
				username: '18308465172',
				password: 'w13540010'
			},
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
			loading: false
		}
	},
	sockets: {
		connect() {
			console.log('socket connected')
		},
		chatevent(data) { //监听message事件，方法是后台定义和提供的
			console.log(data)
		}
	},
	methods: {
		getConfigResult(res) {
			// 接收回调函数返回数据的方法
			console.log(res)
			if (res.type === 'login') {
				sessionStorage.setItem('uName', this.ruleForm.username) //18308465172
				sessionStorage.setItem('uPass', this.ruleForm.password) //w13540010
				this.loading = false
				this.$router.push('/')
			}
		},
		submitForm(formName) {
			const self = this
			this.loading = true
			self.$refs[formName].validate((valid) => {
				if (valid) {
					var obj = {
						userid: '10926',
						pass: 'bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a'
					}
					self.$socket.emit('chatevent', {cmd: 1401, data: JSON.stringify(obj)}, function(e) {
						self.loading = false
						self.$router.push('/')
					})
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
