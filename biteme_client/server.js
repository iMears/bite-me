//initialize app
var express   = require('express');
var path      = require('path');
var morgan    = require("morgan");
var app       = express();
var Fraction  = require('fractional-arithmetic').Fraction;

// all environments
var port = process.env.PORT || 9000;
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Node express server running on port ' + port);

//CORS Configuration
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

  next();
});

app.get('*', function(req, res) {
  res.sendfile('./views/index.html');
})