<template>
	<view class="content">
		<view class="tagList flex justify-start text-white">
			<view :class="currentsearchType === item.type ? 'text-blue' : ''" v-for="(item,index) in searchTypes" :key="item.type" @tap="selectType(item.type,index)">{{ item.title }}</view>
		</view>
		<view class="resList" v-show="currentsearchType === searchTypes[0].type">
			<mescroll-item class="me" ref="ARTICLE" top="80" :mescrollOption="mescrollOption" :dataList="dataList[0]" @up="update" @down="reset" />
		</view>
		<view class="resList" v-show="currentsearchType === searchTypes[1].type">
			<user-item ref="USER" class="me" :mescrollOption="mescrollOption" :dataList="dataList[1]" @up="update" />
		</view>
	</view>
</template>

<script>
	import {
		search,
		follow
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
				dataList: [
					[],
					[]
				],
				serachText: '',
				searchTypes: [{
						type: 'ARTICLE',
						title: '文章',
						endCursor: ''
					},
					{
						type: 'USER',
						title: '用户',
						endCursor: ''
					}
				],
				currentsearchType: 'USER',
				endCursor: ''
			};
		},
		methods: {
			search() {
				let idx;
				// 当前搜索类型
				this.searchTypes.forEach((item, index) => {
					if (item.type === this.currentsearchType)
						idx = index;
				})
				console.log(idx);
				this.endCursor = this.searchTypes[idx].endCursor
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
							// 分页标记
							const hasNextPage = res.pageInfo.hasNextPage;
							this.searchTypes[idx].endCursor = res.pageInfo.endCursor;
							this.setDataList(res.edges, idx);
							resolve(hasNextPage);
						})
						.catch(err => {
							console.log(err);
							reject('faild');
						});
				});
			},
			setDataList(edgesList, idx) {
				this.dataList[idx] = this.dataList[idx].concat(
					edgesList.map(item => {
						const node = item.node.entity;
						let info = {};
						if (idx === 0) {
							info = node;
							info.postId = info.originalUrl.split('/')[4];
							info.tags = info.tags.map(tag => tag.title).join('/');
							info.author = info.user.username;
						} else {
							info = node;
							info.avatarHd = info.avatarHd ? info.avatarHd : '/static/noAvatar.png'
						}
						return info;
					})
				);
			},
			selectType(type,index) {
				this.currentsearchType = type;
				if(this.dataList[index].length === 0){
					this.search();
				}
				
			},
			update() {
				this.search().then(res => {
					this.$refs[this.currentsearchType].endSuccess(res);
				});
			},
			reset(){
				this.dataList[0] = [];
				this.searchTypes[0].endCursor = '';
				this.search();
			}
		},
		onNavigationBarSearchInputConfirmed(e) {
			console.log(e);
			this.serachText = e.text;
			this.dataList = [
				[],
				[]
			];
			this.mescrollOption.upOption.page.num = 0;
			this.endCursor = '';
			this.search().then(res => {
				uni.hideKeyboard();
			});
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		width: 100vw;
	}

	.tagList {
		width: 96vw;
		margin: 0 auto;
		height: auto;

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

	.resList {
		height: auto;
		width: 100%;
	}
</style>
