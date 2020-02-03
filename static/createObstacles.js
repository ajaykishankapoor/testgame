var obsArray, hideOutArray, player1col, player2col;
var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            obsArray = myObj.obstacles;
            hideOutArray = myObj.hideouts;
            //player1col = myObj.player1color;
            //player2col = myObj.player2color;
            //document.getElementById("test1").innerHTML = myObj.obstacles;
          }
        };
        xmlhttp.open("GET", "obstacles.js", true);
        xmlhttp.send();

/*setInterval(function() {
  document.getElementById("test1").innerHTML = obsArray;
}, 500);*/
var w = window.innerWidth;
var h = window.innerHeight;
var canvas = document.getElementById("canvas");
canvas.width = w * 2;
canvas.height = h * 2;

class createPlayer {
  constructor(name) {
    this.playerName = name;
    this.width = w/15; 
    this.height = w/15; 
    this.cX;
    this.cY; 
  }
  present(plyr, color) {
    /*this.cX = plyr.x + this.width/2 + (this.width * Math.cos(plyr.theta)); 
    this.cY = plyr.y + this.width/2 - this.height/20 + (this.width * Math.sin(plyr.theta));*/
    this.cX = plyr.x + this.width/1.5 * Math.cos(plyr.theta); 
    this.cY = plyr.y + this.width/1.5 * Math.sin(plyr.theta);
    var context = canvas.getContext('2d');
    
    context.fillStyle = color;
    context.shadowBlur = 7;
    context.shadowColor = "black";
    context.fill();
    context.fillRect(plyr.x - this.width/2, plyr.y - this.width/2, this.width/4, this.width/4);
    //wheels(plyr.x, plyr.y+100, this.width/4, 30, "black");
    context.fillRect(plyr.x + this.width/4, plyr.y + this.width/4, this.width/4, this.width/4);
    context.fillRect(plyr.x - this.width/2, plyr.y + this.width/4, this.width/4, this.width/4);
    context.fillRect(plyr.x + this.width/4, plyr.y - this.width/2, this.width/4, this.width/4);

    context.fillRect(plyr.x - this.width/2, plyr.y - this.width/3, this.width, this.width/8);
    context.fillRect(plyr.x - this.width/2, plyr.y + this.width/4, this.width, this.width/8);
    context.fillRect(plyr.x - this.width/3, plyr.y - this.width/2, this.width/8, this.width);
    context.fillRect(plyr.x + this.width/4, plyr.y - this.width/2, this.width/8, this.width);

    context.fillRect(plyr.x - this.width/4, plyr.y - this.width/4, this.width/2, this.width/2);
   
    /*context.font = (20)+'px Arial';;
    context.fillStyle = "grey";
    context.fillText(this.playerName,plyr.x,plyr.y);*/

    context.beginPath();
    context.moveTo(plyr.x, plyr.y);
    context.lineTo(this.cX, this.cY);
    context.lineWidth = this.height/10;
    context.strokeStyle = "rgb(30, 30, 30)";
    context.lineCap = "round";
    context.stroke();
    context.shadowBlur = 0;
    context.shadowColor = "transparent";
    context.closePath();

    context.beginPath();
    context.arc(plyr.x, plyr.y, canvas.width/150, 0, 2 * Math.PI);
    //context.stroke();
    context.fillStyle = "black";
    context.fill();
    context.shadowBlur = 0;
    context.shadowColor = "transparent";
    context.closePath();

    context.beginPath();
    context.arc(this.cX, this.cY, canvas.width/300, 0, 2 * Math.PI);
    //context.stroke();
    context.fillStyle = "rgb(30, 30, 30)";
    context.fill();
    context.shadowBlur = 0;
    context.shadowColor = "transparent";
    context.closePath();

    /*function wheels(_X, _Y, w, h) {
      var canvas = document.getElementById("canvas");
                        var ctx = canvas.getContext("2d");
                        ctx.fillStyle = "black";
                        for (_X = 1/2; _X < w+1; _X=_X+w/2){ctx.fillRect(_X,1/2,1,w-2);}
                        for (_Y = 1/2; _Y < w+1; _Y=_Y+w/2){ctx.fillRect(1/2,_Y,w-2,1);}
                        ctx.fillRect(w-2,1,1,w-2);
                        ctx.fillRect(1,w-2,w-2,1);
      document.getElementById("test1").innerHTML = "hello!";
    }*/
  }
  
}

class createObstacles {
  constructor(w) {
    this.width = w/15; 
    this.height = w/15; 
    this.tankWidth = w/15 * 1.3;
  }
  newObstacle() {
  	var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "brown";//'rgb(255, 204, 204)';
    ctx.fill();
    ctx.shadowBlur = 7;
    ctx.shadowColor = "black";
    //var k = 0;
    for(var i = 0; i < obsArray.length; i++) {
      ctx.fillRect(obsArray[i][0], obsArray[i][1], this.tankWidth, this.tankWidth);
      ctx.fillRect(obsArray[i][0] + 15, obsArray[i][1] + 15, this.tankWidth - 30, this.tankWidth - 30);
      ctx.fillRect(obsArray[i][0] + 30, obsArray[i][1] + 30, this.tankWidth - 60, this.tankWidth - 60);
      /*ctx.font = (20)+'px Arial';;
      ctx.fillStyle = "grey";
      ctx.fillText(k, obsArray[i][0] + 10, obsArray[i][1] + 20);
      k++;*/
    }
  }
}
class createHideOuts {
  constructor(w) {
    this.width = w/15; 
    this.height = w/15; 
    this.tankWidth = w/15 * 1.3;
  }
  hideout() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "brown";//'rgb(255, 204, 204)';
    ctx.fill();
    ctx.shadowBlur = 7;
    ctx.shadowColor = "black";
    //var k = 0;
    for(var i = 0; i < hideOutArray.length; i++) {
      ctx.fillRect(hideOutArray[i][0], hideOutArray[i][1], this.tankWidth, this.tankWidth);
      ctx.fillRect(hideOutArray[i][0] + 15, hideOutArray[i][1] + 15, this.tankWidth - 30, this.tankWidth - 30);
      ctx.fillRect(hideOutArray[i][0] + 30, hideOutArray[i][1] + 30, this.tankWidth - 60, this.tankWidth - 60);
      /*ctx.font = (20)+'px Arial';;
      ctx.fillStyle = "grey";
      ctx.fillText(k, obsArray[i][0] + 10, obsArray[i][1] + 20);
      k++;*/
    }
  }
}

function explosion(X, Y) {
  var canvas = document.getElementById("canvas2");
  canvas.width = w * 2;
  canvas.height = h * 2;
  var c = canvas.getContext('2d');
  var lineNum = 10;
  var lines = [];

  
  c.beginPath();
  c.moveTo(X, Y);
  //c.lineTo(100, 100);
  c.strokeStyle = "rgb(255, 0, 0)";
  //c.stroke();
      //c.closePath();

  var i = 1;
  var id = setInterval(frame, 100);
  function frame() {
    if(i >= 100) {
      clearInterval(id);
    }else{
      c.clearRect(0, 0, canvas.width, canvas.height);
      i += 2;
      X += 1; Y += 1;
      c.strokeStyle = "rgb(255, 0, 0)";
      c.lineTo(X, Y);
      c.stroke();
    }
  }
  /*var id = setInterval(frame, 50);
  var theta = 0.5;
  //var radius = 3;
    function frame() {
      if(Math.abs(X) >= 225 || Math.abs(Y) >= 225) {
        clearInterval(id);
      }
      else{
        //radius -= 1;
        c.beginPath();
        c.arc(X, Y, 3, 0, 2 * Math.PI);
        c.fillStyle = "rgb(" + Math.floor(Math.random() * 10) + "," + Math.floor(Math.random() * 10) + "," + Math.floor(Math.random() * 10) + ")";
        c.fill();
        c.closePath();
        X += Math.cos(Math.floor(Math.random() * 10)) * 0.5;
        Y += Math.sin(Math.floor(Math.random() * 10)) * 0.5;
        //newParticle.present();
      }
    }*/



  /*class particle {
    constructor() {
      this.x = X;
      this.y = Y;
    }
    present() {
      c.beginPath();
      c.arc(this.x, this.y, 3, 0, 2 * Math.PI);
      c.fillStyle = "red";//"rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
      c.fill();
      c.closePath();
    }
  }

  for(var i = 0; i < particleNum; i++) {
    var newParticle = new particle();
    particles.push(newParticle.present());
  }
  //for(var i = 0; i < particles.length; i++) {
    var id = setInterval(frame, 100);
    var theta = 0.5;
    function frame() {
      if(newParticle.x >= 300 || newParticle.y >= 300) {
        clearInterval(id);
      }
      else{
        theta += 0.1;//Math.floor(Math.random() * 10);
        document.getElementById("test1").innerHTML = particles.length;
        newParticle.x +=  0.5;
        newParticle.y +=  0.5;
        //newParticle.present();
      }
      
    }*/
  //}
}









