var express = require('express')
var router  = express.Router();
var app = express();

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;


app.set('view engine', 'ejs');
app.use(express.static(__dirname + './'));
app.use(express.static('public'));

router.get('/', function(req, res){
  res.render("index");
})
router.get('/login', function(req, res){
  res.render('login');
})
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
