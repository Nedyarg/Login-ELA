const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
var express = require("express");
const LoginReq = require("./logins.js");
const Login = require("./login.js");
var sessions = require("express-session");
const MongoStore = require("connect-mongo");
const dbURI =
  "mongodb+srv://nedyarg:grayden11@elaresources.qwegmih.mongodb.net/elaresources?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(PORT, function (err) {
      if (err) console.log(err);
      console.log("Server listening on PORT", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

var logged = false;
var session;
const fs = require("fs");
var app = express();
var PORT = 3000;
let name = undefined;
const oneDay = 1000 * 60 * 60 * 170;
//defining render engine
app.engine("html", require("ejs").renderFile);
app.use(cookieParser());

app.use(
  sessions({
    secret: "SECRET KEY",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbURI,
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
    }),
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  session = req.session;
  if (session.userid && session.userid != "admin") {
    res.sendFile("public/home.html", { root: __dirname });
  } else {
    res.sendFile("public/index.html", { root: __dirname });
  }
});
//initialition of css files
app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/public/style.css");
});
app.get("/notice.css", function (req, res) {
  res.sendFile(__dirname + "/public/notice.css");
});
app.get("/admin.css", function (req, res) {
  res.sendFile(__dirname + "/public/admin.css");
});

//initialize html files
app.get("/signup.html", function (req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/incorrect.html", function (req, res) {
  res.sendFile(__dirname + "/public/incorrect.html");
});
app.get("/signupnotice.html", function (req, res) {
  res.sendFile(__dirname + "/public/signupnotice.html");
});
app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/adminconsole", function (req, res) {
  if (req.session.userid == "admin" && req.session.passwd == "yallknowben") {
    LoginReq.find()
      .then((result) => {
        data = result;
        mydata = {};
        for (var key in result) {
          mydata[result[key].username] = result[key].password;
        }

        console.log(JSON.parse(JSON.stringify(mydata)));
      })
      .then(function () {
        Login.find().then((result) => {
          myLogin = {};
          for (var key in result) {
            myLogin[result[key].username] = result[key].password;
          }
          return res.render(__dirname + "/public/admin.html", {
            name: JSON.stringify(mydata),
            mylogin: JSON.stringify(myLogin),
          });
        });
      });
  }else{
    console.log("hellobyw")
    return res.redirect('/')
  }
});
app.post("/admindelete", (req, res) => {
  Login.find()
    .then((result) => {
      data = result;
    })
    .then(function () {
      Login.deleteMany({ username: req.body.username }, function (err) {
        if (err) console.log(err);
        console.log("Successful deletion of" + req.body.username);
        res.redirect("/adminconsole");
      });
    });
});
app.post("/admin", (req, res) => {
  LoginReq.find()
    .then((result) => {
      data = result;
    })
    .then(function () {
      console.log("save");
      if (data == "") {
        console.log("No Docs");
      } else {
        LoginReq.findOne({
          username: req.body.username,
        }).then((result) => {
          if (data)
            login = new Login({
              username: result.username,
              password: result.password,
            });
          login.save();
        });
      }
    });
  LoginReq.find()
    .then((result) => {
      console.log(result);
      data = result;
    })
    .then(function () {
      console.log("del");
      if (data === "") {
        console.log("No docs");
      } else {
        console.log("hello");
        console.log(data);
        LoginReq.findOne({
          username: req.body.username,
        })
          .then((result) => {
            var id = result._id;
            data = result;
          })
          .then(function () {
            console.log(data.username);
            LoginReq.deleteMany({ username: data.username }, function (err) {
              if (err) console.log(err);
              console.log("Successful deletion");
            });
          });
        console.log("Sent request to logins database");
      }
    });

  LoginReq.find()
    .then((result) => {
      data = result;
      mydata = {};
      for (var key in result) {
        mydata[result[key].username] = result[key].password;
      }

      console.log(JSON.parse(JSON.stringify(mydata)));
    })
    .then(function () {
      Login.find().then((result) => {
        myLogin = {};
        for (var key in result) {
          myLogin[result[key].username] = result[key].password;
        }
        return res.render(__dirname + "/public/admin.html", {
          name: JSON.stringify(mydata),
          mylogin: JSON.stringify(myLogin),
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//login check
app.post("/submitlogin", (req, res) => {
  if (req.body.username == "admin" && req.body.password == "yallknowben") {
    LoginReq.find()
      .then((result) => {
        data = result;
        mydata = {};
        for (var key in result) {
          mydata[result[key].username] = result[key].password;
        }
        console.log(JSON.parse(JSON.stringify(mydata)));
      })
      .then(function () {
        Login.find().then((result) => {
          myLogin = {};
          for (var key in result) {
            myLogin[result[key].username] = result[key].password;
          }
          session = req.session;
          session.userid = req.body.username;
          session.passwd = req.body.password;
          console.log(`${req.body.username} has logged in.`);
          return res.redirect('/adminconsole')
        });
      });
  } else {
    console.log("hello");
    Login.find()
      .then((result) => {
        mydata = {};
        for (var key in result) {
          mydata[result[key].username] = result[key].password;
        }
        console.log(JSON.parse(JSON.stringify(mydata)));
      })
      .then(function () {
        for (var i in mydata) {
          if (req.body.username == i && req.body.password == mydata[i]) {
            session = req.session;
            session.userid = req.body.username;
            console.log(`${req.body.username} has logged in.`);
            return res.redirect("/");
          }
        }
        return res.redirect("/incorrect.html");
      });
  }
});
//logout and clear session
app.get("/logout", (req, res) => {
  console.log(`${session.userid} has logged out.`);
  req.session.destroy();
  res.redirect("/");
});
//signup and add to mongodb requests
app.post("/signup", (req, res) => {
  logins = new LoginReq({
    username: req.body.username,
    password: req.body.password,
  });
  logins.save();
  res.redirect("/signupnotice.html");
  console.log(req.body);
});
