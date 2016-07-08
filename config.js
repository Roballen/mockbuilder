define(['module'], function(module) {
  'use strict';

  return {
    'url': 'https://simon-dev.codebig2.net', //change to the url you want to test
    'ignoreQueryParams': [ //do not use these params
      'token',
      'api_key'
    ], //these will no be used when matching the url, supported on Nock only at the moment
    'ignoreUrls': [ //these will not be mocked
      '/sites',
      '/references',
      '/login',
    ],
    'template': 'sinon', //supports nock, sinon
    'outputLocation': 'mocks', //change to the location where you want to save the mocks
    'ignoreHeaders': [
      'Set-Cookie',
    ]
  };
});
