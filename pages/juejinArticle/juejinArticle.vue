<template>
	<view>
		<web-view :src="url" class="webview"></web-view>
	</view>
</template>

<script>
	import {
		param
	} from '../../utils/funcitons';
	import { collection } from '../../utils/request';
	export default {
		data() {
			return {
				url: '',
				params:{}
			};
		},
		onLoad(options) {
			console.log(options.id);
			const url = 'https://post-storage-api-ms.juejin.im/v1/getDetailData';
			const userData = uni.getStorageSync('juejin');
			const params = {
				uid: userData.userId,
				device_id: userData.clientId,
				token: userData.token,
				src: 'web',
				postId: options.postId,
				type: 'entryView',
				id:options.id
			};
			this.params = params;
			this.url = `/hybrid/html/local.html?${param(params)}`;
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 1){
				const data = {
					id:this.params.id,
					page:0
				}
				collection(data).then(res => {
					const list = [];
					res.forEach(item => {
						const info = {
							img:item.bgImg.url,
							title:item.title,
							csId:item.csId
						}
						list.push(info);
					})
					console.log(JSON.stringify(list));
					const wv = this.$mp.page.$getAppWebview().children()[0];
					wv.evalJS(`collection(${JSON.stringify(list)});`);
				})
				
				//this.$mp.page.$getAppWebview().setTitleNViewButtonStyle(1,{color:'#007FFF'})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.webview {
		width: 100vw;
		height: 100vh;
	}
</style>
