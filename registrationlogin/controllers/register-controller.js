var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');
// cryptr = new Cryptr('myTotalySecretKey');
 
module.exports.register=function(req,res){
    var today = new Date();
  //var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "username":req.body.name,
        "email":req.body.email,
        "password":req.body.password
    }
    var _username = req.body.name;
    var _email = req.body.email;
    var _password = req.body.password;

    //var sql = "INSERT INTO myusers (username) VALUES ('_username')";
    connection.query('INSERT INTO myusers SET ?',users, function (error, results, fields) {
    //connection.query(sql, function (err, result, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some errors with query'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
    });
}
