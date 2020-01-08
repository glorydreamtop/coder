<template>
	<view>
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
		<mescroll-item v-if="current === 'like'" class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update('like')" @down="reset('like')" ref="like" />
		<my-dialog :show="showDialog" @close="showDialog = false" :width="60">
			<view class="cu-list menu dialogList">
				<view class="cu-item" v-if="diaLogdata[TabCur].length" v-for="item in diaLogdata[TabCur]" :key="item.csId" @tap="tagselect(item.csId)">{{ item.title }}</view>
				<view class="cu-item" v-else>暂无收藏集</view>
			</view>
		</my-dialog>
	</view>
</template>

<script>
import { likeList, collectionSetEntries, collectionSet, colletcion } from '../../utils/request';
import { formatTime, Toast } from '../../utils/funcitons';
import config from './config';
import MescrollItem from '../../components/mescroll-item';
import myDialog from '../../components/my-dialog';
export default {
	components: {
		MescrollItem,
		myDialog
	},
	filters: {
		formatTime
	},
	data() {
		return {
			current: '',
			TabCur: 0,
			endCur: 0,
			collectionIds: [],
			dataList: [],
			diaLogdata: [],
			...config, // mescroll组件配置 mescrollOption 分页信息 pageInfos 收藏来源 collectionSets
			showDialog: false
		};
	},
	methods: {
		// 查询点赞详情列表
		likeList() {
			const data = {
				page: this.$refs.me.mescroll.options.up.page.num,
				pageSize: this.$refs.me.mescroll.options.up.page.size
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
			collectionSet(data).then(res => {
				this.diaLogdata.push(res);
			});
		},
		// 查询收藏集详情列表
		collectionList() {
			const entryIds = this.collectionIds.slice(this.endCur, this.endCur + 9).join('|');
			const data = {
				entryIds
			};
			return new Promise((resolve, reject) => {
				colletcion(data).then(res => {
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
					this.endCur = this.endCur + 9;
					resolve({ len: newData.length, total: res.total });
				});
			})
			
		},
		// 选择收藏集
		tagselect(csId) {
			const data = {
				csId,
				page: 0
			};
			collectionSetEntries(data).then(res => {
				this.collectionIds = res;
				this.dataList = [];
				this.collectionList();
				this.showDialog = false;
			});
		},
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
			}
		},
		reset(type) {
			switch (type) {
				case 'collection':
					this.$refs.collection.mescroll.resetUpScroll();
					break;
				case 'like':
					this.$refs.like.mescroll.resetUpScroll();
					break;
			}
			
		},
		// 选择收藏集来源
		tabSelect(index) {
			this.TabCur = index;
			setTimeout(() => {
				// this.collectionSetList(options.targetUserId);
				this.showDialog = true;
			}, 300);
		}
	},
	onLoad(options) {
		this.current = options.type;
		const title = this.pageInfos[this.current].title;
		uni.setNavigationBarTitle({
			title: `${title}(${options.num})`
		}).then(res => {
			switch (this.current) {
				case 'like':
					this.likeList();
					break;
				case 'collection':
					this.collectionSetList(options.targetUserId);
					break;
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
