<template>
		<view :class="['cu-modal', isOpen === true ? 'show' : '']">
			<view class="cu-dialog" :style="{width:width+'%'}" >
				<slot></slot>
			</view>
		</view>	
</template>

<script>
import { Toast } from '../utils/funcitons';
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		width: {
			type: Number,
			default: 60
		},
		autoClose:{
			type: Boolean,
			default: false
		}
	},
	watch: {
	    show:function(val) {
			this.isOpen = val
	    }
	},
	data() {
		return {
			isOpen: false
		};
	},
	methods: {
		hideModal() {
			if(this.autoClose){
				this.isOpen = false;
				this.$emit('close')
			}
			return;
		},
		stopmove() {}
	}
};
</script>

<style lang="scss" scoped>
	.cu-dialog{
		border-radius: 10upx;
	}
</style>
