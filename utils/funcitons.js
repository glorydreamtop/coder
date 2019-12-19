const Toast = (title) => {
	uni.showToast({
		title,
		icon: 'none',
		position: 'bottom'
	})
}
const parseTime = (time, cFormat) => {
	if (arguments.length === 0) {
		return null;
	}
	cFormat = cFormat === true ? '' : cFormat;
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';

	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time);
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		M: date.getMonth() ,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/\{([yMmdhisa])+\}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			//return ['日', '一', '二', '三', '四', '五', '六'][value];
		} else if (key === 'M') {
			return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][value]
		}
		return value.toString().padStart(2, '0');
	})
	return time_str;
}
const formatTime = (time, option) => {
	if (/^\d{4}-\d{2}-\d{2}/i.test(time)) {
		time = new Date(time).getTime()
	} else {
		if (('' + time).length === 10) {
			time = parseInt(time) * 1000
		} else {
			time = +time
		}
	}
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return (
			d.getMonth() +
			1 +
			'月' +
			d.getDate() +
			'日' +
			d.getHours() +
			'时' +
			d.getMinutes() +
			'分'
		)
	}
}
const cleanArray = (actual) => {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}
const param = (json) => {
	if (!json) return ''
	return cleanArray(
		Object.keys(json).map(key => {
			if (json[key] === undefined) return ''
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
		})
	).join('&')
}
const getQueryObject = (params) => {
	const obj = {}
	const reg = /([^?&=]+)=([^?&=]*)/g
	params.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1)
		let val = decodeURIComponent($2)
		val = String(val)
		obj[name] = val
		return rs
	})
	return obj
}
export {
	Toast,
	formatTime,
	parseTime,
	param,
	getQueryObject
}
