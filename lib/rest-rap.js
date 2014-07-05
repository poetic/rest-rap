/* global module: true */

var inflector  = require('ember-inflector-node-shim');
var bodyParser = require('body-parser');
var urlParse   = require('./url-parse');

var cache = {};
var fromCache = function(key) {
  if (!cache[key]) {
    return cache[key] = { records: {} };
  }
  return cache[key];
}

function restRap() {
  return function (req, res, next) {
    bodyParser.json()(req, res, function(err) {
      if(err) { return next(err); }

      var url             = urlParse(req.url);
      var modelName       = inflector.singularize(url.model);
      var pluralModelName = inflector.pluralize(url.model);
      var model           = fromCache(pluralModelName);
      var id              = url.id;
      var body            = req.body[modelName] || {};
      var response        = {};
      var status          = 200;

      switch(req.method) {
        case 'GET':
          if (req.query && req.query.ids) {
            response[pluralModelName] = [];
            Object.keys(model.records).forEach(function(key){
              var record = model.records[key];
              if (req.query.ids.indexOf(record.id.toString()) > -1) {
                response[pluralModelName].push(record);
              }
            });
          } else if (id != null) {
            if (model.records[id]) {
              response[modelName] = model.records[id]
            } else {
              status = 400;
            }
          } else {
            response[pluralModelName] = Object.keys(model.records).map(function(id) {
              return model.records[id];
            });
          }
          break;
        case 'POST':
          if (body.id != null) {
            response[modelName] = model.records[body.id] = body;
            status = 201;
          } else {
            status = 400;
          }
          break;
        case 'PUT':
          if (body.id != null && model.records[body.id]) {
            response[modelName] = model.records[body.id] = body;
          } else {
            status = 400;
          }
          break;
        case 'DELETE':
          if (id != null && model.records[id]) {
            model.records[id] = {};
            status = 204;
          } else {
            status = 400;
          }
          break;
      }
      res.json(status, response);
    });
  };
}

module.exports = restRap;
