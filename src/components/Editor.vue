<template>
	<div id="wangeditor">
		<div ref="editor" style="text-align:left"></div>
	</div>
</template>
<script>
import E from 'wangeditor'
export default {
	name: 'editor',
	data() {
		return {
			editor: ''
		}
	},
	methods: {
		init() {
			this.editor = new E(this.$refs.editor)

			this.setMenus() //设置菜单
			this.editor.create() //创建编辑器
		},
		setMenus() {
			/*this.editor.customConfig.menus = [
				'head', // 标题
				'bold', // 粗体
				'fontSize', // 字号
				'fontName', // 字体
				'italic', // 斜体
				'underline', // 下划线
				'strikeThrough', // 删除线
				'foreColor', // 文字颜色
				'backColor', // 背景颜色
				'link', // 插入链接
				'list', // 列表
				'justify', // 对齐方式
				'image', // 插入图片
				'table', // 表格
				'undo', // 撤销
				'redo' // 重复
			]*/
			this.editor.customConfig.menus = []
		},
		getHtml() {
			return this.editor.txt.html()
		},
		setHtml(txt) {
			this.editor.txt.html(txt)
		},
		setFocus() {
			this.editor.$textElem.focus()
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.init()
		})
	}
}
</script>
<style lang="scss" scoped>
	/deep/ .w-e-text-container{
		border: none !important;
		height: auto !important;
		min-height: 40px;
	}
	/deep/ .w-e-toolbar{
		display: none;
	}
	/deep/ .w-e-text{
		padding: 0;
		display: flex;
	}
	/deep/ .w-e-text p{
		word-break: break-all;
		margin: 0;
	}
</style>
