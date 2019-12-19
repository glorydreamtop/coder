<template>
	<view :style="{background:background}" class="bg">
		<view class="mask">
			
		</view>
		<view class="text-block flex flex-direction justify-end">
			<text class="day text-white">{{day}}</text>
			<text class="year text-white">{{`${month}.${year}`}}</text>
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
			time:'',
			day:'',
			month:'',
			year:'',
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
			this.time = parseTime(new Date(),'{y}-{M}-{d}');
			this.day = this.time.split('-')[2];
			this.month = this.time.split('-')[1];
			this.year = this.time.split('-')[0];
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
		width: 92vw;
		bottom: 80upx;
		left:40upx;
		z-index: 19;
	}
	.day{
		font-size: 144upx;
		font-family: 'Serif';
	}
	.year{
		font-size: 64upx;
		font-family: 'Serif';
	}
	.sentence{
		font-size: 42upx;
		
	}
	.mask{
		width: 100%;
		height: 100%;
		background: linear-gradient(top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
	}
</style>
