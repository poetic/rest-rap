var nodeUrl = require('url');

module.exports = function(url) {
  url = nodeUrl.parse(url).pathname;

  var split = url.split('/').slice(1).slice(-2);
  var first = split[0];
  var last  = split[1];

  var id = parseInt(last, 10);

  if (last && !isNaN(id)) {
    return {
      model: first,
      id: id
    }
  } else {
    return {
      model: last ? last : first,
      id: null
    }
  }

}
