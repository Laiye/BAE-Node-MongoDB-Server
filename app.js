var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('./db/mongoose.js');
var fs = require('fs');
var app = express();



//import the models
var models = {
  Note: require('./models/Note')(mongoose.mongoose,mongoose.Db)
};

//WeChat Open Framework
var config = {
  token: 'your token',
  appid: 'your appid',
  encodingAESKey: 'Ezr3WdFsRxnFgJ2VACyWGxB5D0ZsLMFsLvSs8j4RsfR' //43 number
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public.
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.query());
app.use(session({
  secret: 'hola-hola',
  cookie: {maxAge: 800000},
  resave: false,
  saveUninitialized: true
}));


// import the routes
fs.readdirSync('routes').forEach(function(file) {
    if ( file[0] == '.' ) return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./routes/' + routeName)(app, models,config);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
