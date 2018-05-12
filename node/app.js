const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
//Load Config
const config = require('./config');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('jwt-secret',config.secret);

app.use('/',require('./routes'));

let server = app.listen(port,() => {
  console.log('Express server is running on '+port);
});
