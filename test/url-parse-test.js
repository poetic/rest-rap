/*global require: true, module: true, describe: true, it: true*/

'use strict';

var urlParser = require('../lib/url-parse');
var should    = require('should');

describe('url parser', function() {
  it('should return model name when no id is given', function() {
    urlParser('/api/v1/posts').model.should.eql('posts');
    (urlParser('/api/v1/posts').id === null).should.be.true;

    urlParser('/api/posts').model.should.eql('posts');
    (urlParser('/api/posts').id === null).should.be.true;

    urlParser('/posts').model.should.eql('posts');
    (urlParser('/posts').id === null).should.be.true;

    urlParser('/api/v1/posts?ids[]=1&ids[]=2').model.should.eql('posts');
    (urlParser('/api/v1/posts?ids[]=1&ids[]=2').id === null).should.be.true;
  });

  it('should return model name and id', function() {
    urlParser('/api/v1/posts/1').model.should.eql('posts');
    urlParser('/api/v1/posts/1').id.should.eql(1);

    urlParser('/api/posts/1').model.should.eql('posts');
    urlParser('/api/posts/1').id.should.eql(1);

    urlParser('/posts/1').model.should.eql('posts');
    urlParser('/posts/1').id.should.eql(1);
  });
});


