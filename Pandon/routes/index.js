var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var multer = require('multer')
var upload = multer({dest: 'public/uploads/'})


var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'posts'});
client.connect(function (err, result) {

    console.log('connected');

});

router.post('/upload', upload.any(), function (req, res, next) {
    res.send(req.files[0].filename);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home');
});
router.get("/login", function (req, res, next) {
    res.render("register");
});
router.get('/contact', function (req, res, next) {
    res.render('contact');
});
router.get("/profile", function (req, res, next) {
    res.render("profile");
});

module.exports = router;

