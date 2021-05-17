var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

app.use(express.static('public'));

app.get('/' , function(req, res){
    res.sendFile(__dirname+'/index.html');
});
app.get('/game' , function(req, res){
    res.sendFile(__dirname+'/test.html');
});
app.get('/rules' , function(req, res){
    res.sendFile(__dirname+'/rules.html');
});

io.on('connection',function(socket){
    socket.on('message',function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.on('rename',function(name){
        console.log(name);
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});