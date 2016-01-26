var _ = require("lodash"),
  fs = require("fs"),
  requirejs = require("requirejs"),
  harString = "";

if (process.argv.length !== 3) {
  console.log(process.argv);
  process.abort();
}



requirejs(["HARParser", "text!sinon_fake_server.hb", "text!nock_fake_server.hb", "config"], function(harParser, sinonTemplate, nockTemplate, config) {
  console.log(process.argv[2]);
  var template = config.template == 'nock' ? nockTemplate : sinonTemplate;
  fs.readFile(process.argv[2], function(error, harString) {
    var outputFile = process.argv[2].replace(/hars\/(.*).har/, config.outputLocation + "/" + config.template + "$1.js");
    fs.writeFile(outputFile, harParser.parse(template, JSON.parse(harString), config));
  });
});
