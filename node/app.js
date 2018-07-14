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

app.use('/',router)

var server = app.listen(port,() => {
  console.log('Express server is running on '+port);
});
