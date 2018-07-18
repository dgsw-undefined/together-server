const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

//cors 설정
const cors = require('cors')

//Load Config
const config = require('./config');
const router = require('./routes')

//CORS 설정

app.use(cors());

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.set('jwt-secret',config.secret)

app.use('/profile',express.static(path.join(__dirname,'../img')));

app.use('/',router)

var server = app.listen(port,() => {
  console.log('Express server is running on '+port);
});
