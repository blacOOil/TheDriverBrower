const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const { promises, resolve } = require('dns');
const { rejects } = require('assert');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

app.post('/profilepic',async (req,res) => {
    const ReadFile = await readJson('js/userDB.json');
    let upload = multer({ storage: storage, fileFilter:imageFilter}).single('avatar');
    upload(req,res,(err)=>{
    if(req.fileValidationError) {
       return res.send(req.fileValidationError);
    }
    else if(!req.file){
      return res.send('Pls select an image to upload');
    }
    else if (err instanceof multer.MulterError){
      return res.send(err);
    }
    else if(err){
      return res.send(err);
    }
    updateImg(req.cookies.username,req.file.filename,JSON.parse(ReadFile),'js/userDB.json')
    res.cookie('img',req.file.filename);
    return res.redirect('feed.html')
 });
})

// ถ้าต้องการจะลบ cookie ให้ใช้
// res.clearCookie('username');
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('index.html');
})

app.get('/readPost', async (req,res) => {
    const WaitForReadFIle  = await readJson('js/postDB.json');
    console.log('read post pass in get');
    res.send(WaitForReadFIle);
})

app.post('/writePost',async (req,res) => {
  const WaitForReadFIle  = await readJson('js/postDB.json');
  console.log(req.body)
  const postUpload = await updateMsg(req.body,WaitForReadFIle,'js/postDB.json')
  console.log('write post pass in app post');
  res.send(postUpload);
})

app.post('/checkLogin',async (req,res) => {
    const checkLogin = await readJson('js/userDB.json');
    var information = JSON.parse(checkLogin);
    var key = Object.keys(information);
    var isTrue = false;
    for(var data_info = 0; data_info<key.length; data_info++)
    {
      if(req.body.username == information[key[data_info]].username 
        && req.body.password == information[key[data_info]].password )
      {
        res.cookie('username',information[key[data_info]].username);
        res.cookie('img',information[key[data_info]].img);
        console.log('Login Pass');
        isTrue = true;
        return res.redirect('feed.html');
        
      }
    }
    if(isTrue == false)
    {
      console.log('Login Fail');
      isTrue = false;
      return res.redirect('index.html?error=1')
     
    }
})


const readJson = (file_name) => {
    return new Promise((resolve,reject) =>{
      fs.readFile(file_name,'utf-8',(err,data)=>
      {
        if(err)
        {
          reject(err)
          console.log("error read");
        }
        else
        {
          resolve(data);
          console.log('read pass');
        }
      });
    });
}
const updateMsg = (new_msg, data, file_name) => {
  return new Promise((resolve) => { 
     const FileRead = JSON.parse(data);
     var keys = Object.keys(FileRead);
     FileRead["post"+ [keys.length+1]] = {
      user:new_msg.user,
      message:new_msg.message,
     };
     console.log("update fininsh");
     resolve(writeJson(JSON.stringify(FileRead),file_name));
  });
}

const writeJson = (data,file_name) => {
    return new Promise((resolve,reject) =>{
      fs.writeFile(file_name,data,(err)=>
      {
        if(err)
        {
          reject(err);
          console.log('Write fail');
        }
        else
        {
          console.log("Write Post Pass");
          resolve(data);
        }
      });
    })
};

const updateImg = async (username, fileimg,data, file_name) => {
    return new Promise((resolve) => {
    var keys = Object.keys(data);
    for(var imageData = 0; imageData<keys.length;imageData++)
    {
    
      if(data[keys[imageData]].username == username)
      {
        data[keys[imageData]].img = fileimg;
        break;
      }
    }
    resolve(writeJson(JSON.stringify(data),file_name));
    });
    
    
}

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/`);
});
