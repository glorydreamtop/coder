<template>
	<view class="all">
		<view class="juejin bg-white">
			<view :class="['flex','justify-between',isLoading === 3 ? 'toleft' : '',isLogin ? 'onleft' : '']">
				<form class="inputs flex flex-direction justify-between" @submit="login">
					<view class="">
						<input name="phoneNumber" placeholder="手机号/邮箱" value="17320266068" @focus="focus(0)" @blur="focus(2)" />
						<view class="focus" v-if="inputFocus === 0"></view>
					</view>
					<view class="margin-top">
						<input name="password" placeholder="密码" value="adidas0520" @focus="focus(1)" @blur="focus(2)" password="true" />
						<view class="focus" v-if="inputFocus === 1"></view>
					</view>
					<button :class="[inputFocus === 1 ? 'btn_show' : 'btn_hidden', 'btn']" formType="submit">
						<text>登录</text>
						<text class="loading" v-if="isLoading===2"></text>
					</button>
				</form>
				<view class="infoBox flex justify-between align-center">
					<view class="personal flex justify-between align-center">
						<image :src="juejinInfo.avatarHd" class="cu-avatar lg round" mode="widthFix"></image>
						<view class="flex flex-direction justify-between margin-left-sm">
							<text class="text-lg">{{ juejinInfo.userName }}</text>
							<text class="text-gray">{{ juejinInfo.jobTitle }}</text>
						</view>
					</view>
					<view class="flex justify-between text-center">
						<view class=" flex flex-direction justify-between">
							<text class="text-lg">赞</text>
							<text>{{juejinInfo.collectedEntriesCount}}</text>
						</view>
						<view class=" flex flex-direction justify-between text-center">
							<text class="text-lg">收藏</text>
							<text>{{juejinInfo.collectionSetCount}}</text>
						</view>
						<view class=" flex flex-direction justify-between text-center">
							<text class="text-lg">读过</text>
							<text>{{juejinInfo.viewedEntriesCount}}</text>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		login
	} from '../../utils/request';
	import {
		Toast
	} from '../../utils/funcitons';
	import {
		getUserInfo
	} from '../../utils/init';
	export default {
		data() {
			return {
				inputFocus: 2,
				isLoading: 1,
				scrollLeft: true,
				showLogin: false
			};
		},
		computed: {
			juejinInfo() {
				return uni.getStorageSync('juejinInfo')
			},
			isLogin(){
				let bool;
				if(this.juejinInfo.userName){
					bool = true
				}else{
					bool = false
				}
				return bool;
			}
		},
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
				if (phoneNumber.indexOf('@') !== -1) {
					values = {
						email: phoneNumber,
						password: password
					};
				}
				this.isLoading = 2;
				login(values).then(res => {
					this.inputFocus = 2;
					getUserInfo().then(res => {
						setTimeout(() => {
							this.isLoading = 3;
						}, 800)
					})

					// uni.switchTab({
					// 	url: '../juejin/juejin'
					// });
				});
			},
			updateJuejinInfo() {
				const values = {};
				if (this.juejinInfo.account.indexOf('@') !== -1) {
					values.email = this.juejinInfo.account;
				} else {
					values.phoneNumber = this.juejinInfo.account;
				}
				values.password = this.juejinInfo.password;
				login(values).then(res => {
					Toast('更新成功')
					uni.stopPullDownRefresh();
				});
			}
		},
		onPullDownRefresh() {
			if (this.juejinInfo) {
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
			// this.updateJuejinInfo();
		},
		onLoad() {}
	};
</script>

<style lang="scss" scoped>
	.all {
		font-size: 28upx;
	}

	.juejin {
		height: auto;
		width: 90vw;
		padding: 5vw;
		margin: 20upx auto;
		border-radius: 18upx;
		overflow: hidden;

		>view {
			width: 165vw;
			padding: 0;
		}
	}

	.inputs {
		width: 70vw;
		height: auto;
		padding: 5vw;

		>view {
			width: 50%;
			margin: 0 auto;
		}

		>view>view {
			height: 36upx;
			width: 100%;
		}

		.btn {
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
		width: 80vw;
		height: auto;
		padding: 5vw 0;

		>view:last-child {
			min-width: 8em;
			height: 96upx;
		}
	}

	.personal {
		>view {
			height: 96upx;
		}
	}

	.toleft {
		animation: toleft 0.3s linear;
		transform: translateX(-85vw);
	}

	.onleft {
		transform: translateX(-85vw);
	}

	@keyframes toleft {
		from {
			transform: translateX(0vw);
		}

		to {
			transform: translateX(-85vw);
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
</style>
