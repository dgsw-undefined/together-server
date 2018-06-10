const router = require('express').Router()
const controller = require('./team.controller')

router.get('/',controller.list)
router.post('/',controller.create)
router.post('/kickout',controller.kickout)
router.post('/join',controller.join)
module.exports = router
