var surfyService = surfyService || {};

function showExtension(tabId, changeInfo, tab) {

    if (tab.status === "complete" && tab.url !== "chrome://newtab/") {
        var currentUrl = encodeURIComponent(tab.url);
        surfyService.getPageInfo(currentUrl).done(function (data) {
            chrome.pageAction.show(tabId);
            // FIXME: Specify different icons for each rating category
            var rating = data.surfy.rating;
            if (rating < 3) {
                chrome.pageAction.setIcon({tabId: tabId, path: "images/surfy-icon.png"});
            } else if (rating === 3) {
                chrome.pageAction.setIcon({tabId: tabId, path: "images/surfy-icon.png"});
            } else {
                chrome.pageAction.setIcon({tabId: tabId, path: "images/surfy-icon.png"});
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

chrome.runtime.onMessage.addListener(function (request, sender, sendReponse) {
    chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
        sendReponse({token: token});
    });
    return true;
});


