var mongoose = require('mongoose');
var db = exports.Db = mongoose.createConnection();

//WeChat Open Framework
var settings = {
  name: 'your MongoDB ID',
  host: 'mongo.duapp.com',  //if you use BAE,that is the host of  mongodb host.
  port: '8908', //it depends Baidu,we have no choice.
  user: 'user id',
  pass: 'password'
};

var options = {
  db: {
    native_parser: false
  },
  server: {
    poolSize: 5,
    auto_reconnect: true
  },
  user: settings.user,
  pass: settings.pass
};

db.open(settings.host,settings.name,settings.port,options,function(){
  console.log('MongoDB connected!');
});

db.on('error',function(err){
  console.error.bind(console,'connection error!');
  console.log('connection error!!');
  // listen BAE mongodb, if except throws then close the connection
  //why have to do this? cause it'll be disconnected if it free after 30s by.
  db.close();
});

db.on('close',function(){
  db.open(settings.host,settings.name,settings.port,options,function(){
    console.log('open MongoDB connection again!');
  });
});

exports.mongoose = mongoose;