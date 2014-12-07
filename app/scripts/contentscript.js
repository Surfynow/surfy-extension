'use strict';

var surfy = surfy || {};

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
    var currentPageUrl = encodeURIComponent(window.location.origin);

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
    var mainTemplate,
        comments;

    function render() {
        if (!mainTemplate || !comments) {
            return;
        }

        var rendered = Mustache.render(mainTemplate, { comments: comments });
        $("body").append(rendered);
        surfy.getContainer().addClass('visible');
        sendResponse({"commentsLoaded": true});
    }

    $.get(chrome.extension.getURL("templates/main.html"), function (template) {
        mainTemplate = template;
        render();
    });

    $.get(surfy.config.restUrl + "/comments/" + currentPageUrl).done(function (data) {
        comments = data.comments;
        render();
    });
};

surfy.getContainer = function () {
    return $("#surfy");
};

$(document).ready(function () {
    surfy.init();
});
