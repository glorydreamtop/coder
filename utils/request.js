import {
	Toast
} from './funcitons';
import urls from './urls';
//get globalData
let juejinHeaders = uni.getStorageSync('juejinHeaders');
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
	return new Promise((resolve, reject) => {
		post(`${urls.login}${type}`, data, 'juejin').then(res => {
			const Headers = {};
			[Headers.token, Headers.userId, Headers.clientId] = [
				res.token,
				res.userId,
				res.clientId
			]
			uni.setStorage({
				key: 'juejinHeaders',
				data: Headers
			}).then(res => {
				juejinHeaders = uni.getStorageSync('juejinHeaders');
				resolve('success')
			})
		})
	})
}

//get userInfo
const userInfo = (data) => {
	const current_uid = data ? data : juejinHeaders.userId;
	data = {
		src: 'web',
		uid: juejinHeaders.userId,
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		current_uid
	}
	return new Promise((resolve, reject) => {
		get(urls.userInfo, data, 'noHeader').then(res => {
			const juejinInfo = res.d;
			uni.setStorage({
				key: 'juejinInfo',
				data: juejinInfo
			}).then(res => {
				resolve(juejinInfo);
			})
		})
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

// like or dislike
const changeLike = (data, dislike) => {
	if (dislike) {
		return del(`${urls.like}${data}`, null, 'juejin')
	}
	return put(`${urls.like}${data}`, null, 'juejin')
}

// get likeList
const likeList = (data) => {
	const uid = data.userId || juejinHeaders.userId;
	return new Promise((resolve, reject) => {
		get(`${urls.likeList}${uid}/like/entry`, data, 'juejin').then(res => {
			resolve(res.d);
		})
	})
}

// get collection set
const collectionSet = (data) => {
	const id = data.id;
	data = {
		src: 'web',
		userId: juejinHeaders.userId,
		clientId: juejinHeaders.clientId,
		token: juejinHeaders.token,
		...data
	}
	return new Promise(resolve => {
		if(id){
			get(`${urls.collection}/${id}`, data, 'juejin').then(res => {
				res = res.d.collectionSets;
				resolve(res)
			})
		}else{
			get(urls.collection, data, 'noHeader').then(res => {
				res = res.d.collectionSets;
				resolve(res)
			})
		}
	})
}

// get collection
const colletcion = (data) => {
	
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
const follow = (followee, type) => {
	const data = {
		src: 'web',
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		follower: juejinHeaders.userId,
		followee: followee
	}
	return get(`${urls.follow}${type}`, data, 'noHeader')
}

//get one pic&sentence
const oneSpider = () => {
	const data = {
		key: '6e6c7a8ec059d6bfe58eba3b1f53a5d0'
	}
	return new Promise((resolve, reject) => {
		get(urls.one, data, 'noHeader').then(res => {
			const sentence = res.newslist[0].word;
			const imgUrl = res.newslist[0].imgurl;
			resolve({
				imgUrl,
				sentence
			})

		})
	})
}

const picSpider = () => {
	const url = uni.getStorageSync('dailyPic');
	return new Promise((resolve, reject) => {
		get(url, null, 'noHeader').then(res => {
			resolve(`https:${res.img}`);
		}).catch(err => {
			reject(err)
		})
	})
}

const picSpider302 = (url) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			header: {
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
			},
			success: (res) => {
				console.log(res.header.location)
				resolve(res.header.Location || res.header.location);
			}
		})
	})
}

export {
	get,
	post,
	put,
	del,
	login,
	userInfo,
	categories,
	articleList,
	search,
	tagsList,
	changeLike,
	likeList,
	collectionSet,
	colletcion,
	changeCollect,
	follow,
	oneSpider,
	picSpider302
}
