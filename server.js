var fs = require("fs"),
    http = require("http"),
    mongoose = require("mongoose"),
    jade = require('jade');

var carAttrs = require("./car.js"),
    carSchema = mongoose.Schema(carAttrs);

var parseParams(queryString) {
  data = data.split('&');
  for (var i=0; i < data.length; i++) {
    var _data = data[i].split("=");
    postParams[_data[0]] = _data[1];
  }
}

var Car = mongoose.model('Car', carSchema);
mongoose.connect('mongodb://localhost/crud_sans_frameworks');

var handleRequest = function(req, res) {
  if (req.url == '/') {
    res.writeHead(301, {Location: 'http://localhost:1337/cars'})
    res.end();
  }

  if (req.url == '/cars' && req.method == "GET") {
    var index = fs.readFileSync('index.jade', 'utf8');
    var compiledIndex = jade.compile(index, { pretty: true, filename: 'index.jade' });

    Car.find({}, function(err, cars){
      console.log(cars);
      var rendered = compiledIndex({cars: cars});
      res.end(rendered)
    })
  } else if (req.url == "/cars/new") {
    var newTemplate = fs.readFileSync('new.jade', 'utf8');
    compilednewTemplate = jade.compile(newTemplate, { pretty: true, filename: 'new.jade' });

    res.end(compilednewTemplate());
  } else if (req.url == '/cars' && req.method == "POST") {
    var postParams = {}
    req.on('data', function(data) {
      var params = parseParams(data.toString());

      var car = new Car(postParams);
      car.save(function (err) {
        if (err)
          console.log(err);
      });

      res.writeHead(301, {location: 'http://localhost:1337/cars'});
      res.end();
    });

  } else if (req.url.indexOf('/cars/') > -1 && req.method == "GET") {
    var postParams = {}
    req.on('data', function(data) {
      var params = parseParams(data.toString());

      var car = new Car(postParams);
      car.save(function (err) {
        if (err)
          console.log(err);
      });

      res.writeHead(301, {location: 'http://localhost:1337/cars'});
      res.end();
    });

  } else if (req.url.indexOf('edit') > -1 && req.method == 'GET') {
    Car.findOne({_id: _id}, function(err, doc) {
      res.end(compileJade('edit.jade', {car: doc}));
    });
  } else if (req.url.indexOf('delete') > -1 && req.method == 'POST') {
    Car.findOneAndRemove({_id: _id}, function(err) {
      if (err) console.log(err);

      redirectToIndex(res);
    });
  } else if (req.url.indexOf('update') > -1 && req.method == 'POST') {
    req.on('data', function(data) {
      Car.update({_id: _id}, parseParams(data.toString()), {upsert: true}, function(err, raw) {
        redirectToIndex(res)
      });
    });
  } else if (req.url.indexOf('/cars/') > -1 && req.method == 'GET') {
    var car = Car.findOne({_id: _id}, function(err, doc) {
      res.end(compileJade('show.jade', {car: doc}))
    });
  } else {
    res.writeHead(404);
    res.end('PC Load letter');
  }
};

var server = http.createServer(handleRequest);
server.listen(1337);
