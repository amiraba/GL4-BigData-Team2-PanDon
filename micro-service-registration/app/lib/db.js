/**
 * Created by Vyndee on 28/02/2017.
 */
var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/users';

module.exports = function(app) {
  mongoose.connect(mongoUrl, {
    mongoose: {
      safe: true
    }
  }, function(err) {
    if (err) {
      return console.log('Mongoose - connection error:', err);
    }
  });


  return mongoose;
};
