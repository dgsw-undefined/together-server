const router = require('express').Router()
const controller = require('./alert.controller')

router.get('/create-team',controller.create_team)

module.exports = router
