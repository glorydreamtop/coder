<template>
	<view>
		<scroll-view scroll-x class="bg-white nav mescroll-touch-x" scroll-with-animation :scroll-left="scrollLeft">
			<view :class="['cu-item', index === TabCur ? 'text-blue cur' : '']" v-for="(item, index) in categories" :key="item.title"
			 @tap="tabSelect(index)">{{ item.name }}</view>
		</scroll-view>
		<view class="" v-for="idx in categories.length" v-show="TabCur === idx" :key="idx">
			<mescroll-item class="me" :mescrollOption="mescrollOption" :dataList="dataList[idx]" @up="update(idx)" @down="reset(idx)"
			 :ref="`me${idx}`">
				<view class="tagList flex justify-start text-white">
					<view :class="currentTagId[idx] === item.tagId ? 'text-blue' : ''" v-for="item in tagList[idx]" :key="item.title"
					 @tap="selectTag(item.tagId)">
						{{ item.title }}
					</view>
				</view>
			</mescroll-item>
		</view>
	</view>
</template>

<script>
	import {
		categories,
		articleList,
		tagsList
	} from '../../utils/request';
	import {
		formatTime,
		Toast
	} from '../../utils/funcitons';
	import config from './config';
	import MescrollItem from '../../components/mescroll-item';
	export default {
		components: {
			MescrollItem
		},
		filters: {
			formatTime
		},
		data() {
			return {
				// 分类列表
				categories: [],
				// 当前tab
				TabCur: 0,
				// 分类tab左划距离
				scrollLeft: 0,
				// mescroll组件配置 mescrollOption
				// 分页信息 pageInfos
				// query id 列表 queryList
				...config,
				// 分类标签列表
				tagList: new Array(10).fill([]),
				// 列表数据
				dataList: new Array(10).fill([]),
				// 当前tag
				currentTagId: []
			};
		},
		methods: {
			tabSelect(index) {
				console.log(index);
				if (this.TabCur === index) return;
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
				if (this.dataList[index].length === 0) {
					this.getTaglist(index);
					this.getArticlelist(index);
				}
			},
			selectTag(tagId) {
				console.log(tagId);

				let order;
				switch (tagId) {
					case 'coco0':
						order = 'POPULAR';
						break;
					case 'coco1':
						order = 'NEWEST';
						break;
					case 'coco2':
						order = 'THREE_DAYS_HOTTEST';
						break;
					default:
						order = 'POPULAR';
						break;
				}
				if (tagId === 'all') {
					tagId = '';
				}
				const index = this.TabCur;
				this.dataList[index] = [];
				this.currentTagId[index] = tagId;
				this.pageInfos[this.categories[index].title].endCursor = '';
				this.getArticlelist(this.TabCur, [tagId], order);
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
							this.currentTagId = ['coco0', '', ...new Array(this.categories.length - 2).fill('all')];
							this.getTaglist(0);
							this.getArticlelist(0);
						})
						.catch(err => {
							console.log(err);
							Toast('获取分类失败');
						});
				} else {
					this.currentTagId = ['coco0', '', ...new Array(this.categories.length - 2).fill('all')];
					this.getTaglist(0);
					this.getArticlelist(0);
				}
			},
			getArticlelist(index, tags, order) {
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
						tags: tags || [],
						category,
						after: endCursor,
						order: order || 'POPULAR'
					}
				};
				return new Promise((resolve, reject) => {
					articleList(data)
						.then(res => {
							// 保存下次查询的偏移量
							this.pageInfos[this.categories[index].title].endCursor = res.pageInfo.endCursor;
							// 保存是否有下一页
							this.pageInfos[this.categories[index].title].hasNextPage = res.pageInfo.hasNextPage;
							// 保存列表数据
							this.dataList[index] = this.dataList[index].concat(
								res.edges.map(item => {
									const info = {};
									const node = index === 1 ? item.node.targets[0] : item.node;
									info.likeCount = node.likeCount;
									info.viewerHasLiked = node.viewerHasLiked;
									info.author = node.user.username;
									info.createdAt = node.createdAt;
									info.tags = node.tags ?
										node.tags.map(tag => {
											return tag.title;
										}) :
										[node.user.jobTitle];
									info.tags = info.tags.join('/');
									info.title = node.title;
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
			getTaglist(index) {
				// 当前分类id
				if (index === 0) {
					this.tagList[0] = [{
							title: '最热',
							tagId: 'coco0'
						},
						{
							title: '最新',
							tagId: 'coco1'
						},
						{
							title: '三天热榜',
							tagId: 'coco2'
						}
					];
				} else if (index > 1) {
					const category = this.categories[index].id;
					const id = this.queryList[3].id;
					const data = {
						extensions: {
							query: {
								id
							}
						},
						operationName: '',
						query: '',
						variables: {
							limit: 15,
							category
						}
					};
					tagsList(data).then(res => {
						this.tagList[index] = [{
								title: '全部',
								tagId: 'all'
							},
							...res
						];
					});
				}
				console.log(this.tagList[0]);
			},
			update(idx) {
				setTimeout(() => {
					this.getArticlelist(idx).then(res => {
						this.$refs[`me${idx}`][0].endSuccess(res);
					}).catch((err) => {
						this.$refs[`me${idx}`][0].endSuccess(res);
					});
				}, 1000);
			},
			reset(idx) {
				this.dataList[idx] = [];
				this.pageInfos[this.categories[idx].title].endCursor = '';
				this.pageInfos[this.categories[idx].title].hasNextPage = true;
				this.getArticlelist(idx).then(res => {
					this.$refs[`me${idx}`][0].endSuccess(res);
				}).catch((err) => {
					this.$refs[`me${idx}`][0].endSuccess(res);
				})
			}
		},
		onLoad() {
			this.getCategories();
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '../juejinSearch/juejinSearch'
			});
		}
	};
</script>

<style lang="scss" scoped>
	.nav {
		border-bottom: 1px solid #ececec;
		font-size: 28upx;
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.me {
		height: 100%;
	}

	.tagList {
		width: 96vw;
		margin: 90upx auto -20upx auto;
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
