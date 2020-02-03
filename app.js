// Dependencies
var mysql      = require('mysql');
var connection = mysql.createConnection({
  // xxxx
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected..");
} else {
    console.log("Error while connecting with database");
    console.log(err);
}
}); 

var req = require("request");
var eve = require('events');

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
//var hbs = require("hbs");
//app.set("views", path.join(__dirname,”views”));
//app.set("view engine", "hbs");

/*app.get('/', (req, res)=>{ 
//shows all the cookies 
res.send(req.cookies['cookie_name']); 
//res.send(JSON.stringify(req.cookies['cookie_name'])); 
}); */

var user;
var canvasDim, canvasW, canvasH;
var obstaclesArray = []; 
var hideOutArray = [];
var intervalsRunning = 0;
//var lastUpdateTime = (new Date()).getTime();

var playerColor = ["red", "yellow"];

app.get('/', function (req, res, next) {
   user = req.cookies['cookie_name'];
   canvasDim = req.cookies['canvasDim'];
   canvasDim = String(canvasDim);
   var index = canvasDim.indexOf(",");
          if (index > -1) {
          canvasW = canvasDim.substring(0,index);
          }
   var index = canvasDim.indexOf(",");
          if (index > -1) {
          canvasH = canvasDim.substring(index + 1,canvasDim.length);
          }
   var tankWidth = Math.trunc(1.3 * canvasW/30);
  createRandomObstacles();

   connection.query('SELECT * FROM myusers WHERE email = ?',[user], function (error, results, fields) {
      if (error) {
          user = '';
          res.send('no such user');
      }else{
       
        if(results.length >0){
            //res.send('user exists'); 
            /*res.json({
              obstacles: obstaclesArray
                 }); */    
            /*res.render("index", {
              data: obstaclesArray
            })   */
        }
        else{
          user = '';
          res.send('no such user');
        }
      }
    });
   //res.end();
   next();
})
app.get('/obstacles.js', function (req, res, next) {
   res.json({obstacles: obstaclesArray, 
             hideouts: hideOutArray
             /*player1color: "red",
             player2color: "yellow",*/
           });
   next();
})

var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

/*setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);*/

var players = {};
var usersArray = [];
var playerTitle = ["player1", "player2"];
var numberOfObstacles = 25;
var numberOfHideouts = 20;
var enemyTanks = {};

var commonEnemyData = {
    enemyContact: false,
    tankHit: false,
    enemyFireX: "",
    enemyFireY: "",
    tanksDestroyed: 0,
    heatSeeker: false,
    tanksTotal: 20
}
var commonPlayerData = {
    enemyContact: false,
    tankHit: false,
    playerFireX: "",
    playerFireY: "",
    x: "",
    y: "",
    flaresRadius: ""
}

var enemyCount = 0;
var idCreateEnemies = setInterval(frame, 2000); intervalsRunning++;
        function frame(){
          if(enemyCount == commonEnemyData.tanksTotal){
            clearInterval(idCreateEnemies);
            console.log("idCreateEnemies");
          }
          else {
            enemyCount += 1;
            if(enemyCount <= 5){
              enemyTanks[enemyCount - 1] = {
                  tankLight: {
                    x: 150,
                    y: 150,
                    theta: (Math.floor(Math.random() * 4) + 1) * 1.5708,
                    bullets: 1,
                    obsAhead: false,
                    fire: { x: -40, 
                            y: -40,
                          consumed: false},
                    color: "",
                    speed: canvasW/800,
                    direction: Math.floor(Math.random() * 4),
                    hit: false,
                    color: "green",
                    bulletSpeed: canvasW/800,
                    blastRadius: 0,
                    strength: 1,
                    heatSeeker: { /*x: -40, 
                                  y: -40,
                                  consumed: false,
                                  quantity: 1,
                                  cycle: ""*/
                                },
                    event: ""             
                  }
                }
              }
              if(enemyCount > 5 && enemyCount <= 10){
                enemyTanks[enemyCount - 1] = {
                  tankLight: {
                    x: 150,
                    y: 150,
                    theta: (Math.floor(Math.random() * 4) + 1) * 1.5708,
                    bullets: 1,
                    obsAhead: false,
                    fire: { x: -40, 
                            y: -40,
                          consumed: false},
                    color: "",
                    speed: canvasW/160,
                    direction: Math.floor(Math.random() * 4),
                    hit: false,
                    color: "yellow",
                    bulletSpeed: canvasW/800,
                    blastRadius: 0,
                    strength: 2,
                    heatSeeker: "",
                    event: ""                    
                  }
                }
              }
              if(enemyCount > 10 && enemyCount <= 15){
                enemyTanks[enemyCount - 1] = {
                  tankLight: {
                    x: 150,
                    y: 150,
                    theta: (Math.floor(Math.random() * 4) + 1) * 1.5708,
                    bullets: 1,
                    obsAhead: false,
                    fire: { x: -40, 
                            y: -40,
                          consumed: false},
                    color: "",
                    speed: canvasW/800,
                    direction: Math.floor(Math.random() * 4),
                    hit: false,
                    color: "maroon",
                    bulletSpeed: canvasW/270,
                    blastRadius: 0,
                    strength: 1,
                    heatSeeker: "",
                    event: ""                    
                  }
                }
              }
              if(enemyCount > 15 && enemyCount <= 20){
                enemyTanks[enemyCount - 1] = {
                  tankLight: {
                    x: 150,
                    y: 150,
                    theta: (Math.floor(Math.random() * 4) + 1) * 1.5708,
                    bullets: 1,
                    obsAhead: false,
                    fire: { x: -40, 
                            y: -40,
                          consumed: false},
                    color: "",
                    speed: canvasW/800,
                    direction: Math.floor(Math.random() * 4),
                    hit: false,
                    color: "orange",
                    bulletSpeed: canvasW/400,
                    blastRadius: 0,
                    strength: 4,
                    heatSeeker: { x: -40, 
                                  y: -40,
                                  consumed: false,
                                  quantity: 1,
                                  cycle: ""
                                },
                    event: ""                    
                  }
                }
              }
              enemyTankMovements(enemyCount - 1);
            }
        }

//setTimeout(function(){ enemyTankMovements(Math.floor(Math.random() * 5)); }, 2000);

function enemyTankMovements(enemyId) {
    var enemyTank = enemyTanks[enemyId];

    var idTM = setInterval(frameTanksMoving, 50);
    
    function frameTanksMoving() {
      //console.log(commonPlayerData.playerFireX+","+commonPlayerData.playerFireY+","+enemyTank.tankLight.x);
      if(collision(Math.abs(commonPlayerData.playerFireX), Math.abs(commonPlayerData.playerFireY), "", enemyId)){        
        commonEnemyData.tankHit = true;
        enemyTank.tankLight.hit = true;               
      }
      /*if(enemyTank.tankLight.event == "finished") {
          delete(enemyTanks[enemyId]);
      }*/
      if(enemyTank.tankLight.hit == true){
        clearInterval(idTM);console.log("idTM");
        setTimeout(function(){ 
          delete(enemyTanks[enemyId]);
        }, 3000);       
        return;
      }
      if(enemyTank.tankLight.event == "hit" && blastRadius <= 30) {
        blastRadius += 2;
        enemyTank.tankLight.blastRadius = blastRadius;
      }
      if((enemyTank.tankLight.event == "hit" && blastRadius >= 30) || enemyTank.tankLight.hit == true){
        enemyTank.tankLight.event = "";
        blastRadius = 0;
        enemyTank.tankLight.fire.x = ""; enemyTank.tankLight.fire.y = "";
      }
      var tankWidth = Math.trunc(1.1 * canvasW/30);
      var tankObs = false;
        switch (enemyTank.tankLight.direction) {
          case 0: 
            if(enemyTank.tankLight.x - tankWidth/2 < canvasW - canvasW/30 - 3) {
              enemyTank.tankLight.x += enemyTank.tankLight.speed;
              //console.log(enemyTank.tankLight.x);
            }else{enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            if(tankObstructed(enemyTank.tankLight.x, enemyTank.tankLight.y, enemyTank.tankLight.speed) || tankObs ||
              enemyContact(commonPlayerData.x, commonPlayerData.y, enemyTank.tankLight.x, enemyTank.tankLight.y) ){ 
              enemyTank.tankLight.x -= enemyTank.tankLight.speed; 
              enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            break;
          case 1:
            if(enemyTank.tankLight.x - tankWidth/2 > 3){
              enemyTank.tankLight.x -= enemyTank.tankLight.speed;
            }else{enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            if(tankObstructed(enemyTank.tankLight.x, enemyTank.tankLight.y, enemyTank.tankLight.speed) || tankObs ||
              enemyContact(commonPlayerData.x, commonPlayerData.y, enemyTank.tankLight.x, enemyTank.tankLight.y) ){ 
              enemyTank.tankLight.x += enemyTank.tankLight.speed; 
              enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            break;
          case 2: 
            if(enemyTank.tankLight.y - tankWidth/2 < canvasH - canvasW/30 - 3) {
              enemyTank.tankLight.y += enemyTank.tankLight.speed;
            }else{enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            if(tankObstructed(enemyTank.tankLight.x, enemyTank.tankLight.y, enemyTank.tankLight.speed) || tankObs ||
              enemyContact(commonPlayerData.x, commonPlayerData.y, enemyTank.tankLight.x, enemyTank.tankLight.y) ){ 
              enemyTank.tankLight.y -= enemyTank.tankLight.speed; 
              enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            break;
          case 3: 
            if(enemyTank.tankLight.y - tankWidth/2 > 3) {
              enemyTank.tankLight.y -= enemyTank.tankLight.speed;
            }else{enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            if(tankObstructed(enemyTank.tankLight.x, enemyTank.tankLight.y, enemyTank.tankLight.speed) || tankObs ||
              enemyContact(commonPlayerData.x, commonPlayerData.y, enemyTank.tankLight.x, enemyTank.tankLight.y) ){ 
              enemyTank.tankLight.y += enemyTank.tankLight.speed; 
              enemyTank.tankLight.direction = Math.floor(Math.random() * 4);}
            break;
        }

        var lastBullet;

        /*function lastFire(x, y, speed, theta) {
                          if(lastBulletX == "consumed"){                            
                            clearInterval(lastBullet);                             
                          }
                          else{
                            var lastBulletX, lastBulletY;
                            lastBulletX += Math.cos(theta) * 1.5 * speed;
                            lastBulletY += Math.sin(theta) * 1.5 * speed;

                            commonEnemyData.enemyFireX = lastBulletX;
                            commonEnemyData.enemyFireY = lastBulletY;
                          }
                          if(windowLimits(lastBulletX, lastBulletY, "", theta)){                                                                                 
                            lastBulletX = "consumed";                            
                          }
                          if(obstacleHit(lastBulletX, lastBulletY,)){                                                                                                               
                            lastBulletX = "consumed";                             
                          }   
                          if(commonPlayerData.tankHit){                            
                            lastBulletX = "consumed";                          
                          }
                        }      
*/
        var enemyFiring = setInterval(function() {
          if(enemyTank.tankLight.bullets > 0) {
            enemyTank.tankLight.bullets--;
            
            enemyTank.tankLight.theta += 1;//1.5708 for 90 degrees;

            setTimeout(function(){ 
              
                  enemyTank.tankLight.event = "";
                  
                  var theta = enemyTank.tankLight.theta;
                  enemyTank.tankLight.fire.x = enemyTank.tankLight.x + canvasW/30/2 * Math.cos(theta);
                  enemyTank.tankLight.fire.y = enemyTank.tankLight.y + canvasW/30/2 * Math.sin(theta);
                  //console.log(enemyTank.tankLight.x + "," + enemyTank.tankLight.y);
                  var id = setInterval(frameFiring, 10);
                  function frameFiring(){
                    if(enemyTank.tankLight.hit == true){                        
                        clearInterval(id);                      
                        clearInterval(enemyFiring);       

                        //lastBullet = setInterval(lastFire, 10); 
                        lastBullet = setInterval(function(x, y, speed, theta){
                          if(lastBulletX == "consumed"){                            
                            clearInterval(lastBullet);                             
                          }
                          else{
                            var lastBulletX, lastBulletY;
                            lastBulletX += Math.cos(theta) * 1.5 * speed;
                            lastBulletY += Math.sin(theta) * 1.5 * speed;

                            commonEnemyData.enemyFireX = lastBulletX;
                            commonEnemyData.enemyFireY = lastBulletY;
                          }
                          if(windowLimits(lastBulletX, lastBulletY, "", theta)){                                                                                 
                            lastBulletX = "consumed";                            
                          }
                          if(obstacleHit(lastBulletX, lastBulletY,)){                                                                                                               
                            lastBulletX = "consumed";                             
                          }   
                          if(commonPlayerData.tankHit){                            
                            lastBulletX = "consumed";                          
                          }  
                        }, 10, enemyTank.tankLight.fire.x , enemyTank.tankLight.fire.y, enemyTank.tankLight.bulletSpeed, enemyTank.tankLight.theta);
         
                      }                 
                    else{
                      enemyTank.tankLight.fire.x += Math.cos(theta) * 1.5 * enemyTank.tankLight.bulletSpeed;
                      enemyTank.tankLight.fire.y += Math.sin(theta) * 1.5 * enemyTank.tankLight.bulletSpeed;;  

                      commonEnemyData.enemyFireX = enemyTank.tankLight.fire.x;
                      commonEnemyData.enemyFireY = enemyTank.tankLight.fire.y;
                      if(windowLimits(enemyTank.tankLight.fire.x, enemyTank.tankLight.fire.y, "", enemyTank.tankLight.theta)){
                        clearInterval(id);
                        //delete(enemyTank.tankLight.fire.x); delete(enemyTank.tankLight.fire.y);
                        //fired = false;
                        enemyTank.tankLight.bullets++;
                        enemyTank.tankLight.event = "hit";
                      }
                      if(obstacleHit(enemyTank.tankLight.fire.x, enemyTank.tankLight.fire.y)){
                        clearInterval(id);
                        //delete(enemyTank.tankLight.fire.x); delete(enemyTank.tankLight.fire.y);
                        //console.log("obstacle hit");
                        //fired = false;
                        enemyTank.tankLight.bullets++;  
                        //enemyTank.tankLight.fire.x = ""; enemyTank.tankLight.fire.y = ""; 
                        enemyTank.tankLight.event = "hit";
                      }                     
                    }
                  }
                //}
                
             }, 500)
            
          }
        }, 1500);

        
          var heatSeekerFired = setInterval(function() {
            if(enemyTank.tankLight.heatSeeker.quantity > 0) {             
              //enemyTank.tankLight.theta += 1;//1.5708 for 90 degrees;              
              enemyTank.tankLight.heatSeeker.quantity--;
              setTimeout(function(){      
                if(enemyTank.tankLight.heatSeeker != "" && commonEnemyData.heatSeeker == false) {
                commonEnemyData.heatSeeker = true;             
                  var theta = enemyTank.tankLight.theta;
                  enemyTank.tankLight.heatSeeker.x = enemyTank.tankLight.x + canvasW/30/2 * Math.cos(theta);
                  enemyTank.tankLight.heatSeeker.y = enemyTank.tankLight.y + canvasW/30/2 * Math.sin(theta);
                  //console.log(enemyTank.tankLight.x + "," + enemyTank.tankLight.y);
                  var idHS = setInterval(frameHSFiring, 10);
                  function frameHSFiring(){
                    if(enemyTank.tankLight.heatSeeker.consumed){
                      clearInterval(idHS);//console.log("idHS");
                      clearInterval(heatSeekerFired);//console.log("heatseekerfired");
                      setTimeout(function(){ 
                        delete(enemyTank.tankLight.heatSeeker.x); delete(enemyTank.tankLight.heatSeeker.y);
                      }, 2000);                      
                    }
                    else{
                      thetaHS = Math.atan2(commonPlayerData.y - enemyTank.tankLight.heatSeeker.y, commonPlayerData.x - enemyTank.tankLight.heatSeeker.x); 
                      enemyTank.tankLight.heatSeeker.x += Math.cos(thetaHS) * 0.5;
                      enemyTank.tankLight.heatSeeker.y += Math.sin(thetaHS) * 0.5;
                      if(Math.trunc(enemyTank.tankLight.heatSeeker.x) == Math.trunc(commonPlayerData.x) && 
                        Math.trunc(enemyTank.tankLight.heatSeeker.y) == Math.trunc(commonPlayerData.y)){
                        commonPlayerData.tankHit = true;
                        enemyTank.tankLight.heatSeeker.consumed = true;
                        commonEnemyData.heatSeeker = false;                         
                      }
                      if(Math.abs(enemyTank.tankLight.heatSeeker.x - commonPlayerData.x) < commonPlayerData.flaresRadius && 
                        Math.abs(enemyTank.tankLight.heatSeeker.y - commonPlayerData.y) < commonPlayerData.flaresRadius){                        
                        //console.log("heatSeekerDestroyed");
                        //clearInterval(idHS);
                        //heatSeeker = false;    
                        enemyTank.tankLight.heatSeeker.consumed = true;
                        commonEnemyData.heatSeeker = false;                         
                        enemyTank.tankLight.event = "heatSeekerDestroyed";
     
                      }
                    }
                  }
                }
              }, 2000);
            }
          }, 2000);            
  }     
}
      
  
if(playerTitle.length == 1 && playerTitle[0] == "player2") {
  playerTitle.push("player1");
}
if(playerTitle.length == 1 && playerTitle[0] == "player1") {
  playerTitle.push("player2");
}
/*if(playerColor.length == 1 && playerColor[0] == "red") {
  playerColor.push("yellow");
}
if(playerColor.length == 1 && playerColor[0] == "yellow") {
  playerColor.push("red");
}*/
 
var blastRadius = 0;
io.on('connection', function(socket) {
  socket.on('new player', function() {
    
    players[socket.id] = {
      x: canvasW/3,
      y: canvasH/3,
      bullets: 1,
      heatSeeker: { x: -20, 
                    y: -20,
                    consumed: false,
                    quantity: 1,
                    cycle: ""
                  },
      gameStarted: "no",
      player1or2: "",
      theta: 0,
      thetaSet: false,
      obsAhead: false,
      fire: { x: -20, 
              y: -20,
              consumed: false},
      enemy: {
              x: "", y: ""
            },
      color: "red",
      speed: canvasW/160,
      event: "",
      explosion: {
        r: 0,
        color: "red"
      },
      flares: {
        radius: "",
        quantity: 1
      }
    };

    
    
    socket.on('disconnect', function() {
      delete players[socket.id];
    });
  });
  
  socket.on('movement', function(data) {
    var fired = "", heatSeeker = ""; var targetX, targetY, targetId = "", flares = ""; 
    var tankWidth = Math.trunc(1.1 * canvasW/30);
    //var currentTime = (new Date()).getTime();
    //var timeDifference = currentTime - lastUpdateTime;
    var player = players[socket.id] || {};

    
    if(player.event == "hit" && blastRadius <= canvasW/30) {
      blastRadius += canvasW/450;
      player.explosion.r = blastRadius;
      //console.log(player.explosion.r); 
    }
    if(player.event == "hit" && blastRadius >= canvasW/30){
      player.event = "";
      blastRadius = 0;
      player.fire.x = ""; player.fire.y = "";
    }
    if(collision(Math.abs(commonEnemyData.enemyFireX), Math.abs(commonEnemyData.enemyFireY), "", -1, player.x, player.y)) {
      player.event = "playerHit";
      commonPlayerData.tankHit = true;
    }
    if(commonPlayerData.tankHit == true) {
      player.event = "playerHit";
      //console.log(player.event);
    }
    if(player.event == "playerHit") {
      return;
    }
    if(playerColor[0] == "red"){
      player.color = "red";
    }
    if(playerColor[0] == "red"){
      playerColor.shift();
    }
    //console.log(playerColor.length + "," + playerColor[0] + "," + player.color);
    if (data.left && player.x - tankWidth/2 > 3) {
      player.x -= player.speed; commonPlayerData.x = player.x;// * timeDifference;
      if(tankObstructed(player.x, player.y, player.speed)){ player.x += player.speed; commonPlayerData.enemyContact = false; }
      /*if(data.thetaClock || data.thetaAntiClock){return;}
      else{*/player.theta = 1.5708 * 2;
    }
    if (data.up && player.y - tankWidth/2 > 3) {
      player.y -= player.speed; commonPlayerData.y = player.y;// * timeDifference;
      if(tankObstructed(player.x, player.y, player.speed)){ player.y += player.speed; commonPlayerData.enemyContact = false;}
      player.theta = 1.5708 * 3;
    }
    if (data.right && player.x - tankWidth/2 < canvasW - canvasW/30 - 3) {
      player.x += player.speed; commonPlayerData.x = player.x;// * timeDifference;
      if(tankObstructed(player.x, player.y, player.speed)){ player.x -= player.speed; commonPlayerData.enemyContact = false;}
      player.theta = 1.5708 * 4;
    }
    if (data.down && player.y - tankWidth/2 < canvasH - canvasW/30 - 3) {
      player.y += player.speed; commonPlayerData.y = player.y;// * timeDifference;
      if(tankObstructed(player.x, player.y, player.speed)){ player.y -= player.speed; commonPlayerData.enemyContact = false;}
      player.theta = 1.5708;
    }
    if (data.flares) {
      //console.log(player.flares.quantity);
      if(player.flares.quantity > 0) {
        flares = true;
        player.flares.quantity--;
      }
    }
    if(flares){
      //console.log(flares);
      //flares = false;
      var exRadius = 0;
      var idFlares = setInterval(releaseFlares, 15);intervalsRunning++;
      function releaseFlares() {
        if(exRadius >= 70){
          clearInterval(idFlares);//console.log("idflares");
          player.flares.quantity++;
          player.flares.radius = 0;
          exRadius = 0;
          commonPlayerData.flaresRadius = exRadius;
          flares = false;
        }else{
          exRadius += 0.5;
          player.flares.radius = exRadius;
          commonPlayerData.flaresRadius = exRadius;
        }
      }
    }
    if(data.heatSeeker) {
      if(player.heatSeeker.quantity > 0){
        heatSeeker = true;
        player.heatSeeker.quantity--;
      }
    }
    if(data.thetaClock && (player.bullets > 0 || player.heatSeeker.quantity > 0)) {
      player.theta += 0.05;
    }
    if(data.thetaAntiClock && (player.bullets > 0 || player.heatSeeker.quantity > 0)){
       player.theta -= 0.05;
    }
    if (data.firing) {
      if(player.bullets > 0){
        fired = true;
        player.thetaSet = true;
        player.bullets--;
      }
    }
    if(heatSeeker){
        if(usersArray.length > 1){
          if(usersArray[0] == socket.id) {
                targetId = usersArray[1];
              }else {
                targetId = usersArray[0];
              }
              
              try {
              
                targetX = players[targetId].x;
                targetY = players[targetId].y;
              
              }catch(err) {}
          //var idObject = {};
        }
        
        var thetaHS = player.theta;

        player.heatSeeker.consumed = false;
        player.heatSeeker.x = player.x + canvasW/30/data.canvasSize * Math.cos(thetaHS); 
        player.heatSeeker.y = player.y + canvasW/30/data.canvasSize * Math.sin(thetaHS);
        
        var idLaunch = setInterval(frameLaunch, 5);
        var idHs;
        var i = 1;
        function frameLaunch(){
          if(i == 50){
            clearInterval(idLaunch);
            idHs = setInterval(frame, 5);
            
          }else{
            i = i + 1;
            player.heatSeeker.x += Math.cos(thetaHS) * 1.5;
            player.heatSeeker.y += Math.sin(thetaHS) * 1.5;
          }
        }

        function frame(){
          if(player.heatSeeker.consumed){
            clearInterval(idHs);
            player.thetaSet = false;
            player.heatSeeker.quantity++;
            
          }
          else{
            if(collision(Math.abs(player.heatSeeker.x), Math.abs(player.heatSeeker.y), socket.id)){
              player.heatSeeker.consumed = true;
              heatSeeker = false;
              console.log("BOOM BOOM BOOM BOOM");  
            }
            
            try{
                        player.enemy.x = players[targetId].x;//targetX;
                        player.enemy.y = players[targetId].y;//targetY;
                        }catch(err) {
                          player.heatSeeker.x += Math.cos(thetaHS) * 0.5;
                          player.heatSeeker.y += Math.sin(thetaHS) * 0.5;
                          if(windowLimits(player.heatSeeker.x, player.heatSeeker.y, "heatseeker")){
                            console.log("window limit");
                            //clearInterval(idHS);
                            player.heatSeeker.consumed = true;
                            heatSeeker = false;
                          }
                          return;
                        }
            thetaHS = Math.atan2(player.enemy.y - player.heatSeeker.y, player.enemy.x - player.heatSeeker.x); 
            player.heatSeeker.x += Math.cos(thetaHS) * 0.5;
            player.heatSeeker.y += Math.sin(thetaHS) * 0.5;                        
          }
        }
      }

      if(fired){
        fired = false;
        player.event = "";
        var theta = player.theta;
        player.fire.x = player.x + canvasW/30/data.canvasSize * Math.cos(theta); 
        player.fire.y = player.y + canvasW/30/data.canvasSize * Math.sin(theta);
        var id = setInterval(frame, 5);intervalsRunning++;
        function frame(){
          if(commonEnemyData.tankHit == true){
            //console.log(commonEnemyData.tankHit);
            clearInterval(id);           
            commonEnemyData.tanksDestroyed++;
            console.log(commonEnemyData.tanksDestroyed);
            if(commonEnemyData.tanksDestroyed == commonEnemyData.tanksTotal) {
              console.log("Mission Accomplished");
            }
            /*delete(commonPlayerData.playerFireX);
            delete(commonPlayerData.playerFireY);*/
            player.event = "hit";                          
            fired = false;
            player.bullets++; 
            commonEnemyData.tankHit = false;  
            commonPlayerData.playerFireX = "";
            commonPlayerData.playerFireY = "";
          }
          else{
            player.fire.x += Math.cos(theta) * canvasW/250;
            player.fire.y += Math.sin(theta) * canvasW/250; 

            commonPlayerData.playerFireX = player.fire.x;
            commonPlayerData.playerFireY = player.fire.y;

            if(windowLimits(player.fire.x, player.fire.y, "", theta)){
              clearInterval(id);
              fired = false;
              player.bullets++;
              player.event = "hit";              
            }           
            if(collision(Math.abs(player.fire.x), Math.abs(player.fire.y), socket.id )){
              clearInterval(id);
              fired = false;
              player.bullets++;  
              player.event = "hit";
              player.fire.x = -50; player.fire.y = -50; 
            }
            if(obstacleHit(player.fire.x, player.fire.y)){
              clearInterval(id);
              fired = false;
              player.bullets++;  
              player.event = "hit";
              //player.fire.x = ""; player.fire.y = ""; 
            }
          }
        }
      }
        
      if(data.id){
        //player.color = "red";
        if(data.startGame == "yes") {
          if(!usersArray.includes(socket.id)){
            usersArray.push(socket.id);
          }
          
        }
      }
      if(data.delete){
        usersArray = [];
      }

      if (data.show) {
        /*player.theta += 0.1;
        console.log(player.theta + "," + Math.sin(player.theta) + " , " + Math.cos(player.theta));*/

        for(var i = 0; i < usersArray.length - 2; i++) {
          usersArray.shift();
        }
      }
    //lastUpdateTime = currentTime;
  });

});

function collision(missileX, missileY, socketId, enemyId, pX, pY) {
  var targetId;
  var targetX, targetY;
  var targetCoord = [];
  var playerCoord = [];
  var uArray = usersArray;
  var playerWidth = canvasW/30;
  
    if(uArray[0] == socketId) {
      targetId = uArray[1];
      //playerId = uArray[0];
    }else {
      targetId = uArray[0];
      //playerId = uArray[1];
    }
    

    if(socketId != "") {
      try {
        targetX = players[targetId].x;
        targetY = players[targetId].y;
      }catch(err) {
        return false;
      }
    }

    if(enemyId > -1) {
      try {
        targetX = enemyTanks[enemyId].tankLight.x;
        targetY = enemyTanks[enemyId].tankLight.y;
      }catch(err) {
        return false;
      }
    }
    getTargetCoord(targetX, targetY, targetCoord);
    if(insideArray(Math.trunc(missileX), Math.trunc(missileY), targetCoord) ) {
      return true;
    }
    getTargetCoord(pX, pY, playerCoord);
    //console.log(playerCoord);
    if(insideArray(Math.trunc(missileX), Math.trunc(missileY), playerCoord)) {
      return true;
    }    
    function getTargetCoord(x, y, array) {
      for(var i = Math.trunc(x - playerWidth/2); i <= Math.trunc(x + playerWidth/2); i = i + 1){
        for(var j = Math.trunc(y - playerWidth/2); j <= Math.trunc(y + playerWidth/2); j = j + 1) {
          array.push([i , j]);
        }
      }
    }
    function insideArray(X, Y, array){
        for(var i = 0; i <= array.length - 1; i++){
                var ele1 = array[i][0];
                var ele2 = array[i][1];
                if(ele1==X && ele2==Y){return true;}
        }return false;
    }
}

function createRandomObstacles() {
  //var tankWidth = 1.3 * canvasW/30;
  var tankWidth = Math.trunc(1.3 * canvasW/30);
  var numbers = [];
  for(var i = 0; i <= canvasW; i = i + tankWidth) {
    for(var j = 0; j <= canvasH; j = j + tankWidth) {
      numbers.push([Math.trunc(i), Math.trunc(j)]);
    }
  }
  if(obstaclesArray.length <= 0) {
    for(var i = 0; i < numberOfObstacles; i++) {
      var locToBeEntered = numbers[Math.floor(Math.random() * numbers.length)]
      obstaclesArray.push(locToBeEntered);
      var index = numbers.indexOf(locToBeEntered);
              if (index > -1) {
                numbers.splice(index, 1);
              }
    }
    for(var i = 0; i < numberOfHideouts; i++) {
      var locToBeEntered = numbers[Math.floor(Math.random() * numbers.length)]
      hideOutArray.push(locToBeEntered);
      var index = numbers.indexOf(locToBeEntered);
              if (index > -1) {
                numbers.splice(index, 1);
              }
    }
  }
}

function obstacleHit(X, Y) {
  var tankWidth = Math.trunc(1.3 * canvasW/30);
  for(var i = 0; i < obstaclesArray.length; i++) { 
    if(X > obstaclesArray[i][0] && X < obstaclesArray[i][0] + tankWidth && Y > obstaclesArray[i][1] && Y < obstaclesArray[i][1] + tankWidth) {
      return true;
    }
  }
   return false;     
}
function tankObstructed(X, Y, speed) {
  var tankWidth = Math.trunc(1.3 * canvasW/30);
  /*var tankCoord = [ 
      [Math.trunc(X - tankWidth/2) + speed * 2, Math.trunc(Y - tankWidth/2) + speed * 2],
      [Math.trunc(X - tankWidth/2) + speed * 2, Math.trunc(Y + tankWidth/2) - speed * 2], 
      [Math.trunc(X + tankWidth/2) - speed * 2, Math.trunc(Y - tankWidth/2) + speed * 2],
      [Math.trunc(X + tankWidth/2) - speed * 2, Math.trunc(Y + tankWidth/2) - speed * 2]
  ];*/
  var tankCoord = [ 
      [Math.trunc(X - tankWidth/2), Math.trunc(Y - tankWidth/2)],
      [Math.trunc(X - tankWidth/2), Math.trunc(Y + tankWidth/2)], 
      [Math.trunc(X + tankWidth/2), Math.trunc(Y - tankWidth/2)],
      [Math.trunc(X + tankWidth/2), Math.trunc(Y + tankWidth/2)]
  ];
  
    for(var i = 0; i < tankCoord.length; i++) { 
      for(var j = 0; j < obstaclesArray.length; j++) { 
        if(tankCoord[i][0] > obstaclesArray[j][0] && tankCoord[i][0] < obstaclesArray[j][0] + tankWidth &&
          tankCoord[i][1] > obstaclesArray[j][1] && tankCoord[i][1] < obstaclesArray[j][1] + tankWidth) {
          return true;
        }
      }
    }  
  return false;    
}
function enemyContact(playerX, playerY, enemyX, enemyY) {
  var tankWidth = Math.trunc(1.3 * canvasW/30);
  if(Math.trunc(playerX) - tankWidth/2 == Math.trunc(enemyX) + tankWidth/2 || Math.trunc(playerX) + tankWidth/2 == Math.trunc(enemyX) - tankWidth/2 ||
    Math.trunc(playerY) - tankWidth/2 == Math.trunc(enemyY) + tankWidth/2 || Math.trunc(playerY) + tankWidth/2 == Math.trunc(enemyY) - tankWidth/2){
    commonPlayerData.enemyContact = true;
    return true;
  }else{
    return false;
  }
}
function windowLimits(elementX, elementY, heatSeeker, theta) {
          if(heatSeeker != "") {
            if((elementX <= -10 || elementY <= -10)){
            return true;
            }
            if((elementX <= -10 || (canvasH) - elementY <= -10)){
              return true;
            }
            if(((canvasW) - elementX <= -10 || (canvasH) - elementY <= -10)){
              return true;
            }
            if(((canvasW) - elementX <= -10 || elementY <= -10)){
              return true;
            }
          }
          if(Math.sin(theta) <= 0 && Math.cos(theta) <= 0 && (elementX <= 0 || elementY <= 0)){
            return true;
          }
          if(Math.sin(theta) >= 0 && Math.cos(theta) <= 0 && (elementX <= 0 || (canvasH) - elementY <= 0)){
            return true;
          }
          if(Math.sin(theta) >= 0 && Math.cos(theta) >= 0 && ((canvasW) - elementX <= 0 || (canvasH) - elementY <= 0)){
            return true;
          }
          if(Math.sin(theta) <= 0 && Math.cos(theta) >= 0 && ((canvasW) - elementX <= 0 || elementY <= 0)){
            return true;
          }
}

setInterval(function() {
  io.sockets.emit('state', [players, enemyTanks]);
  //io.sockets.emit('enemyState', enemyTanks);
}, 1000 / 60);
























