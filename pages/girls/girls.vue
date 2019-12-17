<template>
	<view :style="{background:background}" class="bg">
		<view class="mask">
			
		</view>
		<view class="text-block flex flex-direction justify-end">
			<text class="text-xxl text-white">{{time}}</text>
			<text class="sentence text-white">{{sentence}}</text>
		</view>
	</view>
</template>

<script>
import {oneSpider} from '../../utils/request';
import {parseTime} from '../../utils/funcitons';
export default {
	data() {
		return {
			background:'',
			sentence:'',
			time:''
		};
	},
	methods: {
		oneSpider() {
			oneSpider()
		}
	},
	onLoad() {
		oneSpider().then(res => {
			this.background = `url(${res.imgUrl})`;
			this.sentence = res.sentence;
			this.time = parseTime(new Date(),'{y} {m} {d}');
		})
	}
};
</script>

<style lang="scss">
	.bg{
		height: 100vh;
		width: 100vw;
		position: relative;
	}
	.text-block{
		position: absolute;
		bottom: 80upx;
		left:40upx;
		z-index: 19;
	}
	.sentence{
		font-size: 48upx;
	}
	.mask{
		width: 100%;
		height: 100%;
		background: linear-gradient(top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
	}
</style>
