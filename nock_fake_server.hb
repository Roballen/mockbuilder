var scope = nock('{{url}}');

{{#each log.entries}}
    scope.{{request.method}}('{{{request.url.pathname}}}')
    .reply({{response.status}},
    {{{response.content.text}}});
{{/each}}
