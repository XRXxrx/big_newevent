$(function() {
    //定义表单校验规则
    let form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //新旧密码的校验
        samePwd: function(val) {
            if (val === $('.layui-card-body input[name=oldPwd]').val()) {
                return '新旧密码不能相同！';
            }
        },
        //再次输入密码校验
        rePwd: function(value) {
            if (value !== $('.layui-card-body input[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    });

    //修改功能
    let layer = layui.layer;
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //成功,提示信息
                layer.msg('更新成功', {
                    icon: 6
                });
                //重置表单
                //reset()是一个DOM方法,所以要把jQuery转DOM
                $('.layui-form')[0].reset();
                // 重登
                // localStorage.removeItem('token');
                // window.parent.location.href = '/login.html';
            }
        })
    });

    //重置按钮
    $('#rebt').click(function(e) {
        e.preventDefault();
        $('.layui-form')[0].reset();
    })
})