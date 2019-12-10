<template>
	<view class="all">
		<view class="">
			<form class="form margin-sm padding bg-white flex flex-direction justify-between" @submit="login">
				<view class="flex flex-direction inputs">
					<view class="">
						<input name="phoneNumber" placeholder="手机号/邮箱" @focus="focus(0)" @blur="focus(3)" />
						<view class="focus" v-if="inputFocus === 0"></view>
					</view>
					<view class="margin-top">
						<input name="password" placeholder="密码" @focus="focus(1)" @blur="focus(3)" password="true" />
						<view class="focus" v-if="inputFocus === 1"></view>
					</view>
					<view class="btn" v-if="inputFocus === 1"><button formType="submit">登录</button></view>
				</view>
				<!-- <button class='login cu-btn bg-red margin-tb-sm lg' formType='submit'>登录</button> -->
			</form>
		</view>
	</view>
</template>

<script>
import { login } from '../../utils/request';
import { Toast } from '../../utils/funcitons';
export default {
	data() {
		return {
			inputFocus: Number
		};
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
			if (phoneNumber.indexOf('@') !== -1) {
				values = {
					email: phoneNumber,
					password: password
				};
			}
			login(values).then(res => {
				console.log(res);
				uni.switchTab({
					url: '../juejin/juejin'
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.all {
	font-size: 28upx;
}
.form {
	height: auto;
	border-radius: 10upx;
}
.inputs {
	margin: 0 auto;
	width: 50%;
	height: auto;
	> view {
		position: relative;
		height: 36upx;
		width: 100%;
	}
	.btn{
		
		height: 68upx;
		animation: btn_down 1s ease;
		>button{
			border:none;
			outline: none;
			width: 80%;
			height: 68upx;
			padding: 10px 0;
			margin: 0 auto;
			color: white;
			font-size:28upx;
			line-height: 100%;
			background-color: #0077FF;
			border-radius: 0;
			animation: btn_down 1s ease;
		}
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
	background-color: #0077ff;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	animation: open 0.5s ease;
}
@keyframes open {
	from {
		width: 0;
	}
	to {
		width: 100%;
	}
}
@keyframes btn_down {
	from {
		height: 0;
	}
	to {
		height: 68upx;
	}
}
</style>
