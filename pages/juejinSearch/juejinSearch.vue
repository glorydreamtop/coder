<template>
	<view class="content">
		<view class="tagList flex justify-start text-white">
			<view :class="currentsearchType === item.type ? 'text-blue' : ''" v-for="item in searchTypes" :key="item.type" @tap="selectType(item.type)">
				{{ item.title }}
			</view>
		</view>
		<view class="" v-show="currentsearchType === searchTypes[0].type">
			<mescroll-item class="me" ref="ARTICLE" :mescrollOption="mescrollOption" :dataList="dataList[0]" @up="update" />
		</view>
		<view class="" v-show="currentsearchType === searchTypes[1].type">
			<user-item ref="USER" :mescrollOption="mescrollOption" :dataList="dataList[1]" />
		</view>
	</view>
</template>

<script>
	import {
		search
	} from '../../utils/request';
	import config from './config';
	import MescrollItem from '../../components/mescroll-item';
	import UserItem from '../../components/user-item';
	export default {
		components: {
			MescrollItem,
			UserItem
		},
		data() {
			return {
				// mescroll组件配置
				mescrollOption: config.mescrollOption,
				dataList: [[],[]],
				serachText: '',
				searchTypes: [{
					type: 'ARTICLE',
					title: '文章'
				}, {
					type: 'USER',
					title: '用户'
				}],
				currentsearchType: 'USER',
				endCursor: ''
			};
		},
		methods: {
			search() {
				const data = {
					extensions: {
						query: {
							id: 'a53db5867466eddc50d16a38cfeb0890'
						}
					},
					operationName: '',
					query: '',
					variables: {
						first: 20,
						type: this.currentsearchType,
						query: this.serachText,
						period: 'ALL',
						after: this.endCursor
					}
				};
				return new Promise((resolve, reject) => {
					search(data)
						.then(res => {
							this.endCursor = res.pageInfo.endCursor;
							const hasNextPage = res.pageInfo.hasNextPage;
							const idx = this.searchTypes.indexOf(this.currentsearchType);
							this.setDataList(res.edges,idx);
							resolve(hasNextPage);
						})
						.catch(err => {
							console.log(err);
							reject('faild');
						});
				});
			},
			setDataList(edgesList,idx) {
				this.dataList[idx] = this.dataList[idx].concat(edgesList.map(item => {
					const node = item.node.entity;
					if(idx === 0){
						const info = {
							viewerHasLiked: node.liked,
							likeCount: node.likeCount,
							createdAt: node.createdAt,
							title: node.title,
							author: node.user.username,
							originalUrl: node.originalUrl,
							id: node.id,
							postId: node.originalUrl.split('/')[4],
							tags: node.tags.map(tag => tag.title).join('/')
						}
					}else {
						const info = {
							jobTitle: node.jobTitle,
							username: node.username,
							id: node.id,
							avatarHd:node.avatarHd,
							pinCount:node.pinCount,
							postedPostsCount:node.postedPostsCount,
							followersCount:node.followersCount,
							viewerIsFollowing:node.viewerIsFollowing
						}
					}
					return info;
				}))
			},
			selectType(type) {
				this.currentsearchType = type;
			},
			update() {
				this.search().then(res => {
					this.$refs[this.currentsearchType].endSuccess(res);
				});
			}
		},
		onNavigationBarSearchInputConfirmed(e) {
			console.log(e);
			this.serachText = e.text;
			this.dataList = [];
			this.mescrollOption.upOption.page.num = 0;
			this.endCursor = '';
			this.search().then(res => {
				uni.hideKeyboard()
			});
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		width: 100vw;
	}

	.me {
		height: 100%;
		width: 100vw;
	}

	.tagList {
		width: 96vw;
		margin: 10upx auto -20upx auto;
		overflow-x: auto;

		>view {
			background-color: #dbdbdb;
			padding: 12upx 16upx;
			font-size: 28upx;
			line-height: 28upx;
			height: 52upx;
			margin: 14upx 10upx;
			border-radius: 26upx;
			white-space: nowrap;
		}
	}
</style>
