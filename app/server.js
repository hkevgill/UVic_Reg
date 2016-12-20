// BASE SETUP
// CALL THE PACKAGES    ---------------------------------------------------------
var express     = require('express'); // call express
var app         = express(); // define our app using express
var bodyParser  = require('body-parser'); // get body-parser
var morgan      = require('morgan'); // used to see requests
var port        = process.env.PORT || 3000; // set the port for our app
var path        = require("path");

// APP CONFIGURATION    ---------------------------------------------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // log all requests to the console
app.use(morgan('dev'))

// ROUTES   ---------------------------------------------------------
// basic route for the home page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

// API routes
var apiRoutes = require('./server/routes/api')(app, express);
app.use('/api', apiRoutes);

// start the server
app.listen(port);
console.log(port + ' is the magic port!');
