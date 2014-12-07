'use strict';

var surfy = surfy || {};

surfy.init = function () {
    function addListener() {
        chrome.runtime.onMessage.addListener(surfy.onClick);
    }

    console.log("Content script is loaded");
    if (chrome.runtime.onMessage) {
        addListener();
    } else {
        // sometimes Chrome extension runtime is not ready yet
        setTimeout(addListener, 500);
    }
};

surfy.onClick = function (request, sender, sendResponse) {
    var currentPageUrl = encodeURIComponent(window.location.origin);
    console.log(currentPageUrl + Math.random());

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
    var surfyContainer = $("<div id='surfy'/>").addClass('surfyContainer');
    surfy.appendTemplate(surfyContainer, "container");
    $("body").append(surfyContainer);

    var content = surfyContainer.find(".content");

    var url = surfy.config.restUrl;
    $.get(url + "/comments/" + currentPageUrl).done(function (data) {
        var parentDiv = $("<div/>");

        surfy.appendTemplate(parentDiv, "headerSection", data);

        $.each(data.comments, function (index, comment) {
            surfy.appendTemplate(parentDiv, "commentSection", comment);
        });

        content.append(parentDiv);
        surfy.getContainer().addClass('visible');

        sendResponse({"commentsLoaded": true});
    });
};

surfy.getContainer = function () {
    return $("#surfy");
};

surfy.appendTemplate = function (container, template, data) {
    container.loadTemplate(
        template,
        data,
        { html: surfy.templates[template], append: true }
    );
};

$(document).ready(function () {
    surfy.init();
});
