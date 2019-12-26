<template>
	<view>
		<mescroll-uni @init="mescrollinit" :down="mescrollOption.downOption" @down="downCallback" :up="mescrollOption.upOption" @up="upCallback">
			<view class="scroll-item">
				<view class="card flex justify-between margin-bottom-sm padding-sm">
					<image class="avatar" src="../static/noAvatar.png" mode="widthFix"></image>
					<view class="">
						
					</view>
					<view class="btn">
						
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import MescrollUni from 'mescroll-uni';
export default {
	data() {
		return {};
	},
	components: {
		MescrollUni
	},
	methods: {}
};
</script>

<style lang="scss"></style>
