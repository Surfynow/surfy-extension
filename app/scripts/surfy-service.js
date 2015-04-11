'use strict';

var surfyService = surfyService || {};

surfyService.processComments = function (comments) {
    if (!comments) {
        return;
    }

    $.map(comments, function (c) {
        c.avatar = chrome.extension.getURL("/images/surfy-avatar.png");
    });
};

surfyService.submitComment = function (newComment) {
    var def = $.Deferred();

    $.post(surfy.config.restUrl + "/comment", newComment, function (data) {
        surfyService.processComments(data.comments);
        def.resolve(data);
    });

    return def.promise();
};

surfyService.getPageInfo = function (currentPageUrl) {
    var def = $.Deferred();

    $.get(surfy.config.restUrl + "/" + currentPageUrl).done(function (data) {
        if (data.success) {
            surfyService.processComments(data.surfy.comments);
        }
        def.resolve(data);
    });

    return def.promise();
};

surfyService.submitRating = function (newRating) {
    var def = $.Deferred();

    $.post(surfy.config.restUrl + "/rating/", newRating, function (data) {
        surfyService.processComments(data.comments);
        def.resolve(data);
    });

    return def.promise();
};
