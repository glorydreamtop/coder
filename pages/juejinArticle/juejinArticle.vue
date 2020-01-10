<template>
	<view class="content">
		 <u-parse :content="article" ></u-parse>
	</view>
</template>
<script>
	import {articleDetail} from '../../utils/request';
	import uParse from '../../components/u-parse/u-parse.vue'
	export default{
		components: {
		    uParse
		  },
		data(){
			return{
				postId:'',
				article:'<div>我是HTML代码</div>'
			}
		},
		methods:{
			getArticle(){
				const data ={ 
					postId:this.postId
				}
				articleDetail(data).then(res => {
					this.article = res;
				})
			}
		},
		onLoad(options) {
			this.postId = options.postId;
			this.getArticle();
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../static/css/juejin.css";
	@import "../../components/u-parse/u-parse.css";
	.content{
		width: 100vw;
		height: auto;
	}
</style>