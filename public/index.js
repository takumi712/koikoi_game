var socketio = io();

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
        document.getElementById("show_name").textContent = month;
        console.log(num);
        return false;
    });
    // page3
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
    socketio.on('game_start',function(){
        SelectPage(5);
    });
    socketio.on('player_disconnect',function(){
        alert('対戦相手が接続を切りました…');
        SelectPage(3);
        socketio.emit('room_leaeve');
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