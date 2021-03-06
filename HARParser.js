// var nodeUrl = require("url");

define(["handlebars", "lodash", "url"],
  function(Handlebars, _, nodeUrl) {
    return {
      parse: function(testTemplate, harData, config) {
        var url = config.url;
        var compiledTemplate = Handlebars.compile(testTemplate);
        harData.alreadyMapped = [];

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
            //parse the url for better control over mocking
            var parsedUrl = nodeUrl.parse(e.request.url, true);

            if (_.indexOf(config.ignoreUrls, parsedUrl.pathname) > 0) {
              return;
            }

            // put the response back in JSON so it will be safe to embed in the Javascript directly
            e.response.content.text = JSON.stringify(e.response.content.text);
            // add a flag to help with handling trailing commas
            e.response.headers[e.response.headers.length - 1].last = true;

            e.response.headers = e.response.headers.filter(function(e) {
              if (_.indexOf(config.ignoreHeaders, e.name) < 0) {
                return e;
              }
            });

            if ( config.template == 'nock' ) {
              e.request.method = e.request.method.toLowerCase();
            }

            //console.log(parsedUrl.pathname);

            if ( _.indexOf(harData.alreadyMapped, parsedUrl.pathname) < 0 ) {
              harData.alreadyMapped.push(parsedUrl.pathname)
            }
            else {
              console.log(`done been mapped${parsedUrl.pathname}`);
              return;
            }

            e.request.host = parsedUrl.host;

            parsedUrl.requestParams = _.each(Object.keys(parsedUrl.query), function(query) {
              if (_.indexOf(config.ignoreQueryParams, query) < 0) {
                if (!parsedUrl.requestParams) {
                  parsedUrl.requestParams = {};
                }
                parsedUrl.requestParams[query] = parsedUrl.query[query];
              }
            });
            //"string".replace(/\//g, 'ForwardSlash');
            parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "").replace(/\//g,'\\/');

            e.request.url = parsedUrl;

            if (e.response.status === 304) {
              e.response.status = 200;
            }
            return e;
          })
          .filter(function(e) {
            return e;
          })
          .sortBy(function(e) {
            return e.request.url.pathname;
          })
          .value();


          _.each(harData.log.entries, function(it) { console.log(it.request.url.pathname); })

        return compiledTemplate(harData);
      },
    };
  }
);
