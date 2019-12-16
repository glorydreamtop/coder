<template>
	<view class="all">
		<view class="juejin bg-white">
			<view class="flex justify-start">
				<form :class="[isLoading === 3 ? 'toleft' : '','inputs','margin']" @submit="login">
					<view class="margin-sm padding flex flex-direction justify-between">
						<view class="">
							<input name="phoneNumber" placeholder="手机号/邮箱" value="17320266068" @focus="focus(0)" @blur="focus(3)" />
							<view class="focus" v-if="inputFocus === 0"></view>
						</view>
						<view class="margin-top">
							<input name="password" placeholder="密码" value="adidas0520" @focus="focus(1)" @blur="focus(3)" password="true" />
							<view class="focus" v-if="inputFocus === 1"></view>
						</view>
						<button :class="[inputFocus === 1 ? 'btn_show' : 'btn_hidden', 'btn']" formType="submit">
							<text>登录</text>
							<text class="loading" v-if="isLoading===2"></text>
						</button>
					</view>
				
				</form>
				<view :class="['infoBox','margin','flex','justify-between']">
					<view class="personal flex justify-between">
						<image :src="juejinInfo.avatarHd" class="cu-avatar lg round" mode="widthFix"></image>
						<view class="flex flex-direction justify-between margin-left-sm">
							<text class="text-lg">{{ juejinInfo.userName }}</text>
							<text class="text-gray">{{ juejinInfo.jobTitle }}</text>
						</view>
					</view>
					<view class=""></view>
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
	export default {
		data() {
			return {
				inputFocus: Number,
				isLoading: 1,
				scrollLeft: true,
				showLogin: false
			};
		},
		computed: {
			juejinInfo() {
				return uni.getStorageSync('juejinInfo');
			}
		},
		methods: {
			focus(index) {
				this.inputFocus = index;
			},
			login(e) {
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
					this.isLoading = 3;
					Toast('登录成功')
					console.log(res);

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
			uni.removeStorageSync('juejinInfo');
			uni.removeStorageSync('juejinHeaders')
			this.updateJuejinInfo();
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
		padding:5vw;
		margin: 20upx auto;
		border-radius: 18upx;
		overflow: auto;
		>view{
			width: 180vw;
			border: #0077ff solid 1px;
		}
	}

	.inputs {
		width: 60vw;
		height: auto;
		padding: 5vw;
		border: #0077ff solid 1px;
		>view {
			width: 60%;
			margin: 0 auto;
		}

		>view>view {
			height: 36upx;
			width: 100%;
		}

		.btn {
			transition: height linear 0.5s;
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
		width: 60vw;
		height: auto;
		padding: 5vw;
		border: #111 solid 1px;
	}

	.toleft {
		animation: toleft 0.5s linear;
		transform: translateX(-90vw);
	}

	@keyframes toleft {
		from {
			transform: translateX(0vw);
		}

		to {
			transform: translateX(-90vw);
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
