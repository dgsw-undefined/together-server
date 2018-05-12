const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const morgan = require('morgan')
//Load Config
const config = require('./config');

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.set('jwt-secret',config.secret)

app.use('/',require('./routes'))

var server = app.listen(port,() => {
  console.log('Express server is running on '+port);
});
