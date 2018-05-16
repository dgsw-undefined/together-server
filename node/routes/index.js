const router = require('express').Router();
const verifyMiddleware = require('../middleware/verify');
const team = require('./team');
const user = require('user');

router.get('/',(req,res) => {
  res.send("This is Node Page!!!");
});

router.use('/user', verifyMiddleware)
router.use('/user', user);

router.use('/team', verifyMiddleware)
router.use('/team', team);

module.exports = router
