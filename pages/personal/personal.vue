<template>
	<view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
		    <view class="cu-item arrow">
		      <view class="content flex justify-between align-center padding-tb-sm" @tap="openAlbum">
		        <text class="text-grey">头像</text>
				<image :src="juejinInfo.avatarLarge" class="cu-avatar round" mode="aspectFill"></image>
		      </view>
		    </view>
		    <view class="cu-item arrow">
		      <view class="content flex justify-between align-center">
		        <text class="text-grey">用户名</text>
				<input class="text-grey" type="text" v-model="juejinInfo.username" @confirm="submit('username')" />
		      </view>
		    </view>
		    <view class="cu-item arrow">
		      <view class="content flex justify-between align-center">
		        <text class="text-grey">职位</text>
		        <input class="text-grey" type="text" v-model="juejinInfo.jobTitle" placeholder="暂未填写" placeholder-class="text-grey" @confirm="submit('jobTitle')" />
		      </view>
		    </view>
		    <view class="cu-item arrow">
		      <view class="content flex justify-between align-center">
		        <text class="text-grey">公司</text>
				<input class="text-grey" type="text" v-model="juejinInfo.company" placeholder="暂未填写" placeholder-class="text-grey" @confirm="submit('company')" />
		      </view>
		    </view>
		    <view class="cu-item arrow">
		      <view class="content flex justify-between align-center">
		        <text class="text-grey">个人介绍</text>
				<input class="text-grey" type="text" v-model="juejinInfo.selfDescription" placeholder="暂未填写" placeholder-class="text-grey" @confirm="submit('selfDescription')" />
		      </view>
		    </view>
		  </view>
	</view>
</template>

<script>
	import {Toast} from '../../utils/funcitons';
	import {updateUserinfo,userInfo} from '../../utils/request';
	export default {
		data() {
			return {
				juejinInfo:{
					username:'',
					jobTitle:'',
					company:'',
					selfDescription:''
				}
			};
		},
		methods:{
			openAlbum(){
				
			},
			submit(field){
				const data ={
					field,
					value:this.juejinInfo[field]
				}
				updateUserinfo(data).then(res => {
					Toast('修改成功')
					userInfo().then(res => {
						this.juejinInfo = res;
					})
				}).catch(err => {
					Toast(err.m);
					this.juejinInfo = uni.getStorageSync('juejinInfo');
				})
			}
		},
		onLoad() {
			this.juejinInfo = uni.getStorageSync('juejinInfo');
		}
	}
</script>

<style lang="scss" scoped>
.content>text{
	width: auto;
	white-space:nowrap;
}
input{
	text-align: right;
}
</style>
