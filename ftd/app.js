var express = require('express')
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


var app = express(); //create a new express app
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
db.run('DROP TABLE IF EXISTS langs');
db.run('CREATE TABLE IF NOT EXISTS langs(id INTEGER PRIMARY KEY AUTOINCREMENT,name text,password text)');
var count = 0;

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;


app.use(express.static('public'));
app.use(express.static('views'))
app.get('/', function(req, res){
  res.render("index");
})
app.get('/registration', function(req, res){
  res.render("registration")
})
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
      }
    })
    if(a==0){
      console.log("row not found")
    }
  });
});
app.get('/login', function(req, res){
  res.render("login");
})
app.post('/login', function(req, res){
    res.send("hello")
})

app.get('/database', function(req, res){
  var word = "";
  let sql = ("SELECT * FROM langs;");
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});
  res.send("call");
})
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
