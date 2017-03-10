/**
 * Created by aswasn on 2017/3/10.
 */

window.addEventListener(('orientationchange' in window ? 'orientationchange' : 'resize'), (function () {
    function c() {
        var d = document.documentElement;
        var cw = d.clientWidth || 750;
        d.style.fontSize = (10 * (cw / 750)) > 10 ? 10 + 'px' : (10 * (cw / 750)) + 'px';
    }

    c();
    return c;
})(), false);

// 生成新容器
var $container = $("<div class='sbr-container'></div>");

// 获取原页面资料
var title = $("#article .content__headline").text();
var standfirst = $("#article .content__standfirst").text();
var authorName = $("#article .byline span[itemprop='name']").text();
var picture = $("#article figure picture").clone(false, false);
var figcaption = $("#article figure figcaption").text();
var content = $("#article .content__article-body p,#article .content__article-body ul").clone(false, false);


// 给容器加上资料
$container.append($("<h1 class='sbr-title'>" + title + "</h1>"));
$container.append($("<p class='sbr-author'>" + authorName + "</p>"));
$container.append($("<p class='sbr-standfirst'>" + standfirst + "</p>"));
$container.append($("<figure class='sbr-figure'><figcaption>" + figcaption + "</figcaption></figure>"));
$container.append($("<article class='sbr-content'></article>"));



// 清空旧页面内容
$("body").empty();

// 给页面加上容器
$("body").append($container);
picture.prependTo($(".sbr-figure"));
content.appendTo($(".sbr-content"));

// 去掉超链接
content.find($("a")).each(function (index, element) {
    var text = $(this).text();
    $(this).replaceWith($("<span>" + text + "</span>"));
});
