<template>
	<view>
		<!-- 收藏 -->
		<view v-if="current === 'collection'" class="">
			<scroll-view scroll-x class="bg-white shadow nav mescroll-touch-x" scroll-with-animation :scroll-left="scrollLeft">
				<view class="flex text-center">
					<view
						:class="['cu-item', 'flex-sub', index === TabCur ? 'text-blue cur' : '']"
						v-for="(item, index) in collectionSets"
						:key="item.title"
						@tap="tabSelect(index)"
					>
						<text>{{ item.title }}</text>
						<text class="cuIcon-unfold"></text>
					</view>
				</view>
			</scroll-view>
			<mescroll-item class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update('collection')" @down="reset('collection')" top="90" ref="collection" />
		</view>
		<!-- 专栏 -->
		<mescroll-item v-if="current === 'post'" class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update('post')" @down="reset('post')" ref="post" />
		<!-- 赞 -->
		<mescroll-item v-if="current === 'like'" class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update('like')" @down="reset('like')" ref="like" />
		<!-- 关注的人 -->
		<user-item
			v-if="current === 'follow'"
			class="me"
			:mescrollOption="mescrollOption"
			:dataListprop="dataList"
			@up="update('follow')"
			@down="reset('follow')"
			ref="follow"
		></user-item>
		<!-- 弹窗 -->
		<my-dialog :show="showDialog" @close="showDialog = false" :width="60">
			<view class="cu-list menu dialogList">
				<view class="cu-item flex justify-between" v-if="diaLogdata[TabCur].length" v-for="item in diaLogdata[TabCur]" :key="item.csId" @tap="tagselect(item.csId)">
					<text>{{ item.title }}</text>
					<text class="text-blue">{{ item.entryCount }}</text>
				</view>
				<view class="cu-item" v-else>暂无收藏集</view>
			</view>
		</my-dialog>
	</view>
</template>

<script>
import { likeList, collectionSetEntries, collectionSet, collection, followList, postList } from '../../utils/request';
import { formatTime, Toast } from '../../utils/funcitons';
import config from './config';
import MescrollItem from '../../components/mescroll-item';
import UserItem from '../../components/user-item';
import myDialog from '../../components/my-dialog';
export default {
	components: {
		MescrollItem,
		UserItem,
		myDialog
	},
	filters: {
		formatTime
	},
	data() {
		return {
			current: '', // 当前页面类型(赞，关注，收藏)
			TabCur: 0, // 当前Tab索引
			targetUserId: '', // 当前被查看用户id
			collectionIds: [], // 当前收藏集所有条目id
			dataList: [], // 当前mescroll数据列表
			diaLogdata: [], // 当前弹窗所有条目
			...config, // mescroll组件配置 mescrollOption 分页信息 pageInfos 收藏来源 collectionSets
			showDialog: false // 是否显示弹窗
		};
	},
	methods: {
		// 查询点赞详情列表
		likeList() {
			const data = {
				page: this.$refs.like.mescroll.options.up.page.num,
				pageSize: this.$refs.like.mescroll.options.up.page.size
			};
			return new Promise((resolve, reject) => {
				likeList(data).then(res => {
					this.pageInfos.like.total = res.total;
					const newData = res.entryList;
					this.dataList = this.dataList.concat(
						newData.map(item => {
							const info = {
								originalUrl: item.originalUrl,
								title: item.title,
								id: item.objectId,
								createdAt: item.createdAt,
								author: item.user.username,
								viewerHasLiked: true,
								likeCount: item.collectionCount
							};
							info.postId = info.originalUrl.split('/')[4];
							info.tags = item.tags
								.map(i => {
									return i.title;
								})
								.join('/');
							return info;
						})
					);
					resolve({ len: newData.length, total: res.total });
				});
			});
		},
		// 查询收藏集列表
		collectionSetList(targetUserId) {
			const data = {
				targetUserId: targetUserId || uni.getStorageSync('juejinHeaders').userId,
				page: 0
			};
			const type = this.TabCur === 0 ? 'user' : 'follow';
			return new Promise((resolve, reject) => {
				collectionSet(data, type).then(res => {
					this.diaLogdata.push(res);
					resolve();
				});
			});
		},
		// 查询收藏集详情列表
		collectionList() {
			const endCur = this.$refs.collection.mescroll.options.up.page.num * 10;
			const entryIds = this.collectionIds.slice(endCur, endCur + 10).join('|');
			const data = {
				entryIds
			};
			return new Promise((resolve, reject) => {
				collection(data).then(res => {
					const newData = res.entrylist;
					this.dataList = this.dataList.concat(
						newData.map(item => {
							const info = {
								originalUrl: item.originalUrl,
								title: item.title,
								id: item.objectId,
								createdAt: item.createdAt,
								author: item.user.username,
								viewerHasLiked: item.isCollected,
								likeCount: item.collectionCount
							};
							info.postId = info.originalUrl.split('/')[4];
							info.tags = item.tags
								.map(i => {
									return i.title;
								})
								.join('/');
							return info;
						})
					);
					resolve({ len: newData.length, total: res.total });
				});
			});
		},
		// 选择收藏集
		tagselect(csId) {
			const data = {
				csId,
				page: 0
			};
			collectionSetEntries(data).then(res => {
				this.collectionIds = res;
				this.$refs.collection.mescroll.setPageNum(1);
				this.dataList = [];
				this.collectionList();
				this.showDialog = false;
			});
		},
		// 关注的人列表
		followList() {
			followList().then(res => {
				const newData = res.map(item => {
					const info = item.followee;
					info.viewerIsFollowing = info.currentUserFollowed;
					info.avatarHd = info.avatarHd ? info.avatarHd : info.avatarLarge ? info.avatarLarge : '/static/noAvatar.png';
					return info;
				});
				this.dataList = newData;
				this.$refs.follow.mescroll.endSuccess(newData.length, false);
				this.$refs.follow.mescroll.showNoMore();
			});
		},
		postList() {
			const data = {
				limit: this.$refs.like.mescroll.options.up.page.size,
				before: this.dataList[this.dataList.length - 1].creatAt
			};
			return new Promise((resolve, reject) => {
				postList(data).then(res => {
					const newData = res.entrylist.map(item => {
						const info = {
							originalUrl: item.originalUrl,
							title: item.title,
							id: item.objectId,
							createdAt: item.createdAt,
							author: item.user.username,
							viewerHasLiked: item.isCollected,
							likeCount: item.collectionCount
						};
						info.postId = info.originalUrl.split('/')[4];
						info.tags = item.tags
							.map(i => {
								return i.title;
							})
							.join('/');
						return info;
					});
					this.dataList.concat(newData);
					const hasNextpage = res.total < data.limit ? false : true;
					resolve({ len: newData.length, hasNextpage });
				});
			});
		},
		// 上拉加载的回调
		update(type) {
			switch (type) {
				case 'collection':
					this.collectionList().then(res => {
						this.$refs.collection.mescroll.endBySize(res.len, res.total);
					});
					break;
				case 'like':
					this.likeList().then(res => {
						this.$refs.like.mescroll.endBySize(res.len, res.total);
					});
					break;
				case 'follow':
					this.$refs.follow.mescroll.showNoMore();
					break;
				case 'post':
					this.postList().then(res => {
						this.$refs.post.mescroll.endSuccess(res.len, res.hasNextpage);
					});
					break;
			}
		},
		// 下拉重置的回调
		reset(type) {
			switch (type) {
				case 'collection':
					this.$refs.collection.mescroll.resetUpScroll();
					break;
				case 'like':
					this.$refs.like.mescroll.resetUpScroll();
					break;
				case 'follow':
					this.followList();
					break;
				case 'post':
					this.$refs.post.mescroll.resetUpScroll();
			}
		},
		// 选择收藏集来源
		tabSelect(index) {
			this.TabCur = index;
			this.collectionSetList(this.targetUserId).then(res => {
				this.showDialog = true;
			});
		}
	},
	onLoad(options) {
		// 设置当前页面类型、标题和被查看用户
		this.current = options.type;
		this.targetUserId = options.targetUserId;
		const title = this.pageInfos[this.current].title;
		uni.setNavigationBarTitle({
			title: `${title}(${options.num})`
		}).then(res => {
			switch (this.current) {
				case 'like':
					this.likeList();
					break;
				case 'collection':
					this.tabSelect(0);
					break;
				case 'follow':
					this.followList().then(res => {
						this.$refs.follow.mescroll.endSuccess(res, false);
					});
			}
		});
	}
};
</script>

<style lang="scss" scoped>
.me {
	height: 100%;
}
.dialogList {
	height: auto;
	width: 100%;
	max-height: 29vh;
	overflow-y: auto;
	> view {
		height: 6vh;
	}
}
</style>
