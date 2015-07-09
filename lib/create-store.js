'use strict';

var axios = require('axios');
var DataStore = require('defektive-data-store');

var createStore = module.exports = function (config){

  function AbstractStore() {
    DataStore.apply(this);
  }
  AbstractStore.prototype = Object.create(DataStore.prototype);


  AbstractStore.prototype.getId = function (){
    this.attr(config.idAttribute)
  }

  AbstractStore.prototype.getEndpoint = function (){
    return config.endpoint;
  }

  AbstractStore.prototype.getObjectUrl = function (){
    return getEndpoint() + this.getId();
  }

  AbstractStore.prototype.read = function () {
    axios.get(this.getObjectUrl())
    .then(function (response) {
      this.attrs(response.data);
    }.bind(this));
  }
  AbstractStore.prototype.get = AbstractStore.prototype.read;

  AbstractStore.prototype.update = function (attrs) {
    axios
      .put(this.getObjectUrl(), toParamPayload(attrs))
      .then(function (response) {
        this.attrs(response.data);
      }.bind(this));
  }

  AbstractStore.prototype.delete = function () {
    axios
      .delete(this.getObjectUrl())
      .then(function (response) {
        this.emitEvent('deleted')
      }.bind(this));
  }

  AbstractStore.create = function (attrs, callback) {
    axios
      .post(getEndpoint(), toParamPayload(attrs))
      .then(function (response) {
        callback(response.data);
      }.bind(this));
  }

  // private
  function getEndpoint() {
    return config.endpoint;
  }

  function toParamPayload(attrs){
    if (config.postKeyName) {
      var res = {};
      res[config.postKeyName] = attrs;
      return res
    }
    return attrs;
  }



  AbstractStore.createStore = createStore;
  return AbstractStore;
}
