var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var elasticclient = require('../elasticsearch');

var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'posts' });
client.connect(function (err, result) {
});

var getAllPosts = 'SELECT * FROM  posts ';
var getPostByTitle = 'SELECT * FROM  posts WHERE title= ? ';

var getAllCategories = 'SELECT * FROM  categories';



router.get('/', function (req, res, next) {
   var categories =  [];
   client.execute(getAllCategories,[],function (err,resultCategories) {
      if(err)
       {
           res.status(404).send({msg : err});
       }
       else{

          categories = resultCategories.rows;
          elasticclient.search({
    index: 'posts',
    type: 'posts',
    body: {
      "query": {
        "match_all": {}
      }
    },
  }
    , function (error, response, status) {
      if (error) {
        console.log("search error: " + error)
      }
      else {
        var i = 0;
        var posts = [];
        var j = 0;
        response.hits.hits.forEach(function (hit) {
          posts[i] = hit._source;
          i++;
        });
      }
      res.render('search', {
        posts: posts, categories: categories
      });

    });
           

  } 
});

  



});


router.post('/run', function (req, res, next) {

  var title = req.body.title;
  var category_name = req.body.category;
  var adresse = req.body.adresse;
  var categories =  [];
  client.execute(getAllCategories,[],function (err,resultCategories) {
      if(err)
       {
           res.status(404).send({msg : err});
       }
       else{

          categories = resultCategories.rows;
   if ((title != "") && (category_name == undefined)) {
    console.log('cas 2');
    console.log(title);
    elasticclient.search({
      index: 'posts',
      type: 'posts',
      body: {
               "query": {
                 "bool": {
                   "must": 
                     {
                "prefix" : { "title" : title }
            }
        }

    }


      },
    }
      , function (error, response, status) {
        if (error) {
          console.log("search error: " + error)
        }
        else {
          var i = 0;
          var posts = [];
          console.log(response.hits);
          response.hits.hits.forEach(function (hit) {
            posts[i] = hit._source;
            console.log(hit._source);
            i++;

          })

        }
        res.render('search', {
          posts: posts, categories: categories
        });
      });


  }
  else if ((title != "") && (category_name != undefined)) {
    elasticclient.search({
      index: 'posts',
      type: 'posts',
      body: {
        "query": {
          "bool": {
            "must": [
              { "match": { "title": title } },
              { "match": { "category.name": category_name } },
            ]
          }
        }


      },
    }
      , function (error, response, status) {
        if (error) {
          console.log("search error: " + error)
        }
        else {

          var i = 0;
          var posts = [];
          response.hits.hits.forEach(function (hit) {
            posts[i] = hit._source;
            i++;      
          })
        }
        res.render('search', {
          posts: posts, categories: categories
        });
      });
  }

  else if ((title === "") && (category_name != undefined)) {
    elasticclient.search({
      index: 'posts',
      type: 'posts',
      body: {
         "query": {
         "bool": {
            "must": 
            {
                "match" : {
                    "category.name" : {
                        "query":category_name,
                        "operator":"and"
                    }
                }
            }
        }

    }
      },
    }
      , function (error, response, status) {
        if (error) {
          console.log("search error: " + error)
        }
        else {
          var i = 0;
          var posts = [];
          response.hits.hits.forEach(function (hit) {
            posts[i] = hit._source;
            i++;
      
          })
        }
        res.render('search', {
          posts: posts, categories: categories
        });
      });

  }    
           

  } 
});



  




}

);


module.exports = router;
