//base ajax
const ajax = (url, method, data) => {
	return uni.request({url,method,data})
}
//get ajax
const get = (url,data) => {
	return ajax(url,'GET',data)
}
//post ajax
const post = (url,data) => {
	return ajax(url,'POST',data)
}
//login
const login = (data) =>{
	return post('https://juejin.im/auth/type/phoneNumber',data).then(res => {
		console.log(res);
	})
}
export {login}