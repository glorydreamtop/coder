<template>
	<view>
		<form class='form' @submit='login'>
			<view>
				<input name='phoneNumber' value="17320266068" placeholder='手机号/邮箱' focus></input>
				<input name='password' value="adidas0520" placeholder='密码' password='true'></input>
			</view>
			<button class='login' formType='submit'>登录</button>
		</form>
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

			};
		},
		methods: {
			login(e) {
				let values = e.detail.value;
				let phoneNumber = values.phoneNumber || ''
				let password = values.password || ''
				if (!phoneNumber.replace(/\s+/g, '')) {
					Toast('请输入账号')
					return
				}
				if (!password.replace(/\s+/g, '')) {
					Toast('请输入密码')
					return
				}
				if (phoneNumber.indexOf('@') !== -1) {
					values = {
						email: phoneNumber,
						password: password,
					}
				}
				login(values).then(res => {
					console.log(res);
					uni.switchTab({
						url: '../juejin/juejin'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
