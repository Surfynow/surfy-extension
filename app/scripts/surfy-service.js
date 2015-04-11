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

surfyService.findComments = function (currentPageUrl) {
    var def = $.Deferred();

    $.get(surfy.config.restUrl + "/comment/" + currentPageUrl).done(function (data) {
        surfyService.processComments(data.comments);
        def.resolve(data);
    });

    return def.promise();
};

surfyService.submitComment = function (newComment) {
    var def = $.Deferred();

    $.post(surfy.config.restUrl + "/comment", newComment, function (data) {
        surfyService.processComments(data.comments);
        def.resolve(data);
    });

    return def.promise();
};

surfyService.getPageRating = function (currentPageUrl) {
    var def = $.Deferred();

    $.get(surfy.config.restUrl + "/rating/" + currentPageUrl).done(function (data) {
        var rating = {};
        if (data.success) {
            rating = data.rating;
        }
        def.resolve(rating);
    });

    return def.promise();
};

surfyService.submitRating = function (newRating) {
    var def = $.Deferred();

    $.post(surfy.config.restUrl + "/rating/", newRating, function (data) {
        def.resolve(data);
    });

    return def.promise();
};
