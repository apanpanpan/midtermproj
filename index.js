var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
var _ = require("underscore");
var request = require("request");
var exphbs = require('express-handlebars');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


var _DATA = JSON.parse(fs.readFileSync('bops.json')).bops;

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/',function(req,res){
  function compare(a,b) {
    if (a.title == b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return -1;
    } else {
      return 1;
    }
  }

  var arr = _DATA;
  arr.sort(compare);

  res.render('home', {sorted: arr});
  /* must show all end points */
})

/* api endpoint to view all songs */
app.get('/api/getBops', function (req,res) {
  JSON.stringify(_DATA);

  res.json(_DATA);
})


app.post('/api/addBop', function(req, res) {
  var body = req.body;
  var title = body.title;
  var artists = body.artists.split(", ");
  var chart = parseInt(body.chart);
  var video = body.video;
  var explicit = body.explicit == "yes"


  _DATA.push({title: title,
              artists: artists,
              chart: chart,
              video: video,
              explicit: explicit
            });
  fs.writeFileSync('bops.json', JSON.stringify({bops:_DATA}))
  res.redirect("/");
})

/* api endpoint to view all songs by a certain artist*/
app.get('/api/artist/:artist', function (req,res) {
  var result = []

  for (var b of _DATA) {
    if (b.artists.includes(req.params.artist)) {
      result.push(b.title)
    }
  }
  res.json(result);
})

/* api endpoint to view a random bop*/
app.get('/api/random', function(req, res) {
  var ind = Math.floor((Math.random()*100))%(_DATA.length);
  res.json(_DATA[ind].title);
});

/* api endpoint to view all songs below a certain chart rating */
app.get('/api/chart/:chart',  function(req, res) {
  var result = []

  for (var b of _DATA) {
    if(b.chart <= req.params.chart) {
      result.push(b.title)
    }
  }
  res.json(result);
})

//nonAPI endpoints
app.get('/topBops', function(req, res){
  var top = _.where(_DATA, {chart: 1});

  res.render('general', {title: "top hits", arr:top});
})

app.get('/artist', function(req, res){
  function compare(a,b) {
    if (a.artists[0] == b.artists[0]) {
      if (a.title > b.title) { return 1;} else {return -1;}
    }
    if (a.artists[0] > b.artists[0]) {
      return -1;
    } else {
      return 1;
    }
  }

  var arr = _DATA;
  arr.sort(compare);
  res.render('general', {title: "artists", arr: arr});
})

app.get('/jb', function(req, res){
  var jbBops = [];

  for (var b of _DATA) {
    if (b.artists.includes("Justin Bieber")) {
      jbBops.push(b);
    }
  }

  res.render('general', {title: "jb",arr:jbBops});
})

app.get('/nonexplicit', function(req, res){
  var non = _.where(_DATA, {explicit: false});
  res.render('general', {title: "wholesome", arr:non});
})

app.get('/collabs', function(req, res){
  var collabs = []

  for (var b of _DATA) {
    if (b.artists.length > 1) {
      collabs.push(b);
    }
  }
  res.render('general', {title: "collabs" ,arr:collabs});
})

app.get('/addBop', function (req, res) {
  res.render('addBop');
})

app.post('/addBop', function(req, res) {
  var body = req.body;

  body.artists = body.artists.split(", ");
  body.chart = parseInt(body.chart);
  body.explicit = body.explicit.checked

  _DATA.push(req.body);
  fs.writeFileSync('bops.json', JSON.stringify({bops:_DATA}));

  res.redirect("/");

})

  /*  document.getElementById("search").on('keyup', function(p) {
    function compare(a,b) {
      if (a.title == b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return -1;
      } else {
        return 1;
      }
    }

    var inp = $("#search").val();
    if (inp.length > 1) {
      if (/\s/.test(inp)) {
        arr = inp.toLowerCase().split(' ');
        for (i in arr) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
        }
        inp = arr.join(' ');
      } else {
        inp = inp.toLowerCase();
        inp = inp.charAt(0).toUpperCase() + inp.substr(1);
      }
  }
  var arr = [];
  for (var b of _DATA) {
    if (b.title.search(inp) != -1) {
      arr.push(b.title);
    }
  }
  arr.sort(compare);

  res.render('home', {sorted: arr});
}) */

app.listen(2010, function() {
    console.log('Listening on port 2010!');
});
