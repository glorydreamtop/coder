<template>
	<view>
		<web-view :src="url" class="webview"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			};
		},
		onLoad(options){
			console.log(options.url);
			this.url = options.url;
		}
	}
</script>

<style lang="scss" scoped>
	.webview{
		width: 100vw;
		height: 100vh;
	}
</style>
