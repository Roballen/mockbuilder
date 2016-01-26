// var nodeUrl = require("url");

define(["handlebars", "lodash", "url"],
  function(Handlebars, _, nodeUrl) {
    return {
      parse: function(testTemplate, harData, config) {
        var url = config.url;
        var compiledTemplate = Handlebars.compile(testTemplate);
        harData.url = config.url;
        harData.log.entries =
          _(harData.log.entries)
          // only care about the XHR requests
          .filter(function(e) {
            return _.find(e.request.headers, function(h) {
              return (h.name === "X-Requested-With" && h.value === "XMLHttpRequest") || (h.name === 'Accept' && h.value.indexOf('application/json') > -1);
            });
          })
          .map(function(e) {
            // put the response back in JSON so it will be safe to embed in the Javascript directly
            e.response.content.text = JSON.stringify(e.response.content.text);
            // add a flag to help with handling trailing commas
            e.response.headers[e.response.headers.length - 1].last = true;

            //parse the url for better control over mocking
            var parsedUrl = nodeUrl.parse(e.request.url, true);
            console.log(parsedUrl);
            e.request.host = parsedUrl.host;

            parsedUrl.requestParams = _.each(Object.keys(parsedUrl.query), function(query) {
              console.log(_.indexOf(config.ignoreQueryParams, query));
              if (_.indexOf(config.ignoreQueryParams, query) < 0) {
                console.log('adding:' + query)
                if (!parsedUrl.requestParams) {
                  parsedUrl.requestParams = {};
                }
                parsedUrl.requestParams[query] = parsedUrl.query[query];
              }
            });

            //  _(Object.keys(parsedUrl.query)).map(function(query) {
            //   if (!_(config.ignoreQueryParams).contains(query)) {
            //     return {
            //       'key': query,
            //       'value': parsedUrl.query[query],
            //     };
            //   }
            // });

            e.request.url = parsedUrl;

            if (e.response.status === 304) {
              e.response.status = 200;
            }
            return e;
          })
          .value();

        return compiledTemplate(harData);
      },
    };
  }
);
