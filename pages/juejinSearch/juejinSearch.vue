<template>
	<view class="content">
		<mescroll-item class="me" ref="me" :mescrollOption="mescrollOption" :dataList="dataList" @up="update">
			<view class="tagList flex justify-start text-white">
				<view :class="currentType === item ? 'text-blue' : ''" v-for="item in typeList" :key="item" @tap="selectTag(item)">{{ item.title }}</view>
			</view>
		</mescroll-item>
	</view>
</template>

<script>
import { search } from '../../utils/request';
import config from './config';
import MescrollItem from '../../components/mescroll-item';
export default {
	components: {
		MescrollItem
	},
	data() {
		return {
			// mescroll组件配置
			mescrollOption: config.mescrollOption,
			dataList: [],
			serachText: '',
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
					type: 'ARTICLE',
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
						resolve(hasNextPage);
					})
					.catch(err => {
						console.log(err);
						reject('faild');
					});
			});
		},
		update() {
			this.search().then(res => {
				this.$refs.me.endSuccess(res);
				console.log('123123123123');
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
</style>
