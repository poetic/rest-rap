'use strict';

function EmberCLIRestRap(project) {
  this.project = project;
  this.name    = 'Ember CLI Rest Rap';
}

EmberCLIRestRap.prototype.serverMiddleware = function(options) {
  var app = options.app;
  var restRap = require('./lib/rest-rap');

  app.use('/api', restRap());
};

// < ember-cli 0.0.38 support
EmberCLIRestRap.prototype.treeFor = function() { };
EmberCLIRestRap.prototype.included = function() { };

module.exports = EmberCLIRestRap;
