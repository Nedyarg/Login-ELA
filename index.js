const bodyParser = require('body-parser');
var express = require('express');
var logged = false

const fs = require('fs');
var app = express();
var PORT = 3000;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
//post for login

app.post('/submitlogin', (req, res) => {
    console.log(req.body);
    const data = fs.readFileSync('logins.txt', 'UTF-8')

    // split the contents by new line
    const lines = data.split(/\r?\n/)
    // print all lines
    logged = false
    lines.forEach(line => {
        if (req.body.password  == JSON.parse(line).password && req.body.username  == JSON.parse(line).username) {
        
            console.log("loggin in")
            res.redirect('/home.html')     
            logged = true
                                              
                                                                                                                 
        }

  
    
    
     
    })
    if (logged === false){res.redirect('/incorrect.html')}
})
    
app.post('/signup', (req, res) => {
    res.redirect('/signupnotice.html');
    console.log(req.body);
    fs.appendFile('loginrequests.txt', JSON.stringify(req.body) + '\n' ,err => {
        if (err) {
          console.error(err);
        }});
})
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
}); 