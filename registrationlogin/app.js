//console.log("Hello!");
var express=require("express");
var bodyParser=require('body-parser');
var request = require("../node_modules/request");
var http = require('http');

var events = require('events');
var eventEmitter = new events.EventEmitter();

var connection = require('./config');
var app = express();
 
/*var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');*/

var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var cookieParser = require('cookie-parser');

/*var myEventHandler = function () {
  //console.log('I hear a scream!');
  app.use(cookieParser());

	// set a cookie
	app.use(function (req, res, next) {
		  // check if client sent cookie
		  var cookie = req.cookies.cookieName;
		  if (cookie === undefined)
		  {
		    // no: set a new cookie
		    var randomNumber=Math.random().toString();
		    randomNumber=randomNumber.substring(2,randomNumber.length);
		    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
		    //console.log('cookie created successfully');
		  } 
		  else
		  {
		    // yes, cookie was already present 
		    console.log('cookie exists', cookie);
		  } 
		  next(); // <-- important!
		});
	}

eventEmitter.on('authenticated', myEventHandler);
res.send(eventEmitter.emit('authenticated') );  */


app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})  
 
app.get('/login.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "login.html" );  
})  

app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   /*response = {
      email:req.body.email,
      password:req.body.password
   };
   console.log(response);
   res.end(JSON.stringify(response));
   //res.cookie('userCred', req.body.email);*/

   var email=req.body.email;
   var password=req.body.password;

   connection.query('SELECT * FROM MyUsers WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results.length >0){
            //decryptedString = cryptr.decrypt(results[0].password);
            decryptedString = results[0].password;
            if(password==decryptedString){
                /*res.json({
                    status:true,
                    message:'successfully authenticated',
                    useremail: email
                })  */
            res.cookie('cookie_name' , email).redirect('http://localhost:5000');

            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }     
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exist"
          });
        }
      }
    });
})

/*// route to handle login and registration 
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);*/

app.listen(8012);


