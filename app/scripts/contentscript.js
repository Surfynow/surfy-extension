'use strict';

var surfy = surfy || {};

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
    var url = surfy.config.restUrl;
    console.log("Content script is loaded");

    function init(surfyContainer, currentPageUrl, sendResponse) {
        surfyContainer = $("<div id='surfy'/>").addClass('surfyContainer');
        surfy.appendTemplate(surfyContainer, "container", {logoUrl: chrome.extension.getURL("images/surfy-logo-alt.png")});
        $("body").append(surfyContainer);

        var content = surfyContainer.find(".content");

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
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            var currentPageUrl = encodeURIComponent(window.location.origin);
            console.log(currentPageUrl + Math.random());

            var surfyContainer = surfy.getContainer();
            if (!surfyContainer.length) {
                init(surfyContainer, currentPageUrl, sendResponse);
            } else if (surfyContainer.hasClass('visible')) {
                surfyContainer.removeClass('visible');
            } else {
                surfyContainer.addClass('visible');
            }
        });
});
