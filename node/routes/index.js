const router = require('express').Router();
const verifyMiddleware = require('../middleware/verify');
const team =  require('./team');

router.use('/team', verifyMiddleware)
router.use('/team', team);

module.exports = router
