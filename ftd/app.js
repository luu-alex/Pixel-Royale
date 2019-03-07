var bodyParser = require('body-parser');
var path = require('path');
const sqlite3 = require('sqlite3').verbose();

var express = require('express')
var app = express(); //create a new express app

let db = new sqlite3.Database(':memory:', (err) => { //Attempt to connect to our database
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.run('DROP TABLE IF EXISTS langs'); //Drop our current database when we run the server and create a new one
db.run('CREATE TABLE IF NOT EXISTS langs(name text PRIMARY KEY,password text,email varchar(255))');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
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
  var sql = "SELECT name FROM langs where name="+"'"+req.body.name+"'"+";";
  var a =0;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row){
        a = 1
        res.send("Error, account name already taken.");
      }
    })
    if(a==0){
      db.run(`INSERT INTO langs(name,password,email) VALUES(?,?,?)`, [req.body.name,req.body.psw,req.body.email], function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
      res.sendFile(__dirname +"/views/login.html")
    }
  });
});
app.get('/login', function(req, res){
  res.sendFile(__dirname +"/views/login.html");
});
app.post('/login', function(req, res){
    res.send("hell")
});

app.get('/database', function(req, res){
  console.log("database has been accessed");
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
  // res.sendFile(__dirname +"/views/database.html");
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
