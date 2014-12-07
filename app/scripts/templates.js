var surfy = surfy || {};

surfy.templates = {};

surfy.templates.mainTemplate =
    '<div id="surfy" class="surfyContainer">' +
    '   <div class="bg"></div>' +
    '   <div class="content">' +
    '      <div class="header">' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '         <h2 class="glyphicon glyphicon-star-empty"></h2>' +
    '      </div>' +
    '      <div class="comment">' +
    '          {{ #comments }}' +
    '          <div class="author" data-content="author">{{ author }}</div>' +
    '          <div class="text" data-content="comment">{{ comment }}</div>' +
    '          {{ / comments }}' +
    '      </div>' +
    '   </div>' +
    '   <div class="surfylogo"><img data-src="logoUrl" width="75" height="41" /></div>' +
    '</div>';