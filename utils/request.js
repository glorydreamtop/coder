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
	const header4 = {
		"content-Type": "application/x-www-form-urlencoded"
	}
	const header5 = {
		"content-Type": "multipart/form-data"
	}
	// 创建一个header的映射
	const headerMap = {
		juejin: header1,
		juejinLegacy: header2,
		noHeader: header3,
		urlencoded: header4,
		formData: header5
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
			// 保存header信息
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
			const avatarLarge = juejinInfo.avatarLarge.split('?')[0];
			uni.setStorage({
				key: 'juejinInfo',
				data: juejinInfo
			}).then(res => {
				resolve(juejinInfo);
			})
		})
	})
}

// update userInfo
const updateUserinfo = (data) => {
	data = {
		src: 'web',
		uid: juejinHeaders.userId,
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		...data
	}
	return new Promise((resolve, reject) => {
		post(urls.updateUserinfo, data, 'urlencoded').then(res => {
			if (res.s === 1 && res.m === 'ok') {
				resolve()
			} else {
				reject(res)
			}
		})
	})
}

// update useremail
const updateUseremail = (data) => {
	data = {
		src: 'web',
		uid: juejinHeaders.userId,
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		...data
	}
	return new Promise((resolve, reject) => {
		post(urls.updateUseremail, data, 'urlencoded').then(res => {
			if (res.s === 1 && res.m === 'ok') {
				resolve()
			} else {
				reject(res)
			}
		})
	})
}

//subscribe email
const subscribeEmail = (data) => {
	data = {
		src: 'web',
		uid: juejinHeaders.userId,
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		...data,
		type: 'week'
	}
	return new Promise((resolve, reject) => {
		get(urls.subscribeEmail, data, 'noHeader').then(res => {
			if (res.s === 1 && res.m === 'ok') {
				resolve()
			} else {
				reject(res)
			}
		})
	})

}

//check subscribe email
const checkEmailsub = () => {
	const data = {
		src: 'web',
		uid: juejinHeaders.userId,
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		type: 'week'
	}
	return new Promise((resolve, reject) => {
		get(urls.checkEmailsub, data, 'noHeader').then(res => {
			if (res.s === 1 && res.m === 'ok') {
				resolve(res.d.week)
			} else {
				reject(res)
			}
		})
	})

}

// upload pic
const uploadPic = (data) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: urls.upload,
			name: 'file',
			filePath: data
		}).then(res => {
			res = JSON.parse(res[1].data);
			if (res.s === 1 && res.m === 'ok') {
				resolve(res.d.url.https);
			} else {
				reject(res);
			}
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

// get articleDetail
const articleDetail = (data) => {
	data = {
		src: 'web',
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		uid: juejinHeaders.userId,
		type: 'entryView',
		...data
	}
	return new Promise((resolve, reject) => {
		get(urls.articleDetail, data, 'noHeader').then(res => {
			resolve(res.d.content)
		})
	})
}

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
const collectionSet = (data, type) => {
	const id = data.id;
	data = {
		src: 'web',
		userId: juejinHeaders.userId,
		clientId: juejinHeaders.clientId,
		token: juejinHeaders.token,
		...data
	}
	return new Promise(resolve => {
		if (id) {
			get(`${urls.usercollectionSet}/${id}`, data, 'juejin').then(res => {
				res = res.d.collectionSets;
				resolve(res)
			})
		} else {
			const url = type === 'follow' ? urls.followedCollectionSet : urls.usercollectionSet;
			get(url, data, 'noHeader').then(res => {
				res = res.d.collectionSets;
				resolve(res)
			}).catch(err => {
				console.log(err)
			})
		}
	})
}

// get collectionSetEntries
const collectionSetEntries = (data) => {
	data = {
		rankType: 'new',
		src: 'web',
		...data
	}
	return new Promise(resolve => {
		get(urls.collection, data, 'noHeader').then(res => {
			resolve(res.d);
		})
	})
}


// get collection
const collection = (data) => {
	data = {
		src: 'web',
		uid: juejinHeaders.userId,
		device_id: juejinHeaders.clientId,
		token: juejinHeaders.token,
		...data
	}
	return new Promise((resolve, reject) => {
		get(urls.timeline, data, 'noHeader').then(res => {
			resolve(res.d)
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

//get followList
const followList = (uid) => {
	const data = {
		currentUid: juejinHeaders.userId,
		src: 'web',
		uid: uid || juejinHeaders.userId
	}
	return new Promise((resolve, reject) => {
		get(urls.followee, data, 'noHeader').then(res => {
			resolve(res.d)
		})
	})
}

// get postList
const postList = (data) => {
	data = {
		src: 'web',
		token: juejinHeaders.token,
		device_id: juejinHeaders.clientId,
		uid: juejinHeaders.userId,
		targetUid: data.targetUid || juejinHeaders.userId,
		type: 'post',
		limit: 20,
		order: 'createdAt',
		before: data.before || null
	}
	if (data.before === null) {
		delete data.before;
	}
	return new Promise((resolve, reject) => {
		get(urls.postList, data, 'noHeader').then(res => {
			resolve(res.d);
		})
	})
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
	updateUserinfo,
	updateUseremail,
	subscribeEmail,
	checkEmailsub,
	uploadPic,
	categories,
	articleList,
	articleDetail,
	search,
	tagsList,
	changeLike,
	likeList,
	collectionSet,
	collectionSetEntries,
	collection,
	changeCollect,
	follow,
	followList,
	postList,
	oneSpider,
	picSpider302
}
