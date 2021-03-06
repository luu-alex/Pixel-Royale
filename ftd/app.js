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
db.run('DROP TABLE IF EXISTS scores')
db.run('DROP TABLE IF EXISTS langs'); //Drop our current database when we run the server and create a new one
db.run('CREATE TABLE langs(name text PRIMARY KEY,password text,email varchar(255))');
db.run('CREATE TABLE IF NOT EXISTS scores(name text,kills var,time varchar(255))');
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));  // to support URL-encoded bodies
app.use(express.static('public'));
app.use(express.static('icons'));
app.use(express.static('music'));
//check if client has a token, if so he is logged in
const checkToken = (req, res, next) => {
  const token = req.cookies.auth["token"]
    // decode token
  if (token) {
    jwt.verify(token, 'secret', function(err, token_data) {
      if (err) {
         return res.status(403).send('Error');
      } else {
        req.user_data = token_data;
        next();
      }
    });
  } else {
    return res.status(403).send('No token');
  }
}

//routes
app.get('/', function(req, res){
  res.sendFile(__dirname +'/views/index.html');
});

app.get('/game', function(req, res){
  res.sendFile(__dirname +'/views/game.html');
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
        res.send("Error");
      }
    })
    db.run(`INSERT INTO langs(name,password,email) VALUES(?,?,?)`, [req.body.name,req.body.pass,req.body.email], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.send("success")
    });
  });
});

app.post('/login', function(req, res){
  let sql = ("SELECT * FROM langs;");
  var jsonToken = {};
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if(row.name==req.body.name && row.password == req.body.pass){
        var token = jwt.sign({name: req.body.name}, 'secret', {expiresIn: "1h"})
        user = row.name;
        jsonToken = {
          name:req.body.name,
          success: true,
          message: 'Auth sucessful',
          token: token
        }
      }
    });
    res.cookie('auth',jsonToken);
    res.json(jsonToken)
  });
});

app.get('/user/:id', checkToken, function(req, res){
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
});

app.get('/stats', function(req, res){
  res.sendFile(__dirname +"/views/stats.html");
});

app.get('/logout', function(req, res){
  res.cookie('auth');
  res.send({success: "success"})
})
app.post('/score', checkToken, function(req, res){
  var name = req.cookies.auth["name"]
  db.run(`INSERT INTO scores(name,kills) VALUES(?,?)`, [name, req.body.kills], function(err) {
  if (err) {
    return console.log(err.message);
  }
  // console.log("success")
  res.json({success: "success"})
  });
})
app.get('/score', function(req, res){
  data = [];
  db.all(`SELECT * From scores;`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row){
        data.push([row.name,row.kills]);
      }
    })
  res.json({success: "success", data: data});
  });
})
app.get("/checkJWT", function(req, res){
  var token = {};
  if (req.cookies.auth["token"]) {
    // console.log(req.cookies.auth["name"])
    var sql = "SELECT name FROM langs where name="+"'"+req.cookies.auth["name"]+"'"+";";
    var a = 0;
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        if (row){
          a = 1
        }
      })
    //token is not valid
      if (a) {
        res.json({success: true})
      } else {
        res.cookie('auth');
        res.json({success: false})
      }
    });
  }
})

app.get('/edit', checkToken, function(req, res){
  var name = req.cookies.auth["name"]
  var sql = "SELECT * FROM langs where name="+"'"+name+"'"+";";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (row){
        res.json({
          name:row.name,
          email:row.email
        });
      }
    });
  });
})
app.put('/edit', checkToken, function(req, res){
  var name = req.cookies.auth["name"];
  data = [req.body.email,name];
  var sql = "UPDATE langs set email = ? where name= ?;";
  db.run(sql, data, function(err) {
    if (err) {
      res.json({success:false});
    }
    res.json({success:true});
  })
})
app.delete('/edit', checkToken, function(req, res){
  var name = req.cookies.auth["name"];
  data = [name];
  var sql = "DELETE from langs where name = ?;";
  db.run(sql, data, function(err) {
    if (err) {
      res.json({success:false});
    }
    res.json({success:true});
  })
})

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
