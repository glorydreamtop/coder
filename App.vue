<script>
	import Vue from 'vue'
	export default {
		globalData: {
			juejin: {
				token: '',
				userId: '',
				clientId: '',
				avatarLarge: '',
				username: ''
			}

		},
		onLaunch: function() {

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}

	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/animation.css";
	
</style>
