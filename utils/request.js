import {
	Toast
} from './funcitons';
import urls from './urls';
//get globalData
const juejinHeaders = uni.getStorageSync('juejinHeaders');
//base ajax
const ajax = (url, method, data, legacy) => {
	const header1 = {
		'X-Juejin-Client': juejinHeaders.clientId || '',
		'X-Juejin-Src': 'web',
		'X-Juejin-Token': juejinHeaders.token || '',
		'X-Juejin-Uid': juejinHeaders.userId || ''
	}
	const header2 = {
		'X-Legacy-Device-Id': juejinHeaders.clientId || '',
		'X-Agent': 'Juejin/Web',
		'X-Legacy-Token': juejinHeaders.token || '',
		'X-Legacy-Uid': juejinHeaders.userId || ''
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
const get = (url, data, legacy) => ajax(url, 'GET', data, legacy)

//post ajax
const post = (url, data, legacy) => ajax(url, 'POST', data, legacy)

//put ajax
const put = (url, data, legacy) => ajax(url, 'PUT', data, legacy)

//delete ajax
const del = (url, data, legacy) => ajax(url, 'DELETE', data, legacy)

//login
const login = (data) => {
	const type = data.phoneNumber ? 'phoneNumber' : 'email';
	return post(`${urls.login}${type}`, data).then(res => {
		const juejinHeaders = {};
		const juejinInfo = {};
		[juejinHeaders.token, juejinHeaders.userId, juejinHeaders.clientId, juejinInfo.avatarHd, juejinInfo.userName,juejinInfo.jobTitle,juejinInfo.account,juejinInfo.password] = [
			res.token,
			res.userId,
			res.clientId,
			res.user.avatarHd,
			res.user.username,
			res.user.jobTitle,
			data.phoneNumber||data.email,
			data.password
		]
		uni.setStorageSync('juejinHeaders', juejinHeaders);
		uni.setStorageSync('juejinInfo',juejinInfo);
		console.log(juejinInfo);
	})
}
//get categories
const categories = (data) => get(urls.categories, data).then(res => {
	return Promise.resolve(res.d.categoryList);
})

//get article list
const articleList = (data) => post(urls.query, data, true).then(res => {
	res = res.data.followingArticleFeed ? res.data.followingArticleFeed.items : res.data.articleFeed.items;
	return Promise.resolve(res);
})

//get tags list
const tagsList = (data) => post(urls.query, data, true).then(res => {
	res = res.data.tagNav.items;
	return Promise.resolve(res);
})

//like or dislike
const changeLike = (data, dislike) => {
	if (dislike) {
		return del(`${urls.like}${data}`)
	}
	return put(`${urls.like}${data}`)
}
//get collection set
const collection = (data) => {
	const id = data.id;
	data = {
		src: 'web',
		userId: juejinHeaders.userId,
		clientId: juejinHeaders.clientId,
		token: juejinHeaders.token,
		page: data.page
	}
	return get(`${urls.collection}${id}`, data).then(res => {
		res = res.d.collectionSets;
		return Promise.resolve(res)
	})
}
//collect
const changeCollect = (data,type) => {
	data = {
		src: 'web',
		userId: juejinHeaders.userId,
		clientId: juejinHeaders.clientId,
		token: juejinHeaders.token,
		...data
	}
	return put(`${urls.collect}${type}`,data)
}
export {
	login,
	categories,
	articleList,
	tagsList,
	changeLike,
	collection,
	changeCollect
}
