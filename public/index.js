var socketio = io();

$(function(){
    var name = 'nonename';
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
});