//入口函数
$(function() {
    // alert(1);
    //点击去注册账号，隐藏登录区域，显示注册区域
    $('#link_reg').click(function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //点击去登录，隐藏注册区域，显示登录区域
    $('#link_login').click(function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    //从 layui 中获取 form 对象
    let form = layui.form;
    //通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        //“[ ]”是范围描述符,\s是指空白，包括空格、换行、tab缩进等所有的空白,而\S刚好相反
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            let pwd = $('.reg-box input[name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    });

    // 注册功能
    $('#form_reg').on('submit', function(e) {
        //阻止表单默认提交
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: (res) => {
                // console.log(res);
                // 返回状态判断
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                //提交成功后的处理
                layer.msg('注册成功，请登录！', {
                    icon: 6
                });
                // 手动切换到登录页面
                $('#link_login').click();
                //重置表单
                $('#form_reg')[0].reset();
            }
        })
    });

    // 登录功能
    $('#form_login').on('submit', function(e) {
        //阻止表单默认提交
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                // 返回失败状态
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                //提交成功后，提示信息，保存token，跳转页面
                layer.msg('登录成功！', {
                    icon: 6
                });
                // 保存token
                localStorage.setItem('token', res.token);
                //跳转页面
                location.href = '/index.html';
            }
        })
    })
});