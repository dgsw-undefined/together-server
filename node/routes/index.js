var mysql_dbc = require('../db/dbcon')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);
var stmt;

module.exports = (app) => {
  app.get('/',(req,res) => {
    res.send('Hello routes!!');
  });


}
