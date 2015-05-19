var fs = require("fs"),
    http = require("http"),
    mongoose = require("mongoose"),
    jade = require('jade');

// load Car model
var carAttrs = require("./car.js"),
    carSchema = mongoose.Schema(carAttrs);


var Car = mongoose.model('Car', carSchema);
mongoose.connect('mongodb://localhost/crud_sans_frameworks');

var handleRequest = function(req, res) {
  // redirect users to /cars if they try to hit the homepage
  if (req.url == '/') {
    res.writeHead(301, {Location: 'http://localhost:1337/cars'})
    res.end();
  }

  if (req.url == '/cars' && req.method == "GET") {
    // Synchronously load the index jade template (http://jade-lang.com/)
    var index = fs.readFileSync('index.jade', 'utf8');
    // Compile template
    var compiledIndex = jade.compile(index, { pretty: true, filename: 'index.jade' });

    Car.find({}, function(err, cars){
      console.log(cars);
      var rendered = compiledIndex({cars: cars});
      res.end(rendered)
    })

    // example of data that can be passed in to the Jade template:
    // in your CRUD app, a call to Mongoose should return all of the Cars
  //   var sampleDataForCars = { cars: [
  //     { driver: 'Andreas', make: 'Nissan', model: 'Xterra', year: 2005 },
  //     { driver: 'Bob Ross', make: 'Ford', model: 'Pinto', year: 1972 }
  //   ],
  //   headline: "Welcome to the Cars CRUD App!"
  // };

    // Render jade template, passing in the info

    // Write rendered contents to response stream
  } else if (req.url == "/cars/new") {
    var newTemplate = fs.readFileSync('new.jade', 'utf8');
    compilednewTemplate = jade.compile(newTemplate, { pretty: true, filename: 'new.jade' });

    res.end(compilednewTemplate());
  } else if (req.url == '/cars' && req.method == "POST") {
    var postParams = {}
    req.on('data', function(data) {
      data = data.toString();
      data = data.split('&');
      for (var i=0; i < data.length; i++) {
        var _data = data[i].split("=");
        postParams[_data[0]] = _data[1];
      }
      var car = new Car(postParams);
      car.save(function (err) {
        if (err)
          console.log(err);
      });

      res.writeHead(301, {location: 'http://localhost:1337/cars'});
      res.end();
    });

  } else if (req.url == '/cars/<something id/show' && req.method == "GET") {
    var postParams = {}
    req.on('data', function(data) {
      data = data.toString();
      data = data.split('&');
      for (var i=0; i < data.length; i++) {
        var _data = data[i].split("=");
        postParams[_data[0]] = _data[1];
      }
      var car = new Car(postParams);
      car.save(function (err) {
        if (err)
          console.log(err);
      });

      res.writeHead(301, {location: 'http://localhost:1337/cars'});
      res.end();
    });

  } else {
    // Your code might go here (or it might not)
    res.writeHead(200);
    res.end('A new programming journey awaits');
  }
};

var server = http.createServer(handleRequest);
server.listen(1337);
