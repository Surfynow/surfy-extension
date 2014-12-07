var surfy = surfy || {};

surfy.templates = {};

surfy.templates.mainTemplate =
    '<div id="surfy" class="surfyContainer">' +
    '   <div class="s-bg"></div>' +
    '   <div class="content">' +
    '      <div class="header">' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '      </div>' +
    '      <div class="s-comment">' +
    '          {{ #comments }}' +
    '          <div class="s-author" data-content="author">{{ author }}</div>' +
    '          <div class="s-cmt" data-content="comment">{{ comment }}</div>' +
    '          {{ / comments }}' +
    '      </div>' +
    '   </div>' +
    '   <div class="surfylogo"><img data-src="logoUrl" width="75" height="41" /></div>' +
    '</div>';