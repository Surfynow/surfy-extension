'use strict';

var surfy = surfy || {};

function showExtension(tabId, changeInfo, tab) {
    var url = surfy.config.restUrl;

    if(changeInfo.status == 'complete') {
        console.log(changeInfo);

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {

            var currentUrl = encodeURIComponent(tabs[0].url);

            if (tabs[0].url !== "chrome://newtab/") {

                $.get(url + "/rating/" + currentUrl).done(function (data) {
                    chrome.pageAction.show(tabId);
                    console.log(data);
                    if (data.rating < 3) {
                        chrome.pageAction.setIcon({tabId: tabId, path: "images/low_star.png"});
                    } else if (data.rating === 3) {
                        chrome.pageAction.setIcon({tabId: tabId, path: "images/icon.png"});
                    } else {
                        chrome.pageAction.setIcon({tabId: tabId, path: "images/goodstar.png"});
                    }
                });

                chrome.pageAction.onClicked.addListener(function () {
                    chrome.tabs.sendMessage(tabs[0].id, {loadComments: true}, function (response) {
                        console.log("response from content script" + response);
                    });
                });
            }
        });
    }
}

chrome.tabs.onUpdated.addListener(showExtension);
