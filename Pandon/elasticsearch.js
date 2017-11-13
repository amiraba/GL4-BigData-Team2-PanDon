var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

/*elasticClient.deleteByQuery({
        index: 'posts',
        type: 'posts',
        body: {
           query: {
               "match_all" : {}
           }
        }
    }, function (error, response) {
        console.log(response);
    });*/



var indexName = "posts";
if (!indexExists())
{elasticClient.indices.create({
    index: indexName
},function(err,resp,status) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("created",resp);
    }
});
}

module.exports = elasticClient
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;