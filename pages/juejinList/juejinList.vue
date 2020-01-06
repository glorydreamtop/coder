<template>
	<view><mescroll-item class="me" :mescrollOption="mescrollOption" :dataListprop="dataList" @up="update()" @down="reset()" ref="me" /></view>
</template>

<script>
import { likeList } from '../../utils/request';
import { formatTime, Toast } from '../../utils/funcitons';
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
			dataList: [],
			...config // mescroll组件配置 mescrollOption 分页信息 pageInfos query id 列表 queryList
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
					resolve({len: newData.length,total: res.total});
				});
			});
		},
		update() {
			this.likeList().then(res => {
				this.$refs.me.mescroll.endBySize(res.len,res.total)
			})
		},
		reset() {
			this.$refs.me.mescroll.resetUpScroll();
		}
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title:`${options.type}(${options.num})`
		}).then(res => {
			this.likeList();
		})
		
	}
};
</script>

<style lang="scss" scoped>
.me {
	height: 100%;
}
</style>
