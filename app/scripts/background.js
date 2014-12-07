var surfyUrl = surfy.config.restUrl;

function showExtension(tabId, changeInfo, tab) {

    if (tab.status === "complete" && tab.url !== "chrome://newtab/") {
        var currentUrl = encodeURIComponent(tab.url);
        $.get(surfyUrl + "/rating/" + currentUrl).done(function (data) {
            chrome.pageAction.show(tabId);
            if (data.rating < 3) {
                chrome.pageAction.setIcon({tabId: tabId, path: "images/low_star.png"});
            } else if (data.rating === 3) {
                chrome.pageAction.setIcon({tabId: tabId, path: "images/icon.png"});
            } else {
                chrome.pageAction.setIcon({tabId: tabId, path: "images/goodstar.png"});
            }
        });
    }
};

chrome.tabs.onUpdated.addListener(showExtension);

chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {loadComments: true}, function (response) {
        console.log("response from content script" + response);
    });
});