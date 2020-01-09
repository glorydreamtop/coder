<template>
	<view class="content">
		<view class="tagList flex justify-start text-white">
			<view :class="currentsearchType === item.type ? 'text-blue' : ''" v-for="(item,index) in searchTypes" :key="item.type" @tap="selectType(item.type,index)">{{ item.title }}</view>
		</view>
		<view class="resList" v-show="currentsearchType === searchTypes[0].type">
			<mescroll-item class="me" ref="ARTICLE" top="80" :mescrollOption="mescrollOption" :dataListprop="dataList[0]" @up="update" @down="reset" />
		</view>
		<view class="resList" v-show="currentsearchType === searchTypes[1].type">
			<user-item ref="USER" class="me" :mescrollOption="mescrollOption" :dataListprop="dataList[1]" @up="update" @down="reset" top="80" />
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
				mescrollOption: config.mescrollOption,// mescroll组件配置
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
				currentsearchType: 'ARTICLE',
				currentsearchIndex:0,
				endCursor: ''
			};
		},
		methods: {
			search() {
				const idx = this.currentsearchIndex;
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
				return search(data);
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
							info.avatarHd = info.avatarHd ? info.avatarHd : info.avatarLarge ? info.avatarLarge : '/static/noAvatar.png'
						}
						return info;
					})
				);
			},
			selectType(type,index) {
				this.currentsearchIndex = index;
				this.currentsearchType = type;
				if(this.dataList[index].length === 0){
					this.update();
				}
				
			},
			update() {
				this.search().then(res => {
					const idx = this.currentsearchIndex;
					// 分页标记
					const hasNextPage = res.pageInfo.hasNextPage;
					this.searchTypes[idx].endCursor = res.pageInfo.endCursor;
					this.setDataList(res.edges, idx);
					this.$refs[this.currentsearchType].endSuccess(hasNextPage);
				}).catch(err => {
					this.$refs[this.currentsearchType].endErr();
				});
			},
			reset(){
				const idx = this.currentsearchIndex;
				// 备份原数据
				const endCursor = this.searchTypes[idx].endCursor;
				// 清空原数据
				this.searchTypes[idx].endCursor = '';
				this.search().then(res => {
					const idx = this.currentsearchIndex;;
					this.dataList[idx] = [];
					// 分页标记
					const hasNextPage = res.pageInfo.hasNextPage;
					this.searchTypes[idx].endCursor = res.pageInfo.endCursor;
					this.setDataList(res.edges, idx);
					this.$refs[this.currentsearchType].endSuccess(hasNextPage);
				}).catch(err => {
					// 失败则恢复原样
					this.searchTypes[idx].endCursor = endCursor;
					this.$refs[this.currentsearchType].endErr();
				});
			}
		},
		onNavigationBarSearchInputConfirmed(e) {
			this.serachText = e.text;
			this.dataList = [
				[],
				[]
			];
			this.mescrollOption.upOption.page.num = 0;
			this.searchTypes.forEach(item => {
				item.endCursor = '';
			})
			this.reset();
			uni.hideKeyboard();
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
