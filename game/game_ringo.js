
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var var x, y, relX, relY, objX, objY;
      var objWidth, objHeight;
      var dragging = false;

      function init() {
        objWidth = 50;
        objHeight = 50;
        objX = canvas.width / 2 - objWidth / 2;
        objY = canvas.height / 2 - objHeight / 2;

        drawRect();
      }

      function onDown(e) {
        var offsetX = canvas.getBoundingClientRect().left;
        var offsetY = canvas.getBoundingClientRect().top;

        x = e.clientX - offsetX;
        y = e.clientY - offsetY;

        if (objX < x && (objX + objWidth) > x && objY < y && (objY + objHeight) > y) {
          dragging = true;
          relX = objX - x;
          relY = objY - y;
        }
      }

      function onMove(e) {
        var offsetX = canvas.getBoundingClientRect().left;
        var offsetY = canvas.getBoundingClientRect().top;

        x = e.clientX - offsetX;
        y = e.clientY - offsetY;

        if (dragging) {
          objX = x + relX;
          objY = y + relY;
          drawRect();
        }
      }

      function onUp(e) {
        dragging = false;
      }
  
      function drawRect() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(objX, objY, objWidth, objHeight);
      }

      canvas.addEventListener('mousedown', onDown, false);
      canvas.addEventListener('mousemove', onMove, false);
      canvas.addEventListener('mouseup', onUp, false);