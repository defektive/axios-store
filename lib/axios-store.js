'use strict';

var axios = require('axios');
var DataStore = require('defektive-data-store')

var AxiosStore = module.exports = (function (){

  var defaultOptions = {
    endpoint: '/api/users/',
    idAttribute: 'id'
  }

  function AxiosStore(attrs, options) {
    this.options = options || {}
    if(options) {
      Array.prototype.pop.apply(arguments)
    }
    DataStore.apply(this, arguments);
  }

  AxiosStore.prototype = Object.create(DataStore.prototype);

  AxiosStore.prototype.getId = function (){
    this.store.get(this.options.idAttribute)
  }

  AxiosStore.prototype.getEndpoint = function (){
    return this.options.endpoint;
  }

  AxiosStore.prototype.getObjectUrl = function (){
    return this.getEndpoint() + this.getId();
  }

  AxiosStore.prototype.toParamPayload = function (attrs){
    if (this.options.postKeyName) {
      var res = {};
      res[this.options.postKeyName] = attrs;
      return res
    }
    return attrs;
  }

  AxiosStore.prototype.get = function () {
    axios.get(this.getObjectUrl())
    .then(function (response) {
      this.setHash(response.data.map);
      this.set('data', response.data.map(UserServiceStore.fromResponse));
    }.bind(this));
  }

  AxiosStore.prototype.delete = function () {
    axios
      .delete(this.getObjectUrl())
      .then(function (response) {
        this.emitEvent('deleted')
      }.bind(this));
  }

  AxiosStore.prototype.update = function (attrs) {
    axios
      .put(this.getObjectUrl(), this.toParamPayload(attrs))
      .then(function (response) {
        this.attrs(response.data);
      }.bind(this));
  }

  AxiosStore.prototype.create = function (attrs) {
    axios
      .post(this.getEndpoint(), this.toParamPayload(attrs))
      .then(function (response) {
        this.attrs(response.data);
      }.bind(this));


  AxiosStore.fromResponse = function (response, options) {
    options = options || {};
    return new AxiosStore({}, response);
  }

  AxiosStore.factory = function (options) {
    return new AxiosStore({}, options);
  }


  return AxiosStore
})();
