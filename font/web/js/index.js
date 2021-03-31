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

    //焦点图片
    initHotpic();

    function initHotpic() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/hotpic',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                let htmlStr = template('tpl-cate3', { data3: res.data });
                $('.focus_list').html(htmlStr);
                $('.focus_list li').eq(0).addClass('first').siblings('li').removeClass('first');
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

    //最新资讯
    initLatest();

    function initLatest() {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/latest',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.code !== 200) {
                    return '获取数据失败';
                }
                let htmlStr = template('tpl-cate5', { data5: res.data });
                $('.common_news').html(htmlStr);
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


    //文章搜索
    let nd;

    function fun() {
        let tled = $('.search_txt').val().trim();
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/search',
            data: { key: tled, page: 1, perpage: 5 },
            success: (res) => {
                // console.log(res);
                nd = res.data.totalCount;
            }
        })
    }
    fun();

    let time = null;
    let ul = document.createElement('ul');
    $('.search_form').append(ul);

    function initSearch() {
        if (time !== null) { clearTimeout(time) };
        time = setTimeout(function() {
            let tled = $('.search_txt').val().trim();
            $.ajax({
                type: 'get',
                url: 'http://120.24.171.137:1337/api/v1/index/search',
                data: { key: tled, page: 1, perpage: nd },
                success: (res) => {
                    // console.log(res.data.data.title);
                    if (res.code !== 200) {
                        return '获取数据失败';
                    };

                    if (tled === '') {
                        $(ul).empty();
                        return;
                    }
                    $(ul).empty();
                    $.each(res.data.data, function(i, n) {
                        console.log(n.title);
                        if (n.title.indexOf(tled) !== -1) {
                            let li = document.createElement('li');
                            $(li).addClass('current');
                            $(li).html(n.title);
                            $(ul).append(li);
                        }
                    })
                    $('.search_form').on('mouseenter', '.current', function() {
                        // console.log($(this).text());
                        $(this).addClass('cutr').siblings('li').removeClass('cutr');
                    })
                    $('.search_form').on('mouseleave', '.current', function() {
                        // console.log($(this).text());
                        $(this).removeClass('cutr');
                    })
                    $('.search_form').on('click', '.current', function() {
                        // console.log($(this).text());
                        $(this).addClass('cutr').siblings('li').removeClass('cutr');
                        location.href = '/list.html?key=' + $(this).text();
                    })
                }
            })
        }, 200);
    };
    $('.search_txt').on('keyup', function() {
        initSearch();
    })
    $('.search_btn').on('click', function() {
        let tled = $('.search_txt').val().trim();
        location.href = '/list.html?key=' + tled;
    })
})