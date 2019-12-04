import {
	Toast
} from './funcitons';
//get globalData
const juejin = uni.getStorageSync('juejin') || '';
//base ajax
const ajax = (url, method, data, legacy) => {
	const header1 = {
		'X-Juejin-Client': juejin.clientId || '',
		'X-Juejin-Src': 'web',
		'X-Juejin-Token': juejin.token || '',
		'X-Juejin-Uid': juejin.userId || ''
	}
	const header2 = {
		'X-Legacy-Device-Id': juejin.clientId || '',
		'X-Agent': 'Juejin/Web',
		'X-Legacy-Token': juejin.token || '',
		'X-Legacy-Uid': juejin.userId || ''
	}
	const header = legacy ? header2 : header1;
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			data,
			header
		}).then(res => {
			let title;
			if (!res[0]) {
				const statusCode = res[1].statusCode;
				const data = res[1].data;
				switch (statusCode) {
					case 200:
						resolve(data);
						break;
					case 401:
						title = '用户名或密码错误';
						reject(data);
						break;
					case 404:
						title = '咦,404啦~';
						reject(data);
						break;
					case 500:
						title = 'Sever错误(>﹏<)';
						reject(data);
						break;
					case 502:
						title = '哇,网关错误';
						reject(data);
						break;
				}
			} else {
				title = '没联网吧?';
				reject(res[0]);
			}
			if (title) Toast(title)
		})
	})

}
//get ajax
const get = (url, data, legacy) => {
	return ajax(url, 'GET', data, legacy)
}
//post ajax
const post = (url, data, legacy) => {
	return ajax(url, 'POST', data, legacy)
}
//login
const login = (data) => {
	const type = data.phoneNumber ? 'phoneNumber' : 'email';
	return post('https://juejin.im/auth/type/' + type, data).then(res => {
		Toast('登录成功');
		const juejin = {};
		[juejin.token, juejin.userId, juejin.clientId, juejin.avatarLarge, juejin.username] = [
			res.token,
			res.userId,
			res.clientId,
			res.user.avatarLarge,
			res.user.username
		]
		uni.setStorageSync('juejin', juejin);
		console.log(juejin);
	})
}
//get categories
const categories = (data) => {
	return get('https://gold-tag-ms.juejin.im/v1/categories', data).then(res => {
		return Promise.resolve(res.d.categoryList);
	})
}
//get article list
const articleList = (data) => {
	return post('https://web-api.juejin.im/query', data, true).then(res => {
		res = res.data.followingArticleFeed ? res.data.followingArticleFeed.items : res.data.articleFeed.items;
		return Promise.resolve(res);
	})
}
export {
	login,
	categories,
	articleList
}
