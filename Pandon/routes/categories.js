var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser')

var client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'posts'
});
client.connect(function(err, result) {});

router.post('/', function(req, res) {
    client.execute("SELECT * FROM categories;", function(err, result) {
        if (!err) {
            var catName = req.body.name;
            var found = false;
            var i = 0;
            while ((i < result.rows.length) && (!found)) {
                found = result.rows[i].name == catName;
                i++;
            }
            if (!found) {
                client.execute("INSERT INTO categories (id, name) VALUES (now(), '" + catName + "');");
                client.execute("SELECT * FROM categories;", function(err, result) {
                    if (!err) {
                        res.send({
                            "rows": result.rows
                        });
                    } else {
                        callback(0, {});
                    }
                });
            } else {
                res.send({
                    "rows": result.rows
                });
            }
        } else {
            callback(0, {});
        }
    });
})

router.get('/category', function(req, res) {

    const query = 'SELECT * FROM posts.categories WHERE id=' + req.query.category_id;
    client.execute(query, function(err, resCat) {
        res.send(resCat.rows);
    })

});

module.exports = router;
