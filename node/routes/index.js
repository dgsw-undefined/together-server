const router = require('express').Router();
const verifyMiddleware = require('../middleware/verify');

const team = require('./team')
const user = require('./user')
const alert = require('./alert')
//Mysql 접속 확인

const mysql_dbc = require('../db/dbcon')();
const pool = mysql_dbc.init();
mysql_dbc.test_open(pool);

router.get('/',(req,res) => {
  res.send("This is Node Page!!!");
});

router.use('/team', verifyMiddleware)
router.use('/team', team)

router.use('/user', verifyMiddleware)
router.use('/user', user)

router.use('/alert', verifyMiddleware)
router.use('/alert', alert)


module.exports = router

//todo team join, kickout, alert list
