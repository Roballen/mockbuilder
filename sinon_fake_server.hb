var sinon = require('sinon');

var ServerResponses = {
  'initialize': function(server) {

  {{#each log.entries}}
          server.respondWith({{#request}}
              '{{method}}',
              /{{{url.pathname}}}/,{{/request}}
              [{{#response}}
                  {{status}},
                  { {{#each headers}}
                      '{{name}}': '{{value}}',{{/each}}
                  },
                  {{{content.text}}},
              {{/response}}]
          );
  {{/each}}

  },
}

module.exports = ServerResponses;
