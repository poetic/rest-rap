/* global module: true */

(function () {
  'use strict';

  function restRap() {
    return function (req, res, next) {
      var splitUrl        = req.url.split('/').slice(1)
      var modelName       = inflector.singularize(splitUrl[0]);
      var pluralModelName = inflector.pluralize(modelName);
      var model           = fromCache(pluralModelName);
      var id              = splitUrl[1];

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
          response[modelName] = model.records[req.body[modelName].id] = req.body[modelName];
        case 'PUT':
          response[modelName] = model.records[req.body[modelName].id] = req.body[modelName];
          break;
      }
      res.send(response);
    };
  }

  module.exports = restRap;
}());
