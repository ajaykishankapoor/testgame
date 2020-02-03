var socket = io();
socket.on('message', function(data) {
  //console.log(data);
  //document.getElementById("test1").innerHTML =  data;
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  firing: false,
  thetaClock: 0,
  thetaAntiClock: 0,
  obstacleHit: false,
  id: "",
  startGame: "no",
  canvasSize: 2
  //ammoRemaining: 10
}

var windowMovement = {
  up: false, down: false, right: false, left: false
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // A
      movement.left = true;
      event.preventDefault();
      windowMovement.left = true; windowMovement.right = false; windowMovement.up = false; windowMovement.down = false;
      break;
    case 38: // W
      movement.up = true;
      event.preventDefault();
      windowMovement.left = false; windowMovement.right = false; windowMovement.up = true; windowMovement.down = false;
      break;
    case 39: // D
      movement.right = true;
      event.preventDefault();
      windowMovement.left = false; windowMovement.right = true; windowMovement.up = false; windowMovement.down = false;
      break;
    case 40: 
      movement.down = true;
      event.preventDefault();
      windowMovement.left = false; windowMovement.right = false; windowMovement.up = false; windowMovement.down = true;
      break;
    case 65: // A
      movement.firing = true;
      break;
    case 83: // S
      movement.show = true;
      break;
    case 68: // D 68
      movement.delete = true;
      break;
    case 88: // Z
      movement.thetaClock = true;
      break;
    case 90: // X
      movement.thetaAntiClock = true;
      break;
    case 72: // H
      movement.heatSeeker = true;
      break;
    case 70: // F
      movement.flares = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // A 65
      movement.left = false;
      obstacleHit = false;
      break;
    case 38: // W 87
      movement.up = false;
      obstacleHit = false;
      break;
    case 39: // D 68
      movement.right = false;
      obstacleHit = false;
      break;
    case 40: // S 83
      movement.down = false;
      obstacleHit = false;
      break;
    case 65: // A
      movement.firing = false;
      //movement.consumed = false;
      break;
    case 83: // S
      movement.show = false;
      break;
    case 68: // D 68
      movement.delete = false;
      break;
    case 88: // Z
      movement.thetaClock = false;
      break;
    case 90: // X
      movement.thetaAntiClock = false;
      break;
    case 72: // H
      movement.heatSeeker = false;
      break;
    case 70: // F
      movement.flares = false;
      break;
  }
});


//getCookie("players", "cookie_name");
/*function getCookie(cookie1, cookie2) {
  var cookieString = document.cookie.replace(/;/g, "");
  if(cookieString.indexOf(cookie1) > cookieString.indexOf(cookie2) ){
    var res = cookieString.slice(cookieString.indexOf(cookie1) ).trim();
    document.getElementById('test2').innerHTML = res;
  }
  if(cookieString.indexOf(cookie1) < cookieString.indexOf(cookie2) ){
    var res = cookieString.slice(cookieString.indexOf(cookie1), cookieString.indexOf(cookie2) ).trim();
    document.getElementById('test2').innerHTML = res;
  }
  return res;
}*/


//if(document.cookie != "players=1; cookie_name=ajaykishankapoor%40gmail.com"){
if(!checkCookie()){
  socket.emit('new player');
  document.cookie = "players=1";
  //document.cookie = "gameCreated=true";
  //setInterval(function() {document.cookie = "players=1";}, 1000);
}
function checkCookie(){
  var cookieString = document.cookie;
  if(cookieString.indexOf("players") > -1 ) {
    deleteCookie();
    document.getElementById('canvas').style.display = "none";
    //window.location.href = "http://http://localhost:8012/login.html";
    return true;
  }
}
function checkPageRefresh() {
  var cookieString = document.cookie;
  if(cookieString.indexOf("players") > -1 ) {
    deleteCookie();
  }
}
function deleteCookie(){
  document.cookie = "cookie_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "players=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //document.cookie = "gameCreated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

setInterval(function() {
  socket.emit('movement', movement);
  //socket.emit('firing', firing);
}, 1000 / 60);

//var usersArray = [];

/*var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
*/
      var w = window.innerWidth;
      var h = window.innerHeight;
      var canvas = document.getElementById("canvas");
      canvas.width = w * movement.canvasSize;
      canvas.height = h * movement.canvasSize;
      document.getElementById("test1").innerHTML = canvas.width;

      var container = document.getElementById("container").style.width = w * movement.canvasSize;
      var container = document.getElementById("container").style.height = h * movement.canvasSize;

      if(canvas.width > w) {
        scrollWindow("right");
      }
      if(canvas.width > h) {
        scrollWindow("down");
      }
   
document.cookie = "canvasDim=" + canvas.width + "," + canvas.height;

var obstaclesCoord = [];

var i = 0;
  socket.on('state', function(characters/*players*/) {
  //context.clearRect(0, 0, 800, 600);
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  var players, enemyTanks;
  for(var j = 0; j < characters.length; j++) {
    players = characters[0];
    enemyTanks = characters[1];
  }

  //------------------Enemy Tanks Movements------------------//
  for (var i in enemyTanks) {
    var enemyTank = enemyTanks[i];
    context.shadowBlur = 0;
    context.shadowColor = "transparent";
    var enemyTankLight = new createPlayer();
    enemyTankLight.present(enemyTank.tankLight, enemyTank.tankLight.color); 
    if(enemyTank.tankLight.hit == true) {
      enemyTankLight.present(enemyTank.tankLight, "rgb(30, 30, 30"); 
    }

    context.beginPath();
    context.arc(enemyTank.tankLight.fire.x, enemyTank.tankLight.fire.y, 40/8, 0, 2 * Math.PI);
    context.stroke();
    context.fillStyle = enemyTank.tankLight.color;
    context.fill();
    context.closePath();

    if(enemyTank.tankLight.heatSeeker) {
      context.beginPath();
      context.arc(enemyTank.tankLight.heatSeeker.x, enemyTank.tankLight.heatSeeker.y, 80/8, 0, 2 * Math.PI);
      context.stroke();
      context.fillStyle = enemyTank.tankLight.color;
      context.fill();
      context.closePath();
    }

    if(enemyTank.tankLight.event == "hit") {
        for(var i = 0; i <= 10; i = i + 0.1) {
          context.beginPath();
          context.shadowBlur = 0;
          context.shadowColor = "transparent";
          context.moveTo(enemyTank.tankLight.fire.x, enemyTank.tankLight.fire.y);
          context.lineTo(enemyTank.tankLight.fire.x + Math.cos(i) * enemyTank.tankLight.blastRadius, enemyTank.tankLight.fire.y + Math.sin(i) * enemyTank.tankLight.blastRadius);
          context.lineWidth = 2;
          context.strokeStyle = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
          context.stroke();
          context.closePath();
        }
      }
      if(enemyTank.tankLight.heatSeeker.consumed || enemyTank.tankLight.event == "heatSeekerDestroyed") {
        for(var i = 0; i <= 10; i = i + 0.1) {
          context.beginPath();
          context.shadowBlur = 0;
          context.shadowColor = "transparent";
          context.moveTo(enemyTank.tankLight.heatSeeker.x, enemyTank.tankLight.heatSeeker.y);
          context.lineTo(enemyTank.tankLight.heatSeeker.x + Math.cos(i) * enemyTank.tankLight.blastRadius, enemyTank.tankLight.heatSeeker.y + Math.sin(i) * enemyTank.tankLight.blastRadius);
          context.lineWidth = 1;
          context.strokeStyle = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 100) + "," + Math.floor(Math.random() * 100) + ")";
          context.stroke();
          context.closePath();
        }
      }
  }
  
  //-------------------Player Movements--------------------//
  for (var id in players) {
    var player = players[id];

    movement.id = id;
    /*if(!usersArray.includes(id)){
      usersArray.push(id);
    }*/

    //document.getElementById("test2").innerHTML = player[socket.id];
    context.shadowBlur = 0;
    context.shadowColor = "transparent";
    var newPlayer = new createPlayer(id);
    if(player.event == "playerHit") {
          newPlayer.present(player, "black"); 
        }else{
          newPlayer.present(player, player.color);
        }
    if(player.fire.x) {
        context.beginPath();
        context.arc(player.fire.x, player.fire.y, newPlayer.height/8, 0, 2 * Math.PI);
        //context.arc(player.fire.x, player.fire.y, 0, 0, 2 * Math.PI);
        context.stroke();
        context.fillStyle = player.color;
        context.fill();
        context.closePath();
      }


      context.beginPath();
      context.arc(player.heatSeeker.x, player.heatSeeker.y, newPlayer.height/8, 0, 2 * Math.PI);
      context.stroke();
      context.fillStyle = player.color;
      context.fill();
      context.closePath();

      var obstacles = new createObstacles(w);
      obstacles.newObstacle();

      /*if(player.event == "hit") {
        for(var i = 0; i <= 10; i = i + 0.1) {
          context.beginPath();
          context.shadowBlur = 0;
          context.shadowColor = "transparent";
          //context.moveTo(player.fire.x + Math.cos(i) * player.explosion.r - 1, player.fire.y + Math.sin(i) * player.explosion.r - 1);
          context.lineTo(player.fire.x + Math.cos(i) * player.explosion.r, player.fire.y + Math.sin(i) * player.explosion.r);
          context.lineWidth = 1;
          context.strokeStyle = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 100) + "," + Math.floor(Math.random() * 100) + ")";
          context.stroke();
          context.closePath();
        }
      }*/
      if(player.event == "hit") {
        for(var i = 0; i <= 10; i = i + 0.1) {
          context.beginPath();
          context.shadowBlur = 0;
          context.shadowColor = "transparent";
          context.moveTo(player.fire.x, player.fire.y);
          context.lineTo(player.fire.x + Math.cos(i) * player.explosion.r, player.fire.y + Math.sin(i) * player.explosion.r);
          context.lineWidth = 2;
          /*grd = context.createRadialGradient(200,200,3,200,200,10);
          grd.addColorStop(0, "white");
          grd.addColorStop(1, "red");
          context.strokeStyle = grd;*/
          context.strokeStyle = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 100) + "," + Math.floor(Math.random() * 100) + ")";
          context.stroke();
          context.closePath();
        }
      }
      if(player.flares.radius) {
        for(var i = 0; i <= 10; i = i + 0.1) {
          document.getElementById("test2").innerHTML = j;
          context.beginPath();
          context.shadowBlur = 0;
          context.shadowColor = "transparent";
          /*context.moveTo(player.x + Math.cos(i - j) * player.flares.radius, player.y + Math.sin(i - j) * player.flares.radius);
          context.lineTo(player.x + Math.cos(i - j) * player.flares.radius + 1, player.y + Math.sin(i - j) * player.flares.radius + 1);*/
          context.arc(player.x + Math.cos(i) * player.flares.radius, player.y + Math.sin(i) * player.flares.radius, 2, 0, 2 * Math.PI);
          //context.lineWidth = 4;
          context.fillStyle = "rgb(255, 255, 255)";
          context.fill();
          context.closePath();
        }
      }
      
      
      
      scrollWindow("", player.x, player.y);    
      
      
  }
  
  var hideouts = new createHideOuts(w);
      hideouts.hideout();
});

function scrollWindow(move, plyrX, plyrY) {
  var element = document.getElementById("container");
  var w = window.innerWidth;
  var h = window.innerHeight; 
  //document.getElementById("test3").innerHTML = w;
  var element = document.getElementById("container");
    if(move == "down"){
      element.scrollBy(0, movement.canvasSize * 0.5);
    }
    if(move == "up"){
      element.scrollBy(0, movement.canvasSize * 0.5);
    }
    if(move == "right"){
      element.scrollBy(movement.canvasSize * 0.5, 0);
    }
    if(move == "left"){
      element.scrollBy(movement.canvasSize * 0.5, 0);
    }
    if(w - plyrX < 60 && windowMovement.right){
      window.scrollBy(5, 0);
    }
    if(h - plyrY < 60 && windowMovement.down){
      window.scrollBy(0, 5);
    }
    if(w - plyrX > -40 && windowMovement.left){
      window.scrollBy(-5, 0);
    }
    if(h - plyrY > -40 && windowMovement.up){
      window.scrollBy(0, -5);
    }
}

function obstacleAhead(x, y) {
  var context = canvas.getContext('2d');
  var imgData = context.getImageData(x - w/28, y - w/28, x + w/28, y + 28);
  if(imgData.data[0] == "255" && imgData.data[1] == "204" && imgData.data[2] == "204"){
    document.getElementById("test1").innerHTML = "Obstacle ahead!";
    movement.obstacleHit = true;
    return true;
  }
  return false;
}
function startGame() {
  movement.startGame = "yes";
}







            










