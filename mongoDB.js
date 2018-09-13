var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'tuts';
var _db = {};

module.exports = {
	connectToServer: function( callback ) {
		MongoClient.connect(url , { useNewUrlParser: true }, function(err, db){
	      _db = db.db(dbName);
	      return callback( err );
	    } );
	},
	getDb: function(){
		return _db;
	}
};
