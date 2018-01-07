

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});

var entities = require('./server/gamentities.js');
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

var SOCKET_LIST = {};

var DEBUG = false;

//start listening to socket
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    entities.Player.onConnect(socket);

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        entities.Player.onDisconnect(socket);
    });

		socket.on('sendMsgToServer',function(data){
         var playerName = ("" + socket.id).slice(2,7);
         for(var i in SOCKET_LIST){
             SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
         }
     });

     socket.on('evalServer',function(data){
         if(!DEBUG)
             return;
         var res = eval(data);
         socket.emit('evalAnswer',res);
     });


});

setInterval(function(){
    var pack = {
        player:entities.Player.update(),
        bullet:entities.Bullet.update(),
    };

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions',pack);
    }
},1000/25);
