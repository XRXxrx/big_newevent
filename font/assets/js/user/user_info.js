$(function() {
    //用户表单规则验证
    let form = layui.form;
    form.verify({
        nickname: function(val) {
            if (val.length <= 1 || val.length >= 17) {
                return '昵称长度必须在 1 ~ 16 个字符之间！';
            }
        }
    });

    //用户渲染
    initUserInfo();

    function initUserInfo() {
        let layer = layui.layer;
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //成功，渲染
                form.val('formUserInfo', res.data);
            }
        })
    };

    //重置按钮
    //两种写法，第一种，给表单重置事件
    // $('form').on('reset', function (e) {
    //     e.preventDefault();
    // });
    // 第一种，给重置按钮绑定点击事件
    $('#btnReset').click(function(e) {
        e.preventDefault();
        //重新渲染
        initUserInfo();
    });

    //提交功能
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //成功提示
                layer.msg('修改成功！', {
                    icon: 6
                });
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})