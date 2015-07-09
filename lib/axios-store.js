'use strict';

var axios = require('axios');
var createStore = require('./create-store');
var AxiosStore = module.exports = createStore({
  // default config
  endpoint: 'change/me',
  idAttribute: 'id',
  postKeyName: null
});
