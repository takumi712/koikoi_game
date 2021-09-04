const { verify } = require('crypto');
var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;


app.use(express.static('public'));

app.get('/' , function(req, res){
    res.sendFile(__dirname+'/main.html');
});

var game_object = new Object();
room_list = [];
used_room_list = [];

Deck = [11,13,14,15,22,23,24,25,31,33,34,35,42,43,44,45,52,53,54,55,62,63,64,65,72,73,74,75,81,82,84,85,92,93,94,95,102,103,104,105,111,112,114,115,121,124,125,126];


io.on('connection',function(socket){
    socket.on('create_room',function(room_name,name,month){
        var id = socket.id;
        var find_room;
        find_room = room_list.indexOf(room_name);
        find_used_room = used_room_list.indexOf(room_name);
        if(find_room == -1 && find_used_room == -1){
            socket.join(room_name);
            console.log(id + " joined " + room_name)
            room_list.push(room_name);
            console.log(room_list);
            io.to(id).emit('create_room_done', true);
            game_object[room_name] = ({
                hostId:id,
                hostName:name,
                gestName:null,
                gestId:null,
                month:month,
                countMonth:0,
                isHostTurn:true,
                deck:null,
                field:null,
                hostHands:null,
                gestHands:null,
                hostYaku:null,
                gestYaku:null,
                hostPoint:0,
                gestPoint:0
            });
        }
        else{
            io.to(id).emit('create_room_done', false);
        }
    });
    socket.on('join_room',function(room_name,name){
        var id = socket.id;
        var find_room;
        find_room = room_list.indexOf(room_name);

        if(find_room == -1){
            io.to(id).emit('join_room_done', false);
        }
        else{
            socket.join(room_name);
            room_list.splice(find_room,1);
            used_room_list.push(room_name);
            io.to(id).emit('join_room_done', true);
            io.to(room_name).emit('game_start');
            console.log(id + " joined " + room_name);
            game_object[room_name].gestId = (id);
            game_object[room_name].gestName = (name);
            console.log(game_object)
        }
    });
    socket.on('message',function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.on('room_leaeve',function(){
        var myArr = Array.from(socket.rooms.values());
        var room_name = myArr[1];
        socket.leave(room_name);
    });
    socket.on("disconnecting", (reason) => {
        var find_room;
        var find_used_room;
        var room_name;
        var myArr = Array.from(socket.rooms.values());
        if(myArr.length >= 2){
            room_name = myArr[1];
            find_room = room_list.indexOf(room_name);
            if(find_room != -1){
                room_list.splice(find_room,1);
            }
            find_used_room = used_room_list.indexOf(room_name);
            used_room_list.splice(find_used_room,1);
            socket.leave(room_name);
            io.to(room_name).emit('player_disconnect');
        }
    });
    socket.on("disconnect",function(){
        console.log(socket.id + ' is disconnect');
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});