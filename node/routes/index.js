const router = require('express').Router();
const verifyMiddleware = require('../middleware/verify');
const team =  require('./team');

router.get('/',(req,res) => {
  res.send("This is Node Page!!!");
});

// router.use('/team', verifyMiddleware)
router.use('/team', team);

module.exports = router
