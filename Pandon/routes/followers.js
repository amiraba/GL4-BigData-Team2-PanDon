var express = require('express');
var router = express.Router();
var neo4jclient = require('../neo4j');


router.get('/follow', function (req, res, next) {


    //MERGE SI CA N EXISTE PAS ON LE CREE
    neo4jclient.cypher({
        query: 'MERGE (n:User {name: {name}, id: {id} })',
        params: {
            name: 'Sarah Cruiz',
            id: '1'
        },
    }, function (err, results) {
        if (err) throw err;
    });

    neo4jclient.cypher({
        query: 'MERGE (n:User {name: {name}, id: {id} })',
        params: {
            name: 'Lilia Sfaxi',
            id: '2'
        },
    }, function (err, results) {
        if (err) throw err;
    });

    neo4jclient.cypher({
        query: 'MATCH (a:User {id:{ida}}), (b:User {id:{idb}}) CREATE (a)-[:Follow {state : 1}]->(b)',
        params: {
            ida: '1',
            idb: '2',
        },
    }, function (err, results) {
        if (err) throw err;
    });

// Sa doit devenir le lien de la requete precedente
 res.redirect('/');
});

router.get('/unfollow', function (req, res, next) {


    neo4jclient.cypher({
        query: 'MATCH (a:User {id:{ida}}), (b:User {id:{idb}}),(a)-[r:Follow{state : 1}]->(b) SET r.state={newstate}',
        params: {
            ida: '1',
            idb: '2',
            newstate: '0'
        },
    }, function (err, results) {
        if (err) throw err;
    });

// Sa doit devenir le lien de la requete precedente
    res.redirect('/');
});



module.exports = router;