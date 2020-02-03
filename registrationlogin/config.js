var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'letslin1_ajay',
  password : 'Slayer82!',
  database : 'letslin1_ajay'
});

//$db = mysqli_connect('localhost', 'letslin1_ajay', 'Slayer82!', 'letslin1_ajay');

connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection; 
