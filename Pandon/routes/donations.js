var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser')
var elasticclient = require('../elasticsearch');
var MongoClient = require('mongodb').MongoClient;
var users;


var client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'posts'
});
client.connect(function (err, result) {
});

router.get('/add', function (req, res, next) {
        client.execute("SELECT * FROM categories;", function (err, result) {
            if (!err) {
                res.render('askForDonation', {
                    "rows": result.rows
                });
            } else {
                callback(0, {});
            }
        });
    }
);

router.get('/', function (req, res) {

    const queryPosts = 'SELECT * FROM posts.posts';
    getAllUsers(function () {

        client.execute(queryPosts, function (err, resPosts) {
            res.send(resPosts.rows);
        })

    })

});

var getAllUsers = function (callback) {
    // Connect to mongo db
    MongoClient.connect("mongodb://localhost:27017/pandon", function (err, db) {

        db.collection('users', function (err, collection) {
            collection.find().toArray(function (err, items) {
                users = items;
                callback();
            });

        });

    });

}

router.get('/user', function (req, res) {

    getAllUsers(function () {

        var j = 0;
        while ((j < users.length)) {
            if (users[j].id == req.query.user_id)
                res.send(users[j]);
            j++;
        }

    })

});


router.post('/', function (req, res) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }

    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    client.execute("INSERT INTO posts (id, title, adress, category_id, description, media_path,user_id, time) VALUES (now(), '" + req.body.title + "', '" + req.body.adress + "', " + req.body.category + ", '" + req.body.description + "', '" + req.body.media + "', '" + JSON.parse(localStorage.getItem("user"))._id + "', '" + dateTime + "');");
    client.execute('SELECT name FROM  categories WHERE id= ?', [req.body.category], function (err, result) {
        if (err) {
            res.status(404).send({msg: err});
        } else {

            if (second.toString().length == 1) {
                var second = '0' + second;
            }
            var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
            client.execute("INSERT INTO posts (id, title, adress, category_id, description, media_path,user_id, time) VALUES (now(), '" + req.body.title + "', '" + req.body.adress + "', " + req.body.category + ", '" + req.body.description + "', '" + req.body.media + "', '" + JSON.parse(localStorage.getItem("user"))._id + "', '" + dateTime + "');");
            client.execute('SELECT name FROM  categories WHERE id= ?', [req.body.category], function (err, result) {
                if (err) {
                    res.status(404).send({
                        msg: err
                    });
                } else {
                    category = result.rows[0];
                    elasticclient.index({
                        index: 'posts',
                        type: 'posts',
                        body: {
                            "title": req.body.title,
                            "category": category,
                            "adress": req.body.adress,
                            "description": req.body.description,
                            "image": req.body.image,
                            "timestamp": dateTime,
                        }
                    }, function (err, resp, status) {
                        console.log(resp);
                    });

                }
            });


            res.redirect('/');
        }
    })

});
module.exports = router;

