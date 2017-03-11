/**
 * Created by aswasn on 2017/3/10.
 */


// 生成新容器
var $container = $("<div class='sbr-container' id='sbr-container'></div>");
var $header = $("<div class='sbr-header'></div>");
var $page = $("<div class='sbr-page'></div>");
// 获取原页面资料
var title = $("#article .content__headline").text();
var standfirst = $("#article .content__standfirst").text();
var authorName = $("#article .byline span[itemprop='name']").text();
var picture = $("#article figure picture").clone(false, false);
var figcaption = $("#article figure figcaption").text();
var content = $("#article .content__article-body p,#article .content__article-body ul").clone(false, false);

// 清空旧页面内容
$("body").empty();

// 给页面加上容器
$("body").append($container);

// 给容器加上资料
$container.append($header);
$container.append($page);
$header.append($("<h1 class='sbr-title'>" + title + "</h1>"));
$header.append($("<p class='sbr-author'>" + authorName + "</p>"));

$page.append($("<p class='sbr-standfirst'>" + standfirst + "</p>"));
$page.append($("<figure class='sbr-figure'><figcaption>" + figcaption + "</figcaption></figure>"));
$page.append($("<article class='sbr-content'></article>"));
picture.prependTo($(".sbr-figure"));
content.appendTo($(".sbr-content"));

// 去掉超链接
content.find($("a")).each(function (index, element) {
    var text = $(this).text();
    $(this).replaceWith($("<span>" + text + "</span>"));
});


// 设置根元素字体大小和分页
var pageAll = 1;
var pageNow = 1;
var d = document.documentElement;
var offset = d.clientWidth >= 1025 ? 135 : 100;

function goPage(pageNum) {
    if (pageNum > 0 && pageNum <= pageAll) {
        var pos = (d.clientHeight - offset) * (pageNum - 1);
        $("html,body").animate({scrollTop: pos}, 300);
    } else if (pageNum <= 0) {
        pageNow = 1;
    } else {
        pageNow = pageAll;
    }
}
window.addEventListener("resize", (function () {
    function c() {
        // 设置根元素字体大小
        var d = document.documentElement;
        var clientWidth = d.clientWidth || 750;
        d.style.fontSize = (10 * (clientWidth / 750)) > 10 ? 10 + 'px' : (10 * (clientWidth / 750)) + 'px';

        // 分页
        $(".sbr-pagination").remove();
        $container.append("<div class='sbr-pagination'><a id='sbr-prev-btn' href='javascript:;'>上一页</a><select id='sbr-page-sel'></select><a id='sbr-next-btn' href='javascript:;'>下一页</a></div>");

        var clientHeight = d.clientHeight;
        var scrollHeight = d.scrollHeight;
        var origin = scrollHeight / (clientHeight - offset);
        var originCeil = Math.ceil(scrollHeight / (clientHeight - offset));
        var originFloor = Math.floor(scrollHeight / (clientHeight - offset));
        console.log((origin - originFloor) * (clientHeight - offset));
        console.log($(".sbr-pagination").height() + parseInt($page.css("padding-bottom")));

        pageAll = ((origin - originFloor) * (clientHeight - offset) < (offset + parseInt($page.css("padding-bottom")))) ? originFloor : originCeil;
        pageNow = 1;
        goPage(1);

        var $sel = $("#sbr-page-sel");
        for (var i = 1; i <= pageAll; i++) {
            $sel.append("<option value=" + i + ">" + i + "</option>")
        }

        $("#sbr-prev-btn").on("click", function () {
            --pageNow;
            if (pageNow <= 0) {
                pageNow = 1;
            }
            $sel.val(pageNow);
            goPage(pageNow);
        });
        $("#sbr-next-btn").on("click", function () {
            ++pageNow;
            if (pageNow > pageAll) {
                pageNow = pageAll;
            }
            $sel.val(pageNow);
            goPage(pageNow);
        });

        $("#sbr-page-sel").on("change", function () {
            pageNow = parseInt($(this).val());
            goPage(pageNow);
        })

    }

    setTimeout(c, 1);

    return c;
})(), false);

// 单词查询功能
$container.on("dblclick", function (e) {
    var word = window.getSelection().toString();
    if (!!word && word.length > 0 && word.match(/[A-Za-z0-9 ]+/)) {
        $.ajax({
            type: "get",
            url: "https://api.shanbay.com/bdc/search/?word=" + word,
            success: function (data) {
                console.log(data)
            }
        })
    }
});


