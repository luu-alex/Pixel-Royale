var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

var express = require('express')
var app = express(); //create a new express app
var user = ""; //user object to see if logged in
let db = new sqlite3.Database(':memory:', (err) => { //Attempt to connect to our database
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.run('DROP TABLE IF EXISTS langs'); //Drop our current database when we run the server and create a new one
db.run('CREATE TABLE IF NOT EXISTS langs(name text PRIMARY KEY,password text,email varchar(255))');

app.use(cookieParser());
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));  // to support URL-encoded bodies
app.use(express.static('public'));
app.use(express.static('views'));

//routes
app.get('/', function(req, res){
  res.render("index");
});
app.get('/game', function(req, res){
  res.sendFile(__dirname +'/views/game.html');
});

app.get('/registration', function(req, res){
  res.sendFile(__dirname +'/views/registration.html');
});

app.post('/registration', function(req, res){
  console.log(req.body.name)
  console.log(req.body.email)
  console.log(req.body.pass)
  var sql = "SELECT name FROM langs where name="+"'"+req.body.name+"'"+";";
  var a =0;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row){
        a = 1
        res.send("Error");
      }
    })
    db.run(`INSERT INTO langs(name,password,email) VALUES(?,?,?)`, [req.body.name,req.body.pass,req.body.email], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.send("success")
    });
  });
});
app.get('/login', function(req, res){
  res.sendFile(__dirname +"/views/login.html");
});
app.post('/login', function(req, res){
  let sql = ("SELECT * FROM langs;");
  var found = "";

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      var obj = {"name": row.name, "password":row.password};
      console.log(obj);
      console.log(req.body.name)
      console.log(req.body.pass)
      if(row.name==req.body.name && row.password == req.body.pass){
        var token = jwt.sign({name: req.body.name}, 'secret', {expiresIn: "1h"})
        console.log("Token: "+ token);
        found = "success";
        user = row.name;
      }
    });
    if(found){
      res.json({
        success: true,
        message: 'Auth sucessful',
        token: token
      })
    } else {
      res.json({
        success: false,
        message: 'Auth unsuccesful',
      })
    }
  });
});
app.get('/user/:id', function(req, res){
  var data = [];
  let sql = ("SELECT * FROM langs;");
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row.name == req.params.id){
        var obj = {"name": req.params.id, "email": row.email};
        res.send(obj)
      }
    });
  });
})
app.get('/database', function(req, res){
  var data = [];
  let sql = ("SELECT * FROM langs;");
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      var obj = {"name": row.name, "email":row.email};
      console.log(obj)
      res.send(obj);
    });
  });
});

app.get('/stats', function(req, res){
  res.sendFile(__dirname +"/views/stats.html");
});

const http = require('http');
const hostname = '127.0.0.1';
const port = 3002;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
