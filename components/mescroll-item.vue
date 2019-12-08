<template>
	<view v-show="TabCur === index" class="scroll">
		<mescroll-uni
			class="list flex flex-direction justify-start"
			@init="mescrollinit"
			:down="mescrollOption.downOption"
			@down="downCallback"
			:up="mescrollOption.upOption"
			@up="upCallback"
			top="90"
		>
		<slot></slot>
			<view class="card flex flex-direction justify-start margin-bottom-sm padding-sm" v-for="item in dataList" :key="item.postId" @tap="toArticle(item)">
				<view class="meta text-sm text-gray flex justify-between">
					<text class="flex justify-start">
						<text class="author text-grey margin-right-xs">{{ item.author }}</text>
						<text class="before">{{ item.createdAt | formatTime }}</text>
					</text>
					<text class="tags text-blue">{{ item.tags }}</text>
				</view>
				<view class="content margin-tb-sm">
					<text class="title text-bold">{{ item.title }}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import { formatTime, Toast } from '../utils/funcitons';
import MescrollUni from 'mescroll-uni';
export default {
	props: {
		TabCur: Number,
		index: Number,
		mescrollOption: Object,
		dataList: Array
	},
	data() {
		return {
			mescroll: Object
		};
	},
	filters: {
		formatTime
	},
	components: {
		MescrollUni
	},
	methods: {
		toArticle(item) {
			Toast(item.title);
			uni.navigateTo({
				url: `/pages/juejinArticle/juejinArticle?postId=${item.postId}&id=${item.id}`
			});
		},
		endSuccess(hasNextPage) {
			this.mescroll.endSuccess(20, hasNextPage);
		},
		mescrollinit(mescroll) {
			this.mescroll = mescroll;
		},
		downCallback(mescroll) {
			mescroll.endSuccess(20, true);
		},
		upCallback(mescroll) {
			this.$emit('up');
		}
	}
};
</script>

<style lang="scss" scoped>
// /deep/.mescroll-uni-fixed {
// 	top: 90upx !important;
// }
.list {
	width: 100vw;
	height: 100%;
	.card {
		height: auto;
		width: 94vw;
		margin-left: auto;
		margin-right: auto;
		border-radius: 14upx;
		background-color: #ffffff;
		.meta {
			width: 100%;
			font-size: 28upx;
			height: 1.5em;
		}
		.content{
			font-size: 32upx;
		}
	}
}
.tagList{
	height: 90upx;
	width: 100%;
	background-color: #F1F1F1;
}
</style>
