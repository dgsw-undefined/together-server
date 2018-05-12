const router = require('express').Router();
const verifyMiddleware = require('../../middleware/verify');
const team =  require('./team');

router.use('/team', team);
router.use('/team', verifyMiddleware)

module.exports = router
