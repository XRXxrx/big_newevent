$(function() {
    let layer = layui.layer;
    let form = layui.form;
    //用等号切割获取id值
    // alert(location.search.split('=')[1]);

    function initForm() {
        let Id = location.search.split('=')[1];
        $.ajax({
            type: 'get',
            url: '/my/article/' + Id,
            data: {},
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                //表单赋值
                form.val('form-edit', res.data);
                //设置富文本编辑器的内容
                tinyMCE.activeEditor.setContent(res.data.content);
                // 图片获取
                if (!res.data.cover_img) {
                    return layer.msg('用户未上传图片', {
                        icon: 5
                    })
                };
                // console.log(baseURL);
                let newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    };

    //渲染数据
    initCate();

    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                let htmlStr = template('tpl-cate-s', { detas: res.data });
                $('[name=cate_id]').html(htmlStr);
                //重新渲染文章类别
                form.render();
                //初始化form方法
                initForm();
            }
        })
    };

    // 初始化富文本编辑器
    initEditor();

    // 初始化图片裁剪器
    var $image = $('#image');

    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 初始化裁剪区域
    $image.cropper(options);

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        //修改裁剪区图片
    $('#coverFile').on('change', function(e) {
        //拿到用户选择的文件，e.target相当于this
        let file = e.target.files[0];
        //非空校验
        if (file === undefined) {
            return layer.msg('请选择图片!');
        };
        //根据选择文件，创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file);
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 参数状态值处理
    //定义文章的发布状态
    let art_state = '已发布';
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    //定义一个发布文章的方法
    //如果是提交的是`FormData`格式数据，需要添加 `contentType：false ，processData：false`
    function publishArticle(fd) {
        console.log(...fd);
        $.ajax({
            method: 'post',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                layer.msg('修改文章成功！', {
                    icon: 6
                });
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                //优化
                setTimeout(function() {
                    window.parent.document.querySelector('#art_list').click();
                }, 1000)
            }
        })
    }
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0]);
        // console.log(fd);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })
})