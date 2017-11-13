/**
 * Created by Vyndee on 28/02/2017.
 */
var express = require("express");
var app = express();
var config = require("./config");

require("./db")(app);
require("./parser")(app);

app.set("superSecret", config.secret);
module.exports = app;
