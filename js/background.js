/**
 * Created by aswasn on 2017/3/9.
 */

var active = false;

// 判断page action是否可见
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    checkVisibility(tabId, tab.url);
});

function checkVisibility(tabId, url) {
    if (url.match(/http(s|):\/\/www.theguardian.com\/*/)) {
        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
    active = false;
}
// end of 判断page action是否可见

// 处理点击事件
chrome.pageAction.onClicked.addListener(function (tab) {

    if (active) {
        active = false;
        exitMode(tab);
    } else {
        active = true;
        enterMode(tab);
    }
});

function enterMode(tab) {
    chrome.pageAction.setTitle({tabId: tab.id, title: "点我退出阅读模式"});
    chrome.pageAction.setIcon({
        tabId: tab.id,
        path: {
            16: "icons/ing16.png",
            48: "icons/ing48.png",
            128: "icons/ing128.png"
        }
    });
    chrome.tabs.executeScript({
        file: "js/enter-reader.js"
    });
    chrome.tabs.insertCSS({
        file: "css/enter-reader.css"
    });
}

function exitMode(tab) {
    chrome.pageAction.setTitle({tabId: tab.id, title: "点我进入阅读模式"});
    chrome.pageAction.setIcon({
        tabId: tab.id,
        path: {
            16: "icons/icon16.png",
            48: "icons/icon48.png",
            128: "icons/icon128.png"
        }
    });
    chrome.tabs.reload(tab.id);
}