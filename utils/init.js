import urls from './urls';
import {
	Toast
} from './funcitons';
import {
	get,
	post
} from './request';

const uid = uni.getStorageSync('juejinHeaders').userId;
const token = uni.getStorageSync('juejinHeaders').token;
const device_id = uni.getStorageSync('juejinHeaders').clientId;

const getUserInfo = () => {
	const data = {
		src: 'web',
		uid,
		token,
		device_id,
		current_uid: uid
	}
	return new Promise((reslove, reject) => {
		get(urls.userInfo, data).then(res => {
			const info = res.d;
			const userInfo = {
				collectionSetCount: info.collectionSetCount,
				collectedEntriesCount: info.collectedEntriesCount,
				followeesCount: info.followeesCount,
				juejinPower: info.juejinPower,
				viewedEntriesCount: info.viewedEntriesCount,
				...uni.getStorageSync('juejinInfo')
			}
			uni.removeStorage({
				key: 'juejinInfo'
			}).then(res => {
				uni.setStorage({
					key: 'juejinInfo',
					data: userInfo
				}).then(res => {
					Toast('掘金用户信息同步成功');
				});
				reslove('success')
			})

		})
	})

}

export {
	getUserInfo
}
