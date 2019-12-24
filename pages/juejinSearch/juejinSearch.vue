<template>
	<view class="content"><mescroll-item class="me" :mescrollOption="mescrollOption" :dataList="dataList"></mescroll-item></view>
</template>

<script>
import {search} from '../../utils/request';
import config from './config';
import MescrollItem from '../../components/mescroll-item';
export default {
	components: {
		MescrollItem,
	},
	data() {
		return {
			// mescroll组件配置
			mescrollOption: config.mescrollOption,
			dataList: [],
			endCursor: ''
		};
	},
	methods: {
		search(text) {
			const id = 'a53db5867466eddc50d16a38cfeb0890';
			const data = {
				extensions: {
					query: {
						id
					}
				},
				operationName: '',
				query: '',
				variables: {
					first: 20,
					type: 'ALL',
					query: text,
					period: 'ALL',
					after: this.endCursor
				}
			};
			search(data).then(res => {
				this.endCursor = res.pageInfo.endCursor;
				this.hasNextPage = res.pageInfo.hasNextPage;
				this.dataList = this.dataList.concat(
					res.edges.map(item => {
						const info = {};
						const node = item.node.entity;
						info.viewerHasLiked = node.liked;
						info.likeCount = node.likeCount;
						info.createdAt = node.createdAt;
						info.title = node.title;
						info.author = node.user.username;
						info.tags = node.tags.map(tag => {
							return tag.title;
						});
						info.tags = info.tags.join('/');
						info.originalUrl = node.originalUrl;
						info.id = node.id;
						info.postId = info.originalUrl.split('/')[4];
						return info;
					})
				);
			});
		}
	},
	onNavigationBarSearchInputConfirmed(e) {
		console.log(e);
		this.search(e.text);
	}
};
</script>

<style scoped>
	.content{
		height: 100vh;
		width: 100vw;
	}
	.me{
		position: fixed;
		height: 100%;
		width: 100vw;
		top: -90upx;
		left: 0;
	}
</style>
