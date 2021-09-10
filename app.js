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
    function turn(hand,hands,yaku,room_name){
        p2=0;
        pick=Deck_yaku[game_object[room_name][hands][hand]];
    
        f=game_object[room_name].field.length;
        check=0;
        check_card=[3];
        //場札の数だけ繰り返す
        step=0;
    
        for(step=0;step<f;step++){
            //指定中の場札が選択された手札と10で割ったときの商が同じかどうか
            if((Deck_yaku[game_object[room_name].field[step]] / 10 | 0)==(pick / 10 | 0)){
                check_card[check]=step;
                check++;
            }
        }
    
        //0だったら場札を増やすのみ
        if(check==0){
            field_push(game_object[room_name][hands][hand],room_name);
        }
        //1だったらとる
        else if(check==1){
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name].field[check_card[0]]]);
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name][hands][hand]]);
            game_object[room_name].field[check_card[0]]=null;
        }
        else if(check==2){
            //出す手札の番号をもらう処理を書く(p2に入れる)
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name].field[check_card[p2]]]);
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name][hands][hand]]);
            game_object[room_name].field[check_card[p2]]=null;
        }
        
        game_object[room_name][hands].splice(hand, 1);
    }
    function　turn_yama(yaku,room_name){
        p2=0;
        //山札処理
        n = game_object[room_name].deck.length;
        k = Math.floor(Math.random() * n);//山札の枚数をもとに乱数生成
        f=　game_object[room_name].field.length;
        check=0;
        check_card=[3];
        //場札の数だけ繰り返す
        step=0;
    
        for(step=0;step<f;step++){
            //指定中の場札が選択された手札と10で割ったときの商が同じかどうか
            if((Deck_yaku[game_object[room_name].field[step]] / 10 | 0)==(Deck_yaku[game_object[room_name].deck[k]] / 10 | 0)){
                check_card[check]=step;
                check++;
            }
        }
    
        //0だったら場札を増やすのみ
        if(check==0){
            field_push(game_object[room_name].deck[k],room_name);
        }
        //1だったらとる
        else if(check==1){
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name].field[check_card[0]]]);
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name].deck[k]]);
            game_object[room_name].field[check_card[0]]=null;
        }
        else if(check==2){
            //出す手札の番号をもらう処理を書く(pに入れる)
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name].field[check_card[p2]]]);
            game_object[room_name][yaku].push(Deck_yaku[game_object[room_name].deck[k]]);
            game_object[room_name].field[check_card[p2]]=null;
        }
        game_object[room_name].deck.splice(k, 1);
    
    }
    function yaku_check(yaku,point,room_name){
        gokou=[]
        gokou_p=0;
        tane=[]
        tane_p=0;
        inosika=[]
        inosika_p=0;
        tan=[]
        tan_p=0;
        aka=[]
        aka_p=0;
        ao=[]
        ao_p=0;
        kasu=[]
        kasu_p=0;
        //札分け
        for(i=0;i<game_object[room_name][yaku].length;i++){
            //20点札
            if(game_object[room_name][yaku][i]%10==1){
                gokou.push(game_object[room_name][yaku][i]);
            }
            //10点札
            else if(game_object[room_name][yaku][i]%10==2){
                tane.push(game_object[room_name][yaku][i]);
                //猪鹿蝶
                if((game_object[room_name][yaku][i]/10|0)==6||(game_object[room_name][yaku][i]/10|0)==7||(game_object[room_name][yaku][i]/10|0)==10){
                    inosika.push(game_object[room_name][yaku][i]);
                }
            }
            //5点札
            else if(game_object[room_name][yaku][i]%10==3){
                tan.push(game_object[room_name][yaku][i]);
                //赤短
                if((game_object[room_name][yaku][i]/10|0)==1||(game_object[room_name][yaku][i]/10|0)==2||(game_object[room_name][yaku][i]/10|0)==3){
                    aka.push(game_object[room_name][yaku][i]);
                }
                //青短
                else if((game_object[room_name][yaku][i]/10|0)==6||(game_object[room_name][yaku][i]/10|0)==9||(game_object[room_name][yaku][i]/10|0)==10){
                    ao.push(game_object[room_name][yaku][i]);
                }
            }
            //カス
            else{
                kasu.push(game_object[room_name][yaku][i]);
            }
        }
        //チェック
        //三光、雨入りチェック
        if(gokou.length==3){
            for(i=0;i<3;i++){
                if(gokou[i]==111){
                    break;
                }
                gokou_p++;
            }
        }
        //四光、雨入りチェック
        else if(gokou.length==4){
            for(i=0;i<4;i++){
                if(gokou[i]==111){
                    gokou_p+=10;
                }
                gokou_p++;
            }
        }
        //五光確定
        else if(gokou.length==5){
            gokou_p=5;
        }
        //五光計算
        if(gokou_p<3){
            gokou_p=0;
        }
        else if(gokou_p==3){
            gokou_p=5;
        }
        else if(gokou_p==14){
            gokou_p=7;
        }
        else if(gokou_p==4){
            gokou_p=8;
        }
        else if(gokou_p==5){
            gokou_p=10;
        }
        //タネ計算
        if(tane.length>=5){
            tane_p=tane.length-4;
        }
        //猪鹿蝶計算
        if(inosika.length==3){
            inosika_p=5;
        }
        //短冊計算
        if(tan.length>=5){
            tan_p=tan.length-4;
        }
        //赤短計算
        if(aka.length==3){
            aka_p=5;
        }
        //青短計算
        if(ao.length==3){
            ao_p=5;
        }
        //カス計算
        if(kasu.length>=10){
            kasu_p=kasu.length-9;
        }
        kei=gokou_p+tane_p+inosika_p+tan_p+aka_p+ao_p+kasu_p;
        if(kei!=game_object[room_name][point]){
            game_object[room_name][point]=kei;
        }
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
                currentMonth:1,
                isHostTurn:turn,
                deck:Deck,
                field:[],
                hostHands:[],
                guestHands:[],
                hostYaku:[],
                guestYaku:[],
                hostPoint:[],
                guestPoint:[]
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
            io.to(id).emit('updateDraw', game_object[room_name].guestHands,game_object[room_name].hostHands,game_object[room_name].field,!game_object[room_name].isHostTurn,game_object[room_name].currentMonth);
            io.to(game_object[room_name].hostId).emit('updateDraw', game_object[room_name].hostHands,game_object[room_name].guestHands,game_object[room_name].field,game_object[room_name].isHostTurn,game_object[room_name].currentMonth);


            console.log(game_object);
        }
    });
    socket.on('pullOutHands',function(hand){
        var id = socket.id;
        var isHost = true;
        var hands;
        var yaku;
        var point;
        var myArr = Array.from(socket.rooms.values());
        room_name = myArr[1];

        if(id == game_object[room_name].hostId){
            isHost = true;
            hands = "hostHands";
            yaku = "hostYaku";
            point = "hostPoint";
        }
        else{
            isHost = false;
            hands = "guestHands";
            yaku = "guestYaku";
            point = "guestPoint";
        }
        
        if(isHost == game_object[room_name].isHostTurn){
            console.log("hand = " + hand);
            console.log("hands = " + hands);
            console.log("yaku = " + yaku);
            
            turn(hand,hands,yaku,room_name);
            turn_yama(yaku,room_name);
            yaku_check(yaku,point,room_name);
            io.to(game_object[room_name].guestId).emit('updateDraw', game_object[room_name].guestHands,game_object[room_name].hostHands,game_object[room_name].field,game_object[room_name].isHostTurn,game_object[room_name].currentMonth);
            io.to(game_object[room_name].hostId).emit('updateDraw', game_object[room_name].hostHands,game_object[room_name].guestHands,game_object[room_name].field,!game_object[room_name].isHostTurn,game_object[room_name].currentMonth);
            game_object[room_name].isHostTurn = !game_object[room_name].isHostTurn
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