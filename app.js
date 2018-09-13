var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoDB = require('./mongoDB');
var ObjectId = require('mongodb').ObjectID;
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoDB.connectToServer( function( err ) {
  console.log('Connection Successfull.');
});

io.on('connection', function(socket){
  // console.log('a user connected');
  // socket.on('disconnect', function(){
  // 	console.log('user disconnected.');
  // });
  socket.on('Chatting', function(msg){
  	// console.log('Message: '+msg);
  	io.emit('Chatting', msg);
    var saveMessage = {
      sender: "Hello",
      text: msg,
      timestamp: new Date()
    }
    var DB = mongoDB.getDb();
    DB.collection('GroupChatting').insert(saveMessage, function(err, result){
        if(err) console.log(err);
        else console.log(result);
    });
  });
  socket.on('startTyping', function(status){
  	// console.log('status: '+status);
  	io.emit('startTyping', status);
  });
  socket.on('stopTyping', function(status){
  	// console.log('status: '+status);
  	io.emit('stopTyping', status);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
