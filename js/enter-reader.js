/**
 * Created by aswasn on 2017/3/10.
 */
// 生成新容器
var $container = $("<div id='sbr-container'></div>");

// 获取原页面资料
var title = $("#article .content__headline").text();
var standfirst = $("#article .content__standfirst").text();
var author = $("#article .byline").text();
var picture = $("#article figure picture").clone(false, false);
var figcaption = $("#article figure figcaption").clone(false, false);
var content = $("#article .content__article-body p,#article .content__article-body ul").clone(false, false);


// 给容器加上资料
$container.append($("<p class='sbr-title'>" + title + "</p>"));
$container.append($("<p class='sbr-standfirst'>" + standfirst + "</p>"));
$container.append($("<p class='sbr-author'>" + author + "</p>"));
$container.append($("<figure class='sbr-figure'></figure>"));
content.appendTo($container);


// 清空旧页面内容
$("body").empty();

// 给页面加上容器
$("body").append($container);
picture.appendTo($(".sbr-figure"));
figcaption.appendTo($(".sbr-figure"));
// 去掉超链接
content.find($("a")).each(function (index, element) {
    var text = $(this).text();
    $(this).replaceWith($("<span>" + text + "</span>"));
});