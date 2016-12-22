// BASE SETUP
// CALL THE PACKAGES    ---------------------------------------------------------
var express     = require('express'); // call express
var app         = express(); // define our app using express
var bodyParser  = require('body-parser'); // get body-parser
var morgan      = require('morgan'); // used to see requests
var port        = process.env.PORT || 3000; // set the port for our app
var path        = require("path");
var favicon     = require('serve-favicon');

// APP CONFIGURATION    ---------------------------------------------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // log all requests to the console
app.use(morgan('dev'))

// serve favicon
app.use(favicon(__dirname + '/favicon.ico'));

// ROUTES   ---------------------------------------------------------
// set the public folder to serve public assets
app.use(express.static(__dirname + '/client/'));
console.log(__dirname + '/client');

// API routes
var apiRoutes = require('./server/routes/api')(app, express);
app.use('/api', apiRoutes);

// basic route for the home page
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

// start the server
app.listen(port);
console.log(port + ' is the magic port!');
