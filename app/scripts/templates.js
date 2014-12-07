var surfy = surfy || {};

surfy.templates = {};

surfy.templates.container =
    '<div class="bg"></div>' +
    '<div class="content"></div>' +
    '<div class="surfylogo"><img data-src="logoUrl" width="75" height="41" /></div>';

surfy.templates.headerSection =
    '<div class="header">' +
    '   <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '   <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '   <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '   <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '   <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '</div>';

surfy.templates.commentSection =
    '<div class="comment">' +
    '   <div class="author" data-content="author"></div>' +
    '   <div class="text" data-content="comment"></div>' +
    '</div>'