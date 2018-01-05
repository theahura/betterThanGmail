var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

// lets you access css, js, and img files
app.use(express.static(path.join(__dirname)));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});