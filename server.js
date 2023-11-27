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
const { userInfo } = require("os");
const { constrainedMemory } = require("process");

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
//<---leader Board--->
app.get('/updateboard',async(req,res) =>{
  console.log("leaderBoardUpdating...")
  
    let sql = "CREATE TABLE IF NOT EXISTS BoardInfo(username VARCHAR(255),Score INT(255))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username,Score) VALUES ("${req.body.username}","${req.body.score}")`;
    result = await queryDB(sql);
    console.log("leaderBoardUpdate Complete");
   
  
})

app.get('/leaderBoarding', async (req, res) => {
    console.log("pleaseee");
  try {
    let sql = "CREATE TABLE IF NOT EXISTS BoardInfo (username VARCHAR(255), Score INT(255))";
    let result = await queryDB(sql);
    sql = `SELECT username, Score FROM BoardInfo ORDER BY Score DESC`;
    result = await queryDB(sql);
    console.log("leaderBoardShowing");
    console.log(result);

    res.json(result);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/checkLogin', async (req, res) => {
  let sql = `SELECT username, password FROM userInfo`;
  let result;

  try {
      result = await queryDB(sql);
  } catch (error) {
      console.error('Error fetching data from the database:', error);
      return res.status(500).send('Internal Server Error');
  }

  const usernameInput = req.body.Username; // Note the capital 'U' in 'Username'
  const passwordInput = req.body.Password;

  for (let key_counter = 0; key_counter < result.length; key_counter++) {
      const dbUsername = result[key_counter].username;
      const dbPassword = result[key_counter].password;

      if (usernameInput === dbUsername && passwordInput === dbPassword) {
         
      
       
          res.cookie('username', dbUsername);
          res.cookie('password', dbPassword);
          return res.redirect('index.html');
      }
  }

  console.log('Login Failed');
  return res.redirect('login.html?error=1');
});


app.post('/regisDB', async (req,res) => {
  
    let sql = 
            "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY,  username VARCHAR(255),password VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username,  password) VALUES ("${req.body.username}","${req.body.password}")`;
    result = await queryDB(sql);
    console.log("New ID ADD now");
    return res.redirect('Login.html');
})

app.get('/logout', (req,res) => {
  res.cookie('username', "Guest");
    return res.redirect('index.html');
})
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

})