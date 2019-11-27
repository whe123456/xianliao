import CryptoJS from 'crypto-js/crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse('aesmxkey20190723') //""中与后台一样  密码
const IV = CryptoJS.enc.Utf8.parse() //""中与后台一样

/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word, keyStr, ivStr) {
	let key = KEY
	let iv = IV

	if (keyStr) {
		key = CryptoJS.enc.Utf8.parse(keyStr)
		iv = CryptoJS.enc.Utf8.parse(ivStr)
	}
	word = JSON.stringify(word)
	let srcs = CryptoJS.enc.Utf8.parse(word)
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {
		iv: iv,
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})
	// console.log("-=-=-=-", encrypted.ciphertext)
	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export function Decrypt(word, keyStr, ivStr) {
	let key = KEY
	let iv = IV

	if (keyStr) {
		key = CryptoJS.enc.Utf8.parse(keyStr)
		iv = CryptoJS.enc.Utf8.parse(ivStr)
	}

	let base64 = CryptoJS.enc.Base64.parse(word)
	let src = CryptoJS.enc.Base64.stringify(base64)
	var decrypt = CryptoJS.AES.decrypt(src, key, {
		iv: iv,
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})
	var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
	return JSON.parse(decryptedStr.toString())
}

export function getUrlKey(name) {
	/* eslint-disable */
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
	/* eslint-disable */
}
