const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
var express = require('express');
var sessions = require("express-session");
var logged = false
var session;
const fs = require('fs');
var app = express();
var PORT = 3000;

const oneDay = 1000 * 60 * 60 * 170;
app.use(cookieParser());
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
//post for login
app.get('/', (req, res) => {
  session = req.session;
  if (session.userid) {
    res.sendFile('public/home.html', { root: __dirname })



  }
  else {
    res.sendFile('public/index.html', { root: __dirname })
  }
})
app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/public/style.css");
});
app.get('/notice.css', function(req, res) {
  res.sendFile(__dirname + "/public/notice.css");
});
app.get('/signup.html', function(req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get('/incorrect.html', function(req, res) {
  res.sendFile(__dirname + "/public/incorrect.html");
});
app.get('/signupnotice.html', function(req, res) {
  res.sendFile(__dirname + "/public/signupnotice.html");
});
app.get('/index.html', function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.post('/home')
app.post('/submitlogin', (req, res) => {
  console.log(req.body);
  const data = fs.readFileSync('logins.txt', 'UTF-8')


  // split the contents by new line
  const lines = data.split(/\r?\n/)
  // print all lines
  logged = false
  lines.forEach(line => {
    if (req.body.password == JSON.parse(line).password && req.body.username == JSON.parse(line).username) {
      session = req.session;
      session.userid = req.body.username
      console.log(req.sessionID)
      
      res.redirect('/')

      logged = true


    }





  })
  if (logged === false) { res.redirect('/incorrect.html') }
})
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
app.post('/signup', (req, res) => {
  res.redirect('/signupnotice.html');
  console.log(req.body);
  fs.appendFile('loginrequests.txt', JSON.stringify(req.body) + '\n', err => {
    if (err) {
      console.error(err);
    }
  });
})
app.listen(PORT, function(err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
}); 
