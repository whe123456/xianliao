import {config} from './config' //引入模块
import RSA from 'rsa'
export default {
	//DES加密
	encrypt(data) {
		let encryptRsa = new RSA.RSAKey()
		encryptRsa = RSA.KEYUTIL.getKey(config.publicKey)
		return encryptRsa.encryptLong(encodeURIComponent(data)) //分段加密
	},
	decrypt(data) {
		let decryptRsa = new RSA.RSAKey()
		decryptRsa = RSA.KEYUTIL.getKey(config.privateKey)
		let decStr = decryptRsa.decryptLong(data)
		return decodeURIComponent(decStr)
	},
	//将字符串转换成二进制形式，中间用空格隔开
	strToBinary(str) {
		return str
		/*var result = []
		var list = str.split('')
		for (var i = 0; i < list.length; i++) {
			if (i !== 0) {
				result.push(' ')
			}
			var item = list[i]
			const binaryStr = item.charCodeAt().toString(2)
			result.push(binaryStr)
		}
		return result.join('')*/
	},
	//将二进制字符串转换成Unicode字符串
	binaryToStr(str) {
		return str
		/*var result = []
		var list = str.split(' ')
		for (var i = 0; i < list.length; i++) {
			var item = list[i]
			var asciiCode = parseInt(item, 2)
			var charValue = String.fromCharCode(asciiCode)
			result.push(charValue)
		}
		return result.join('')*/
	}
}
