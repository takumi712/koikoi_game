var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

app.use(express.static('public'));

app.get('/' , function(req, res){
    res.sendFile(__dirname+'/main.html');
});

room_list = [];

io.on('connection',function(socket){
    socket.on('create_room',function(room_name){
        var find_room;
        find_room = room_list.indexOf(room_name);
        if(find_room == -1){
            socket.join(room_name);
            console.log(room_name + " to join")
            room_list.push(room_name);
            console.log(room_list)
            io.emit('create_room_done', true);
        }
        else{
            io.emit('create_room_done', false);
        }
    });
    socket.on('join_room',function(room_name){
        var find_room;
        find_room = room_list.indexOf(room_name);

        if(find_room == -1){
            io.emit('join_room_done', false);
        }
        else{
            socket.join(room_name);
            room_list.splice(find_room,1);
            io.emit('join_room_done', true);
            console.log(room_name + " to join")
        }

    });
    socket.on('message',function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});