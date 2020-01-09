<template>
	<view class="all">
		<view class="boxes juejin">
			<view :class="['flex', 'justify-between', isLoading === 3 ? 'toleft' : '', isLogin ? 'onleft' : '']">
				<form class="inputs flex flex-direction justify-between" @submit="login">
					<view class="">
						<input name="phoneNumber" placeholder="手机号/邮箱" value="17320266068" @focus="focus(0)" @blur="focus(2)" />
						<view class="focus" v-if="inputFocus === 0"></view>
					</view>
					<view class="margin-top">
						<input name="password" placeholder="密码" value="adidas0520" @focus="focus(1)" @blur="focus(2)" password="true" />
						<view class="focus" v-if="inputFocus === 1"></view>
					</view>
					<button v-if="isLoading < 4" :class="[inputFocus === 1 ? 'btn_show' : 'btn_hidden', 'btn']" formType="submit">
						<text>登录</text>
						<text class="loading" v-if="isLoading === 2"></text>
					</button>
				</form>
				<view class="infoBox">
					<view class="personal flex justify-start align-center">
						<image :src="juejinInfo.avatarHd" class="cu-avatar lg round" mode="widthFix"></image>
						<view class="flex flex-direction justify-between margin-left-sm">
							<text class="text-lg">{{ juejinInfo.username }}</text>
							<text class="text-gray">{{ juejinInfo.jobTitle }}</text>
						</view>
					</view>
					<view :class="['base-num', 'flex', 'justify-between', 'text-center', isLoading === 4 ? 'base-num_show' : 'base-num_hidden']">
						<view class=" flex flex-direction justify-between" @tap="toList('like', juejinInfo.collectedEntriesCount)">
							<text class="text-lg">赞</text>
							<text>{{ juejinInfo.collectedEntriesCount }}</text>
						</view>
						<view class=" flex flex-direction justify-between" @tap="toList('collection', juejinInfo.collectionSetCount)">
							<text class="text-lg">收藏集</text>
							<text>{{ juejinInfo.collectionSetCount }}</text>
						</view>
						<view class=" flex flex-direction justify-between" @tap="Toast('看过这么多，都会了？')">
							<text class="text-lg">读过</text>
							<text>{{ juejinInfo.viewedEntriesCount }}</text>
						</view>
						<view class=" flex flex-direction justify-between" @tap="toList('follow', juejinInfo.followeesCount)">
							<text class="text-lg">关注</text>
							<text>{{ juejinInfo.followeesCount }}</text>
						</view>
						<view class=" flex flex-direction justify-between">
							<text class="text-lg">粉丝</text>
							<text>{{ juejinInfo.followersCount }}</text>
						</view>
						<view class=" flex flex-direction justify-between" @tap="toList('post', juejinInfo.postedPostsCount)">
							<text class="text-lg">专栏</text>
							<text>{{ juejinInfo.postedPostsCount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="boxes flex justify-between align-center">
			<view class="">切换每日一图来源</view>
			<view class="btns">
				<button
					:class="['cu-btn', 'round', item.selected ? `bg-${item.color}` : `line-${item.color}`, 'shadow', 'margin-right-xs', 'sm']"
					@tap="checkPic(item, index)"
					v-for="(item, index) in pics"
					:key="item.name"
				>
					{{ item.name }}
				</button>
			</view>
		</view>
		<view class="boxes text-red text-bold text-lg text-center" @tap="showModal = true">清除所有缓存</view>
		<neil-modal 
		    :show="showModal" 
		    title="操作提示" 
		    content="确定要清除所有缓存吗？"
			@close="showModal = false"
		    @cancel="showModal = false" 
		    @confirm="clearStorge">
		</neil-modal>
	</view>
</template>

<script>
import { login, userInfo } from '../../utils/request';
import { Toast } from '../../utils/funcitons';
import { pics } from './pics';
import neilModal from '../../components/neil-modal';
export default {
	components:{
		neilModal
	},
	data() {
		return {
			inputFocus: 2, // 0:账号框,1:密码框,2空状态
			isLoading: 1, // 1:未登录,2:现在登录中,3:刚刚已登录,4:已登录
			scrollLeft: true, // 是否显示个人信息框
			juejinInfo: null, // 掘金用户信息
			isLogin: false, // 登录状态
			showModal:false,
			pics
		};
	},
	computed: {},
	methods: {
		focus(index) {
			this.inputFocus = index;
		},
		login(e) {
			this.inputFocus = 1;
			let values = e.detail.value;
			let phoneNumber = values.phoneNumber || '';
			let password = values.password || '';
			if (!phoneNumber.replace(/\s+/g, '')) {
				Toast('请输入账号');
				return;
			}
			if (!password.replace(/\s+/g, '')) {
				Toast('请输入密码');
				return;
			}
			if (phoneNumber.includes('@')) {
				values = {
					email: phoneNumber,
					password: password
				};
			}
			this.isLoading = 2;
			login(values).then(res => {
				this.inputFocus = 2;
				this.updateJuejinInfo().then(res => {
					setTimeout(() => {
						this.isLoading = 3;
						this.isLogin = this.juejinInfo !== null ? true : false;
						setTimeout(() => {
							this.isLoading = 4;
						}, 300);
					}, 500);
				});
			});
		},
		toList(type, num) {
			uni.navigateTo({
				url: `../juejinList/juejinList?type=${type}&num=${num}`
			});
		},
		updateJuejinInfo() {
			return new Promise((resolve, reject) => {
				userInfo().then(res => {
					uni.getStorage({
						key: 'juejinInfo'
					}).then(res => {
						this.juejinInfo = res[1].data;
						resolve('success');
					});
					// this.juejinInfo = uni.getStorageInfoSync('juejinInfo');
				});
			});
		},
		checkPic(info, index) {
			let url = info.url;
			const currentPic = uni.getStorageSync('currentPic');
			if (index === 2) {
				this.pics.forEach(item => {
					item.selected = false;
				});
				this.pics[2].selected = true;
				const onePic = uni.getStorageSync('onePic');
				console.log(onePic);
				uni.setStorage({
					key: 'currentPic',
					data: onePic
				});
			} else if (url !== currentPic) {
				uni.setStorage({
					key: 'currentPic',
					data: url
				}).then(res => {
					this.pics.forEach(item => {
						item.selected = item.name === info.name ? true : false;
					});
				});
			}
		},
		clearStorge() {
			uni.setStorage({
				key: 'currentPic',
				data: ''
			}).then(res => {
				this.pics.forEach(item => {
					item.selected = false;
				});
			});
			uni.startPullDownRefresh({
				success: () => {
					this.showModal = false;
					Toast('清除成功');
				}
			});
		}
	},
	onPullDownRefresh() {
		if (this.juejinInfo) {
			this.juejinInfo = null;
			uni.removeStorage({
				key: 'juejinInfo'
			}).then(res => {
				uni.removeStorage({
					key: 'juejinHeaders'
				}).then(res => {
					this.isLogin = false;
					this.isLoading = 1;
					uni.stopPullDownRefresh();
				});
			});
		} else {
			this.isLogin = false;
			this.isLoading = 1;
			uni.stopPullDownRefresh();
		}
	},
	onLoad() {
		this.juejinInfo = uni.getStorageSync('juejinInfo') || null;
		this.isLogin = this.juejinInfo !== null ? true : false;
		this.isLoading = this.isLogin ? 4 : 1;
		const url = uni.getStorageSync('currentPic');
		const Reg = /wufazhuce/g;
		if (Reg.test(url)) {
			this.pics[2].selected = true;
		} else {
			this.pics.forEach(item => {
				item.selected = item.url === uni.getStorageSync('currentPic') ? true : false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.all {
	font-size: 28upx;
}

.boxes {
	height: auto;
	width: 94vw;
	padding: 5vw;
	box-sizing: border-box;
	margin: 20upx auto;
	border-radius: 18upx;
	background-color: #FFFFFF;
	box-shadow: 10upx 10upx 5upx #eaeaea;
}

.juejin {
	overflow: auto;
	> view {
		width: 178vw;
		box-sizing: border-box;
		padding: 0;
		padding-right: 5vw;
	}
}

.inputs {
	width: 84vw;
	height: auto;
	box-sizing: border-box;

	> view {
		width: 50%;
		margin: 0 auto;
	}

	> view > view {
		height: 36upx;
		width: 100%;
	}

	.btn {
		min-height: 0;
		max-height: 68upx;
		transition: height linear 0.3s;
		transition-delay: 0.3s;
		border: none;
		outline: none;
		width: 60%;
		margin: 0 auto;
		color: white;
		font-size: 28upx;
		line-height: 68upx;
		background-color: #0077ff;
		border-radius: 0;
	}

	.btn_hidden {
		height: 0;
	}

	.btn_show {
		height: 68upx;
	}
}

input {
	height: 100%;
	min-height: 100%;
	line-height: 100%;
	box-sizing: border-box;
	text-align: center;
}

.focus {
	width: 100%;
	height: 1px;
	display: block;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	background-color: #0077ff;
	animation: open linear 0.3s;
}

.loading:after {
	content: '\e67a';
	font-family: 'cuIcon';
	display: inline-block;
	animation: cuIcon-spin 1s infinite linear;
}

.infoBox {
	width: 84vw;
	height: auto;
	box-sizing: border-box;
}

.base-num {
	transition: all linear 0.3s;
	transition-delay: 0.3s;
	width: 100%;
	margin: 0 auto;
	overflow: hidden;
}

.base-num_hidden {
	max-height: 0;
	margin-top: 0upx;
}

.base-num_show {
	max-height: 96upx;
	margin-top: 20upx;
}

.personal {
	> view {
		height: 96upx;
	}

	> image {
		width: 144upx;
		height: 144upx;
	}
}

.toleft {
	animation: toleft 0.3s linear;
	transform: translateX(-89vw);
}

.onleft {
	transform: translateX(-89vw);
}

@keyframes toleft {
	from {
		transform: translateX(0vw);
	}

	to {
		transform: translateX(-89vw);
	}
}

@keyframes open {
	from {
		width: 0;
	}

	to {
		width: 100%;
	}
}

.btns {
	> button {
		width: 4em;
	}
}
</style>
