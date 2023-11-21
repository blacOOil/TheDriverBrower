const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser =  require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "driverbrowser"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}
app.post('/checkLogin',async (req,res) => {
    let sql = `SELECT username, password FROM userInfo`;
    var checker = false;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    var keys = Object.keys(result);
      for(var key_counter = 0; key_counter < keys.length; key_counter++ )
      {
        if(req.body.username == result[keys[key_counter]].username &&
           req.body.password == result[keys[key_counter]].password)
        {
          checker = true;
          console.log('login Succesfull')
          res.cookie("username",result[keys[key_counter]].username);
          res.cookie("password",result[keys[key_counter]].password);
          return res.redirect('index.html');
        }
      }
      if(checker == false)
      {
        console.log('login fail');
        checker = false;
        return res.redirect('login.html?error=1')
      }
      
      
  })

app.post('/regisDB', async (req,res) => {
    let now_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY,  username VARCHAR(255),password VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username,  password) VALUES ("${req.body.username}","${req.body.password}"`;
    result = await queryDB(sql);
    console.log("New ID ADD now");
    console.log(result);
    return res.redirect('Login.html');
    
})

app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('login.html');
})
// <----- comment Session ------->
app.get('/readPost', async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS PostInfo ( username VARCHAR(255), post VARCHAR(500))";
    let result = await queryDB(sql)
    sql = `SELECT username, post FROM PostInfo`
    result = await queryDB(sql)
    result = Object.assign({},result)
    console.log("read pass");
    console.log(result);
    res.json(result);
  })
  app.post('/writePost',async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS PostInfo ( username VARCHAR(255), post VARCHAR(500))";
    let result = await queryDB(sql);
    sql = `INSERT into PostInfo (username, post) VALUES ("${req.body.user}","${req.body.message}")`
    result = await queryDB(sql);
    console.log("post pass");
    console.log(result);
    return res.redirect("index.html");
  })



app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/index.html`);
});

