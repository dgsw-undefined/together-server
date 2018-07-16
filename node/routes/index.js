const router = require('express').Router();
const verifyMiddleware = require('../middleware/verify');

const team = require('./team')
const user = require('./user')

//test
const test = require('./test')

//Mysql 접속 확인

const mysql_dbc = require('../db/dbcon')();
const pool = mysql_dbc.init();
mysql_dbc.test_open(pool);

router.get('/',(req,res) => {
  res.send("This is Node Page!!!");
});

router.use('/test', test)

router.use('/team', verifyMiddleware)
router.use('/team', team)

router.use('/user', verifyMiddleware)
router.use('/user', user)

module.exports = router

//todo team join, kickout, alert list
