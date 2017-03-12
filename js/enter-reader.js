/**
 * Created by aswasn on 2017/3/10.
 */

// -----获取原页面资料-----
var title = $("#article .content__headline").text();
var standfirst = $("#article .content__standfirst").text();
var authorName = $("#article .byline span[itemprop='name']").text();
var picture = $("#article figure picture").clone(false, false);
var figcaption = $("#article figure figcaption").text();
var content = $("#article .content__article-body p,#article .content__article-body ul").clone(false, false);

// -----清空旧页面内容-----
$("body").empty();

// -----生成新容器-----
var $container = $("<div class='sbr-container' id='sbr-container'></div>");
var $header = $("<div class='sbr-header'></div>");
var $page = $("<div class='sbr-page'></div>");

// -----给页面加上容器-----
$("body").append($container);
$container.append($header);
$container.append($page);

// -----给容器加上资料-----
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
// 加上fontawesome
var fa = document.createElement('style');
fa.type = 'text/css';
fa.textContent = '@font-face { font-family: FontAwesome; src: url("'
    + chrome.extension.getURL('fonts/fontawesome-webfont.woff')
    + '"); }';
document.head.appendChild(fa);

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
        var clientWidth = d.clientWidth || 750;
        d.style.fontSize = (10 * (clientWidth / 750)) > 10 ? 10 + 'px' : (10 * (clientWidth / 750)) + 'px';

        // 分页
        offset = d.clientWidth >= 1025 ? 135 : 100;
        $(".sbr-pagination").remove();
        $container.append("<div class='sbr-pagination'><a id='sbr-prev-btn' href='javascript:;'>上一页</a><select id='sbr-page-sel'></select><a id='sbr-next-btn' href='javascript:;'>下一页</a></div>");

        var clientHeight = d.clientHeight;
        var scrollHeight = d.scrollHeight;
        var origin = scrollHeight / (clientHeight - offset);
        var originCeil = Math.ceil(scrollHeight / (clientHeight - offset));
        var originFloor = Math.floor(scrollHeight / (clientHeight - offset));

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
$container.on("click", function () {
    $(".sbr-dict-pop").remove();
});
$container.on("dblclick", function (ev) {
    lookUpWord(ev)
});
function lookUpWord(ev) {
    var selection = window.getSelection();
    var word = selection.toString();
    if (!!word && word.length > 0 && word.match(/[A-Za-z0-9]+/)) {
        $.ajax({
            type: "get",
            url: "https://api.shanbay.com/bdc/search/?word=" + word,
            success: function (data) {
                appendDictWindow(selection, word, data.data, ev);
            }
        })
    }
}
function appendDictWindow(selection, str, data, ev) {
    var word = str;
    var def = "无释义。";
    var audioSrc = "";
    var detailHref = "https://www.shanbay.com/";
    var isEmpty = $.isEmptyObject(data);
    if (!isEmpty) {
        word = data.content;
        def = data.definition;
        audioSrc = data.audio.replace(/http:/, "https:");
        detailHref = "https://www.shanbay.com/bdc/vocabulary/" + data.id;
    }
    $(".sbr-dict-pop").remove();
    // 计算显示位置
    var popWidth = d.clientWidth >= 320 ? 260 : d.clientWidth - 20;
    var popHeight = 120;
    var posX = ev.clientX;
    var posY = ev.clientY + 15;
    if (posX + popWidth > d.clientWidth) {
        posX = def.length > 50 ? (d.clientWidth - popWidth) : (d.clientWidth - popWidth + 40);
    }
    if (posY + popHeight > d.clientHeight) {
        posY = def.length > 30 ? (posY - popHeight - 30) : (posY - popHeight + 10);
    }


    $("body").append($("<div class='sbr-dict-pop'>" +
        "<section class='line1'><h3 class='word'>" + word + "</h3>" + (isEmpty ? "" : "<i class='audio-btn fa fa-volume-up'><audio id='sbr-audio'><source src='" + audioSrc + "'></audio></i><a target='_blank' class='detail' href='" + detailHref + "'>详细</a>") + "</section> " +
        "<section class='line2'>" + def + "</section> " +
        "</div>"));

    $(".audio-btn").on("click", function () {
        document.getElementById("sbr-audio").play();
    });
    $(".sbr-dict-pop").css({
        "position": "fixed",
        "top": posY,
        "left": posX,
        "max-width": popWidth,
        "max-height": popHeight,
        "background-color": "rgba(0,0,0,0.8)",
        "box-shadow": "3px 3px 3px",
        "border-radius": "6px",
        "padding": "1rem"
    });
}

