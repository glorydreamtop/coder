<template>
	<view class="bg">
		<view class="mask"></view>
		<image class="pic" :src="background" mode="aspectFill"></image>
		<view class="text-block flex flex-direction justify-end">
			<text class="day text-white">{{ day }}</text>
			<text class="year text-white">{{ `${month}.${year}` }}</text>
			<text class="sentence text-white">{{ sentence }}</text>
		</view>
	</view>
</template>

<script>
import { oneSpider } from '../../utils/request';
import { parseTime } from '../../utils/funcitons';
export default {
	data() {
		return {
			sentence:'',
			background: '',
			time: '',
			day: '',
			month: '',
			year: ''
		};
	},
	methods: {
		setTime() {
			this.time = parseTime(new Date(), '{y}-{M}-{d}');
			this.day = this.time.split('-')[2];
			this.month = this.time.split('-')[1];
			this.year = this.time.split('-')[0];
		},
		getSentence() {
			const now = new Date(new Date().toLocaleDateString()).getTime();
			const lastTime = uni.getStorageSync('dailyWord_last_time') || 0;
			if (now !== lastTime) {
				oneSpider().then(res => {
					const background = res.imgUrl;
					const sentence = res.sentence;
					// 保存每日一句
					uni.setStorage({
						key: 'dailyWord',
						data: sentence
					}).then(res => {
						this.sentence = sentence;
						// 保存来自one的每日一图
						uni.setStorage({
							key: 'onePic',
							data: background
						}).then(res => {
							// 保存上次更新时间
							uni.setStorage({
								key: 'dailyWord_last_time',
								data: now
							})
						});
					});
				});
			}
		}
	},
	onLoad() {
		this.setTime();
		this.background = uni.getStorageSync('currentPic');
		this.sentence = uni.getStorageSync('dailyWord') || '';
		this.getSentence();
	},
	onShow() {}
};
</script>

<style lang="scss" scoped>
.bg {
	height: 100vh;
	width: 100vw;
	position: relative;
}
.pic {
	width: 100vw;
	height: 100vh;
	position: absolute;
	top: 0;
	left: 0;
}
.text-block {
	width: 92vw;
	margin: 4vw;
	position: absolute;
	bottom: 60upx;
	z-index: 19;
}
.day {
	font-size: 144upx;
	font-family: 'Serif';
}
.year {
	font-size: 64upx;
	font-family: 'Serif';
}
.sentence {
	font-size: 42upx;
}
.mask {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 9;
	background: linear-gradient(top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
}
</style>
