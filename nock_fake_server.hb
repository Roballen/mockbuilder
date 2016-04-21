var nock = require('nock');
var scope = nock('{{url}}');
scope = scope.persist();

{{#each log.entries}}
    scope.{{request.method}}('{{{request.url.pathname}}}')
    .reply({{response.status}},
    {{{response.content.text}}});
{{/each}}
