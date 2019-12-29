<template>
	<view class="scroll">
		<mescroll-uni class="list flex flex-direction justify-start" @init="mescrollinit" :down="mescrollOption.downOption"
		 :up="mescrollOption.upOption" @up="upCallback" @down="downCallback" :top="top">
			<slot></slot>
			<view class="scroll-item">
				<view class="card flex flex-direction justify-start margin-bottom-sm padding-sm" v-for="(item, index) in dataList"
				 :key="item.postId" @tap="toArticle(item)">
					<view class="meta solid-bottom text-sm text-gray flex justify-between">
						<text class="flex justify-start">
							<text class="author text-grey margin-right-xs">{{ item.author }}</text>
							<text class="before">{{ item.createdAt | formatTime }}</text>
						</text>
						<text class="tags text-blue">{{ item.tags }}</text>
					</view>
					<view class="content margin-tb-sm">
						<text class="title text-bold">{{ item.title }}</text>
					</view>
					<view class="like">
						<text @tap.stop="like(item.id, index)">
							<text :class="[item.viewerHasLiked || item.liked ? 'cuIcon-appreciatefill' : 'cuIcon-appreciate', 'text-red']"></text>
							<text class="text-grey padding-left-xs">{{ `${item.likeCount}赞` }}</text>
						</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		formatTime,
		Toast
	} from '../utils/funcitons';
	import {
		changeLike
	} from '../utils/request';
	import MescrollUni from 'mescroll-uni';
	export default {
		props: {
			currentTagId: String,
			mescrollOption: Object,
			dataListprop: Array,
			top: Number
		},
		data() {
			return {
				mescroll: Object,
				dataList:[]
			};
		},
		watch:{
			// 此处不能用箭头函数,箭头函数会在上下文中寻找this
			dataListprop:function(val){
				this.dataList = val;
			}
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
			endErr() {
				this.mescroll.endErr();
			},
			mescrollinit(mescroll) {
				this.mescroll = mescroll;
			},
			upCallback(mescroll) {
				this.$emit('up');
			},
			downCallback(mescroll) {
				this.$emit('down');
			},
			like(id, index) {
				changeLike(id, this.dataList[index].viewerHasLiked).then(res => {
					if (res.m === 'success') {
						this.dataList[index].viewerHasLiked = !this.dataList[index].viewerHasLiked;
						const like = this.dataList[index].viewerHasLiked ? 1 : -1;
						this.dataList[index].likeCount += like;
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.list {
		width: 100vw;
		height: 100%;

		.card {
			height: auto;
			width: 96vw;
			margin-left: auto;
			margin-right: auto;
			border-radius: 16upx;
			background-color: #ffffff;

			.meta {
				width: 100%;
				font-size: 28upx;
				height: 1.5em;

				.author {
					width: 35%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.tags {
					text-align: right;
					width: 35%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.content {
				font-size: 32upx;
			}
		}
	}

	.tagList {
		height: 90upx;
		width: 100%;
		background-color: #f1f1f1;
	}

	.scroll-item {
		margin-top: 20upx;
	}

	/deep/.mescroll-uni-fixed {
		position: relative;
		top: 0 !important;
	}
</style>
