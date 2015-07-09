'use strict';

var axios = require('axios');
var DataStore = require('defektive-data-store');

var AxiosStore = module.exports = (function (){
  function AxiosStore(attrs) {
    this.config = {
      endpoint: '/api/users/',
      idAttribute: 'id'
    }
  }

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

  AxiosStore.prototype.create = function (attrs) {
    axios
      .post(this.getEndpoint(), this.toParamPayload(attrs))
      .then(function (response) {
        this.attrs(response.data);
      }.bind(this));
  }

  AxiosStore.prototype.read = function () {
    axios.get(this.getObjectUrl())
    .then(function (response) {
      this.setHash(response.data.map);
      this.set('data', response.data.map(UserServiceStore.fromResponse));
    }.bind(this));
  }
  AxiosStore.prototype.get = AxiosStore.prototype.read;

  AxiosStore.prototype.update = function (attrs) {
    axios
      .put(this.getObjectUrl(), this.toParamPayload(attrs))
      .then(function (response) {
        this.attrs(response.data);
      }.bind(this));
  }

  AxiosStore.prototype.delete = function () {
    axios
      .delete(this.getObjectUrl())
      .then(function (response) {
        this.emitEvent('deleted')
      }.bind(this));
  }

  AxiosStore.createStore = function (config){
    function TmpStore(){
      AxiosStore.apply(this, arguments);
      this.config = config;
    }

    TmpStore.prototype = Object.create(AxiosStore.prototype);
    return TmpStore
  }

  return AxiosStore
})();
