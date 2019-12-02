const global = getApp().globalData;
//base ajax
const ajax = (url, method, data) => {
	return uni.request({
		url,
		method,
		data
	})
}
//get ajax
const get = (url, data) => {
	return ajax(url, 'GET', data)
}
//post ajax
const post = (url, data) => {
	return ajax(url, 'POST', data)
}
//login
const login = (data) => {
	return post('https://juejin.im/auth/type/phoneNumber', data).then(res => {
		console.log(res);
		res = res[1].data;
		const juejin = global.juejin;
		console.log(global);
		[juejin.token, juejin.userId, juejin.clientId, juejin.avatarLarge, juejin.username] = [
			res.token,
			res.userId,
			res.clientId,
			res.user.avatarLarge,
			res.user.username
		]
		console.log(global.juejin);
	})
}
export {
	login
}
