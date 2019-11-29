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
	import {login} from '../../utils/request.js'
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			login(e){
				console.log(e.detail.value);
				login(e.detail.value).then(res => {
					uni.showToast({
						title: '登录成功'
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
