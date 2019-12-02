<template>
	<view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view :class="['cu-item',index === TabCur?'text-blue':'']" v-for="(item,index) in categories" :key='item.title' @tap="tabSelect(index)">
				{{item.name}}
			</view>
			<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="list-item">
					
				</view>
			</mescroll-uni>
		</scroll-view>
	</view>
</template>

<script>
	import {
		categories,
		articleList
	} from '../../utils/request';
	import MescrollUni from "mescroll-uni";
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				categories: [],
				TabCur: 0,
				scrollLeft: 0,
				// 下拉刷新的常用配置
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的常用配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
					},
					noMoreSize: 10, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '么有更多了~~'
					}
				},
				// 列表数据
				dataList: []
			};
		},
		methods: {
			tabSelect(index) {
				console.log(index);
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
			},
			getCategories() {
				this.categories = uni.getStorageSync('juejin_cate');
				if (!this.categories) {
					categories().then(res => {
						const subscribe = {
							name: '关注',
							title: 'subscribe'
						}
						const recommend = {
							name: '推荐',
							title: 'recommend'
						}
						this.categories = [recommend, subscribe, ...res];
						uni.setStorageSync('juejin_cate', this.categories);

					}).catch(err => {
						console.log(err);
						Toast('获取分类失败')
					})
				}
				this.getArticlelist();
			},
			getArticlelist() {
				const data = {
					extensions: {
						query: {
							id: '21207e9ddb1de777adeaca7a2fb38030'
						}
					},
					operationName: "",
					query: "",
					variables: {
						first: 20,
						category: '',
						after: "",
						order: "POPULAR"
					}
				};
				articleList(data).then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
				})
			}
		},
		onLoad() {
			this.getCategories()
		},
		downCallback(mescroll){
			mescroll.endSuccess();
		}
	}
</script>

<style lang="scss">

</style>
