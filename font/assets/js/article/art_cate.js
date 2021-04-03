$(function() {
    // 渲染文章分类列表
    let layer = layui.layer;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                //成功，渲染
                let htmlStr = template('tpl-art-cate', { data: res.data });
                $('tbody').html(htmlStr);
            }
        })
    };
    //添加文章分类
    $('#addBtn').on('click', function() {
        //利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    });

    // 利用事件委托给表单动态绑定submit事件
    $('body').on('submit', '#form_add', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //   成功，重新渲染数据
                initArtCateList();
                layer.msg('添加成功！', {
                    icon: 6
                });
                layer.close(indexAdd);
            }
        })
    });

    //编辑功能（利用事件委托）
    let indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        // 获取相对应的自定义属性Id值
        let Id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据到form表单中
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            data: {},
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //   成功，渲染数据
                layui.form.val('form-edit', res.data);
            }
        })
    });

    //更新文章分类
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //   成功，重新渲染数据
                initArtCateList();
                layer.msg('更新分类数据成功！', {
                    icon: 6
                });
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {
        // 获取相对应的自定义属性Id值
        let Id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + Id,
                data: {},
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message, {
                            icon: 5
                        })
                    };
                    // 成功，提示
                    layer.msg('删除分类成功！', {
                        icon: 6
                    });
                    //重新渲染
                    initArtCateList();
                    layer.close(index);
                }
            })
        });
    })
})