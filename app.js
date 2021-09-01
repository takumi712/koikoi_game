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

var game_list = [];
room_list = [];
used_room_list = [];

Deck = [11,13,14,15,22,23,24,25,31,33,34,35,42,43,44,45,52,53,54,55,62,63,64,65,72,73,74,75,81,82,84,85,92,93,94,95,102,103,104,105,111,112,114,115,121,124,125,126];

const koikoiGame = class {
    constructor(room_name, name, month){
        this.month = month;
        hostName = name;
        guestName;
        m_hands = []
        e_hands = []
        field = [];
        m_yaku=[]
        e_yaku=[]
        m_point=0;
        e_point=0;
        c=0;
        l=0;
        img_Deck = []
        var i;
        for(i=0;i<48;i++){
            img_Deck[i] = i;
        }
        m_hands = hudaseisaku();
        e_hands = hudaseisaku();
    }
    field_push(fp){
        for(i=0;i<12;i++){
            if(field[i]==null){
                field[i]=fp;
                break;
            }
        }
    }
    hudaseisaku(){
        hands = [];
        tuki_check=[0,0,0,0,0,0,0,0,0,0,0,0,0];
        while (hands.length < 8) {
            n = img_Deck.length;//山札の枚数
            k = Math.floor(Math.random() * n);//山札の枚数をもとに乱数生成
        
            hands.push(img_Deck[k]);//札を増やす
            img_Deck.splice(k, 1);//山札から減らす
        }
        for(i=0;i<8;i++){
            x = Deck[hands[i]]/10|0;
            tuki_check[x] += 1;
            if(tuki_check[x]==4){
                for(j=0;j<8;j++){
                    img_Deck.push(hands[j]);
                }
                hands.splice(0,8);
                console.log("手四で自札再制作！");
                hudaseisaku();
                break;
            }
            if(tuki_check[x]==2){
                kuttuki=0;
                for(k=0;k<13;k++){
                    if(tuki_check[k]==2){
                        kuttuki++;
                        if(kuttuki==4){
                            for(j=0;j<8;j++){
                                img_Deck.push(hands[j]);
                            }
                            hands.splice(0,8);
                            console.log("くっつきで自札再制作！");
                            hudaseisaku();
                            break;
                        }
                    }
                }
            }  
        }
        return hands;
    }
    bahudaseisaku(){
        while (field.length < 8) {
            n = img_Deck.length;
            k = Math.floor(Math.random() * n);
            field_push(img_Deck[k]);
            img_Deck.splice(k, 1);
        }
        tuki_check=[0,0,0,0,0,0,0,0,0,0,0,0,0];
        for(i=0;i<8;i++){
            x = Deck[field[i]]/10|0;
            tuki_check[x] += 1;
            if(tuki_check[x]==3){
                for(j=0;j<8;j++){
                    if(field[j]!=null){
                        img_Deck.push(field[j]);
                    }
                }
                console.log("場札再制作！");
                field = [];
                bahudaseisaku();
                break;
            }
        }
    }
}

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
        }
        else{
            io.to(id).emit('create_room_done', false);
        }
    });
    socket.on('join_room',function(room_name){
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