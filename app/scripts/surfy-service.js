'use strict';

var surfyService = surfyService || {};

surfyService.procesComments = function (comments) {
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
        surfyService.procesComments(data.comments);
        def.resolve(data);
    });

    return def.promise();
};

surfyService.submitComment = function (newComment) {
    var def = $.Deferred();

    $.post(surfy.config.restUrl + "/comment", newComment, function (data) {
        surfyService.procesComments(data.comments);
        def.resolve(data);
    });

    return def.promise();
};

surfyService.getPageRating = function (currentPageUrl) {
    var def = $.Deferred();

    $.get(surfy.config.restUrl + "/rating/" + currentPageUrl).done(function (data) {
        var rating = 0;
        if (data.success) {
            rating = data.rating.rating.toFixed();//FIXME we should show partial ratings like 3.3 correctly by partially filling the arrow
        }
        def.resolve(rating);
    });

    return def.promise();
};
