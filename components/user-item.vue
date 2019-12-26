<template>
	<view>
		<mescroll-uni @init="mescrollinit" :down="mescrollOption.downOption" :up="mescrollOption.upOption" @up="upCallback">
			<view class="scroll-item">
				<view class="card flex justify-between margin-bottom-sm padding-sm">
					<image class="avatar" src="../static/noAvatar.png" mode="widthFix"></image>
					<view class="info flex flex-direction justify-between">
						<view class="user">
							<text>前端爸爸</text><text>阿里巴巴工程师</text>
						</view>
						<view class="counts">
							12个关注1922个文章
						</view>
					</view>
					<view class="btn">
						关注
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from 'mescroll-uni';
	export default {
		props: {
			mescrollOption: Object,
			dataList: Array,
		},
		data() {
			return {
				mescroll: null
			};
		},
		components: {
			MescrollUni
		},
		methods: {
			endSuccess(hasNextPage) {
				this.mescroll.endSuccess(20, hasNextPage);
			},
			mescrollinit(mescroll) {
				this.mescroll = mescroll;
			},
			upCallback(mescroll) {
				this.$emit('up');
			},
		}
	};
</script>

<style lang="scss">
	.scroll-item {
		margin-top: 20upx;
	}

	.card {
		height: auto;
		width: 96vw;
		margin-left: auto;
		margin-right: auto;
		border-radius: 16upx;
		background-color: #ffffff;
		.avatar{
			width: 96upx;
			height: 96upx;
			border-radius: 48upx;
		}
	}
</style>
