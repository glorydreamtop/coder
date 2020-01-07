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
			<!-- <mescroll-item v-if="current === 'collection'" class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update()" @down="reset()" ref="me" /> -->
		</view>
		<mescroll-item v-if="current === 'like'" class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update()" @down="reset()" ref="me" />
		<my-dialog :show="showDialog" @close="showDialog = false" :width="60">
			<view class="cu-list menu dialogList"><view class="cu-item" v-for="item in diaLogdata" :key="item.csId" @tap="tagselect(item.csId)">{{item.title}}</view></view>
		</my-dialog>
	</view>
</template>

<script>
import { likeList,collectionSet } from '../../utils/request';
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
			dataList: [],
			diaLogdata:[],
			...config, // mescroll组件配置 mescrollOption 分页信息 pageInfos 收藏来源 collectionSets
			showDialog: false
		};
	},
	methods: {
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
								viewerHasLiked: true
							};
							info.postId = info.originalUrl.split('/')[4];
							info.tags = item.tags
								.map(i => {
									return i.title;
								})
								.join('/');
							info.likeCount = item.collectionCount;
							return info;
						})
					);
					resolve({ len: newData.length, total: res.total });
				});
			});
		},
		collectionSetList(targetUserId) {
			const data = {
				targetUserId:targetUserId || uni.getStorageSync('juejinHeaders').userId,
				page: 0
			};
			collectionSet(data).then(res => {
				this.diaLogdata = res;
			})
			
		},
		collectionList(){
			
		},
		tagselect(csId){
			this.showDialog = false;
		},
		update() {
			this.likeList().then(res => {
				this.$refs.me.mescroll.endBySize(res.len, res.total);
			});
		},
		reset() {
			this.$refs.me.mescroll.resetUpScroll();
		},
		tabSelect(index) {
			if (this.TabCur === index) {
				// Toast('选择收藏集1');
				this.showDialog = true;
			} else {
				this.TabCur = index;
			}
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
.dialogList{
	height: auto;
	width: 100%;
	max-height: 29vh;
	overflow-y: auto;
	>view{
		height: 6vh;
	}
}
</style>
