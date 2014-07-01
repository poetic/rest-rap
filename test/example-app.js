/*global require: true, module: true, describe: true, it: true*/

(function () {

  'use strict';

  var should = require('should'),
    express = require('express'),
    supertest = require('supertest'),
    bodyParser = require('body-parser'),
    restRap = require('../index'),
    simpleApp;

  simpleApp = express();
  simpleApp.use(restRap());

  var lastId = 0;
  function generateTodo(name) {
    return  {
      id: lastId++,
      name: name
    }
  }

  describe('example app(s)', function () {
    describe('GET', function () {
      it('returns empty array when no records are cached', function (done) {
        supertest(simpleApp)
          .get('/todos')
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);
            res.body.should.eql({todos: []});
            done();
          });
      });

      it('returns an array of cached records', function (done) {
        var todo = generateTodo('array of data');
        var app = supertest(simpleApp);
        app.post('/todos')
          .send({todo: todo})
          .end(function(err, res) {
            app.get('/todos')
              .expect(200)
              .end(function (err, res) {
                should.not.exist(err);
                res.body.should.eql({todos: [todo]});
                done()
              });
          });
      });

      it('returns a single record', function (done) {
        var todo = generateTodo('singleTodo');
        var app = supertest(simpleApp);
        app.post('/todos')
          .send({todo: todo})
          .end(function(err, res) {
            app.get('/todos/' + todo.id)
              .expect(200)
              .end(function (err, res) {
                should.not.exist(err);
                res.body.should.eql({todo: todo});
                done()
              });
          });
      });
    });

    describe('POST', function () {
      it('returns the same record', function (done) {
        var todo = {todo: generateTodo('test')};
        supertest(simpleApp)
          .post('/todos')
          .send(todo)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);
            res.body.should.eql(todo);
            done();
          });
      });
    });

    describe('PUT', function () {
      it('returns the updated record', function (done) {
        var todo = generateTodo('original');
        var app = supertest(simpleApp);
        app.post('/todos')
          .send({todo: todo})
          .end(function(err, res) {
            todo.name = 'updated';
            app.put('/todos/' + todo.id)
              .send({todo: todo})
              .expect(200)
              .end(function (err, res) {
                should.not.exist(err);
                res.body.should.eql({todo: {
                  id: todo.id, name: 'updated'
                }});
                done()
              });
          });
      });
    });
  });
}());

