const mysql_dbc = require('../../db/dbcon')();
const connection = mysql_dbc.init();
const jwt = require('jsonwebtoken');
mysql_dbc.test_open(connection);
let stmt;
