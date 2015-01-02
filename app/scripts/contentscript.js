'use strict';

var surfy = surfy || {};
surfy.isSignedIn = false;

surfy.init = function () {
    function addListener() {
        if (chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(surfy.onClick);
        } else {
            // sometimes Chrome extension runtime is not ready yet
            setTimeout(addListener, 500);
        }
    }

    console.log("Content script is loaded");
    addListener();
};

surfy.onClick = function (request, sender, sendResponse) {
    var currentPageUrl = encodeURIComponent(window.location.href);

    var surfyContainer = surfy.getContainer();
    if (!surfyContainer.length) {
        surfy.initContainer(currentPageUrl, sendResponse);
    } else if (surfyContainer.hasClass('visible')) {
        surfyContainer.removeClass('visible');
    } else {
        surfyContainer.addClass('visible');
    }
};

surfy.initContainer = function (currentPageUrl, sendResponse) {

    $.get(chrome.extension.getURL("templates/main.html"), function (template) {
        surfy.template = template;
        render();
    });

    function render() {
        if (!surfy.template) return;
        surfy.refresh(true);
    }

    $.get(surfy.config.restUrl + "/comment/" + currentPageUrl).done(function (data) {
        surfy.comments = data.comments;
        surfy.refresh(true);
    });

};

surfy.refresh = function (animate) {

    $("#surfy").remove();

    var rendered = Mustache.render(surfy.template, { comments: surfy.comments });
    $("body").append(rendered);

    if (animate) {
        //rendering view for first time
        setTimeout(function () {
            surfy.getContainer().addClass('visible');
        }, 200);
    } else {
        surfy.getContainer().addClass('visible');
    }

    surfy.setEventHandlers();
};
surfy.setEventHandlers = function () {
    $("#commentBtn").click(function (event) {
//        if (surfy.isSignedIn) {
            var comment = $("#commentBox").val();
            if (comment.length > 0) {
                var request = {
                    url: window.location.href,
                    comment: comment
                };
                $.post(surfy.config.restUrl + "/comment", request, function (data) {
                    surfy.comments = data.comments;
                    surfy.refresh();
                });
            }
//        }
    });

    $("#signIn").click(function(event){
        if(!surfy.authToken){
            surfy.signIn();
        }
    });
};

surfy.signIn = function () {
    chrome.runtime.sendMessage({getToken: true}, function(response) {
        surfy.authToken = response.token;
        console.log("token is" + surfy.authToken);
        surfy.isSignedIn = true;
    });
};

surfy.getContainer = function () {
    return $("#surfy");
};

$(document).ready(function () {
    surfy.init();
});
