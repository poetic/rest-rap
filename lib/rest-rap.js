/* global module: true */

(function () {
  'use strict';

  var inflector = require('ember-inflector-node-shim');
  var bodyParser = require('body-parser');

  var cache = {};
  var fromCache = function(key) {
    if(!cache[key]) {
      return cache[key] = { records: {} };
    }
    return cache[key];
  }

  function restRap() {
    return function (req, res, next) {
      bodyParser.json()(req, res, function(err) {
        if(err) { return next(err); }

        var splitUrl        = req.url.split('/').slice(1)
        var modelName       = inflector.singularize(splitUrl[0]);
        var pluralModelName = inflector.pluralize(modelName);
        var model           = fromCache(pluralModelName);
        var id              = splitUrl[1];
        var body            = req.body[modelName] || {};

        var response = {};
        switch(req.method) {
          case 'GET':
            if(id) {
              if(model.records[id]) {
                response[modelName] = model.records[id]
              } else {
                response.error = 'Couldn\'t find model with that id';
              }
            } else {
              response[pluralModelName] = Object.keys(model.records).map(function(id) {
                return model.records[id];
              });
            }
            break;
          case 'POST':
            if(body.id != null) {
              response[modelName] = model.records[body.id] = body;
            } else {
              response['errors'] = 'no body id found'
            }
            break;
          case 'PUT':
            if(body.id) {
              response[modelName] = model.records[body.id] = body;
            } else {
              response['errors'] = 'no body id found'
            }
            break;
          case 'DELETE':
            if(body.id != null) {
              response[modelName] = model.records[body.id] = body;
              model.records = [];
            } else {
              response['errors'] = 'no body id found'
            }
            break;
        }
        res.send(response);
      });
    };
  }

  module.exports = restRap;
}());
