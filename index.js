const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
var express = require('express');
const LoginReq = require('./logins.js');
const Login = require('./login.js');
const dbURI = "mongodb+srv://nedyarg:grayden11@elaresources.qwegmih.mongodb.net/elaresources?retryWrites=true&w=majority" 
mongoose.connect(dbURI).then((result)=>{
  app.listen(PORT, function(err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
}); 
}).catch((err) => {console.log(err)})
var sessions = require("express-session");
var logged = false
var session;
const fs = require('fs');
var app = express();
var PORT = 3000;
let name = undefined
const oneDay = 1000 * 60 * 60 * 170;
app.engine('html', require('ejs').renderFile);
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

app.post('/admin', (req,res) =>{
  LoginReq.findOne({
    "username": req.body.username
  }).then((result) =>{
    login = new Login({
    username : result.username,
    password: result.password
    })
    login.save()
    console.log("Sent request to logins database")
    LoginReq.find()
      .then((result) => {
        data = result;
        mydata = {}
        for(var key in result){
          console.log()
          
          mydata[result[key].username] = result[key].password
        }
        
        console.log(JSON.parse(JSON.stringify(mydata)))
      })
      .then(function(){
        return res.render(__dirname + '/public/admin.html', {name:JSON.stringify(mydata)})
      })
  }).catch((err)=>{console.log(err)})
})
app.post('/submitlogin', (req, res) => {
  if (req.body.username == "admin" && req.body.password == "yallknowben"){
      LoginReq.find()
      .then((result) => {
        data = result;
        mydata = {}
        for(var key in result){
          console.log()
          
          mydata[result[key].username] = result[key].password
        }
        
        console.log(JSON.parse(JSON.stringify(mydata)))
      })
      .then(function(){
        return res.render(__dirname + '/public/admin.html', {name:JSON.stringify(mydata)})
      })
    console.log("Admin logged in.")
    
  }
  else{
    LoginReq.find()
          .then((result) => {
            mydata = {}
            for(var key in result){
              console.log()
              
              mydata[result[key].username] = result[key].password
            }
            
            console.log(JSON.parse(JSON.stringify(mydata)))
          })
          .then(function(){
            for(var i in mydata){
              if (req.body.username == i && req.body.password == mydata[i]){
                session = req.session;
                session.userid = req.body.username
                console.log(`${req.body.username} has logged in.`)
                return res.redirect('/')
              }
            
            }
            return res.redirect('/incorrect.html')
          })
}})
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
app.post('/signup', (req, res) => {
  logins = new LoginReq({
    username : req.body.username,
    password: req.body.password
  })
  logins.save()
  res.redirect('/signupnotice.html');
  console.log(req.body);
  fs.appendFile('loginrequests.txt', JSON.stringify(req.body) + '\n', err => {
    if (err) {
      console.error(err);
    }
  });
})