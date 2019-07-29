const emojiUrl = 'http://filemixin.test.upcdn.net/emoji/'
const emojiStr = 'emoji001.png,[调皮]-emoji002.png,[憨笑]-emoji003.png,[微笑]-emoji004.png,[得意]-emoji005.png,[瞌睡]-emoji006.png,[笑哭]-emoji007.png,[呵呵]-emoji008.png,[大笑]-emoji009.png,[衰]-emoji010.png,[色]-emoji011.png,[发怒]-emoji012.png,[折磨]-emoji013.png,[尴尬]-emoji014.png,[亲亲]-emoji015.png,[媚眼]-emoji016.png,[流泪]-emoji017.png,[害羞]-emoji018.png,[吓]-emoji019.png,[酷]-emoji020.png,[难受]-emoji021.png,[恐怖]-emoji022.png,[纠结]-emoji023.png,[无语]-emoji024.png,[闭眼]-emoji025.png,[生病]-emoji026.png,[惊讶]-emoji027.png,[嘟嘴]-emoji028.png,[眨眼]-emoji029.png,[嚎啕大哭]-emoji030.png,[灵魂]-emoji031.png,[郁闷]-emoji032.png,[晕]-emoji033.png,[不看]-emoji034.png,[无语]-emoji035.png,[憋嘴]-emoji036.png,[抛媚眼]-emoji037.png,[想吃]-emoji038.png,[笑脸]-emoji039.png,[龇牙]-emoji040.png,[思考]-emoji041.png,[吐]-emoji042.png,[可爱]-emoji043.png,[色眯眯]-emoji044.png,[委屈]-emoji045.png,[傻笑]-emoji046.png,[怒视]-emoji047.png,[自信]-emoji048.png,[哼哼]-emoji049.png,[惊恐]-emoji050.png,[困]-emoji051.png,[搞怪]-emoji052.png,[着迷]-emoji053.png,[吃惊]-emoji054.png,[洋洋得意]-emoji055.png,[咦哈]-emoji056.png,[大哭]-emoji057.png,[愤怒]-emoji058.png,[欢笑]'.split('-')
export function emojiList() {
	const emojiList = emojiStr.reduce((prev, cur) => {
		const data = cur.split(',')
		prev.push({
			alt: data[1],
			src: emojiUrl + data[0]
		})
		return prev
	}, [])
	return emojiList
}

export function emojiListFind(str) {
	const emojiFind = emojiStr.find((e) => {
		const data = e.split(',')
		return data[1] === str
	})
	const Find = emojiFind.split(',')
	return '<img src="' + emojiUrl + Find[0] + '" alt="' + Find[0] + '">'
}
