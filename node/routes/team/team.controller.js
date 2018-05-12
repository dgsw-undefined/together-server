const mysql_dbc = require('../../db/dbcon')();
const connection = mysql_dbc.init();
const jwt = require('jsonwebtoken');
// encoding : Hs256
mysql_dbc.test_open(connection);
var stmt = null;

/*
  Get /team
*/

exports.list = (req, res) => {
  var user_id = req.params.id
  stmt = 'SELECT * FROM team where = user'
}


/*
  Post /team
*/

exports.create = (req, res) => {

}
