import {
	Toast
} from './funcitons';
import urls from './urls';
//get globalData
const juejinHeaders = uni.getStorageSync('juejinHeaders');
//base ajax
const ajax = (url, method, data, headerType) => {
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
	const header3 = {

	}
	const headerMap = {
		juejin: header1,
		juejinLegacy: header2,
		noHeader: header3
	}
	let header = headerMap[headerType];
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
const get = (url, data, headerType) => ajax(url, 'GET', data, headerType)

//post ajax
const post = (url, data, headerType) => ajax(url, 'POST', data, headerType)

//put ajax
const put = (url, data, headerType) => ajax(url, 'PUT', data, headerType)

//delete ajax
const del = (url, data, headerType) => ajax(url, 'DELETE', data, headerType)

//login
const login = (data) => {
	const type = data.phoneNumber ? 'phoneNumber' : 'email';
	return post(`${urls.login}${type}`, data, 'juejin').then(res => {
		const juejinHeaders = {};
		const juejinInfo = {};
		[juejinHeaders.token, juejinHeaders.userId, juejinHeaders.clientId, juejinInfo.avatarHd, juejinInfo.userName,
			juejinInfo.jobTitle, juejinInfo.account, juejinInfo.password
		] = [
			res.token,
			res.userId,
			res.clientId,
			res.user.avatarHd,
			res.user.username,
			res.user.jobTitle,
			data.phoneNumber || data.email,
			data.password
		]
		uni.setStorage({
			key: 'juejinHeaders',
			data: juejinHeaders
		}).then(res => {
			uni.setStorage({
				key: 'juejinInfo',
				data: juejinInfo
			}).then(res => {
				console.log(juejinInfo);
			});
		});

	})
}
//get categories
const categories = (data) => get(urls.categories, data, 'juejin').then(res => {
	return Promise.resolve(res.d.categoryList);
})

//get article list
const articleList = (data) => post(urls.query, data, 'juejinLegacy').then(res => {
	res = res.data.followingArticleFeed ? res.data.followingArticleFeed.items : res.data.articleFeed.items;
	return Promise.resolve(res);
})

//search articles
const search = (data) => post(urls.query, data, 'juejinLegacy').then(res => {
	return Promise.resolve(res.data.search);
})

//get tags list
const tagsList = (data) => post(urls.query, data, 'juejinLegacy').then(res => {
	res = res.data.tagNav.items;
	return Promise.resolve(res);
})

//like or dislike
const changeLike = (data, dislike) => {
	if (dislike) {
		return del(`${urls.like}${data}`, null, 'juejin')
	}
	return put(`${urls.like}${data}`, null, 'juejin')
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
	return new Promise((resolve) => {
		get(`${urls.collection}${id}`, data, 'juejin').then(res => {
			res = res.d.collectionSets;
			resolve(res)
		})
	})
}
//collect
const changeCollect = (data, type) => {
	data = {
		src: 'web',
		userId: juejinHeaders.userId,
		clientId: juejinHeaders.clientId,
		token: juejinHeaders.token,
		...data
	}
	return put(`${urls.collect}${type}`, data, 'juejin')
}
//follow
const follow = (followee) => {
	const data = {
		src: 'web',
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		follower: juejinHeaders.userId,
		followee: followee
	}
	return get(urls.follow,data,'noHeader')
}
//get one pic&sentence
const oneSpider = () => get(urls.one, null, 'noHeader').then(res => {
	//console.log(res);
	const imgReg = /\(http:\/\/image.wufazhuce.com\/\S+\)/g;
	const stcReg = /id="quote">\S+</g;
	//console.log(res.match(reg)[0].substring(1, res.match(reg)[0].indexOf(')')));
	const imgUrl = res.match(imgReg)[0].substring(1, res.match(imgReg)[0].indexOf(')'));
	const sentence = res.match(stcReg)[0].substring(11, res.match(stcReg)[0].indexOf('<'));
	return Promise.resolve({
		imgUrl,
		sentence
	})
})


export {
	get,
	post,
	put,
	del,
	login,
	categories,
	articleList,
	search,
	tagsList,
	changeLike,
	collection,
	changeCollect,
	follow,
	oneSpider
}
