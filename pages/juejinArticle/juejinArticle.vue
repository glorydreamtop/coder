<template>
	<view>
		<web-view :src="url" class="webview"></web-view>
	</view>
</template>

<script>
	import {param} from '../../utils/funcitons';
	
	export default {
		data() {
			return {
				url:''
			};
		},
		onLoad(options){
			console.log(options.id);
			const url = 'https://post-storage-api-ms.juejin.im/v1/getDetailData';
			const userData = uni.getStorageSync('juejin');
			const params = {
				uid: userData.userId,
				device_id: userData.clientId,
				token:userData.token,
				src: 'web',
				postId: options.id,
				type: 'entryView'
			};
			this.url = `/hybrid/html/local.html?${param(params)}` 
			                                
		}
	}
</script>

<style lang="scss" scoped>
	.webview{
		width: 100vw;
		height: 100vh;
	}
</style>
