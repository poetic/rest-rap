/*global require: true, module: true, describe: true, it: true*/

'use strict';

var should   = require('should'),
  express    = require('express'),
  supertest  = require('supertest'),
  bodyParser = require('body-parser'),
  restRap    = require('../lib/rest-rap'),
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

    it('returns proper error when id doesn\'t exist', function (done) {
      var app = supertest(simpleApp);
      app.get('/todos/9123123')
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.eql(400);
          done()
        });
    });

    it('returns an array records from the ids param', function (done) {
      var todo  = generateTodo('first todo');
      var todo2 = generateTodo('first todo');
      var app   = supertest(simpleApp);

      app.post('/todos')
        .send({todo: todo})
        .end(function(err, res) {
          app.post('/todos')
            .send({todo: todo2})
            .end(function(err, res) {
              app.get('/todos?ids[]=' + todo.id + '&ids[]=' + todo2.id)
                .expect(200)
                .end(function (err, res) {
                  should.not.exist(err);
                  res.body.should.eql({todos: [todo, todo2]});
                  done()
                });
            });
        });
    });
  });

  describe('POST', function () {
    it('returns the same record', function (done) {
      var todo = generateTodo('test');
      supertest(simpleApp)
        .post('/todos')
        .send({todo: todo})
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.eql(201);
          res.body.todo.should.eql(todo);
          done();
        });
    });

    it('errors without an id in the body', function (done) {
      var todo = generateTodo('test');
      delete todo.id;

      supertest(simpleApp)
        .post('/todos')
        .send({todo: todo})
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.eql(400);
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
            .end(function (err, res) {
              res.status.should.eql(200);
              should.not.exist(err);
              res.body.should.eql({todo: {
                id: todo.id, name: 'updated'
              }});
              done()
            });
        });
    });

    it('errors when the record doesn\'t exist', function (done) {
      var todo = generateTodo('original');
      var app = supertest(simpleApp);
      app.put('/todos/125451')
        .send({todo: todo})
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.eql(400);
          done()
        });
    });
  });

  describe('DELETE', function () {
    it('returns the proper status code', function (done) {
      var todo = generateTodo('original');
      var app = supertest(simpleApp);
      app.post('/todos')
        .send({todo: todo})
        .end(function(err, res) {
          app.delete('/todos/' + todo.id)
            .send({todo: todo})
            .end(function (err, res) {
              should.not.exist(err);
              res.status.should.eql(204);
              done()
            });
        });
    });

    it('errors when the record doesn\'t exist', function (done) {
      var todo = generateTodo('original');
      var app = supertest(simpleApp);
      app.delete('/todos/981373')
        .send({todo: todo})
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.eql(400);
          done()
        });
    });

    it('doesn\'t return one that was deleted in the index', function (done) {
      var todo = generateTodo('original');
      var app = supertest(simpleApp);
      app.post('/todos')
        .send({todo: todo})
        .end(function(err, res) {
          app.delete('/todos/' + todo.id)
            .send({todo: todo})
            .end(function (err, res) {
              app.get('/todos')
                .end(function (err, res){
                  should.not.exist(err);
                  res.body.todos.should.not.containEql(todo);
                  done()
                });
            });
        });
    });
  });
});
