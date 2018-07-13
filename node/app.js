const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

//Load Config
const config = require('./config');
const router = require('./routes')

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.set('jwt-secret',config.secret)

app.use('/profile',express.static(path.join(__dirname,'../img')));
// app.use(express.static(path.join(__dirname,'../img')));
app.use('/',router)
// app.post('/', upload.single('file'), function(req, res){
//   res.send('Uploaded! : '+req.file); // object를 리턴함
//   console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
// });

var server = app.listen(port,() => {
  console.log('Express server is running on '+port);
});
