var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:admin@localhost:7474');




module.exports = db
