var express = require('express')
const sqlite3 = require('sqlite3').verbose();


var app = express(); //create a new express app
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
db.run('DROP TABLE IF EXISTS langs');
db.run('CREATE TABLE IF NOT EXISTS langs(id INTEGER PRIMARY KEY AUTOINCREMENT,name text,password text)');


const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res){
  res.render("index");
})
app.get('/login', function(req, res){
  res.render("login");
})
app.post('/login', function(req, res){

  db.run(`INSERT INTO langs(id,name,password) VALUES(?,?,?)`, [1,"alex","luu"], function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  res.render("registration")
})
app.get('/database', function(req, res){
  let sql = ("SELECT * FROM langs;");
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
  });
});
  res.send("run");
})
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
