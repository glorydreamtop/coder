<template>
	<view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view :class="['cu-item',index === TabCur?'text-green cur':'']" v-for="index in 10" :key='index' @tap="tabSelect(index)">
				Tab{{index}}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0
			};
		},
		methods:{
			tabSelect(index){
				console.log(index);
				this.TabCur = index;
				this.scrollLeft = (index - 2) * 60;
			}
		}
	}
</script>

<style lang="scss">

</style>
