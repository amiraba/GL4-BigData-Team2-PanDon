var app = require('./app/lib/app');
const http = require('http');
var api = require('./app/lib/api');
var express = require('express');
var path = require('path');
var morgan = require("morgan");
//catch all other

//Set our api routes
app.use("/api", api.router);
app.use("/api/strict", api.tokenRouter);

//Log our requests
app.use(morgan("dev"));
// Catch all other routes and return the index file
// Point static path to dist

const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
    console.log("Server running !!");
});
