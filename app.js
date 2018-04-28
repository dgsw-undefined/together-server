var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var routes = require("./routes")(app);

var server = app.listen(port,() => {
  console.log("Express server is running on "+port);
});
