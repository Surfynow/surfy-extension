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
        surfy.rating = data;
        surfy.refresh(true);
    });
};

surfy.getContainer = function () {
    return $("#surfy");
};

surfy.refresh = function (animate) {
    if (!surfy.template) {
        return;
    }

    function calculateStars(rating) {
        var stars = [];
        for (var i = 0; i < 5; i++) {
            stars[i] = {
                index: i + 1,
                empty: i >= rating ? '-empty' : ''
            }
        }
        return stars;
    }

    var container = surfy.getContainer();

    container.html('');

    var comments = surfy.comments || [];
    var rating = surfy.rating || 0;
    var stars = calculateStars(rating);

    var rendered = surfy.template({
        comments: comments,
        stars: stars
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
    var self = this;
    this.findEl("#commentBtn").click(function () {
        var comment = $("#commentBox").val();
        if (comment.length > 0) {
            var request = {
                url: window.location.href,
                comment: comment
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

    function getRating(e) {
        var clickedStar = e.currentTarget;
        var rating = $(clickedStar).data("rating");
        return rating;
    }

    this.findEl(".starRating").click(function (e) {
        var rating = getRating(e);
        alert(rating);
    });

    this.findEl(".starRating").mouseover(function (e) {
        surfy.rating = getRating(e);
        setTimeout(surfy.refresh, 50);
    });

    this.findEl(".starRating").mouseout(function (e) {
        surfy.rating = surfy.pageRating;
        setTimeout(surfy.refresh, 50);
    });

    this.findEl(".s-close").click(function (e) {
        e.preventDefault();
        self.toggleContainer();
    });
};

surfy.signIn = function () {
    chrome.runtime.sendMessage({getToken: true}, function (response) {
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
