var express = require('express');
const fileUpload = require('express-fileupload');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');

var neo4j= require('neo4j-driver').v1;
var http = require("http");

var app = express();

//app.set('view engine', 'ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var donations = require('./routes/donations');
var categories = require('./routes/categories');
var followers = require('./routes/followers');
var search = require('./routes/search');

var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
//app.use(express.static(path.join(__dirname, 'public')));

var driver= neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','amira'));
var session = driver.session();



app.post('/jaide/add',function(req,res){
    res.send(req.body);
    var idUser =req.body.idUser;
    var idPost= req.body.idPost;
    console.log("Post...");
//MATCH (u:User {username:'admin'}), (r:Role {name:'ROLE_WEB_USER'})
//CREATE (u)-[:HAS_ROLE]->(r)
//CREATE (n:User {idUser:"3"});
    session.run('MATCH (u:User {idUser:{idUserParam}}), (p:Post {idPost:{idPostParam}}) CREATE (u)-[:JAIDE]->(p)', {idUserParam: idUser, idPostParam:idPost})
        .then(function(result){
            //res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
})

app.use('/', index);
app.use('/users', users);
app.use('/donations', donations);
app.use('/categories', categories);
app.use('/search',search);
app.use('/followers',followers);
app.use(fileUpload());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});








var listener = app.listen(3000, function(){
    console.log('Express is Listening on port ' + listener.address().port); //Listening on port 8888
});

module.exports = app;
