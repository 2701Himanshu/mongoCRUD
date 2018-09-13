var express = require('express');
var router = express.Router();
var mongoDB = require('../mongoDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/getMessageList', function(req, res, next) {
	var DB = mongoDB.getDb();
  	DB.collection('GroupChatting').find().toArray(function(err, result){
	  	if(err) res.send(err);
	  	else res.send(result);
	});
});

router.get('/removeChatHistory', function(req, res, next) {
	var DB = mongoDB.getDb();
  	DB.collection('GroupChatting').remove(function(err, result){
	  	if(err) res.send(err);
	  	else res.send(result);
	});
});

module.exports = router;
