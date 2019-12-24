<template>
	<view><web-view :src="url" class="webview"></web-view></view>
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
	},
	onLoad(options) {
		const url = 'https://post-storage-api-ms.juejin.im/v1/getDetailData';
		const userData = uni.getStorageSync('juejinHeaders');
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
						isIn:item.isIn,
						entryCount:item.entryCount
					};
					list.push(info);
				});
				console.log(JSON.stringify(list));
				this.wv = this.$mp.page.$getAppWebview().children()[0];
				this.wv.evalJS(`collection(${JSON.stringify(list)});`);
			});

			//this.$mp.page.$getAppWebview().setTitleNViewButtonStyle(1,{color:'#007FFF'})
		}else if(e.index === 0){
			uni.getStorage({key:'juejinHeaders'}).then(res => {
				const headers = res;
				console.log(123);
				this.wv = this.$mp.page.$getAppWebview().children()[0];
				this.wv.evalJS(`wakeUpComments(${JSON.stringify(headers)});`);
			})
			
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
