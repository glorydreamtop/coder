<template>
	<view><web-view :src="url" class="webview" @message="collect"></web-view></view>
</template>

<script>
import { param } from '../../utils/funcitons';
import { collection, changeCollect } from '../../utils/request';
export default {
	data() {
		return {
			url: '',
			id: {},
			wv:{}
		};
	},
	methods: {
		collect(event) {
			console.log(123123);
			const data = {
				csId: event.detail.data,
				entryId: this.id
			};
			console.log(event.detail.data);
			const type = 'addEntry';
			changeCollect(data, type).then(res => {
				if (res.m === 'success') {
					this.wv.evalJS(`checkicon()`);
				}
			});
		}
	},
	onLoad(options) {
		const url = 'https://post-storage-api-ms.juejin.im/v1/getDetailData';
		const userData = uni.getStorageSync('juejin');
		const params = {
			uid: userData.userId,
			device_id: userData.clientId,
			token: userData.token,
			src: 'web',
			postId: options.postId,
			type: 'entryView',
			id: options.id
		};
		this.id = options.id;
		this.url = `/hybrid/html/local.html?${param(params)}`;
	},
	onNavigationBarButtonTap(e) {
		if (e.index === 1) {
			const data = {
				id: this.id,
				page: 0
			};
			uni.showLoading({
				title:'加载收藏集'
			})
			collection(data).then(res => {
				uni.hideLoading();
				const list = [];
				res.forEach(item => {
					const info = {
						img: item.bgImg.url,
						title: item.title,
						csId: item.csId,
						isIn:item.isIn
					};
					list.push(info);
				});
				console.log(JSON.stringify(list));
				this.wv = this.$mp.page.$getAppWebview().children()[0];
				this.wv.evalJS(`collection(${JSON.stringify(list)});`);
			});

			//this.$mp.page.$getAppWebview().setTitleNViewButtonStyle(1,{color:'#007FFF'})
		}
	}
};
</script>

<style lang="scss" scoped>
.webview {
	width: 100vw;
	height: 100vh;
}
</style>
