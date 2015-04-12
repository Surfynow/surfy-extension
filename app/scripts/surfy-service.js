'use strict';

var surfyService = surfyService || {};

surfyService.signIn = function (method, token) {
    var def = $.Deferred();

    var signInData = { name: method + 'SignIn', token: token };
    $.post(surfy.config.restUrl + "/account/action", signInData, function (data) {
        def.resolve(data);
    });

    return def.promise();
};

surfyService.processComments = function (comments) {
    if (!comments) {
        return;
    }

    $.map(comments, function (c) {
        if (!c.avatar) {
            c.avatar = chrome.extension.getURL("/images/surfy-avatar.png");
        }
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
