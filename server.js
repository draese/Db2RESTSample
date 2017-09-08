// Main server entry point
// Defines a Web server with static routing to our Angular app page
// with all its required resources.
//
// 2017/09/09 Oliver Draese, odraese@us.ibm.com
let express     = require('express');
let restHandler = require('./app/server/EmpDataHandler.js');
let app         = express();

// root folder
app.use( express.static( "./websource") );

// map into JS folders
app.use( '/js', express.static( './node_modules/angular') );
app.use( '/js', express.static( './node_modules/angular-route') );

// map into CSS folders
app.use( '/css', express.static( './node_modules/bootstrap/dist/css') );

// define REST API getEmpData, handled by EmpDataHandler
app.use( '/getEmpData', restHandler.getEmpData );

// route /list to main application
app.use( '/list', express.static( './websource/birthDayList.html' ) );

// redirect to main page
app.get( '/', function(req, res){
  res.redirect( '/list' );
});

// root of the App routed to root
app.use( '/', express.static( './app') );

app.listen(3000);
