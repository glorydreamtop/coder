<template>
	<view>
		<scroll-view scroll-x class="bg-white nav mescroll-touch-x" scroll-with-animation :scroll-left="scrollLeft">
			<view :class="['cu-item', index === TabCur ? 'text-blue' : '']" v-for="(item, index) in categories" :key="item.title" @tap="tabSelect(index)">{{ item.name }}</view>
		</scroll-view>
		<mescroll-uni class="list flex flex-direction justify-start" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
			<view class="card flex flex-direction justify-start margin-top-xs padding-sm" v-for="item in dataList[TabCur]" :key="item.title" @tap="toArticle(item.originalUrl)">
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
import { categories, articleList } from '../../utils/request';
import { formatTime } from '../../utils/funcitons';
import config from './config';
import MescrollUni from 'mescroll-uni';
export default {
	components: {
		MescrollUni
	},
	filters: {
		formatTime
	},
	data() {
		return {
			categories: [],
			TabCur: 0,
			scrollLeft: 0,
			// mescroll组件配置
			...config.mescrollOption,
			// 列表数据
			dataList: [[], [], [], [], [], [], [], [], [], []],
			// query id 列表
			queryList: config.queryList,
			// 分页信息
			pageInfos: config.pageInfos
		};
	},
	methods: {
		tabSelect(index) {
			console.log(index);
			if (this.TabCur === index) return;
			this.TabCur = index;
			this.scrollLeft = (index - 1) * 60;
			if (this.dataList[index].length === 0) this.getArticlelist();
		},
		getCategories() {
			this.categories = uni.getStorageSync('juejin_cate');
			// 检查缓存中是否存在分类
			if (!this.categories) {
				categories()
					.then(res => {
						const subscribe = {
							name: '关注',
							title: 'subscribe',
							id: ''
						};
						const recommend = {
							name: '推荐',
							title: 'recommend',
							id: ''
						};
						this.categories = [recommend, subscribe, ...res];
						uni.setStorageSync('juejin_cate', this.categories);
						this.getArticlelist();
					})
					.catch(err => {
						console.log(err);
						Toast('获取分类失败');
					});
			} else {
				this.getArticlelist();
			}
		},
		getArticlelist() {
			// 当前分类索引
			const index = this.TabCur;
			// 当前分类id
			const category = this.categories[index].id;
			// 当前分类请求所用queryId
			const id = index > 1 ? this.queryList[2].id : this.queryList[index].id;
			// 当前分类请求所用偏移量
			let endCursor = this.pageInfos[this.categories[index].title].endCursor;
			// 当前分类是否有下一页
			let hasNextPage = this.pageInfos[this.categories[index].title].hasNextPage;
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
					type: 'ARTICLE',
					tags: [],
					category,
					after: endCursor,
					order: 'POPULAR'
				}
			};
			return new Promise((resolve, reject) => {
				articleList(data)
					.then(res => {
						console.log(res);
						// 保存下次查询的偏移量
						this.pageInfos[this.categories[index].title].endCursor = res.pageInfo.endCursor;
						// 保存是否有下一页
						this.pageInfos[this.categories[index].title].hasNextPage = res.pageInfo.hasNextPage;
						// 保存列表数据
						console.log(this.dataList[index]);
						this.dataList[index] = this.dataList[index].concat(
							res.edges.map(item => {
								const info = {
									author: '',
									createdAt: '',
									tags: []
								};
								info.author = item.node.user ? item.node.user.username : item.node.targets[0].user.username;
								info.createdAt = item.node.createdAt ? item.node.createdAt : item.node.targets[0].createdAt;
								info.tags = item.node.tags
									? item.node.tags.map(tag => {
											return tag.title;
									  })
									: [];
								info.tags = info.tags.join('/');
								info.title = item.node.title ? item.node.title : item.node.targets[0].title;
								info.originalUrl = item.node.originalUrl ? item.node.originalUrl : item.node.targets[0].originalUrl;
								return info;
							})
						);

						console.log(this.dataList);
						resolve('success');
					})
					.catch(err => {
						console.log(err);
						reject('faild');
					});
			});
		},
		downCallback(mescroll) {
			mescroll.endSuccess(20, true);
		},
		upCallback(mescroll) {
			setTimeout(() => {
				this.getArticlelist().then(res => {
					mescroll.endSuccess(20, this.pageInfos[this.categories[this.TabCur].title].hasNextPage);
				});
			}, 1500);
		},
		toArticle(originalUrl) {
			uni.navigateTo({
				url:`../juejinArticle/juejinArticle?url=${originalUrl}`
			})
		}
	},
	onLoad() {
		this.getCategories();
	}
};
</script>

<style lang="scss" scoped>
.nav {
	border-bottom: 1px solid #ececec;
	position: fixed;
	z-index: 9;
}
/deep/.mescroll-uni-fixed {
	top: 90upx !important;
}
.list {
	width: 100vw;
	height: 100vh;
	.card {
		height: auto;
		width: 100vw;
		background-color: #ffffff;
		.meta {
			width: 100%;
			height: 1.5em;
		}
	}
}
</style>
