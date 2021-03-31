$(function() {
        //获取用户信息
        getUserInfo();

        //退出登录功能
        let layer = layui.layer;
        $('#btnOut').click(function() {
            layer.confirm('确认退出吗？', { icon: 3, title: '提示' }, function(index) {
                //do something
                //清空本地令牌
                localStorage.removeItem('token');
                //页面跳转
                location.href = '/login.html';
                //关闭弹出框
                layer.close(index);
            });


        })
    })
    // 为了后面的页面调用，将其写到全局
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     //重新登录，因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            console.log(res);
            // 请求失败,返回提升信息
            if (res.status !== 0) {
                return layui.layer.msg(res.message, {
                    icon: 5
                })
            }
            // 请求成功，渲染头像
            renderAvatar(res.data);
        },
        //用于身份登录认证
        // complete: function(res) {
        //     console.log(res);

        // }
    });

    function renderAvatar(user) {
        // 渲染名称（如果nickname没有就用username的值）
        let name = user.nickname || user.username;
        $('#welcome').html('欢迎&nbsp&nbsp' + name);
        //渲染头像
        //如果有头像就用获取到的头像，如果没有就用文字头像
        if (user.userPic !== null) {
            $('.layui-nav-img').show().attr('src', user.userPic);
            $('.text-avatar').hide();
        } else {
            $('.layui-nav-img').hide();
            $('.text-avatar').show().html(name[0].toUpperCase());
        }
    }
}