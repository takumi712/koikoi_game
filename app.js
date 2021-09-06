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
Deck = [];

Deck_yaku = [11,13,14,15,22,23,24,25,31,33,34,35,42,43,44,45,52,53,54,55,62,63,64,65,72,73,74,75,81,82,84,85,92,93,94,95,102,103,104,105,111,112,114,115,121,124,125,126];
for(i=0;i<48;i++){
    Deck[i] = i;
}

io.on('connection',function(socket){
    function tehudaseisaku(room_name,isHost){
        var hands;
        if(isHost){
            hands = "hostHands";
        }
        else{
            hands = "guestHands";
        }
        while (game_object[room_name][hands].length < 8) {
            n = game_object[room_name].deck.length;//山札の枚数
            k = Math.floor(Math.random() * n);//山札の枚数をもとに乱数生成
        
            game_object[room_name][hands].push(game_object[room_name].deck[k]);//札を増やす
            game_object[room_name].deck.splice(k, 1);//山札から減らす
        }
        tuki_check=[0,0,0,0,0,0,0,0,0,0,0,0,0];
        for(i=0;i<8;i++){
            x = Deck_yaku[game_object[room_name][hands][i]]/10|0;
            tuki_check[x] += 1;
            if(tuki_check[x]==4){
                for(j=0;j<8;j++){
                    game_object[room_name].deck.push(game_object[room_name][hands][j]);
                }
                game_object[room_name][hands].splice(0,8);
                // console.log("手四で自札再制作！");
                tehudaseisaku(room_name,isHost);
                break;
            }
            if(tuki_check[x]==2){
                kuttuki=0;
                for(k=0;k<13;k++){
                    if(tuki_check[k]==2){
                        kuttuki++;
                        if(kuttuki==4){
                            for(j=0;j<8;j++){
                                game_object[room_name].deck.push(game_object[room_name][hands][j]);
                            }
                            game_object[room_name][hands].splice(0,8);
                            console.log("くっつきで自札再制作！");
                            tehudaseisaku(room_name,isHost);
                            break;
                        }
                    }
                }
            }  
        }
    };
    function bahudaseisaku(room_name){
        while (game_object[room_name].field.length < 8) {
            n = game_object[room_name].deck.length;
            k = Math.floor(Math.random() * n);
            field_push(game_object[room_name].deck[k],room_name);
            game_object[room_name].deck.splice(k, 1);
        }
        tuki_check=[0,0,0,0,0,0,0,0,0,0,0,0,0];
        for(i=0;i<8;i++){
            x = Deck_yaku[game_object[room_name].field[i]]/10|0;
            tuki_check[x] += 1;
            if(tuki_check[x]==3){
                for(j=0;j<8;j++){
                    if(game_object[room_name].field[j]!=null){
                        game_object[room_name].deck.push(game_object[room_name].field[j]);
                    }
                }
                console.log("場札再制作！");
                game_object[room_name].field = [];
                bahudaseisaku(room_name);
                break;
            }
        }
    };
    function field_push(fp,room_name){
        for(i=0;i<12;i++){
            if(game_object[room_name].field[i]==null){
                game_object[room_name].field[i]=fp;
                break;
            }
        }
    };
    function initGame(room_name){
        //変数初期化
        var Deck = [];
        for(i=0;i<48;i++){
            Deck[i] = i;
        }
        game_object[room_name].deck = Deck;
        game_object[room_name].field = [];
        game_object[room_name].hostHands = [];
        game_object[room_name].guestHands = [];
        game_object[room_name].hostYaku = [];
        game_object[room_name].guestYaku = [];

        //ホスト側の手札作成
        tehudaseisaku(room_name,true);
        //ゲスト側の手札作成
        tehudaseisaku(room_name,false);
        //場札作成
        bahudaseisaku(room_name);
    }
    socket.on('create_room',function(room_name,name,month){
        var id = socket.id;
        var find_room;
        var turn;
        var Deck = [];
        for(i=0;i<48;i++){
            Deck[i] = i;
        }
        find_room = room_list.indexOf(room_name);
        find_used_room = used_room_list.indexOf(room_name);
        if(find_room == -1 && find_used_room == -1){
            socket.join(room_name);
            console.log(id + " joined " + room_name)
            room_list.push(room_name);
            console.log(room_list);
            io.to(id).emit('create_room_done', true);
            
            //先行後攻決め
            if(0 == Math.floor(Math.random()*2)){
                turn = true;
            }
            else{
                turn = false;
            }

            game_object[room_name] = ({
                hostId:id,
                hostName:name,
                guestName:null,
                guestId:null,
                month:month,
                countMonth:0,
                isHostTurn:turn,
                deck:Deck,
                field:[],
                hostHands:[],
                guestHands:[],
                hostYaku:[],
                guestYaku:[],
                hostPoint:0,
                guestPoint:0
            });

            console.log(game_object);
            initGame(room_name);
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
            io.to(room_name).emit('game_start',game_object[room_name].hostName,name);
            console.log(id + " joined " + room_name);
            game_object[room_name].guestId = (id);
            game_object[room_name].guestName = (name);
            io.to(id).emit('updateDraw', game_object[room_name].guestHands,game_object[room_name].hostHands,game_object[room_name].field);
            io.to(game_object[room_name].hostId).emit('updateDraw', game_object[room_name].hostHands,game_object[room_name].guestHands,game_object[room_name].field);

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
            delete game_object[room_name];
        }
    });
    socket.on("disconnect",function(){
        console.log(socket.id + ' is disconnect');
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});