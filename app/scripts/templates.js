var surfy = surfy || {};

surfy.templates = {};

surfy.templates.container =
    '<div class="bg"></div>' +
    '<div class="content"></div>' +
    '<div class="logo"><img data-src="logoUrl" width="75" height="41" /></div>';

surfy.templates.headerSection =
    '<div class="header">' +
    '   <span class="glyphicon glyphicon-star-empty"></span>' +
    '</div>';

surfy.templates.commentSection =
    '<div class="comment">' +
    '   <div class="author" data-content="author"></div>' +
    '   <div class="text" data-content="comment"></div>' +
    '</div>'