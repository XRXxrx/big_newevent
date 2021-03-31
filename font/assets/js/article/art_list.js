$(function() {
    //通过 `template.defaults.imports` 定义过滤器，向模板引擎中导入变量/函数
    //形参data指的是模板字符串中时间的数据即$value.pub_date
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data);
            let y = dt.getFullYear();
            let m = padZero(dt.getMonth() + 1);
            let d = padZero(dt.getDate());
            let h = padZero(dt.getHours());
            let mm = padZero(dt.getMinutes());
            let s = padZero(dt.getSeconds());

            return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    };
    let layer = layui.layer;
    //获取文章列表
    initTable();

    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                };
                // 成功，渲染
                layer.msg('获取成功！', {
                    icon: 6
                });
                let htmlStr = template('tpl-list', { data: res.data });
                $('tbody').html(htmlStr);
                //调用分页
                renderPage(res.total);
            }
        })
    };

    // 初始化分类
    let form = layui.form;
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
                // 成功，赋值，渲染
                let htmlStr = template('tpl-cate-s', { deta: res.data });
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    };

    // 筛选的功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // console.log(cate_id);
        // console.log(state);
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });

    //分页
    let laypage = layui.laypage;

    function renderPage(total) {
        // console.log(total)
        //开启location.hash的记录
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条
            //当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function(obj, first) {
                //判断不是第一次初始化才能重新调用初始化文章列表
                if (!first) {
                    // 改变但当前页
                    q.pagenum = obj.curr;
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                    q.pagesize = obj.limit
                        //do something
                    initTable();
                }
            }
        });
    }

    //删除
    $('tbody').on('click', '.btn-delete', function() {
        let Id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + Id,
                data: {},
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message, {
                            icon: 5
                        })
                    };
                    //   成功，提示
                    layer.msg('删除成功！', {
                        icon: 6
                    });
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    //重新渲染
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})