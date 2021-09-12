var socketio = io();

var canvas = document.getElementById("canvas_game");
var ctx = canvas.getContext("2d");
canvas.addEventListener('click', onClick, false);

chara = [];
for(i=0;i<49;i++){
    chara[i] = new Image();
}

chara[0].src="image/1-1.png";
chara[1].src="image/1-3.png";
chara[2].src="image/1-41.png";
chara[3].src="image/1-42.png";
chara[4].src="image/2-2.png";
chara[5].src="image/2-3.png";
chara[6].src="image/2-41.png";
chara[7].src="image/2-42.png";
chara[8].src="image/3-1.png";
chara[9].src="image/3-3.png";
chara[10].src="image/3-41.png";
chara[11].src="image/3-42.png";
chara[12].src="image/4-2.png";
chara[13].src="image/4-3.png";
chara[14].src="image/4-41.png";
chara[15].src="image/4-42.png";
chara[16].src="image/5-2.png";
chara[17].src="image/5-3.png";
chara[18].src="image/5-41.png";
chara[19].src="image/5-42.png";
chara[20].src="image/6-2.png";
chara[21].src="image/6-3.png";
chara[22].src="image/6-41.png";
chara[23].src="image/6-42.png";
chara[24].src="image/7-2.png";
chara[25].src="image/7-3.png";
chara[26].src="image/7-41.png";
chara[27].src="image/7-42.png";
chara[28].src="image/8-1.png";
chara[29].src="image/8-2.png";
chara[30].src="image/8-41.png";
chara[31].src="image/8-42.png";
chara[32].src="image/9-2.png";
chara[33].src="image/9-3.png";
chara[34].src="image/9-41.png";
chara[35].src="image/9-42.png";
chara[36].src="image/10-2.png";
chara[37].src="image/10-3.png";
chara[38].src="image/10-41.png";
chara[39].src="image/10-42.png";
chara[40].src="image/11-1.png";
chara[41].src="image/11-2.png";
chara[42].src="image/11-3.png";
chara[43].src="image/11-4.png";
chara[44].src="image/12-1.png";
chara[45].src="image/12-41.png";
chara[46].src="image/12-42.png";
chara[47].src="image/12-43.png";
chara[48].src="image/0.png";
chara[48].onload = ()=>{
    ctx.drawImage(chara[48], 1180, 295, 80, 130);
};

function onClick(e) {
    console.log("click");
    let rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var w = rect.right - rect.left;
    var h = rect.bottom - rect.top;
    x=x/w;
    y=y/h;
    x=x*1280;
    y=y*720;
    for(i=0;i<8;i++){
        if(x<330+(100*i) && 250+(100*i)<x){
            if(y>590&&720>y){
                console.log("あなたが選んだ手札",i);
                socketio.emit('pullOutHands', i);
            }
        }
    }
}

$(function(){
    var name = 'nonename';
    var month = 0;
    

    $('#name_form').submit(function(){
        name = $('#input_name').val();
        $('#input_name').val('');
        document.getElementById("name").textContent = name;
        var a = document.getElementById("name_form");
        var b = document.getElementById("message_form");
        a.style.display = 'none';
        b.style.display = 'block';
        return false;
    });
    $('#message_form').submit(function(){
        var txt; 
        txt = $('#input_msg').val();
        socketio.emit('message', name + " < " + txt);
        $('#input_msg').val('');
        return false;
    });
    socketio.on('message',function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    // page1
    $('#start_btn').on('click',function(){
        name = $('#name_txt').val();
        document.getElementById("show_name").textContent = name;
        console.log(name);
        return false;
    });
    // page2
    $('#mode_btn_pc').on('click',function(){
        color1 = document.form1.mode_combo_kaisu;
        num = color1.selectedIndex;
        if (num == 0){
            month = 12;
        }
        else if( num == 1){
            month = 6;   
        }
        else if( num == 2){
            month = 3;   
        }
        else if( num == 3){
            month = 1;   
        }
        console.log(num);
        return false;
    });
    // page3
    var room_name;
    document.getElementById("create_room_btn").onclick = function(){
    room_name = $('#room_name').val();
        if (room_name != ''){
            socketio.emit('create_room',room_name,name,month);
            document.getElementById("maching_roomname").textContent = room_name;
        }
        else{
            alert('部屋名を入力してください');
        }
    };
    document.getElementById("join_room_btn").onclick = function() {
        room_name = $('#room_name').val();
        if (room_name != ''){
            socketio.emit('join_room',room_name,name);
        }
        else{
            alert('部屋名を入力してください');
        }
    }
    // page4
    document.getElementById("game_agari").onclick = function() {
        document.getElementById("game_popup").style.display = "none";
        socketio.emit('agari');
    }
    document.getElementById("game_koikoi").onclick = function() {
        document.getElementById("game_popup").style.display = "none";
        socketio.emit('koikoi');
    }

    document.getElementById("game_tugi").onclick = function() {
        socketio.emit('startNextGame');
    }
    document.getElementById("go_title").onclick = function() {
        window.location.reload();
    }
    document.getElementById("one_more").onclick = function() {
        socketio.emit('restart');
    }
    socketio.on('restart',function(){
        SelectPage(5);
    });
    
    socketio.on('hidePopUp',function(){
        document.getElementById("game_popup").style.display = "none";
        document.getElementById("game_popup2").style.display = "none";
    });

    socketio.on('create_room_done',function(can_execute){
        if(can_execute){
            SelectPage(4);
        }
        else{
            alert('すでに使用されている部屋名です');
        }
    });
    socketio.on('join_room_done',function(can_execute){
        if(can_execute){
            SelectPage(4);
        }
        else{
            alert('存在のしない部屋名です');
        }
    });
    socketio.on('game_start',function(hostName,guestName){
        document.getElementById("show_name").textContent = hostName + " VS " + guestName;
        SelectPage(5);
    });
    socketio.on('player_disconnect',function(){
        alert('対戦相手が接続を切りました…');
        document.getElementById("show_name").textContent = name;
        SelectPage(3);
        document.getElementById("game_popup").style.display = "none";
        document.getElementById("game_popup2").style.display = "none";
        socketio.emit('room_leaeve');
    });

    socketio.on('koikoiOrAgari',function(){
        document.getElementById("game_popup").style.display = "block";
    });

    socketio.on('interimResult',function(myPoint,enemyPoint,myTotalPoint,enemyTotalPoint,month){
        document.getElementById("game_popup2").style.display = "block";
        document.getElementById("game_pp_title_tuki").textContent = month;
        document.getElementById("my_get").textContent = myPoint;
        document.getElementById("my_point").textContent = myTotalPoint;
        document.getElementById("en_get").textContent = enemyPoint;
        document.getElementById("en_point").textContent = enemyTotalPoint;
        
    });
    
    socketio.on('result', function(month,hostName,guestName,hostTotalPoint,guestTotalPoint){
        document.getElementById( "page_title" ).style.display = 'none';
        document.getElementById( "page_mode" ).style.display = 'none';
        document.getElementById( "page_select" ).style.display = 'none';
        document.getElementById( "page_maching" ).style.display = 'none';
        document.getElementById( "page_game" ).style.display = 'none';
        document.getElementById( "page_result" ).style.display = 'block';
        var hostScore = 0;
        var guestScore = 0;
        for(var i=0;i<hostTotalPoint.length;i++){
            hostScore += hostTotalPoint[i];
        }
        for(var i=0;i<guestTotalPoint.length;i++){
            guestScore += guestTotalPoint[i];
        }

        for(var i=1;i<=hostTotalPoint.length;i++){
            if(i<10){
                $('#result_score').append($('<li>').text('&nbsp;'+i+"月　"+hostTotalPoint[i-1]+"　"+guestTotalPoint[i-1]));
            }
            else{
                $('#result_score').append($('<li>').text(i+"月　"+hostTotalPoint[i-1]+"　"+guestTotalPoint[i-1]));
            }
        }

        document.getElementById("kaisu").textContent = month;
        document.getElementById("player1_name").textContent = hostName;
        document.getElementById("player2_name").textContent = guestName;
        document.getElementById("player1_score").textContent = hostScore;
        document.getElementById("player2_score").textContent = guestScore;
        if(hostScore > guestScore){
            document.getElementById("player_win").textContent = hostName+" の勝ち！";
        }
        else if(guestScore > hostScore){
            document.getElementById("player_win").textContent = guestName+" の勝ち！";
        }
        else{
            document.getElementById("player_win").textContent = "ひきわけ！";

        }

        
    })
    
    socketio.on('updateDraw',function(m_hands,e_hands,field,turn,month){
        var turnPlayer;
        if(turn){
            turnPlayer = "自分の";
        }
        else{
            turnPlayer = "相手の";
        }
        document.getElementById("game_turn").textContent = turnPlayer;
        document.getElementById("game_tuki").textContent = month + "月";
        ctx.clearRect(0,0,1280,720);
        for(i=0;i<m_hands.length;i++){
            ctx.drawImage(chara[m_hands[i]], 250+100*i, 590, 80, 130);
        }
        for(i=0;i<e_hands.length;i++){
            ctx.drawImage(chara[48], 250+100*i, 0, 80, 130);
        }
        if(field[0]!=null){
            ctx.drawImage(chara[field[0]], 520, 210, 80, 130);
        }
        if(field[1]!=null){
            ctx.drawImage(chara[field[1]], 520, 380, 80, 130);
        }
        if(field[2]!=null){
            ctx.drawImage(chara[field[2]], 680, 210, 80, 130);
        }
        if(field[3]!=null){
            ctx.drawImage(chara[field[3]], 680, 380, 80, 130);
        }
        if(field[4]!=null){
            ctx.drawImage(chara[field[4]], 360, 210, 80, 130);
        }
        if(field[5]!=null){
            ctx.drawImage(chara[field[5]], 360, 380, 80, 130);
        }
        if(field[6]!=null){
            ctx.drawImage(chara[field[6]], 840, 210, 80, 130);
        }
        if(field[7]!=null){
            ctx.drawImage(chara[field[7]], 840, 380, 80, 130);
        }
        if(field[8]!=null){
            ctx.drawImage(chara[field[8]], 200, 380, 80, 130);
        }
        if(field[9]!=null){
            ctx.drawImage(chara[field[9]], 200, 210, 80, 130);
        }
        if(field[10]!=null){
            ctx.drawImage(chara[field[10]], 1000, 380, 80, 130);
        }
        if(field[11]!=null){
            ctx.drawImage(chara[field[11]], 1000, 210, 80, 130);
        }
        ctx.drawImage(chara[48], 1180, 295, 80, 130);
    });
    

});
$(function(){
    $('.js-modal-open').on('click',function(){
        $('.js-modal').fadeIn();
        return false;
    });
    $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
    });
});