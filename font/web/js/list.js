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

    //分页
    let key = decodeURI(location.search.split('=')[1]);
    console.log(key);
    let dum;
    let sug;
    let dd = 5;

    function initNews(tt, dd) {
        $.ajax({
            type: 'get',
            url: 'http://120.24.171.137:1337/api/v1/index/search',
            data: { key: tt, page: 1, perpage: dd },
            success: (res) => {
                console.log(res);
                // //总条数
                // console.log(res.data.totalCount);
                dum = res.data.totalCount;
                // console.log(dum);
                sug = Math.ceil(dum / dd);
                // console.log(sug);
                let htmlStr = template('news-cate', { degs: res.data.data });
                $('#list').html(htmlStr);
                $("#pagination").pagination({
                    currentPage: 1,
                    totalPage: sug,
                    callback: function(current) {
                        console.log(current);
                        $.ajax({
                            type: 'get',
                            url: 'http://120.24.171.137:1337/api/v1/index/search',
                            data: {
                                key: tt,
                                page: current,
                                perpage: dd
                            },
                            success: (res) => {
                                // console.log(res);
                                let htmlStr = template('news-cate-s', {
                                    degst: res.data.data
                                });
                                $('#list').html(htmlStr);
                            }
                        })
                    }
                });
            }
        })
    }
    $('.search_btn').click(function() {
        let txt = $('.search_txt').val();
        initNews(txt, dd);
    });
    //页面一加载：默认搜索全部
    // console.log(key);
    if (key === 'undefined' || key === '') {
        $('.search_btn').trigger('click');
    } else {
        initNews(key, 3);
    }


})