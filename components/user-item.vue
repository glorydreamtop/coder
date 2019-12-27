<template>
	<view class="content">
		<mescroll-uni top="80" class="scroll-item" @init="mescrollinit" :down="mescrollOption.downOption" :up="mescrollOption.upOption" @up="upCallback">
			<view>
				<view class="card flex justify-start align-center margin-bottom-sm padding-sm" v-for="item in dataList" :key="item.id">
					<image class="avatar margin-right-sm" :src="item.avatarHd" mode="widthFix"></image>
					<view class="info flex flex-direction justify-between">
						<view class="user flex flex-direction">
							<text class="text-lg">{{item.username}}</text>
							<text class="text-gray">{{item.jobTitle || item.company}}</text>
						</view>
						<view class="counts">
							{{`${item.postedPostsCount}个专栏·${item.followersCount}人关注`}}
						</view>
					</view>
					<view :class="['btn',item.viewerIsFollowing ? 'followed' : 'unfollowed']">
						关注
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {follow} from '../utils/request';
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
			follow(followee){
				follow(followee).then(res => {
					console.log(res.m);
				})
			}
		}
	};
</script>

<style lang="scss">
	.card {
		height: auto;
		width: 96vw;
		margin-left: auto;
		margin-right: auto;
		border-radius: 16upx;
		background-color: #ffffff;
		.info{
			width: auto;
			flex:1;
			.user>text:nth-child(2){
				overflow-x: hidden;
				text-overflow: ellipsis;
			}
		}
		.avatar{
			width: 96upx;
			height: 96upx;
			border-radius: 54upx;
		}
		.btn{
			width: 120upx;
			height: 48upx;
			border-radius: 8upx;
			border: 1px solid #006CFF;
			color: #006CFF;
			text-align: center;
			margin-left: auto;
		}
		.unfollowed{
			color: #006CFF;
		}
		.followed{
			color: #FFFFFF;
			background-color: #006CFF;
		}
	}
	.scroll-item{
		position: relative;
		top: 0;
		bottom: 0;
		height: auto;
	}
	.mescroll-uni-fixed{
		position: relative !important;
		top: 0 !important;
	}
</style>
