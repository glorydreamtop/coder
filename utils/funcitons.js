const Toast = (title) => {
	uni.showToast({
		title,
		icon: 'none',
		position: 'bottom'
	})
}
export {
	Toast
}
