<template>
	<view class="content">
		
			<mescroll-uni :top="top"  @init="mescrollinit" :down="mescrollOption.downOption" :up="mescrollOption.upOption" @up="upCallback" @down="downCallback">
				<view class="scroll-item">
					<view class="card flex justify-start align-center margin-bottom-sm padding-sm" v-for="(item,index) in dataList" :key="item.id">
						<image class="avatar margin-right-sm" :src="item.avatarHd" mode="widthFix"></image>
						<view class="info flex flex-direction justify-between">
							<view class="user flex flex-direction">
								<text class="text-lg">{{item.username}}</text>
								<text class="text-gray">{{item.jobTitle || item.company}}</text>
							</view>
							<view v-if="item.postedPostsCount" class="counts">
								{{`${item.postedPostsCount}个专栏·${item.followersCount}人关注`}}
							</view>
						</view>
						<view :class="['btn',item.viewerIsFollowing ? 'followed' : 'unfollowed']" @tap="follow(item.id,item.viewerIsFollowing,index)">
							{{item.viewerIsFollowing ? '已关注' : '关注'}}
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
			dataListprop: Array,
			top:Number
		},
		data() {
			return {
				mescroll: null,
				dataList: []
			};
		},
		watch:{
			// 此处不能用箭头函数,箭头函数会在上下文中寻找this
			dataListprop(val){
				this.dataList = val;
			}
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
			downCallback(mescroll) {
				this.$emit('down');
			},
			follow(id,type,index){
				type = type ? 'unfollow' : 'follow';
				follow(id,type).then(res => {
					if(res.s === 1){
						this.dataList[index].viewerIsFollowing = !this.dataList[index].viewerIsFollowing;
					}
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
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
			text-align: center;
			margin-left: auto;
		}
		.unfollowed{
			color: #006CFF;
			background-color:#FFFFFF;
		}
		.followed{
			color: #FFFFFF;
			background-color: #006CFF;
		}
	}
	.scroll-item{
		margin-top: 20upx;
	}
	.mescroll-uni-fixed{
		position: relative !important;
		top: 0 !important;
	}
</style>
