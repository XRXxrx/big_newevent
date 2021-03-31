// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// 1.开发环境服务器地址
let baseURL = 'http://127.0.0.1:3003';
// 2.测试环境服务器地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';
// 3.生产环境服务器地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function(option) {
    option.url = baseURL + option.url;
    // console.log(option.url);
    //以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
    if (option.url.indexOf('/my/') != -1) {
        option.headers = {
            //重新登录，因为token过期事件12小时
            Authorization: localStorage.getItem('token') || ''
        };
        // console.log(232);

    }
    //拦截所有响应，判断用户身份认证信息（登录拦截）
    option.complete = function(res) {
        // console.log(res);
        let obj = res.responseJSON;
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            //清空本地令牌
            localStorage.removeItem('token');
            //跳回登录页面
            location.href = '/login.html';
        }
    }
})