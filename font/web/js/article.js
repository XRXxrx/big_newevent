$(function() {

    //文章类型
    initCategory();

    function initCategory() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/category',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                let htmlStr = template('tpl-cate1', { data1: res.data });
                $('.level_two').html(htmlStr);
                let htmlStr1 = template('tpl-cate2', { data2: res.data });
                $('.left_menu').html(htmlStr1);
            }
        })
    };

    //文章热门排行
    initRank();

    function initRank() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/rank',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                let htmlStr = template('tpl-cate4', { data4: res.data });
                $('.hotrank_list').html(htmlStr);
                $('.hotrank_list li').eq(0).find('span').addClass('firsts');
                $('.hotrank_list li').eq(1).find('span').addClass('seconds');
                $('.hotrank_list li').eq(2).find('span').addClass('thirds');
            }
        })
    };


    //最新评论
    //名字过滤器修改样式
    template.defaults.imports.dt1 = function(dat) {
        let nas = dat[0];
        return nas;
    };
    //时间过滤器修改样式
    template.defaults.imports.dt2 = function(dats) {
        const td1 = new Date(dats).getTime();
        const td2 = new Date().getTime();
        if (td1 > td2) {
            let num = parseInt((td1 - td2) / 1000 / 60 / 60 / 24 / 30);
            return num;
        } else {
            let num = parseInt((td2 - td1) / 1000 / 60 / 60 / 24 / 30);
            return num;
        }

    };
    //月日过滤器修改样式
    template.defaults.imports.dt3 = function(datr) {
        let nat = datr.slice(5);
        return nat;
    };
    initLatest_comment();

    function initLatest_comment() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/latest_comment',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                let htmlStr = template('tpl-cate6', { data6: res.data });
                $('.comment_list').html(htmlStr);
            }
        })
    };

    //焦点关注 
    initAttention();

    function initAttention() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/attention',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                let htmlStr = template('tpl-cate7', { data7: res.data });
                $('.guanzhu_list').html(htmlStr);
            }
        })
    };

    //文章详细内容
    let id = location.search.split('=')[1];


    let dts;

    function initLatest() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/latest',
            data: {},
            async: false,
            success: (res) => {
                // console.log(res.data);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                dts = res.data;
                // console.log(dts);
            }
        })
    };
    initArticle(id);

    function initArticle(id) {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/article',
            data: { id: id },
            success: (res) => {
                // console.log(res);
                initLatest();
                // console.log(dts[0].id);

                if (res.data.prev === null || res.data.next === null) {
                    initLatest();
                    res.data.prev = { id: dts[0].id, title: dts[0].title };
                    res.data.next = { id: dts[dts.length - 1].id, title: dts[dts.length - 1].title };
                }
                if (res.data.next === null) {
                    initLatest();
                    res.data.next = { id: dts[dts.length - 1].id, title: dts[dts.length - 1].title }
                }
                let htmlStr = template('tpl-art', {
                    datar: res.data,
                    pre: res.data.prev,
                    nxt: res.data.next
                });
                $('.left_con').html(htmlStr);
            }
        })
    };
    //不重新刷新页面
    $('body').on('click', '.ntx', function() {
        let Id = $(this).attr('data-id');
        initArticle(Id);
    });
    $('body').on('click', '.ptx', function() {
        let Id = $(this).attr('data-ids');
        initArticle(Id);
    });

    //发表评论
    $('body').on('click', '.comment_sub', function(e) {
        e.preventDefault();
        // 非空判断
        if ($('.comment_name').val().trim().length == 0 || $('.comment_input').val().trim().length == 0) {
            return alert('请输入用户名和评论内容');
        };
        $.ajax({
            type: 'post',
            url: 'http://120.24.171.137:1337/api/v1/index/post_comment',
            data: {
                author: $('.comment_name').val(),
                content: $('.comment_input').val(),
                articleId: id
            },
            success: (res) => {
                // console.log(res);
                if (res.code == 201) {
                    alert('发表成功');
                    window.location.reload();
                }
            }
        })
    });

    //评论列表
    initComment();

    function initComment() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/latest_comment',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                };
                let htmlStr = template('comment_list', { dlis: res.data });
                setTimeout(function() {
                    $('.comment_list_con').html(htmlStr);
                }, 1000);
                $('.comment_count').html(res.data.length + '条评论');
            }
        })
    };
})