# rest-rap

[![Build
Status](https://travis-ci.org/poetic/rest-rap.svg?branch=master)](https://travis-ci.org/poetic/rest-rap)

A simple express middleware for automatic in-memory rest routes.

### Usage

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


