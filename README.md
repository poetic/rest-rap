# rest-rap

[![Build
Status](https://travis-ci.org/poetic/rest-rap.svg?branch=master)](https://travis-ci.org/poetic/rest-rap)

A simple express middleware for automatic in-memory rest routes.

### Usage

It will automatically respond to all requests to /api/modelName with an
in-memory cache.

**Request examples**

```
GET    /api/posts
  received:
  {
    "posts": [
      { id: 0, name: "Test"},
      { id: 1, name: "Test"}
    ]
  }
GET    /api/posts/1
  received:
  {
    "post": {
      id: 0,
      name: "Test"
    }
  }
GET    /api/posts?ids[]=1&ids[]=2
  received:
  {
    "posts": [
      { id: 1, name: "Test"},
      { id: 2, name: "Test"}
    ]
  }

POST   /api/posts
  sent:
  {
    id: 0,
    name: "Test"
  }

  received:
  {
    "post": {
      id: 0,
      name: "Test"
    }
  }

PUT    /api/posts/1
  sent:
  {
    id: 0,
    name: "Test"
  }

  received:
  {
    "post": {
      id: 0,
      name: "Test"
    }
  }

DELETE /api/posts/1
  sent: null
  received: null
```

#### Ember CLI

```sh
npm install --save-dev rest-rap
```

That's it! Your API is now available at /api

#### Express App
```sh
npm install --save-dev rest-rap
```

then

```js
var restRap = require('rest-rap');

var app = express();

app.use(restRap())
```


