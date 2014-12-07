var surfy = surfy || {};

surfy.templates = {};

surfy.templates.container =
    '<div class="s-bg"></div>' +
    '<div class="s-content"></div>' +
    '<a class="s-close">x</a>' +
    '<div class="s-surfylogo"></div>';

surfy.templates.headerSection =
    '<div class="s-options">' +
    '   <div class="s-ranking">' +
    '       <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '       <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '       <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '       <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '       <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '   </div>' +
    '</div>';

surfy.templates.commentSection =
    '<div class="s-comment">' +
    '   <textarea class="s-textarea">post your comment here...</textarea>' +
    '   <button class="s-button">Post</button>' +
    '   <div class="s-entries">' +
        '   <h3>Top Comments</h3>' +
    '   </div>' +
    '</div>'

surfy.templates.commentEntry =
    '<div class="s-entry">' +
    '   <div class="s-avatar"></div>' +
    '   <div class="s-text">' +
    '       <div class="s-author" data-content="author"></div>' +
    '       <div class="s-cmt" data-content="comment"></div>' +
    '   </div>' +
    '   <div class="s-controls"><span class="glyphicon glyphicon-pencil"></span></div>' +
    '   <div class="clearfix"></div>' +
    '</div>'