var surfy = surfy || {};
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    function getQueryVariable(url, variable) {
        var query = url.split("?")[1];
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    var url = "";
    if (request.method == 'google') {
        url = "https://accounts.google.com/o/oauth2/auth?scope=email&response_type=code&client_id=359268642661-pgl0nrhc6jjoau5v22anrm9d2btbc6d1.apps.googleusercontent.com&redirect_uri=https://bpdkbpfeglhbhjgiilnglmccihbhhhad.chromiumapp.org/testSurfy";
    } else {
        url = "https://www.facebook.com/dialog/oauth?client_id=589345354543549&redirect_uri=https://bpdkbpfeglhbhjgiilnglmccihbhhhad.chromiumapp.org/testSurfy";
    }

    chrome.identity.launchWebAuthFlow(
        {'url': url, 'interactive': true},
        function (redirect_url) {
            sendResponse({method: request.method, token: getQueryVariable(redirect_url, "code")})
        });
    return true;
});



