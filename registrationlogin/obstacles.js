var obstacles;
$.ajax({
            url: '/',
            complete: function(data) {
              //console.log(data.obstacles);
              //obstacles = JSON.stringify(data.obstacles);
              obstacles = data.obstacles;
              document.getElementById("test1").innerHTML = obstacles[0];
            }
          });
