<template>
	<view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
			<view class="cu-item arrow">
				<view class="content flex justify-between align-center padding-tb-sm" @tap="choosePic">
					<text class="text-grey">头像</text>
					<image :src="juejinInfo.avatarLarge" class="cu-avatar lg round" mode="aspectFill"></image>
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
					<input
						class="text-grey"
						type="text"
						v-model="juejinInfo.selfDescription"
						placeholder="暂未填写"
						placeholder-class="text-grey"
						@confirm="submit('selfDescription')"
					/>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content flex justify-between align-center">
					<text class="text-grey">电子邮箱</text>
					<input class="text-grey" type="text" v-model="juejinInfo.email" placeholder="暂未填写" placeholder-class="text-grey" @confirm="updateEmail" />
				</view>
			</view>
			<!-- <view class="cu-item arrow">
				<view class="content flex justify-between align-center">
					<text class="text-grey">邮箱订阅每周5篇精选</text>
					<switch @change="subscribe" :checked="emailSub" />
					<checkbox-group @change="subscribe"><checkbox :value="!emailSub" :checked="emailSub" /></checkbox-group>
				</view>
			</view> -->
		</view>
		<avatar ref="avatar" @upload="uploadPic"></avatar>
	</view>
</template>

<script>
import { Toast } from '../../utils/funcitons';
import { updateUserinfo, userInfo, uploadPic, updateUseremail, subscribeEmail, checkEmailsub } from '../../utils/request';
import avatar from '../../components/yq-avatar/yq-avatar';
export default {
	data() {
		return {
			juejinInfo: {
				username: '',
				jobTitle: '',
				company: '',
				selfDescription: '',
				email: '',
				emailSub: true
			}
		};
	},
	components: {
		avatar
	},
	methods: {
		// 提交更改,传入field为待修改字段名
		submit(field) {
			const data = {
				field,
				value: this.juejinInfo[field]
			};
			updateUserinfo(data)
				.then(res => {
					Toast('修改成功');
					userInfo().then(res => {
						this.juejinInfo = res;
					});
				})
				.catch(err => {
					Toast(err.m);
					this.juejinInfo = uni.getStorageSync('juejinInfo');
				});
		},
		// subscribe(e) {
		// 	subscribeEmail({ check: e.detail.value[0] === 'true' ? true : false })
		// 		.then(res => {
		// 			Toast('修改成功');
		// 		})
		// 		.catch(err => {
		// 			Toast(err.m);
		// 			this.checkEmailsub();
		// 		});
		// },
		// checkEmailsub() {
		// 	checkEmailsub().then(res => {
		// 		this.emailSub = res;
		// 		console.log(res);
		// 	});
		// },
		// 修改绑定邮箱
		updateEmail() {
			const checkFormat = /^([a-zA-Z0-9.-])+\@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(this.juejinInfo.email);
			if (!checkFormat) {
				Toast('邮箱格式不正确');
				userInfo().then(res => {
					this.juejinInfo = res;
				});
				return;
			} else {
				updateUseremail({ email: this.juejinInfo.email }).then(res => {
					Toast('修改成功');
					userInfo().then(res => {
						this.juejinInfo = res;
						return;
					});
				});
			}
		},
		// 上传头像图片
		uploadPic(e) {
			uploadPic(e.path)
				.then(response => {
					this.juejinInfo.avatarLarge = response;
					this.submit('avatarLarge');
				})
				.catch(err => {
					Toast(err.m);
				});
		},
		// 选择图片并裁剪
		choosePic() {
			this.$refs.avatar.fChooseImg(0, {
				selWidth: '100%',
				selHeight: '100%',
				expWidth: '600upx',
				expHeight: '600upx'
			});
		}
	},
	onLoad() {
		this.juejinInfo = uni.getStorageSync('juejinInfo');
	}
};
</script>

<style lang="scss" scoped>
.content > text {
	width: auto;
	white-space: nowrap;
}
input {
	text-align: right;
}
</style>
