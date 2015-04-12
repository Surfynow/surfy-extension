'use strict';

var surfy = surfy || {};
var surfyService = surfyService || {};
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
    } else {
        surfy.toggleContainer();
    }
};

surfy.toggleContainer = function () {
    var surfyContainer = surfy.getContainer();
    if (surfyContainer.hasClass('visible')) {
        surfyContainer.removeClass('visible');
    } else {
        surfyContainer.addClass('visible');
    }
};

surfy.initContainer = function (currentPageUrl) {
    $("body").append('<div id="surfy" class="s-container"></div>');

    $.get(chrome.extension.getURL("templates/main.html"), function (template) {
        surfy.template = Handlebars.compile(template);
        surfy.refresh(true);
    });

    surfyService.findComments(currentPageUrl).then(function (data) {
        surfy.comments = data.comments;
        surfy.refresh(true);
    });

    surfyService.getPageRating(currentPageUrl).done(function (data) {
        surfy.pageRating = data;
        surfy.rating = data.rating;
        surfy.refresh(true);
    });

    setInterval(surfy.refresh, 5000);
};

surfy.getContainer = function () {
    return $("#surfy");
};


surfy.refresh = function (animate) {
    clearTimeout(surfy.refreshTimeout);
    surfy.refreshTimeout = setTimeout(function () {
        surfy.doRefresh(animate);
    }, 100);
};

surfy.doRefresh = function (animate) {
    if (!surfy.template) {
        return;
    }

    function calculateStars(rating) {
        var stars = [];
        for (var i = 1; i <= 5; i++) {
            stars[i - 1] = {
                index: i,
                empty: i > rating ? '-empty' : ''
            }
        }
        return stars;
    }

    var container = surfy.getContainer();

    container.html('');

    console.log('refreshed rating', surfy.rating);

    var comments = surfy.comments || [];
    var nocomment = comments.length == 0;
    var rating = parseFloat(surfy.rating) || 0;
    var stars = calculateStars(rating);

    var rendered = surfy.template({
        comments: comments,
        nocomment: nocomment,
        stars: stars
//        isHot: surfy.pageRating.isHot || false
    });

    container.html(rendered);

    if (animate) {
        //rendering view for first time
        setTimeout(function () {
            container.addClass('visible');
        }, 200);
    } else {
        container.addClass('visible');
    }

    surfy.setEventHandlers();
};

surfy.setEventHandlers = function () {
    function getRating(e) {
        var clickedStar = e.currentTarget;
        var rating = $(clickedStar).data("rating");
        return rating;
    }

    var self = this;
    this.findEl("#commentBtn").click(function () {
        var comment = $("#commentBox").val();
        if (comment.length > 0) {
            var request = {
                url: window.location.href,
                comment: comment,
                token: surfy.authToken
            };
            surfyService.submitComment(request).then(function (data) {
                surfy.comments = data.comments;
                surfy.refresh(false);
            });
        }
    });

    this.findEl("#signIn").click(function () {
        if (!surfy.authToken) {
            surfy.signIn();
        }
    });

    this.findEl(".starRating").mouseup(function (e) {
        var request = {
            url: window.location.href,
            rating: getRating(e)
        };
        surfyService.submitRating(request).then(function (data) {
            surfy.pageRating = data;
            surfy.rating = data.rating;
        });
    });

    this.findEl(".starRating").mouseenter(function (e) {
        surfy.rating = getRating(e);
        surfy.refresh();
    });

    this.findEl(".starRating").mouseleave(function () {
        surfy.rating = surfy.pageRating.rating;
        surfy.refresh();
    });

    this.findEl(".s-close").click(function (e) {
        e.preventDefault();
        self.toggleContainer();
    });
};

surfy.signIn = function (method) {
    chrome.runtime.sendMessage({getToken: true, method: method}, function (response) {
        surfy.authToken = response.token;
        console.log("token is" + surfy.authToken);
        surfy.isSignedIn = true;
    });
};

surfy.findEl = function (sel) {
    return this.getContainer().find(sel);
};

$(document).ready(function () {
    surfy.init();
});
